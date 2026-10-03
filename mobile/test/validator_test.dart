import 'package:flutter_test/flutter_test.dart';
import 'package:learnfy/core/helper_functions/validator.dart';

void main() {
  test('username requires supported characters and minimum length', () {
    expect(validateUsername(''), isNotNull);
    expect(validateUsername('ab'), isNotNull);
    expect(validateUsername('hello!'), isNotNull);
    expect(validateUsername('learnfy_user'), isNull);
  });
  test('email validates structure including long top-level domains', () {
    expect(validateEmail('bad email'), isNotNull);
    expect(validateEmail('learner@example.education'), isNull);
  });
  test('password policy matches the backend UTF-8 byte limit', () {
    expect(validatePassword('Short123'), isNotNull);
    expect(validatePassword('a long unique passphrase'), isNull);
    expect(validatePassword('🔒' * 20), isNotNull);
  });
}
