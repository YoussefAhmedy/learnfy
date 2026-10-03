export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: 'student' | 'instructor' | 'admin';
  avatar?: string;
  enrolledCourseIds: string[];
}

export interface LessonResource {
  id: string;
  title: string;
  type: 'pdf' | 'code' | 'archive' | 'link';
  size: string;
  url: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  sectionId: string;
  title: string;
  durationMinutes: number;
  isPreview: boolean;
  videoUrl: string;
  videoQualities?: { quality: string; url: string }[];
  captionsUrl?: string;
  summary: string;
  notes?: string;
  resources?: LessonResource[];
  quiz?: QuizQuestion[];
}

export interface Section {
  id: string;
  courseId: string;
  title: string;
  lessons: Lesson[];
}

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  category: string;
  subcategory?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  thumbnailUrl: string;
  description: string;
  longDescription?: string;
  learningOutcomes: string[];
  requirements: string[];
  instructor: {
    id: string;
    name: string;
    title: string;
    bio: string;
    avatar: string;
    rating: number;
    studentsCount: number;
    coursesCount: number;
  };
  duration: string; // e.g. "14.5 hours"
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  price: number;
  discountPrice?: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isRecommended?: boolean;
  lastUpdated: string;
  language: string;
  subtitles: string[];
  sections: Section[];
  reviews?: Review[];
}

export interface CourseProgress {
  courseId: string;
  completedLessonIds: string[];
  lastAccessedLessonId: string;
  playbackPositionSeconds: Record<string, number>; // lessonId -> seconds
  quizScores?: Record<string, number>; // lessonId -> percentage
  certificateIssued?: boolean;
  certificateId?: string;
  certificateDate?: string;
}

export interface CartItem {
  course: Course;
  price: number;
}

export interface OrderItem {
  courseId: string;
  courseTitle: string;
  coursePrice: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  paymentMethod: string;
  paymentStatus: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentReference: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'course' | 'order' | 'certificate' | 'system';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}
