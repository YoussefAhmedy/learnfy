import 'package:flutter_test/flutter_test.dart';
import 'package:learnfy/features/auth/data/otp_gateway.dart';
import 'package:learnfy/features/auth/presentation/manager/otp_cubit/otp_cubit.dart';
import 'package:learnfy/features/auth/presentation/manager/otp_cubit/otp_states.dart';

// Tests only. No production fake-success gateway is registered.
class TestGateway implements OtpGateway {
  bool accepted = false;
  String? requestedPhone;
  @override
  Future<void> sendCode(String phoneNumber) async { requestedPhone = phoneNumber; }
  @override
  Future<bool> verifyCode(String phoneNumber, String code) async => accepted;
}

void main() {
  test('unconfigured OTP fails closed, never emits success', () async {
    final cubit = OTPCubit();
    addTearDown(cubit.close);
    await cubit.sendCode('+201234567890');
    expect(cubit.state, isA<OTPVerifyFailure>());
    expect((cubit.state as OTPVerifyFailure).error, contains('not configured'));
    await cubit.verify('123456');
    expect(cubit.state, isA<OTPVerifyFailure>());
  });
  test('invalid phone is not submitted', () async {
    final gateway = TestGateway();
    final cubit = OTPCubit(gateway: gateway);
    addTearDown(cubit.close);
    await cubit.sendCode('123');
    expect(gateway.requestedPhone, isNull);
    expect(cubit.state, isA<OTPVerifyFailure>());
  });
  test('only provider verification can grant success', () async {
    final gateway = TestGateway();
    final cubit = OTPCubit(gateway: gateway);
    addTearDown(cubit.close);
    await cubit.sendCode('+201234567890');
    expect(cubit.state, isA<OTPCodeSent>());
    await cubit.verify('123456');
    expect(cubit.state, isA<OTPVerifyFailure>());
    gateway.accepted = true;
    await cubit.verify('123456');
    expect(cubit.state, isA<OTPVerifySuccess>());
  });
  test('incomplete code is rejected', () async {
    final cubit = OTPCubit(gateway: TestGateway());
    addTearDown(cubit.close);
    await cubit.sendCode('+201234567890');
    await cubit.verify('1234');
    expect(cubit.state, isA<OTPVerifyFailure>());
  });
}
