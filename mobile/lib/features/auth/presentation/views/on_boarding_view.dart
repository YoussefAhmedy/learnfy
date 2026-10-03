import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:learnfy/core/routing/app_routes.dart';
import 'package:learnfy/features/auth/presentation/widgets/primary_button.dart';
import '../manager/on_boarding_cubit/on_boarding_cubit.dart';
import '../manager/on_boarding_cubit/on_boarding_state.dart';
import '../widgets/onboarding_dummy.dart';
import '../widgets/onboarding_page.dart';
import '../widgets/page_indicator.dart';

class OnboardingView extends StatefulWidget {
  const OnboardingView({super.key});

  @override
  State<OnboardingView> createState() => _OnboardingViewState();
}

class _OnboardingViewState extends State<OnboardingView> {
  late final PageController _pageController;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => OnboardingCubit(pages: pages),
      child: Scaffold(
        backgroundColor: Color(0xffFFEBFE),
        body: BlocConsumer<OnboardingCubit, OnboardingState>(
          listener: (context, state) {
            // Sync page controller with state changes
            if (_pageController.hasClients &&
                _pageController.page?.round() != state.currentPage) {
              _pageController.animateToPage(
                state.currentPage,
                duration: const Duration(milliseconds: 500),
                curve: Curves.easeInOut,
              );
            }
          },
          builder: (context, state) {
            return Padding(
              padding: const EdgeInsets.all(25.0),
              child: Column(
                children: [
                  Expanded(
                    child: PageView.builder(
                      controller: _pageController,
                      physics: const BouncingScrollPhysics(),
                      itemCount: pages.length,
                      onPageChanged: (index) {
                        context.read<OnboardingCubit>().updatePageIndex(index);
                      },
                      itemBuilder: (context, index) {
                        return OnboardingPageWidget(page: pages[index]);
                      },
                    ),
                  ),
                  const SizedBox(height: 20),
                  SizedBox(
                    width: MediaQuery.of(context).size.width * .25,
                    child: PageIndicatorWidget(
                      boardController: _pageController,
                      pageCount: pages.length,
                      currentPage: state.currentPage,
                    ),
                  ),
                  const SizedBox(height: 20),

                  SizedBox(
                    width: MediaQuery.of(context).size.width * .67,
                    child: PrimaryButton(
                      text: 'Next',
                      onPressed: () {
                        if (state.isLastPage) {
                          _navigateToSignUpScreen(context);
                        } else {
                          context.read<OnboardingCubit>().nextPage();
                          // The Bloc listener owns the page animation; do not start
                          // a second competing animation from the button.
                        }
                      },
                      height: 60,
                    ),
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  void _navigateToSignUpScreen(BuildContext context) {
    Navigator.pushReplacementNamed(
      context,
      AppRoutes.register,
    );
  }
}
