abstract class OTPState {}
class OTPVerfiyInitial extends OTPState {}
class OTPCodeSent extends OTPState {
  final String phoneNumber;
  OTPCodeSent(this.phoneNumber);
}
class OTPVerifySuccess extends OTPState {}
class OTPVerifyLoading extends OTPState {}
class OTPVerifyFailure extends OTPState {
  final String error;
  final int? remainingAttempts;
  OTPVerifyFailure(this.error, [this.remainingAttempts]);
}
