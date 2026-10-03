import 'dart:convert';
import 'dart:typed_data';
import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:learnfy/core/network/api_client.dart';
import 'package:learnfy/features/auth/data/auth_repository.dart';
import 'package:learnfy/features/auth/data/models/auth_session.dart';

class TestAdapter implements HttpClientAdapter {
  TestAdapter(this.respond);
  final ResponseBody Function(RequestOptions) respond;
  @override
  Future<ResponseBody> fetch(RequestOptions options, Stream<Uint8List>? requestStream, Future<void>? cancelFuture) async => respond(options);
  @override
  void close({bool force = false}) {}
}
Map<String, dynamic> userJson() => {'id': 1, 'name': 'Test Learner', 'username': 'test_learner', 'email': 'test@example.test', 'role': 'Student', 'age': 25, 'phoneNumber': null};
Map<String, dynamic> sessionJson() => {'success': true, 'message': 'Login successful', 'token': 'test-only-token', 'user': userJson(), 'expiresAt': DateTime.now().add(const Duration(minutes: 15)).toIso8601String()};
ResponseBody jsonBody(Object value, [int status = 200]) => ResponseBody.fromString(jsonEncode(value), status, headers: {Headers.contentTypeHeader: [Headers.jsonContentType]});

void main() {
  test('unconfigured native transport fails honestly without a localhost fallback', () async {
    await expectLater(ApiClient(baseOrigin: '').request('/auth/login'), throwsA(isA<ApiFailure>()));
  });
  test('registration posts the actual contract, not a fake OTP transition', () async {
    final dio = Dio(BaseOptions(baseUrl: 'https://learnfy.example.test/api'));
    dio.httpClientAdapter = TestAdapter((request) {
      expect(request.method, 'POST'); expect(request.uri.path, '/api/auth/register');
      expect(request.data, {'name': 'Full Name', 'username': 'full_name', 'email': 'test@example.test', 'password': 'test-passphrase'});
      return jsonBody(sessionJson(), 201);
    });
    final repository = NetworkAuthRepository(ApiClient(dio: dio));
    final session = await repository.register(name: 'Full Name', username: 'full_name', email: 'test@example.test', password: 'test-passphrase');
    expect(session.user.role, 'Student'); expect(session.token, 'test-only-token');
  });
  test('profile update uses a bearer token and only public editable fields', () async {
    final dio = Dio(BaseOptions(baseUrl: 'https://learnfy.example.test/api'));
    dio.httpClientAdapter = TestAdapter((request) {
      expect(request.uri.path, '/api/auth/profile'); expect(request.method, 'PATCH');
      expect(request.headers['Authorization'], 'Bearer test-only-token');
      expect(request.data, {'name': 'Updated Name', 'age': 30, 'phoneNumber': null});
      return jsonBody({...userJson(), 'name': 'Updated Name', 'age': 30});
    });
    final user = await NetworkAuthRepository(ApiClient(dio: dio)).updateProfile('test-only-token', name: 'Updated Name', age: 30, phoneNumber: '');
    expect(user.name, 'Updated Name');
  });
  test('recovery does not report sent mail on an unavailable provider', () async {
    final dio = Dio(BaseOptions(baseUrl: 'https://learnfy.example.test/api'));
    dio.httpClientAdapter = TestAdapter((_) => jsonBody({'detail': 'Password reset delivery is unavailable.'}, 503));
    await expectLater(NetworkAuthRepository(ApiClient(dio: dio)).forgotPassword('test@example.test'),
        throwsA(isA<ApiFailure>().having((error) => error.statusCode, 'status', 503).having((error) => error.message, 'message', contains('unavailable'))));
  });
  test('expired, malformed or forged sessions are rejected', () {
    expect(() => AuthSession.fromJson({...sessionJson(), 'expiresAt': '2000-01-01'}), throwsA(isA<ApiFailure>()));
    expect(() => AuthSession.fromJson({...sessionJson(), 'token': null}), throwsA(isA<ApiFailure>()));
    expect(() => AuthUser.fromJson({...userJson(), 'role': 'fake_admin'}), throwsA(isA<ApiFailure>()));
  });
}
