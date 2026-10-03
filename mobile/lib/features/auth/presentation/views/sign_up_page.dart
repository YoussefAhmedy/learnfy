import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/helper_functions/validator.dart';
import '../../../../core/routing/app_routes.dart';
import '../../../../core/widgets/primary_button.dart';
import '../manager/auth_cubit/auth_cubit.dart';
import '../widgets/auth_text_form_field.dart';

class SignUpPage extends StatefulWidget {
  const SignUpPage({super.key});
  @override
  State<SignUpPage> createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {
  final _form = GlobalKey<FormState>();
  final _name = TextEditingController();
  final _username = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  bool _visible = false;
  @override
  void dispose() { _name.dispose(); _username.dispose(); _email.dispose(); _password.dispose(); super.dispose(); }
  Future<void> _submit() async {
    if (_form.currentState?.validate() != true) return;
    final success = await context.read<AuthCubit>().register(name: _name.text, username: _username.text, email: _email.text, password: _password.text);
    // Only a real successful server session grants account access. No fake phone OTP gate.
    if (mounted && success) Navigator.pushNamedAndRemoveUntil(context, AppRoutes.mainScreen, (_) => false);
  }
  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('New Account')),
    body: BlocBuilder<AuthCubit, AuthState>(builder: (context, state) => SingleChildScrollView(
      padding: const EdgeInsets.all(24), child: Form(key: _form, child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          const SizedBox(height: 16), const Text('Your next chapter', style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8), const Text('Create your Learnfy account.'), const SizedBox(height: 24),
          AuthTextFormField(label: 'Full Name', controller: _name, validator: (value) => (value ?? '').trim().length < 2 ? 'Enter at least two characters' : (value!.length > 100 ? 'Name is too long' : null)),
          const SizedBox(height: 16), AuthTextFormField(label: 'Username', controller: _username, validator: (value) => validateUsername(value ?? '')),
          const SizedBox(height: 16), AuthTextFormField(label: 'Email', controller: _email, validator: (value) => validateEmail(value ?? '')),
          const SizedBox(height: 16), TextFormField(controller: _password, obscureText: !_visible,
            autovalidateMode: AutovalidateMode.onUserInteraction,
            decoration: InputDecoration(labelText: 'Password', helperText: 'At least 12 characters; use a unique passphrase.',
              suffixIcon: IconButton(tooltip: _visible ? 'Hide password' : 'Show password', onPressed: () => setState(() => _visible = !_visible), icon: Icon(_visible ? Icons.visibility_off : Icons.visibility))),
            validator: (value) => validatePassword(value ?? '')),
          const SizedBox(height: 20), if (state.error != null) Padding(padding: const EdgeInsets.only(bottom: 16), child: Semantics(liveRegion: true, child: Text(state.error!, style: const TextStyle(color: Colors.red)))),
          PrimaryButton(label: state.busy ? 'Creating account…' : 'Create New Account', onPressed: state.busy ? null : _submit),
          const SizedBox(height: 16), TextButton(onPressed: state.busy ? null : () => Navigator.pushReplacementNamed(context, AppRoutes.login), child: const Text('Already have an account? Sign in')),
        ],
      )),
    )),
  );
}
