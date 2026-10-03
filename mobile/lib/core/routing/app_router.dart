import 'package:flutter/material.dart';
import 'package:learnfy/features/auth/presentation/views/on_boarding_view.dart';
import 'package:learnfy/features/auth/presentation/views/otp_screen.dart';
import 'package:learnfy/features/auth/presentation/views/sign_up_page.dart';
import 'package:learnfy/features/user_profile/presentation/views/edit_profile_view.dart';
import 'package:learnfy/features/user_profile/presentation/views/settings_view.dart';
import 'package:learnfy/main_screen.dart';
import 'app_routes.dart';
import '../../features/auth/presentation/views/login_view.dart';
import '../../features/auth/presentation/views/forget_pass_view.dart';

class AppRouter {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case AppRoutes.login:
        return MaterialPageRoute(builder: (_) => const LoginView());
      case AppRoutes.forgotPassword:
        return MaterialPageRoute(builder: (_) => const ForgetPassView());
      case AppRoutes.register:
        return MaterialPageRoute(builder: (_) => const SignUpPage());
      case AppRoutes.mainScreen:
        return MaterialPageRoute(builder: (_) => const MainScreen());
      case AppRoutes.onboarding:
        return MaterialPageRoute(builder: (_) => const OnboardingView());
      case AppRoutes.otp:
        return MaterialPageRoute(builder: (_) => const OTPScreen());
      case AppRoutes.settings:
        return MaterialPageRoute(builder: (_) => const SettingsView());
      case AppRoutes.userprofile:
      case AppRoutes.editprofile:
        return MaterialPageRoute(builder: (_) => const EditProfileView());
      default:
        return MaterialPageRoute(
          builder: (_) => const Scaffold(body: Center(child: Text("Not Found"))),
        );
    }
  }
}
