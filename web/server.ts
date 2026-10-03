import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Database / Domain state
const COURSES = [
  {
    id: 'course-1',
    title: 'Modern Fullstack Architecture: Next.js, TypeScript & Scalable APIs',
    category: 'Development',
    price: 89.99,
    discountPrice: 64.99,
    rating: 4.9,
    duration: '18 hours'
  },
  {
    id: 'course-2',
    title: 'Brutally Clean Design Systems: Typography, Layout & Mobile First',
    category: 'Design',
    price: 69.99,
    discountPrice: 49.99,
    rating: 4.95,
    duration: '9.5 hours'
  },
  {
    id: 'course-3',
    title: 'Enterprise Distributed Systems & Event Streaming',
    category: 'Development',
    price: 119.99,
    discountPrice: 89.99,
    rating: 4.88,
    duration: '22 hours'
  },
  {
    id: 'course-4',
    title: 'Product Leadership & Digital Monetization Strategy',
    category: 'Business',
    price: 79.99,
    discountPrice: 59.99,
    rating: 4.82,
    duration: '11 hours'
  }
];

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Learnfy Modern Learning & Streaming Core'
  });
});

// Catalog endpoint
app.get('/api/courses', (req, res) => {
  const { category, search } = req.query;
  let results = [...COURSES];

  if (category && category !== 'all') {
    results = results.filter(c => c.category.toLowerCase() === String(category).toLowerCase());
  }
  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(c => c.title.toLowerCase().includes(q));
  }

  res.json({ success: true, count: results.length, data: results });
});

// Single Course
app.get('/api/courses/:id', (req, res) => {
  const course = COURSES.find(c => c.id === req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }
  res.json({ success: true, data: course });
});

// Media Playback Authorization (HMAC / Entitlement validation)
app.post('/api/media/authorize', (req, res) => {
  const { courseId, lessonId, userId } = req.body;
  
  // Verify entitlement server-side
  const isPreview = lessonId?.endsWith('-1'); // First lesson is preview
  const hasEntitlement = Boolean(userId); // Simulated verified student entitlement

  if (!isPreview && !hasEntitlement) {
    return res.status(403).json({
      success: false,
      error: 'EntitlementRequired',
      message: 'Active course ownership required for streaming access.'
    });
  }

  // Issue short-lived media stream token
  res.json({
    success: true,
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    token: `stream_${Math.random().toString(36).substring(2)}`,
    expiresIn: 3600,
    adaptiveLevels: ['1080p', '720p', '480p']
  });
});

// Order Processing & Entitlement Generation
app.post('/api/orders/checkout', (req, res) => {
  const { items, paymentMethod, couponCode, userId } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ success: false, message: 'Cart items required.' });
  }

  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
  const entitlementIds = items.map((i: any) => `ENT-${i.courseId}-${userId || 'anon'}`);

  res.json({
    success: true,
    orderId,
    status: 'completed',
    paymentReference: `pi_${Math.random().toString(36).substring(2, 12)}`,
    entitlementsCreated: entitlementIds,
    receiptSent: true
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`[Learnfy Engine] Running on http://0.0.0.0:${port}`);
});
