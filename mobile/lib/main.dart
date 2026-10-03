import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'core/network/api_client.dart';
import 'core/routing/app_router.dart';
import 'core/routing/app_routes.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/data/auth_repository.dart';
import 'features/auth/presentation/manager/auth_cubit/auth_cubit.dart';
import 'features/auth/presentation/manager/otp_cubit/otp_cubit.dart';

void main() => runApp(const Learnfy());

class Learnfy extends StatelessWidget {
  const Learnfy({super.key, this.authRepository});
  final AuthRepository? authRepository;
  @override
  Widget build(BuildContext context) => MultiBlocProvider(
    providers: [
      BlocProvider(create: (_) => AuthCubit(authRepository ?? NetworkAuthRepository(ApiClient()))),
      BlocProvider(create: (_) => OTPCubit()),
    ],
    child: MaterialApp(debugShowCheckedModeBanner: false, theme: AppTheme.lightMode,
      onGenerateRoute: AppRouter.generateRoute, initialRoute: AppRoutes.onboarding),
  );
}
