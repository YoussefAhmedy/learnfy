import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/routing/app_routes.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../auth/presentation/manager/auth_cubit/auth_cubit.dart';

class UserDataCard extends StatelessWidget {
  const UserDataCard({super.key});
  @override
  Widget build(BuildContext context) => BlocBuilder<AuthCubit, AuthState>(builder: (context, state) {
    final user = state.session?.user;
    return Container(padding: const EdgeInsets.all(16), color: AppColors.black5, child: Row(children: [
      CircleAvatar(radius: 30, backgroundColor: AppColors.primary20,
        child: user == null ? const Icon(Icons.person_outline, color: AppColors.primary100) : Text(user.name.isEmpty ? '?' : user.name[0].toUpperCase(), style: const TextStyle(color: AppColors.primary100, fontSize: 24))),
      const SizedBox(width: 14), Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(user?.name ?? 'Your Learnfy account', style: AppTextStyles.heading5),
        Text(user?.email ?? 'Sign in to view your profile', style: AppTextStyles.bodySmallMedium),
      ])),
      TextButton(onPressed: () => Navigator.pushNamed(context, user == null ? AppRoutes.login : AppRoutes.settings), child: Text(user == null ? 'Sign in' : 'Edit profile')),
    ]));
  });
}
