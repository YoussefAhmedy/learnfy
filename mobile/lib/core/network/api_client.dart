import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

class ApiFailure implements Exception {
  const ApiFailure(this.message, [this.statusCode]);
  final String message;
  final int? statusCode;
  @override
  String toString() => message;
}

class ApiClient {
  ApiClient({String? baseOrigin, Dio? dio}) {
    final configured = baseOrigin ?? const String.fromEnvironment('API_BASE_URL');
    final origin = kIsWeb && configured.isEmpty ? Uri.base.origin : configured;
    final uri = Uri.tryParse(origin);
    _configured = dio != null || (uri != null && uri.hasAuthority && uri.userInfo.isEmpty &&
        uri.query.isEmpty && uri.fragment.isEmpty && (uri.path.isEmpty || uri.path == '/') &&
        (uri.scheme == 'https' || (!kReleaseMode && uri.scheme == 'http')));
    _dio = dio ?? Dio(BaseOptions(
      baseUrl: _configured ? '${origin.replaceFirst(RegExp(r'/$'), '')}/api' : '',
      connectTimeout: const Duration(seconds: 10), receiveTimeout: const Duration(seconds: 20),
      headers: {'Accept': 'application/json'},
    ));
  }
  late final Dio _dio;
  late final bool _configured;

  Future<dynamic> request(String path, {String method = 'GET', Object? data, String? token}) async {
    if (!_configured) throw const ApiFailure('Configure a HTTPS Learnfy API_BASE_URL before using account or catalog features.');
    if (!path.startsWith('/') || path.startsWith('//') || path.contains('\\')) {
      throw const ApiFailure('Invalid relative API path.');
    }
    try {
      final response = await _dio.request<dynamic>(path, data: data, options: Options(
        method: method, headers: {if (token != null) 'Authorization': 'Bearer $token'},
      ));
      return response.data;
    } on DioException catch (error) {
      final body = error.response?.data;
      String? message;
      if (body is Map) {
        for (final key in ['detail', 'message', 'title']) {
          if (body[key] is String && (body[key] as String).isNotEmpty) { message = body[key] as String; break; }
        }
      }
      throw ApiFailure(message ?? (error.response?.statusCode == 401
          ? 'Your session is no longer valid. Please sign in again.'
          : 'The Learnfy server could not be reached. Please try again.'), error.response?.statusCode);
    }
  }
}
