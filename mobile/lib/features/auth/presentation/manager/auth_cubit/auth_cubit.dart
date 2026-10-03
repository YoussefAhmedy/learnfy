import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../../core/network/api_client.dart';
import '../../../data/auth_repository.dart';
import '../../../data/models/auth_session.dart';

class AuthState {
  const AuthState({this.session, this.busy = false, this.error, this.notice});
  final AuthSession? session;
  final bool busy;
  final String? error;
  final String? notice;
}

class AuthCubit extends Cubit<AuthState> {
  AuthCubit(this.repository, {DateTime Function()? now}) : _now = now ?? DateTime.now, super(const AuthState());
  final AuthRepository repository;
  final DateTime Function() _now;
  Timer? _expiryTimer;
  int _generation = 0;

  Future<bool> _authenticate(Future<AuthSession> Function() request) async {
    if (state.busy) return false;
    final generation = ++_generation;
    emit(AuthState(session: state.session, busy: true));
    try {
      final session = await request();
      if (isClosed || generation != _generation) return false;
      if (!session.expiresAt.isAfter(_now())) throw const ApiFailure('This session has expired. Please sign in again.', 401);
      _expiryTimer?.cancel();
      emit(AuthState(session: session));
      _expiryTimer = Timer(session.expiresAt.difference(_now()), expireIfNeeded);
      return true;
    } on ApiFailure catch (failure) {
      if (!isClosed && generation == _generation) emit(AuthState(error: failure.message));
      return false;
    } catch (_) {
      if (!isClosed && generation == _generation) emit(const AuthState(error: 'Account access failed. Please try again.'));
      return false;
    }
  }
  Future<bool> login(String email, String password) => _authenticate(() => repository.login(email, password));
  Future<bool> register({required String name, required String username, required String email, required String password}) =>
      _authenticate(() => repository.register(name: name, username: username, email: email, password: password));

  void expireIfNeeded() {
    if (isClosed || state.session == null || state.session!.expiresAt.isAfter(_now())) return;
    _generation++; _expiryTimer?.cancel();
    emit(const AuthState(notice: 'Your session expired. Please sign in again.'));
  }

  Future<void> logout() async {
    final token = state.session?.token;
    final generation = ++_generation;
    _expiryTimer?.cancel();
    emit(const AuthState());
    if (token == null) return;
    try {
      await repository.logout(token);
      if (!isClosed && generation == _generation) emit(const AuthState(notice: 'Signed out. Your active sessions were revoked.'));
    } catch (_) {
      if (!isClosed && generation == _generation) emit(const AuthState(notice: 'Signed out on this device. Server revocation was not confirmed; the token will expire.'));
    }
  }

  Future<bool> updateProfile({required String name, required int age, String? phoneNumber}) async {
    expireIfNeeded();
    final active = state.session;
    if (active == null || state.busy) return false;
    emit(AuthState(session: active, busy: true));
    try {
      final user = await repository.updateProfile(active.token, name: name, age: age, phoneNumber: phoneNumber);
      if (isClosed || state.session?.token != active.token) return false;
      emit(AuthState(session: active.withUser(user), notice: 'Your profile was saved.'));
      return true;
    } on ApiFailure catch (failure) {
      if (!isClosed && state.session?.token == active.token) {
        emit(AuthState(session: failure.statusCode == 401 ? null : active, error: failure.message));
        if (failure.statusCode == 401) { _generation++; _expiryTimer?.cancel(); }
      }
      return false;
    } catch (_) {
      if (!isClosed && state.session?.token == active.token) emit(AuthState(session: active, error: 'Your profile could not be saved.'));
      return false;
    }
  }

  @override
  Future<void> close() { _expiryTimer?.cancel(); return super.close(); }
}
