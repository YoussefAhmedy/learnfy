import 'package:flutter_test/flutter_test.dart';
import 'package:learnfy/core/network/api_client.dart';
import 'package:learnfy/features/landing/data/catalog_repository.dart';

void main() {
  test('course contract accepts actual metadata without invented student counts', () {
    final course = CatalogCourse.fromJson({'id': 3, 'courseName': 'Course Name', 'category': 'Mathematics', 'description': null, 'instructor': null, 'duration': '8 hours', 'imageUrl': null, 'rating': 4.8, 'price': 99.99});
    expect(course.id, 3); expect(course.rating, 4.8); expect(course.price, 99.99);
  });
  test('malformed identifiers and prices never become fake courses', () {
    expect(() => CatalogCourse.fromJson({'id': 'fake-course'}), throwsA(isA<ApiFailure>()));
    expect(() => CatalogCourse.fromJson({'id': 1, 'courseName': 'Course', 'category': 'Math', 'price': -10}), throwsA(isA<ApiFailure>()));
  });
}
