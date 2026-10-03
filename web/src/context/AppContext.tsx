import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Course, CourseProgress, Order, OrderItem, Notification } from '../types';
import { SAMPLE_COURSES, SAMPLE_USERS, SAMPLE_NOTIFICATIONS } from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  courses: Course[];
  activeCourseId: string | null;
  setActiveCourseId: (id: string | null) => void;
  cart: { courseId: string; price: number }[];
  addToCart: (courseId: string) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (courseId: string) => void;
  enrolledCourseIds: string[];
  enrollInCourse: (courseId: string) => void;
  courseProgress: Record<string, CourseProgress>;
  updateLessonProgress: (courseId: string, lessonId: string, completed: boolean, positionSeconds?: number) => void;
  saveQuizScore: (courseId: string, lessonId: string, score: number) => void;
  orders: Order[];
  createOrder: (subtotal: number, discount: number, total: number, couponCode?: string) => Order;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('learnfy_user');
    return saved ? JSON.parse(saved) : SAMPLE_USERS[0]; // Alex Rivera by default
  });

  const [courses] = useState<Course[]>(SAMPLE_COURSES);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  
  const [cart, setCart] = useState<{ courseId: string; price: number }[]>(() => {
    const saved = localStorage.getItem('learnfy_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('learnfy_wishlist');
    return saved ? JSON.parse(saved) : ['course-2'];
  });

  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('learnfy_enrolled');
    return saved ? JSON.parse(saved) : ['course-1']; // Alex is already enrolled in course-1
  });

  const [courseProgress, setCourseProgress] = useState<Record<string, CourseProgress>>(() => {
    const saved = localStorage.getItem('learnfy_progress');
    return saved ? JSON.parse(saved) : {
      'course-1': {
        courseId: 'course-1',
        completedLessonIds: ['les-1-1-1'],
        lastAccessedLessonId: 'les-1-1-2',
        playbackPositionSeconds: { 'les-1-1-1': 720, 'les-1-1-2': 140 },
        quizScores: { 'les-1-1-1': 100 }
      }
    };
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('learnfy_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'ORD-984210',
        userId: 'user-001',
        items: [{ courseId: 'course-1', courseTitle: SAMPLE_COURSES[0].title, coursePrice: 64.99 }],
        subtotal: 89.99,
        discount: 25.00,
        total: 64.99,
        paymentMethod: 'Credit Card (Stripe Tokenized)',
        paymentStatus: 'completed',
        paymentReference: 'pi_3MtwL2KZv9TXHI9x1P234',
        createdAt: '2026-09-24T14:32:00Z'
      }
    ];
  });

  const [notifications, setNotifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('learnfy_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('learnfy_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('learnfy_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('learnfy_enrolled', JSON.stringify(enrolledCourseIds));
  }, [enrolledCourseIds]);

  useEffect(() => {
    localStorage.setItem('learnfy_progress', JSON.stringify(courseProgress));
  }, [courseProgress]);

  useEffect(() => {
    localStorage.setItem('learnfy_orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (courseId: string) => {
    if (cart.some(item => item.courseId === courseId) || enrolledCourseIds.includes(courseId)) return;
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    setCart(prev => [...prev, { courseId, price: course.discountPrice ?? course.price }]);
  };

  const removeFromCart = (courseId: string) => {
    setCart(prev => prev.filter(item => item.courseId !== courseId));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (courseId: string) => {
    setWishlist(prev => 
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  };

  const enrollInCourse = (courseId: string) => {
    if (!enrolledCourseIds.includes(courseId)) {
      setEnrolledCourseIds(prev => [...prev, courseId]);
      // initialize progress
      const course = courses.find(c => c.id === courseId);
      const firstLessonId = course?.sections[0]?.lessons[0]?.id || '';
      setCourseProgress(prev => ({
        ...prev,
        [courseId]: prev[courseId] || {
          courseId,
          completedLessonIds: [],
          lastAccessedLessonId: firstLessonId,
          playbackPositionSeconds: {}
        }
      }));
    }
  };

  const updateLessonProgress = (courseId: string, lessonId: string, completed: boolean, positionSeconds = 0) => {
    setCourseProgress(prev => {
      const current = prev[courseId] || {
        courseId,
        completedLessonIds: [],
        lastAccessedLessonId: lessonId,
        playbackPositionSeconds: {}
      };
      
      const completedSet = new Set(current.completedLessonIds);
      if (completed) {
        completedSet.add(lessonId);
      } else {
        completedSet.delete(lessonId);
      }

      const completedArray = Array.from(completedSet);

      // Check if all lessons are completed to issue verified certificate
      const course = courses.find(c => c.id === courseId);
      const totalLessons = course ? course.sections.flatMap(s => s.lessons).length : 0;
      const isCourseFinished = totalLessons > 0 && completedArray.length >= totalLessons;

      return {
        ...prev,
        [courseId]: {
          ...current,
          completedLessonIds: completedArray,
          lastAccessedLessonId: lessonId,
          playbackPositionSeconds: {
            ...current.playbackPositionSeconds,
            [lessonId]: positionSeconds
          },
          certificateIssued: isCourseFinished || current.certificateIssued,
          certificateId: current.certificateId || (isCourseFinished ? `CERT-${Date.now().toString(36).toUpperCase()}` : undefined),
          certificateDate: current.certificateDate || (isCourseFinished ? new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : undefined)
        }
      };
    });
  };

  const saveQuizScore = (courseId: string, lessonId: string, score: number) => {
    setCourseProgress(prev => {
      const current = prev[courseId] || {
        courseId,
        completedLessonIds: [],
        lastAccessedLessonId: lessonId,
        playbackPositionSeconds: {}
      };
      return {
        ...prev,
        [courseId]: {
          ...current,
          quizScores: {
            ...current.quizScores,
            [lessonId]: score
          }
        }
      };
    });
  };

  const createOrder = (subtotal: number, discount: number, total: number, couponCode?: string): Order => {
    const orderItems: OrderItem[] = cart.map(item => {
      const course = courses.find(c => c.id === item.courseId);
      return {
        courseId: item.courseId,
        courseTitle: course ? course.title : 'Course Enrollment',
        coursePrice: item.price
      };
    });

    const newOrder: Order = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: currentUser ? currentUser.id : 'anonymous',
      items: orderItems,
      subtotal,
      discount,
      total,
      couponCode,
      paymentMethod: 'Credit Card (Instant Tokenized Auth)',
      paymentStatus: 'completed',
      paymentReference: `pi_${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);

    // Entitle all purchased courses
    cart.forEach(item => {
      enrollInCourse(item.courseId);
    });

    // Add purchase confirmation notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        userId: currentUser?.id || 'user-001',
        title: 'Order Completed & Access Granted',
        message: `Your payment of $${total.toFixed(2)} was verified. All enrolled courses are now ready in your Learning Library.`,
        type: 'order',
        isRead: false,
        createdAt: 'Just now',
        actionUrl: '/library'
      },
      ...prev
    ]);

    clearCart();
    return newOrder;
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      courses,
      activeCourseId,
      setActiveCourseId,
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      wishlist,
      toggleWishlist,
      enrolledCourseIds,
      enrollInCourse,
      courseProgress,
      updateLessonProgress,
      saveQuizScore,
      orders,
      createOrder,
      notifications,
      markNotificationRead,
      searchQuery,
      setSearchQuery,
      activeCategory,
      setActiveCategory,
      isAiModalOpen,
      setIsAiModalOpen
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
