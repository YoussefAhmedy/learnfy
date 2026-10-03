import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/routing/app_routes.dart';
import '../../../auth/presentation/manager/auth_cubit/auth_cubit.dart';
import '../../data/catalog_repository.dart';

class LandingPage extends StatefulWidget {
  const LandingPage({super.key});
  @override
  State<LandingPage> createState() => _LandingPageState();
}
class _LandingPageState extends State<LandingPage> {
  final _search = TextEditingController();
  late Future<CatalogResult> _catalog;
  int _page = 1;
  @override
  void initState() { super.initState(); _catalog = context.read<CatalogRepository>().search(); }
  @override
  void dispose() { _search.dispose(); super.dispose(); }
  void _load({int page = 1}) => setState(() { _page = page; _catalog = context.read<CatalogRepository>().search(search: _search.text, page: page); });
  @override
  Widget build(BuildContext context) => SafeArea(child: Directionality(textDirection: TextDirection.rtl, child: SingleChildScrollView(
    padding: const EdgeInsets.all(20), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      BlocBuilder<AuthCubit, AuthState>(builder: (context, state) => Row(children: [
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text('مرحبًا بك في Learnfy', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 22)),
          Text(state.session?.user.name ?? 'ابدأ رحلتك التعليمية', style: const TextStyle(color: AppColors.black80)),
        ])),
        IconButton(tooltip: 'Your account', icon: const Icon(Icons.person_outline), onPressed: () => Navigator.pushNamed(context, AppRoutes.userprofile)),
      ])),
      const SizedBox(height: 22), TextField(controller: _search, textDirection: TextDirection.ltr, maxLength: 200,
        decoration: InputDecoration(hintText: 'ابحث عن دورة أو مهارة', counterText: '', prefixIcon: const Icon(Icons.search),
          suffixIcon: IconButton(tooltip: 'Search courses', icon: const Icon(Icons.arrow_forward), onPressed: () => _load())),
        textInputAction: TextInputAction.search, onSubmitted: (_) => _load()),
      const SizedBox(height: 26), const Text('اكتشف دورات جديدة', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 21)),
      const SizedBox(height: 16), FutureBuilder<CatalogResult>(future: _catalog, builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) return const Padding(padding: EdgeInsets.all(36), child: Center(child: CircularProgressIndicator()));
        if (snapshot.hasError) return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Semantics(liveRegion: true, child: Text(snapshot.error is ApiFailure ? (snapshot.error as ApiFailure).message : 'Could not load courses. Please try again.')),
          const SizedBox(height: 12), OutlinedButton(onPressed: () => _load(page: _page), child: const Text('Try again')),
        ]);
        final result = snapshot.data!;
        if (result.courses.isEmpty) return const Padding(padding: EdgeInsets.all(30), child: Text('لا توجد دورات مطابقة. جرّب موضوعًا آخر.'));
        return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Text('${result.totalCount} دورات', style: const TextStyle(color: AppColors.black80)), const SizedBox(height: 14),
          ...result.courses.map((course) => _CourseTile(course: course)),
          if (result.totalPages > 1) Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            TextButton(onPressed: _page > 1 ? () => _load(page: _page - 1) : null, child: const Text('Previous')),
            Text('$_page / ${result.totalPages}'),
            TextButton(onPressed: _page < result.totalPages ? () => _load(page: _page + 1) : null, child: const Text('Next')),
          ]),
        ]);
      }),
    ]),
  )));
}
class _CourseTile extends StatelessWidget {
  const _CourseTile({required this.course});
  final CatalogCourse course;
  @override
  Widget build(BuildContext context) => Padding(padding: const EdgeInsets.only(bottom: 16), child: Card(
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14), side: const BorderSide(color: AppColors.black10)), elevation: 0,
    child: InkWell(borderRadius: BorderRadius.circular(14), onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => _CourseOverview(course: course))),
      child: Padding(padding: const EdgeInsets.all(16), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(course.category, style: const TextStyle(color: AppColors.primary100, fontSize: 12)), const SizedBox(height: 9),
        Text(course.name, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
        if (course.description != null) Padding(padding: const EdgeInsets.only(top: 8), child: Text(course.description!, maxLines: 2, overflow: TextOverflow.ellipsis)),
        const SizedBox(height: 13), Wrap(spacing: 16, runSpacing: 8, children: [
          if (course.instructor != null) Text(course.instructor!, style: const TextStyle(fontSize: 12)),
          if (course.duration != null) Text(course.duration!, style: const TextStyle(fontSize: 12)),
          if (course.rating != null) Text('★ ${course.rating!.toStringAsFixed(1)} / 5', style: const TextStyle(color: AppColors.primary100, fontSize: 12)),
        ]),
      ])),
    ),
  ));
}
class _CourseOverview extends StatelessWidget {
  const _CourseOverview({required this.course});
  final CatalogCourse course;
  @override
  Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text('Course overview')), body: SingleChildScrollView(
    padding: const EdgeInsets.all(24), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(course.category, style: const TextStyle(color: AppColors.primary100)), const SizedBox(height: 16),
      Text(course.name, style: const TextStyle(fontSize: 25, fontWeight: FontWeight.bold)), const SizedBox(height: 18),
      Text(course.description ?? 'No description has been published yet.'), const SizedBox(height: 20),
      if (course.instructor != null) Text('Instructor: ${course.instructor}'),
      if (course.duration != null) Text('Duration: ${course.duration}'), const SizedBox(height: 24),
      const Text('This is the current catalog overview. Curriculum, purchasing and course access are not available in this recovery checkpoint.'),
      if (course.price != null) Padding(padding: const EdgeInsets.only(top: 16), child: Text('Listed numeric price: ${course.price!.toStringAsFixed(2)}. Currency is not specified; no payment is requested.')),
    ]),
  ));
}
