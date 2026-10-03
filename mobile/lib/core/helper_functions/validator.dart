import 'dart:convert';

String? validateUsername(String username) {
  if (username.trim().isEmpty) return 'Username is required';
  if (!RegExp(r'^[a-zA-Z0-9_]{3,30}$').hasMatch(username)) {
    return 'Use 3–30 letters, numbers or underscores';
  }
  return null;
}

String? validateEmail(String email) {
  if (email.trim().isEmpty) return 'Email is required';
  if (email.length > 255 || !RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(email.trim())) {
    return 'Invalid email format';
  }
  return null;
}

String? validatePassword(String password) {
  if (password.isEmpty) return 'Password is required';
  if (password.length < 12) return 'Password must be at least 12 characters';
  if (utf8.encode(password).length > 72) return 'Password must not exceed 72 UTF-8 bytes';
  return null;
}
