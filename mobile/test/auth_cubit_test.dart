import 'dart:async';
import 'package:flutter_test/flutter_test.dart';
import 'package:learnfy/core/network/api_client.dart';
import 'package:learnfy/features/auth/data/auth_repository.dart';
import 'package:learnfy/features/auth/data/models/auth_session.dart';
import 'package:learnfy/features/auth/presentation/manager/auth_cubit/auth_cubit.dart';

class TestRepository implements AuthRepository {
  bool rejectLogin = false;
  bool failLogout = false;
  bool rejectProfile = false;
  Completer<AuthSession>? pendingLogin;
  static const user = AuthUser(id: 1, name: 'Test Learner', username: 'learner', email: 'test@example.test', role: 'Student', age: 25);
  AuthSession session() => AuthSession(token: 'test-only-token', user: user, expiresAt: DateTime.now().add(const Duration(minutes: 15)));
  @override
  Future<AuthSession> login(String email, String password) async {
    if (rejectLogin) throw const ApiFailure('Invalid email or password', 401);
    return pendingLogin == null ? session() : pendingLogin!.future;
  }
  @override
  Future<AuthSession> register({required String name, required String username, required String email, required String password}) async => session();
  @override
  Future<void> logout(String token) async { if (failLogout) throw const ApiFailure('Offline'); }
  @override
  Future<AuthUser> updateProfile(String token, {required String name, required int age, String? phoneNumber}) async {
    if (rejectProfile) throw const ApiFailure('Session revoked', 401);
    return AuthUser(id: 1, name: name, username: user.username, email: user.email, role: user.role, age: age, phoneNumber: phoneNumber);
  }
  @override
  Future<String> forgotPassword(String email) async => 'If an account exists, a reset email has been requested.';
}
void main() {
  test('rejected server login never creates a user session', () async {
    final repository = TestRepository()..rejectLogin = true;
    final cubit = AuthCubit(repository); addTearDown(cubit.close);
    expect(await cubit.login('test@example.test', 'wrong'), isFalse);
    expect(cubit.state.session, isNull); expect(cubit.state.error, contains('Invalid'));
  });
  test('only a real successful repository session authenticates', () async {
    final cubit = AuthCubit(TestRepository()); addTearDown(cubit.close);
    expect(cubit.state.session, isNull);
    expect(await cubit.register(name: 'Learner', username: 'learner', email: 'test@example.test', password: 'test-passphrase'), isTrue);
    expect(cubit.state.session?.user.email, 'test@example.test');
  });
  test('expiry and revoked profile sessions remove access', () async {
    var now = DateTime.now(); final repository = TestRepository();
    final cubit = AuthCubit(repository, now: () => now); addTearDown(cubit.close);
    await cubit.login('test@example.test', 'test-passphrase');
    now = now.add(const Duration(hours: 1)); cubit.expireIfNeeded();
    expect(cubit.state.session, isNull); expect(cubit.state.notice, contains('expired'));
    final revoked = AuthCubit(repository); addTearDown(revoked.close);
    await revoked.login('test@example.test', 'test-passphrase'); repository.rejectProfile = true;
    expect(await revoked.updateProfile(name: 'New Name', age: 30), isFalse);
    expect(revoked.state.session, isNull);
  });
  test('failed server logout still clears local access without fake revocation', () async {
    final repository = TestRepository()..failLogout = true;
    final cubit = AuthCubit(repository); addTearDown(cubit.close);
    await cubit.login('test@example.test', 'test-passphrase'); await cubit.logout();
    expect(cubit.state.session, isNull); expect(cubit.state.notice, contains('not confirmed'));
  });
  test('a late login response cannot undo a later logout', () async {
    final repository = TestRepository()..pendingLogin = Completer<AuthSession>();
    final cubit = AuthCubit(repository); addTearDown(cubit.close);
    final login = cubit.login('test@example.test', 'test-passphrase'); await cubit.logout();
    repository.pendingLogin!.complete(repository.session()); expect(await login, isFalse);
    expect(cubit.state.session, isNull);
  });
}
