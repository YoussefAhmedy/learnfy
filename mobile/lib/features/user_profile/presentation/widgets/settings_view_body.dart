import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/routing/app_routes.dart';
import '../../../../core/widgets/primary_button.dart';
import '../../../auth/data/models/auth_session.dart';
import '../../../auth/presentation/manager/auth_cubit/auth_cubit.dart';

class SettingsViewBody extends StatelessWidget {
  const SettingsViewBody({super.key});
  @override
  Widget build(BuildContext context) => BlocBuilder<AuthCubit, AuthState>(builder: (context, state) {
    final user = state.session?.user;
    if (user == null) return Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
      const Text('Please sign in to edit your profile.'),
      if (state.notice != null) Padding(padding: const EdgeInsets.all(16), child: Text(state.notice!)),
      TextButton(onPressed: () => Navigator.pushReplacementNamed(context, AppRoutes.login), child: const Text('Sign in')),
    ]));
    return _ProfileForm(key: ValueKey(user.id), user: user);
  });
}
class _ProfileForm extends StatefulWidget {
  const _ProfileForm({super.key, required this.user});
  final AuthUser user;
  @override
  State<_ProfileForm> createState() => _ProfileFormState();
}
class _ProfileFormState extends State<_ProfileForm> {
  final _form = GlobalKey<FormState>();
  late final TextEditingController _name = TextEditingController(text: widget.user.name);
  late final TextEditingController _age = TextEditingController(text: widget.user.age.toString());
  late final TextEditingController _phone = TextEditingController(text: widget.user.phoneNumber ?? '');
  @override
  void dispose() { _name.dispose(); _age.dispose(); _phone.dispose(); super.dispose(); }
  Future<void> _submit() async {
    if (_form.currentState?.validate() != true) return;
    await context.read<AuthCubit>().updateProfile(name: _name.text, age: int.parse(_age.text), phoneNumber: _phone.text);
  }
  @override
  Widget build(BuildContext context) => BlocBuilder<AuthCubit, AuthState>(builder: (context, state) => SingleChildScrollView(
    padding: const EdgeInsets.all(24), child: Form(key: _form, child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      const Icon(Icons.person_outline, size: 58), const SizedBox(height: 20),
      Text(widget.user.email, textAlign: TextAlign.center), const SizedBox(height: 24),
      TextFormField(controller: _name, decoration: const InputDecoration(labelText: 'Full name'), maxLength: 100,
        validator: (value) => (value ?? '').trim().length < 2 ? 'Enter at least two characters' : null),
      const SizedBox(height: 16), TextFormField(controller: _age, keyboardType: TextInputType.number,
        decoration: const InputDecoration(labelText: 'Age (0 if unspecified)'),
        validator: (value) { final age = int.tryParse(value ?? ''); return age == null || age < 0 || age > 120 ? 'Enter an age from 0 to 120' : null; }),
      const SizedBox(height: 16), TextFormField(controller: _phone, keyboardType: TextInputType.phone,
        decoration: const InputDecoration(labelText: 'Phone number (optional)'), maxLength: 20),
      const SizedBox(height: 12), const Text('Email, username, credentials and roles cannot be changed here.', style: TextStyle(fontSize: 12)),
      if (state.error != null) Padding(padding: const EdgeInsets.symmetric(vertical: 16), child: Semantics(liveRegion: true, child: Text(state.error!, style: const TextStyle(color: Colors.red)))),
      if (state.notice != null) Padding(padding: const EdgeInsets.symmetric(vertical: 16), child: Semantics(liveRegion: true, child: Text(state.notice!))),
      const SizedBox(height: 20), PrimaryButton(label: state.busy ? 'Saving…' : 'Save Changes', onPressed: state.busy ? null : _submit),
    ])),
  ));
}
