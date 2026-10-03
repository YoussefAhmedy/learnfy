import '../../../core/network/api_client.dart';

class CatalogCourse {
  const CatalogCourse({required this.id, required this.name, required this.category, this.description, this.instructor, this.duration, this.imageUrl, this.rating, this.price});
  final int id;
  final String name;
  final String category;
  final String? description;
  final String? instructor;
  final String? duration;
  final String? imageUrl;
  final double? rating;
  final double? price;
  factory CatalogCourse.fromJson(dynamic value) {
    if (value is! Map || value['id'] is! int || value['id'] <= 0 || value['courseName'] is! String || value['category'] is! String) {
      throw const ApiFailure('The server returned an invalid course.', 502);
    }
    for (final key in ['description', 'instructor', 'duration', 'imageUrl']) {
      if (value[key] != null && value[key] is! String) throw const ApiFailure('The server returned an invalid course.', 502);
    }
    if ((value['rating'] != null && (value['rating'] is! num || value['rating'] < 0 || value['rating'] > 5)) ||
        (value['price'] != null && (value['price'] is! num || value['price'] < 0))) {
      throw const ApiFailure('The server returned invalid course data.', 502);
    }
    return CatalogCourse(id: value['id'] as int, name: value['courseName'] as String, category: value['category'] as String,
      description: value['description'] as String?, instructor: value['instructor'] as String?, duration: value['duration'] as String?,
      imageUrl: value['imageUrl'] as String?, rating: (value['rating'] as num?)?.toDouble(), price: (value['price'] as num?)?.toDouble());
  }
}
class CatalogResult {
  const CatalogResult(this.courses, this.totalCount, this.page, this.totalPages);
  final List<CatalogCourse> courses;
  final int totalCount;
  final int page;
  final int totalPages;
}
abstract interface class CatalogRepository {
  Future<CatalogResult> search({String search = '', int page = 1});
}
class NetworkCatalogRepository implements CatalogRepository {
  NetworkCatalogRepository(this.api);
  final ApiClient api;
  @override
  Future<CatalogResult> search({String search = '', int page = 1}) async {
    final query = Uri(queryParameters: {'SearchTerm': search.trim(), 'Page': '$page', 'PageSize': '8', 'SortBy': 'rating', 'SortOrder': 'desc'}).query;
    final value = await api.request('/courses?$query');
    if (value is! Map || value['success'] != true || value['recommendations'] is! List ||
        value['totalCount'] is! int || value['currentPage'] is! int || value['totalPages'] is! int ||
        value['totalCount'] < 0 || value['currentPage'] < 1 || value['totalPages'] < 0) {
      throw const ApiFailure('The server returned an invalid catalog.', 502);
    }
    return CatalogResult((value['recommendations'] as List).map(CatalogCourse.fromJson).toList(),
      value['totalCount'] as int, value['currentPage'] as int, value['totalPages'] as int);
  }
}
