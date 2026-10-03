import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:learnfy/core/theme/app_colors.dart';
import 'package:learnfy/core/theme/app_text_styles.dart';

class PrimaryButton extends StatelessWidget {
  const PrimaryButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.width,
    this.height,
    this.icon,
  });

  final String label;
  final VoidCallback? onPressed;
  final double? width;
  final double? height;
  final String? icon;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width ?? double.infinity,
      height: height ?? 57.0,
      child: ElevatedButton.icon(
        onPressed: onPressed,
        label: Text(
          label,
          style: AppTextStyles.heading5.copyWith(color: AppColors.white),
        ),
        icon: icon == null ? null : SvgPicture.asset(icon!),
      ),
    );
  }
}
