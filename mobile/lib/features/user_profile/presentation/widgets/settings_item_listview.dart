import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/routing/app_routes.dart';
import '../../../auth/presentation/manager/auth_cubit/auth_cubit.dart';
import 'settings_item.dart';

class SettingsItemListView extends StatelessWidget {
  const SettingsItemListView({super.key});
  @override
  Widget build(BuildContext context) => BlocBuilder<AuthCubit, AuthState>(builder: (context, state) => Column(children: [
    SettingsItem(itemName: 'Explore courses', icon: Icons.menu_book, onTap: () => Navigator.pushNamed(context, AppRoutes.mainScreen)),
    if (state.session != null) SettingsItem(itemName: 'Edit profile', icon: Icons.person_outline, onTap: () => Navigator.pushNamed(context, AppRoutes.settings)),
    SettingsItem(itemName: 'Account recovery', icon: Icons.lock_outline, onTap: () => Navigator.pushNamed(context, AppRoutes.forgotPassword)),
    if (state.session != null) SettingsItem(itemName: 'Sign out', icon: Icons.logout, onTap: () async {
      await context.read<AuthCubit>().logout();
      if (context.mounted) Navigator.pushNamedAndRemoveUntil(context, AppRoutes.login, (_) => false);
    }),
    if (state.notice != null) Padding(padding: const EdgeInsets.all(16), child: Semantics(liveRegion: true, child: Text(state.notice!))),
    if (state.error != null) Padding(padding: const EdgeInsets.all(16), child: Semantics(liveRegion: true, child: Text(state.error!, style: const TextStyle(color: Colors.red)))),
  ]));
}
