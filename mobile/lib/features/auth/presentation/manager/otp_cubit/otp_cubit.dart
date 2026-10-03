import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../data/otp_gateway.dart';
import 'otp_states.dart';

class OTPCubit extends Cubit<OTPState> {
  OTPCubit({OtpGateway gateway = const UnavailableOtpGateway()})
      : _gateway = gateway, super(OTPVerfiyInitial());

  final OtpGateway _gateway;
  String? _pendingPhone;

  Future<void> sendCode(String phoneNumber) async {
    if (state is OTPVerifyLoading) return;
    if (!RegExp(r'^\+[1-9][0-9]{7,14}$').hasMatch(phoneNumber)) {
      emit(OTPVerifyFailure('Enter a valid phone number with its country code.'));
      return;
    }
    emit(OTPVerifyLoading());
    try {
      await _gateway.sendCode(phoneNumber);
      if (isClosed) return;
      _pendingPhone = phoneNumber;
      emit(OTPCodeSent(phoneNumber));
    } on OtpUnavailableException catch (error) {
      if (!isClosed) emit(OTPVerifyFailure(error.toString()));
    } catch (_) {
      if (!isClosed) emit(OTPVerifyFailure('Could not request a code. Please try again.'));
    }
  }

  Future<void> resendCode() async {
    final phone = _pendingPhone;
    if (phone == null) {
      emit(OTPVerifyFailure('Request a code first.'));
      return;
    }
    await sendCode(phone);
  }

  Future<void> verify(String code) async {
    if (state is OTPVerifyLoading) return;
    final phone = _pendingPhone;
    if (phone == null || !RegExp(r'^[0-9]{6}$').hasMatch(code)) {
      emit(OTPVerifyFailure('Request a code and enter all six digits.'));
      return;
    }
    emit(OTPVerifyLoading());
    try {
      final verified = await _gateway.verifyCode(phone, code);
      if (isClosed) return;
      emit(verified ? OTPVerifySuccess() : OTPVerifyFailure('The code is invalid or expired.'));
    } on OtpUnavailableException catch (error) {
      if (!isClosed) emit(OTPVerifyFailure(error.toString()));
    } catch (_) {
      if (!isClosed) emit(OTPVerifyFailure('Verification failed. Please try again.'));
    }
  }
}
