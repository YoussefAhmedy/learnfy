import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/helper_functions/validator.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/widgets/primary_button.dart';
import '../manager/auth_cubit/auth_cubit.dart';

class ForgetPassView extends StatefulWidget {
  const ForgetPassView({super.key});
  @override
  State<ForgetPassView> createState() => _ForgetPassViewState();
}
class _ForgetPassViewState extends State<ForgetPassView> {
  final _form = GlobalKey<FormState>();
  final _email = TextEditingController();
  bool _busy = false;
  String? _error;
  String? _message;
  @override
  void dispose() { _email.dispose(); super.dispose(); }
  Future<void> _submit() async {
    if (_busy || _form.currentState?.validate() != true) return;
    setState(() { _busy = true; _error = null; });
    try {
      final message = await context.read<AuthCubit>().repository.forgotPassword(_email.text);
      if (mounted) setState(() => _message = message);
    } on ApiFailure catch (failure) { if (mounted) setState(() => _error = failure.message); }
    catch (_) { if (mounted) setState(() => _error = 'Password recovery could not be requested.'); }
    finally { if (mounted) setState(() => _busy = false); }
  }
  @override
  Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text('Account recovery')),
    body: SingleChildScrollView(padding: const EdgeInsets.all(24), child: Form(key: _form, child: Column(
      crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        const SizedBox(height: 24), const Text('Let’s get you back in.', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
        const SizedBox(height: 16), const Text('Request a one-time reset link for your account email. The link opens Learnfy’s secure password reset page.'),
        const SizedBox(height: 24), TextFormField(controller: _email, keyboardType: TextInputType.emailAddress,
          decoration: const InputDecoration(labelText: 'Email'), validator: (value) => validateEmail(value ?? '')),
        const SizedBox(height: 20), if (_error != null) Semantics(liveRegion: true, child: Text(_error!, style: const TextStyle(color: Colors.red))),
        if (_message != null) Semantics(liveRegion: true, child: Text(_message!)),
        const SizedBox(height: 16), PrimaryButton(label: _busy ? 'Requesting…' : 'Request reset link', onPressed: _busy ? null : _submit),
      ],
    ))),
  );
}
