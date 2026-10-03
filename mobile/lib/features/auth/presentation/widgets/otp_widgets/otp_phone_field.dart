import 'package:flutter/material.dart';
import 'package:flutter_intl_phone_field/flutter_intl_phone_field.dart';

class OTPPhoneField extends StatelessWidget {
  const OTPPhoneField({required this.phoneController, required this.onChanged, super.key});
  final TextEditingController phoneController;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) => SingleChildScrollView(
    child: Padding(
      padding: const EdgeInsets.all(16),
      child: Column(children: [
        const Text('We will request a one-time code for this phone number.', textAlign: TextAlign.center),
        const SizedBox(height: 20),
        IntlPhoneField(
          controller: phoneController,
          keyboardType: TextInputType.phone,
          showCountryFlag: true,
          showDropdownIcon: true,
          flagsButtonPadding: const EdgeInsets.all(16),
          decoration: const InputDecoration(hintText: 'Phone Number').applyDefaults(Theme.of(context).inputDecorationTheme),
          initialCountryCode: 'EG',
          onChanged: (phone) => onChanged(phone.completeNumber),
        ),
      ]),
    ),
  );
}
