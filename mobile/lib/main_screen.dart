import 'package:flutter/material.dart';
import 'core/theme/app_colors.dart';
import 'features/landing/presentation/view/landing_page.dart';
import 'features/user_profile/presentation/widgets/user_profile_view_body.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});
  @override
  State<MainScreen> createState() => _MainScreenState();
}
class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;
  @override
  Widget build(BuildContext context) => Scaffold(
    body: IndexedStack(index: _selectedIndex, children: const [LandingPage(), UserProfileViewBody()]),
    bottomNavigationBar: BottomNavigationBar(currentIndex: _selectedIndex, selectedItemColor: AppColors.primary100,
      onTap: (index) => setState(() => _selectedIndex = index), items: const [
        BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: 'Explore'),
        BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Account'),
      ]),
  );
}
