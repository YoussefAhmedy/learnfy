import 'package:flutter/material.dart';
import 'package:pinput/pinput.dart';

class OTPVerificationField extends StatelessWidget {
  const OTPVerificationField({required this.codeController, required this.phoneNumber, required this.onResend, super.key});
  final TextEditingController codeController;
  final String phoneNumber;
  final VoidCallback? onResend;

  @override
  Widget build(BuildContext context) => SingleChildScrollView(
    child: Padding(
      padding: const EdgeInsets.all(16),
      child: Column(children: [
        Text('A code was requested for $phoneNumber'),
        const SizedBox(height: 24),
        Pinput(controller: codeController, length: 6, keyboardType: TextInputType.number),
        const SizedBox(height: 24),
        Wrap(alignment: WrapAlignment.center, crossAxisAlignment: WrapCrossAlignment.center, children: [
          const Text("Didn't receive the code? "),
          TextButton(onPressed: onResend, child: const Text('Resend Code')),
        ]),
      ]),
    ),
  );
}
