import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, BookOpen } from 'lucide-react';
import { CourseCard } from '../components/CourseCard';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';

interface CatalogViewProps {
  onNavigate: (view: string, courseId?: string) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ onNavigate }) => {
  const { courses, searchQuery, setSearchQuery } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');

  const filteredCourses = courses.filter((c) => {
    // category filter
    if (selectedCategory !== 'all' && c.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    // level filter
    if (selectedLevel !== 'all' && c.level.toLowerCase() !== selectedLevel.toLowerCase()) {
      return false;
    }
    // search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      const matchInst = c.instructor.name.toLowerCase().includes(q);
      const matchCategory = c.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchInst && !matchCategory) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price-low') return (a.discountPrice || a.price) - (b.discountPrice || b.price);
    if (sortBy === 'price-high') return (b.discountPrice || b.price) - (a.discountPrice || a.price);
    if (sortBy === 'students') return b.studentsCount - a.studentsCount;
    return 0;
  });

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Explore Course Catalog
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Browse through verified curriculum designed for enterprise and senior mastery.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#FAF8F5] border border-gray-200 rounded-xl p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
          
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === cat.slug 
                    ? 'bg-red-600 text-white shadow-xs' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Level & Sorting Selectors */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 font-medium hidden sm:inline">Level:</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg text-xs font-medium py-1.5 px-2.5 text-gray-800 focus:outline-none focus:border-red-600"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 font-medium hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg text-xs font-medium py-1.5 px-2.5 text-gray-800 focus:outline-none focus:border-red-600"
              >
                <option value="rating">Top Rated</option>
                <option value="students">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-6 font-medium">
          <span>Showing {filteredCourses.length} programs</span>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-red-600 hover:underline font-semibold"
            >
              Clear search query "{searchQuery}"
            </button>
          )}
        </div>

        {/* Grid Display */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onSelectCourse={(id) => onNavigate('course-detail', id)}
                onStartLearning={(id) => onNavigate('player', id)}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center border border-dashed border-gray-300 rounded-2xl bg-[#FAF8F5]">
            <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-900">No courses match your query</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Try adjusting your category filter, clearing your search keywords, or selecting "All Levels".
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedLevel('all'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
