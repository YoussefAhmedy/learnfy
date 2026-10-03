import '../../../core/network/api_client.dart';
import 'models/auth_session.dart';

abstract interface class AuthRepository {
  Future<AuthSession> login(String email, String password);
  Future<AuthSession> register({required String name, required String username, required String email, required String password});
  Future<void> logout(String token);
  Future<AuthUser> updateProfile(String token, {required String name, required int age, String? phoneNumber});
  Future<String> forgotPassword(String email);
}

class NetworkAuthRepository implements AuthRepository {
  NetworkAuthRepository(this.api);
  final ApiClient api;
  @override
  Future<AuthSession> login(String email, String password) async => AuthSession.fromJson(
      await api.request('/auth/login', method: 'POST', data: {'email': email.trim(), 'password': password}));
  @override
  Future<AuthSession> register({required String name, required String username, required String email, required String password}) async =>
      AuthSession.fromJson(await api.request('/auth/register', method: 'POST', data: {
        'name': name.trim(), 'username': username.trim(), 'email': email.trim(), 'password': password,
      }));
  @override
  Future<void> logout(String token) async { await api.request('/auth/logout', method: 'POST', token: token); }
  @override
  Future<AuthUser> updateProfile(String token, {required String name, required int age, String? phoneNumber}) async =>
      AuthUser.fromJson(await api.request('/auth/profile', method: 'PATCH', token: token,
          data: {'name': name.trim(), 'age': age, 'phoneNumber': phoneNumber?.trim().isEmpty == true ? null : phoneNumber?.trim()}));
  @override
  Future<String> forgotPassword(String email) async {
    final value = await api.request('/auth/forgot-password', method: 'POST', data: {'email': email.trim()});
    if (value is! Map || value['success'] != true || value['message'] is! String) {
      throw const ApiFailure('Password recovery could not be requested.', 502);
    }
    return value['message'] as String; // Requested/queued, not fabricated mail delivery.
  }
}
