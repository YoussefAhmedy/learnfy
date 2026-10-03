import 'package:flutter/material.dart';
import 'package:learnfy/core/theme/app_colors.dart';

class AppTheme {
  static ThemeData lightMode = ThemeData.light().copyWith(
    textTheme: ThemeData.light().textTheme.apply(fontFamily: 'Poppins'),
    appBarTheme: AppBarTheme(
      elevation: 0.0,
      backgroundColor: AppColors.white,
    ),
    scaffoldBackgroundColor: AppColors.white,
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor:AppColors.primary100, // Accessible contrast, same preserved palette
        foregroundColor:AppColors.white,  // Text color
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(15), // Pill shape
        ),
        padding: EdgeInsets.symmetric(
          vertical: 16,
          horizontal: 24,
        ),
        elevation: 5,
        shadowColor: Colors.grey,
      ),
    ),

    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: AppColors.black5,
      contentPadding: EdgeInsets.symmetric(
        horizontal: 24,
        vertical: 16
      ),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12.0),
        borderSide: BorderSide(color: AppColors.black10, width: 1.0),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12.0),
        borderSide: BorderSide(color: AppColors.black10, width: 1.0),
      ),
      focusedBorder: OutlineInputBorder(
        borderSide: BorderSide(color: AppColors.primary90, width: 2.0),
        borderRadius: BorderRadius.circular(12.0),
      ),
    ),
  );
}
