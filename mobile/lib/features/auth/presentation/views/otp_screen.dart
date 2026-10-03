import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:learnfy/core/routing/app_routes.dart';
import 'package:learnfy/features/auth/presentation/manager/otp_cubit/otp_cubit.dart';
import 'package:learnfy/features/auth/presentation/manager/otp_cubit/otp_states.dart';
import 'package:learnfy/features/auth/presentation/widgets/otp_widgets/otp_phone_field.dart';
import 'package:learnfy/features/auth/presentation/widgets/otp_widgets/otp_verification_form.dart';
import 'package:learnfy/features/auth/presentation/widgets/primary_button.dart';
import '../../../../core/res/app_images.dart';
import '../../../../core/theme/app_text_styles.dart';

class OTPScreen extends StatefulWidget {
  const OTPScreen({super.key});
  @override
  State<OTPScreen> createState() => _OTPScreenState();
}

class _OTPScreenState extends State<OTPScreen> {
  bool _isOnFirstPage = true;
  String _phoneNumber = '';
  final PageController _pageController = PageController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _codeController = TextEditingController();

  @override
  void dispose() {
    _pageController.dispose();
    _phoneController.dispose();
    _codeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: SafeArea(
      child: BlocConsumer<OTPCubit, OTPState>(
        listener: (context, state) {
          if (state is OTPCodeSent) {
            setState(() { _isOnFirstPage = false; _phoneNumber = state.phoneNumber; });
            _pageController.animateToPage(1, duration: const Duration(milliseconds: 250), curve: Curves.easeInOut);
          } else if (state is OTPVerifySuccess) {
            Navigator.pushReplacementNamed(context, AppRoutes.mainScreen);
          } else if (state is OTPVerifyFailure) {
            ScaffoldMessenger.of(context).clearSnackBars();
            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(state.error)));
          }
        },
        builder: (context, state) => Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Image.asset(AppImages.otpImage, width: double.infinity,
                height: MediaQuery.sizeOf(context).height * .28, fit: BoxFit.cover),
            const SizedBox(height: 24),
            const Text('OTP Verification', style: AppTextStyles.heading3, textAlign: TextAlign.center),
            const SizedBox(height: 20),
            Expanded(child: PageView(
              physics: const NeverScrollableScrollPhysics(), controller: _pageController,
              children: [
                OTPPhoneField(phoneController: _phoneController, onChanged: (phone) => _phoneNumber = phone),
                OTPVerificationField(codeController: _codeController, phoneNumber: _phoneNumber,
                    onResend: state is OTPVerifyLoading ? null : () => context.read<OTPCubit>().resendCode()),
              ],
            )),
            if (state is OTPVerifyLoading)
              const Padding(padding: EdgeInsets.all(16), child: Center(child: CircularProgressIndicator()))
            else
              Padding(padding: const EdgeInsets.all(16), child: PrimaryButton(
                onPressed: () => _isOnFirstPage
                    ? context.read<OTPCubit>().sendCode(_phoneNumber)
                    : context.read<OTPCubit>().verify(_codeController.text),
                text: _isOnFirstPage ? 'GET OTP' : 'Verify',
              )),
          ],
        ),
      ),
    ),
  );
}
