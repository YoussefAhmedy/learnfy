import '../../../../core/network/api_client.dart';

class AuthUser {
  const AuthUser({required this.id, required this.name, required this.username, required this.email,
    required this.role, required this.age, this.phoneNumber});
  final int id;
  final String name;
  final String username;
  final String email;
  final String role;
  final int age;
  final String? phoneNumber;

  factory AuthUser.fromJson(dynamic value) {
    if (value is! Map || value['id'] is! int || value['id'] <= 0 ||
        value['name'] is! String || value['username'] is! String || value['email'] is! String ||
        !['Student', 'Admin', 'Instructor'].contains(value['role']) || value['age'] is! int ||
        value['age'] < 0 || value['age'] > 120 || (value['phoneNumber'] != null && value['phoneNumber'] is! String)) {
      throw const ApiFailure('The server returned an invalid profile.', 502);
    }
    return AuthUser(id: value['id'] as int, name: value['name'] as String,
        username: value['username'] as String, email: value['email'] as String,
        role: value['role'] as String, age: value['age'] as int, phoneNumber: value['phoneNumber'] as String?);
  }
}

class AuthSession {
  const AuthSession({required this.token, required this.user, required this.expiresAt});
  final String token;
  final AuthUser user;
  final DateTime expiresAt;

  factory AuthSession.fromJson(dynamic value, {DateTime? now}) {
    final expiry = value is Map && value['expiresAt'] is String ? DateTime.tryParse(value['expiresAt'] as String) : null;
    if (value is! Map || value['success'] != true || value['token'] is! String ||
        (value['token'] as String).isEmpty || expiry == null || !expiry.isAfter(now ?? DateTime.now())) {
      throw const ApiFailure('The server returned an invalid or expired session. Please sign in again.', 401);
    }
    return AuthSession(token: value['token'] as String, user: AuthUser.fromJson(value['user']), expiresAt: expiry);
  }
  AuthSession withUser(AuthUser next) => AuthSession(token: token, user: next, expiresAt: expiresAt);
}
