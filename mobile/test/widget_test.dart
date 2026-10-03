import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:learnfy/main.dart';

void main() {
  testWidgets('Learnfy opens the existing onboarding flow', (tester) async {
    tester.view.physicalSize = const Size(430, 900);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    await tester.pumpWidget(const Learnfy());
    await tester.pump(const Duration(milliseconds: 100));
    expect(find.text('Welcome to Your Learning Journey'), findsOneWidget);
    expect(find.text('Next'), findsOneWidget);
    await tester.tap(find.text('Next'));
    // Start the scheduled animation before advancing its clock. Lottie loops,
    // so pumpAndSettle would never be an appropriate synchronization primitive.
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 600));
    expect(find.text('Learn at Your Own Pace'), findsOneWidget);
    expect(tester.takeException(), isNull);
    await tester.pumpWidget(const SizedBox.shrink());
  });
}
