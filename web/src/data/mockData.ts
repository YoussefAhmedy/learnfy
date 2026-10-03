import { Course, User, Notification } from '../types';

export const SAMPLE_USERS: User[] = [
  {
    id: 'user-001',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    username: 'alex_r',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    enrolledCourseIds: ['course-1', 'course-3'],
  },
  {
    id: 'user-inst-1',
    name: 'Sarah Drasner',
    email: 'sarah@learnfy.com',
    username: 'sarah_d',
    role: 'instructor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    enrolledCourseIds: [],
  }
];

export const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-001',
    title: 'New module released',
    message: 'Next.js 15 Server Actions deep dive is now live in Modern Fullstack Masterclass.',
    type: 'course',
    isRead: false,
    createdAt: '10 minutes ago',
    actionUrl: '/learn/course-1'
  },
  {
    id: 'notif-2',
    userId: 'user-001',
    title: 'Order Completed',
    message: 'Thank you! Your enrollment for Design Systems with Tailwind & Figma has been confirmed.',
    type: 'order',
    isRead: true,
    createdAt: '1 day ago',
    actionUrl: '/library'
  }
];

export const SAMPLE_COURSES: Course[] = [
  {
    id: 'course-1',
    slug: 'modern-fullstack-nextjs-typescript',
    title: 'Modern Fullstack Architecture: Next.js, TypeScript & Scalable APIs',
    category: 'Development',
    subcategory: 'Web Development',
    level: 'Intermediate',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    description: 'Master clean architecture, enterprise React 19, distributed backend systems, and high-performance video streaming pipelines.',
    longDescription: 'This comprehensive course takes you from foundational React & TypeScript knowledge to enterprise-grade web application architecture. You will design, build, and deploy resilient digital platforms featuring video streaming, resilient e-commerce checkout, and high-throughput background processing.',
    duration: '18 hours',
    rating: 4.9,
    reviewsCount: 1420,
    studentsCount: 8930,
    price: 89.99,
    discountPrice: 64.99,
    isFeatured: true,
    isTrending: true,
    isRecommended: true,
    lastUpdated: 'October 2026',
    language: 'English',
    subtitles: ['English [Auto]', 'Spanish', 'German'],
    learningOutcomes: [
      'Architect fullstack applications with clean separation of concerns',
      'Implement secure tokenized authentication, RBAC, and rate limiting',
      'Engineer custom video players with adaptive quality, captions & scrubbing',
      'Handle end-to-end e-commerce order processing, cart state, and coupons',
      'Optimize Web Vitals, streaming SSR, and mobile native UX patterns'
    ],
    requirements: [
      'Basic familiarity with JavaScript / TypeScript syntax',
      'Node.js 20+ installed on your development workstation',
      'Desire to build high-standard, commercial-grade digital applications'
    ],
    instructor: {
      id: 'inst-1',
      name: 'Dr. Marcus Vance',
      title: 'Principal Systems Architect & Former Staff Engineer',
      bio: 'Over 14 years leading engineering teams at top-tier distributed systems and media streaming companies.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      rating: 4.92,
      studentsCount: 38400,
      coursesCount: 5
    },
    sections: [
      {
        id: 'sec-1-1',
        courseId: 'course-1',
        title: 'Section 1: Architectural Foundations & Mental Models',
        lessons: [
          {
            id: 'les-1-1-1',
            courseId: 'course-1',
            sectionId: 'sec-1-1',
            title: '1. Introduction & Course Overview',
            durationMinutes: 12,
            isPreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            videoQualities: [
              { quality: '1080p', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
              { quality: '720p', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
              { quality: '480p', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }
            ],
            summary: 'Welcome to the platform! We outline what makes production applications distinct from student toys: bounded contexts, resilient streaming, and deliberate design systems.',
            notes: 'Key Takeaways:\n• Always isolate domain models from client transport layers.\n• Avoid premature polyglot microservices when a modular monolith is superior.\n• Performance begins in design: minimal CSS overhead and typography discipline.',
            resources: [
              { id: 'res-1', title: 'System Architecture Checklist (PDF)', type: 'pdf', size: '2.4 MB', url: '#' },
              { id: 'res-2', title: 'Course Starter Repository (ZIP)', type: 'archive', size: '14.8 MB', url: '#' }
            ],
            quiz: [
              {
                id: 'q1',
                question: 'What is the primary danger of introducing multiple microservices too early in a project?',
                options: [
                  'Increased network latency, distributed transaction complexity, and maintenance overhead',
                  'Fewer Docker containers needed',
                  'Decreased database storage requirements',
                  'Inability to write unit tests'
                ],
                correctIndex: 0,
                explanation: 'premature microservices complicate state consistency, networking, deployments, and debugging without proven organizational scaling need.'
              },
              {
                id: 'q2',
                question: 'Which of the following belongs in a clean design token specification?',
                options: [
                  'Random hexadecimal colors picked ad-hoc per page',
                  'Fixed typography scale, semantic color palette, and predictable border-radius tokens',
                  'Unconstrained neon glowing shadows on every button',
                  'Arbitrary padding values'
                ],
                correctIndex: 1,
                explanation: 'A unified design token system enforces brand cohesion, responsive clarity, and avoids the generic Frankenstein look.'
              }
            ]
          },
          {
            id: 'les-1-1-2',
            courseId: 'course-1',
            sectionId: 'sec-1-1',
            title: '2. Monorepo vs. Clean Modular Monolith',
            durationMinutes: 24,
            isPreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            summary: 'Deep dive into organizing workspaces, shared interfaces, and maintaining strict boundaries between API consumers and data persistence.',
            notes: 'Guidelines:\n• Keep client DTOs synchronized with server models.\n• Never expose sensitive internal DB attributes (e.g. password hash) to client bundles.',
            resources: [
              { id: 'res-3', title: 'Domain Separation Diagram', type: 'link', size: 'Web link', url: '#' }
            ]
          },
          {
            id: 'les-1-1-3',
            courseId: 'course-1',
            sectionId: 'sec-1-1',
            title: '3. Data Modeling & Transactional Integrity',
            durationMinutes: 31,
            isPreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            summary: 'How to structure orders, entitlements, and course completion states without race conditions or payment desynchronization.',
            notes: 'Entitlement Rule: A user is granted course access ONLY when an explicit verified entitlement record exists.'
          }
        ]
      },
      {
        id: 'sec-1-2',
        courseId: 'course-1',
        title: 'Section 2: High-Performance Media & Streaming Player',
        lessons: [
          {
            id: 'les-1-2-1',
            courseId: 'course-1',
            sectionId: 'sec-1-2',
            title: '4. Video Infrastructure: HLS, CDN & Playback Auth',
            durationMinutes: 28,
            isPreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            summary: 'Architecting adaptive bitrate delivery, signed video tokens, and short-lived media authorization.'
          },
          {
            id: 'les-1-2-2',
            courseId: 'course-1',
            sectionId: 'sec-1-2',
            title: '5. Building the Custom Streaming Player Controls',
            durationMinutes: 35,
            isPreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            summary: 'Implementing theater mode, keyboard shortcuts (j/k/l, arrows, f), speed toggles, resolution selectors, and precision time seeking.'
          }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        courseId: 'course-1',
        userId: 'user-10',
        userName: 'Elena Rostova',
        rating: 5,
        comment: 'Easily the cleanest fullstack architectural course on the web. No flashy AI fluff, just pure, senior-level software engineering.',
        date: '2 weeks ago',
        verifiedPurchase: true
      },
      {
        id: 'rev-2',
        courseId: 'course-1',
        userId: 'user-11',
        userName: 'David Kim',
        rating: 5,
        comment: 'The video player chapter alone justified the purchase. The layout feels brutally clean and fast.',
        date: '1 month ago',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'course-2',
    slug: 'crafting-high-impact-design-systems',
    title: 'Brutally Clean Design Systems: Typography, Layout & Mobile First',
    category: 'Design',
    subcategory: 'UI/UX Design',
    level: 'Beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    description: 'Ditch the generic AI neon gradients. Craft timeless, editorial-grade interfaces with cream tones, Swiss typography, and crisp spacing.',
    longDescription: 'Learn how world-class designers construct durable, high-converting product experiences. Master typography hierarchies, grid mathematics, subtle interaction feedback, and ruthless elimination of visual clutter.',
    duration: '9.5 hours',
    rating: 4.95,
    reviewsCount: 884,
    studentsCount: 4210,
    price: 69.99,
    discountPrice: 49.99,
    isFeatured: true,
    isTrending: false,
    isRecommended: true,
    lastUpdated: 'September 2026',
    language: 'English',
    subtitles: ['English', 'French'],
    learningOutcomes: [
      'Understand typography scales and typographic rhythm',
      'Use cream, off-white, and deep charcoal for high-trust commercial products',
      'Design seamless native mobile and responsive layouts',
      'Build reusable React components with zero unnecessary dependencies'
    ],
    requirements: [
      'Basic interest in visual design or frontend engineering',
      'No specialized graphic software required'
    ],
    instructor: {
      id: 'inst-2',
      name: 'Sofia Lindqvist',
      title: 'Design Director & Brand Strategist',
      bio: '12 years directing visual systems for Scandinavian fintechs and high-growth European software ventures.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      rating: 4.96,
      studentsCount: 22100,
      coursesCount: 3
    },
    sections: [
      {
        id: 'sec-2-1',
        courseId: 'course-2',
        title: 'Section 1: The Geometry of Visual Trust',
        lessons: [
          {
            id: 'les-2-1-1',
            courseId: 'course-2',
            sectionId: 'sec-2-1',
            title: '1. Why Generic AI Designs Repel Serious Users',
            durationMinutes: 18,
            isPreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
            summary: 'Examining why neon purples, glowing cards, and excessive glassmorphism undermine commercial authority.'
          },
          {
            id: 'les-2-1-2',
            courseId: 'course-2',
            sectionId: 'sec-2-1',
            title: '2. The Off-White & Deep Charcoal Palette',
            durationMinutes: 22,
            isPreview: false,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            summary: 'Pairing warm cream backgrounds (#FAF8F5) with deliberate coral/red actions for high-converting interfaces.'
          }
        ]
      }
    ],
    reviews: [
      {
        id: 'rev-3',
        courseId: 'course-2',
        userId: 'user-12',
        userName: 'Liam Thorne',
        rating: 5,
        comment: 'A breath of fresh air in an ocean of cookie-cutter templates.',
        date: '3 weeks ago',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'course-3',
    slug: 'scalable-distributed-cloud-systems',
    title: 'Enterprise Distributed Systems & Event Streaming',
    category: 'Development',
    subcategory: 'DevOps & Cloud',
    level: 'Advanced',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    description: 'Architect mission-critical backends with asynchronous message queues, idempotent transactions, and zero-downtime deployments.',
    longDescription: 'Designed for senior developers and architects building software that cannot afford downtime or duplicate payment states. Learn event-driven architecture, resilient retry policies, distributed locking, and real-time observability.',
    duration: '22 hours',
    rating: 4.88,
    reviewsCount: 712,
    studentsCount: 3490,
    price: 119.99,
    discountPrice: 89.99,
    isFeatured: false,
    isTrending: true,
    isRecommended: false,
    lastUpdated: 'August 2026',
    language: 'English',
    subtitles: ['English', 'German'],
    learningOutcomes: [
      'Design fault-tolerant payment webhooks and event reconciliation',
      'Implement structured logging with correlation trace IDs',
      'Mitigate OWASP Top 10 vulnerabilities at the gateway and application level',
      'Configure production Docker containers and CI/CD pipelines'
    ],
    requirements: [
      'Solid experience in backend programming (Node, Go, or .NET)',
      'Understanding of relational databases and SQL'
    ],
    instructor: {
      id: 'inst-3',
      name: 'Tariq Al-Mansoor',
      title: 'Head of Infrastructure @ CloudStream',
      bio: 'Leads global infrastructure processing billions of transactions monthly across multi-region deployments.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      rating: 4.89,
      studentsCount: 19500,
      coursesCount: 4
    },
    sections: [
      {
        id: 'sec-3-1',
        courseId: 'course-3',
        title: 'Section 1: Event-Driven Foundations',
        lessons: [
          {
            id: 'les-3-1-1',
            courseId: 'course-3',
            sectionId: 'sec-3-1',
            title: '1. Designing Idempotent Payment Handlers',
            durationMinutes: 29,
            isPreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            summary: 'How to gracefully handle duplicate gateway webhooks without double-charging or granting duplicated entitlements.'
          }
        ]
      }
    ]
  },
  {
    id: 'course-4',
    slug: 'business-strategy-for-product-leaders',
    title: 'Product Leadership & Digital Monetization Strategy',
    category: 'Business',
    subcategory: 'Product Management',
    level: 'All Levels',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    description: 'Transform features into sustainable commercial models. Master digital subscriptions, course pricing elasticity, and customer retention.',
    longDescription: 'A practical, metrics-driven guide for technical founders, product managers, and digital educators seeking to build profitable digital learning businesses with healthy margins and predictable unit economics.',
    duration: '11 hours',
    rating: 4.82,
    reviewsCount: 430,
    studentsCount: 2810,
    price: 79.99,
    discountPrice: 59.99,
    isFeatured: false,
    isTrending: false,
    isRecommended: true,
    lastUpdated: 'July 2026',
    language: 'English',
    subtitles: ['English'],
    learningOutcomes: [
      'Formulate pricing experiments and discount strategies that preserve brand equity',
      'Optimize student onboarding and reduce drop-off during checkout',
      'Analyze student engagement analytics to drive repeat enrollments'
    ],
    requirements: [
      'No prerequisites'
    ],
    instructor: {
      id: 'inst-4',
      name: 'Claire Beauchamp',
      title: 'VP of Growth & Commercial Monetization',
      bio: 'Advised over 40 scaleups on digital pricing, checkout funnel optimization, and customer retention metrics.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      rating: 4.85,
      studentsCount: 14200,
      coursesCount: 2
    },
    sections: [
      {
        id: 'sec-4-1',
        courseId: 'course-4',
        title: 'Section 1: Unit Economics in EdTech',
        lessons: [
          {
            id: 'les-4-1-1',
            courseId: 'course-4',
            sectionId: 'sec-4-1',
            title: '1. The True Cost of Customer Acquisition vs. LTV',
            durationMinutes: 20,
            isPreview: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
            summary: 'Understanding course conversion economics and why high completion rates directly correlate to referral virality.'
          }
        ]
      }
    ]
  }
];

export const CATEGORIES = [
  { id: 'cat-all', name: 'All Categories', slug: 'all', count: 4 },
  { id: 'cat-dev', name: 'Development', slug: 'development', count: 2 },
  { id: 'cat-design', name: 'Design', slug: 'design', count: 1 },
  { id: 'cat-biz', name: 'Business', slug: 'business', count: 1 },
];
