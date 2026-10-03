/// This contract must be implemented by Learnfy's authenticated backend, never
/// by embedding an SMS provider key in the application.
abstract interface class OtpGateway {
  Future<void> sendCode(String phoneNumber);
  Future<bool> verifyCode(String phoneNumber, String code);
}

class OtpUnavailableException implements Exception {
  const OtpUnavailableException();
  @override
  String toString() => 'Phone verification is not configured. Please use email sign-in.';
}

class UnavailableOtpGateway implements OtpGateway {
  const UnavailableOtpGateway();
  @override
  Future<void> sendCode(String phoneNumber) async => throw const OtpUnavailableException();
  @override
  Future<bool> verifyCode(String phoneNumber, String code) async => throw const OtpUnavailableException();
}
