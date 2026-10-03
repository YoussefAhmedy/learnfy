import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/helper_functions/validator.dart';
import '../../../../core/routing/app_routes.dart';
import '../../../../core/widgets/primary_button.dart';
import '../manager/auth_cubit/auth_cubit.dart';
import '../widgets/auth_text_form_field.dart';

class LoginView extends StatefulWidget {
  const LoginView({super.key});
  @override
  State<LoginView> createState() => _LoginViewState();
}

class _LoginViewState extends State<LoginView> {
  final _form = GlobalKey<FormState>();
  final _email = TextEditingController();
  final _password = TextEditingController();
  bool _visible = false;
  @override
  void dispose() { _email.dispose(); _password.dispose(); super.dispose(); }
  Future<void> _submit() async {
    if (_form.currentState?.validate() != true) return;
    final success = await context.read<AuthCubit>().login(_email.text, _password.text);
    if (mounted && success) Navigator.pushNamedAndRemoveUntil(context, AppRoutes.mainScreen, (_) => false);
  }
  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Sign in')),
    body: BlocBuilder<AuthCubit, AuthState>(builder: (context, state) => SingleChildScrollView(
      padding: const EdgeInsets.all(24), child: Form(key: _form, child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          const SizedBox(height: 20), const Text('Welcome back', style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8), const Text('Sign in to your Learnfy account.'), const SizedBox(height: 24),
          AuthTextFormField(label: 'Email', controller: _email, validator: (value) => validateEmail(value ?? '')),
          const SizedBox(height: 16),
          TextFormField(controller: _password, obscureText: !_visible, autovalidateMode: AutovalidateMode.onUserInteraction,
            decoration: InputDecoration(labelText: 'Password', suffixIcon: IconButton(tooltip: _visible ? 'Hide password' : 'Show password',
              onPressed: () => setState(() => _visible = !_visible), icon: Icon(_visible ? Icons.visibility_off : Icons.visibility))),
            validator: (value) => value == null || value.isEmpty ? 'Password is required' : null),
          Align(alignment: Alignment.centerRight, child: TextButton(onPressed: () => Navigator.pushNamed(context, AppRoutes.forgotPassword), child: const Text('Forgot password?'))),
          if (state.error != null) Padding(padding: const EdgeInsets.only(bottom: 16), child: Semantics(liveRegion: true, child: Text(state.error!, style: const TextStyle(color: Colors.red)))),
          PrimaryButton(label: state.busy ? 'Signing in…' : 'Sign in', onPressed: state.busy ? null : _submit),
          const SizedBox(height: 16), TextButton(onPressed: state.busy ? null : () => Navigator.pushReplacementNamed(context, AppRoutes.register), child: const Text('New here? Create an account')),
          const Text('Sessions are kept in memory and expire automatically. Restarting the app requires signing in again.', style: TextStyle(fontSize: 12)),
        ],
      )),
    )),
  );
}
