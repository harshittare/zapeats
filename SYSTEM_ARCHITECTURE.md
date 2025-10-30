# 🏗️ ZapEats System Architecture

## 📊 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ZapEats Food Delivery Platform                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                                 FRONTEND                                    │
│                          React TypeScript SPA                              │
│                              Port: 3002                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  📱 USER INTERFACE                                                          │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐                │
│  │   Authentication│ │   Restaurant    │ │   Order         │                │
│  │   - Login/Signup│ │   - Browse      │ │   - Cart        │                │
│  │   - Profile     │ │   - Search      │ │   - Checkout    │                │
│  │   - Social Auth │ │   - Filters     │ │   - Tracking    │                │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘                │
│                                                                             │
│  🎨 UI FRAMEWORK: Material-UI (MUI) + Framer Motion                        │
│  🔄 STATE MANAGEMENT: React Context + TanStack Query                       │
│  🛣️  ROUTING: React Router DOM                                              │
│  🔥 REAL-TIME: Socket.io Client                                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                              HTTP REST API
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 BACKEND                                     │
│                            Node.js + Express                               │
│                              Port: 5001                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  🛡️  SECURITY LAYER                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┤
│  │ • JWT Authentication    • Rate Limiting      • CORS                    │
│  │ • Input Validation     • Helmet Security    • Morgan Logging          │ 
│  └─────────────────────────────────────────────────────────────────────────┘
│                                                                             │
│  🔀 API ROUTES                                                              │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐                │
│  │   /api/auth     │ │  /api/restaurants│ │   /api/orders   │                │
│  │   - Register    │ │  - List/Search   │ │   - Create      │                │
│  │   - Login       │ │  - Details       │ │   - Track       │                │
│  │   - Profile     │ │  - Menu Items    │ │   - History     │                │
│  │   - OTP Verify  │ │  - Favorites     │ │   - Status      │                │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘                │
│                                                                             │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐                │
│  │   /api/users    │ │   /api/payments │ │   /api/reviews  │                │
│  │   - Profile     │ │   - Process     │ │   - Submit      │                │
│  │   - Addresses   │ │   - Validate    │ │   - List        │                │
│  │   - Preferences │ │   - Refunds     │ │   - Ratings     │                │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘                │
│                                                                             │
│  🔌 REAL-TIME ENGINE: Socket.io                                            │
│  • Order Status Updates  • Live Tracking  • Notifications                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                              Database Queries
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                               DATABASE                                      │
│                              MongoDB                                       │
│                        mongodb://localhost:27017                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  📊 DATA MODELS                                                             │
│                                                                             │
│  👤 Users Collection                    🏪 Restaurants Collection           │
│  ┌─────────────────────────────────────┐ ┌─────────────────────────────────┐│
│  │ • _id, name, email, phone           │ │ • _id, name, cuisine, location  ││
│  │ • password (hashed), role           │ │ • rating, features, hours       ││
│  │ • addresses, preferences            │ │ • image, description, pricing   ││
│  │ • favoriteRestaurants, points       │ │ • currentOffers, isActive       ││
│  │ • loyaltyLevel, referralCode        │ │ • deliveryRadius, minOrder      ││
│  └─────────────────────────────────────┘ └─────────────────────────────────┘│
│                                                                             │
│  🍽️  MenuItems Collection               📦 Orders Collection               │
│  ┌─────────────────────────────────────┐ ┌─────────────────────────────────┐│
│  │ • _id, name, description, price     │ │ • _id, user, restaurant         ││
│  │ • category, image, restaurant       │ │ • items[], totalAmount          ││
│  │ • customizations[], dietary         │ │ • status, paymentMethod         ││
│  │ • isVegetarian, isAvailable         │ │ • deliveryAddress, timeline     ││
│  │ • nutritionInfo, allergens          │ │ • discount, review, tracking    ││
│  └─────────────────────────────────────┘ └─────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL SERVICES                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  🗺️  Maps & Location     💳 Payment Gateway     📧 Communication           │
│  ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────────┐│
│  │ Google Maps API     │ │ Stripe/PayPal       │ │ Twilio SMS             ││
│  │ • Address Search    │ │ • Payment Processing│ │ • OTP Verification     ││
│  │ • Geocoding        │ │ • Refund Handling   │ │ • Order Notifications  ││
│  │ • Distance Calc    │ │ • Webhook Events    │ │ Email Service          ││
│  └─────────────────────┘ └─────────────────────┘ └─────────────────────────┘│
│                                                                             │
│  ☁️  Cloud Storage       🔐 Authentication       📊 Analytics              │
│  ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────────┐│
│  │ Cloudinary          │ │ Google OAuth        │ │ Custom Analytics       ││
│  │ • Image Storage     │ │ • Facebook Login    │ │ • Order Metrics        ││
│  │ • Image Processing  │ │ • Social Auth       │ │ • User Behavior        ││
│  └─────────────────────┘ └─────────────────────┘ └─────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. 👤 User Authentication                                                  │
│     Frontend → POST /api/auth/login → JWT Token → Secure Routes            │
│                                                                             │
│  2. 🏪 Restaurant Discovery                                                 │
│     Frontend → GET /api/restaurants → MongoDB Query → Restaurant List      │
│                                                                             │
│  3. 🛒 Order Processing                                                     │
│     Cart → POST /api/orders → Validation → Payment → Database → Socket     │
│                                                                             │
│  4. 📱 Real-time Updates                                                    │
│     Order Status Change → Socket.io → Frontend Update → User Notification  │
│                                                                             │
│  5. 🔍 Search & Filtering                                                   │
│     Search Query → MongoDB Aggregation → Filtered Results → UI Display     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           DEPLOYMENT ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  🌐 Frontend Deployment                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────┤
│  │ Platform: Netlify / Vercel                                             │
│  │ Build: npm run build → Static Files → CDN Distribution                 │
│  │ Environment: REACT_APP_API_URL, REACT_APP_GOOGLE_MAPS_API_KEY         │
│  └─────────────────────────────────────────────────────────────────────────┘
│                                                                             │
│  🖥️  Backend Deployment                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────┤
│  │ Platform: Heroku / Railway / AWS                                       │
│  │ Process: Node.js Server → Express API → MongoDB Connection             │
│  │ Environment: MONGODB_URI, JWT_SECRET, PAYMENT_KEYS                     │
│  └─────────────────────────────────────────────────────────────────────────┘
│                                                                             │
│  🗄️  Database Deployment                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┤
│  │ Platform: MongoDB Atlas (Cloud) / Local MongoDB                        │
│  │ Features: Automatic Backups, Scaling, Security                         │
│  └─────────────────────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            SECURITY FEATURES                               │
├─────────────────────────────────────────────────────────────────────────────┤
│  🔐 Authentication & Authorization                                          │
│  • JWT Token-based authentication                                          │
│  • Password hashing with bcryptjs                                          │
│  • Role-based access control (User, Admin, Restaurant)                     │
│  • Social login integration (Google, Facebook)                             │
│                                                                             │
│  🛡️  API Security                                                           │
│  • Rate limiting to prevent abuse                                          │
│  • Input validation with express-validator                                 │
│  • CORS configuration for cross-origin requests                            │
│  • Helmet.js for security headers                                          │
│  • Request logging with Morgan                                             │
│                                                                             │
│  🔒 Data Protection                                                         │
│  • Sensitive data encryption                                               │
│  • Secure payment processing                                               │
│  • PII data handling compliance                                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           PERFORMANCE FEATURES                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  ⚡ Frontend Optimization                                                   │
│  • Code splitting and lazy loading                                         │
│  • React.memo for component optimization                                   │
│  • TanStack Query for caching and data synchronization                     │
│  • Image optimization with lazy loading                                    │
│                                                                             │
│  🚀 Backend Optimization                                                    │
│  • MongoDB indexing for fast queries                                       │
│  • Response compression with gzip                                          │
│  • Connection pooling for database                                         │
│  • Caching strategies for frequently accessed data                         │
│                                                                             │
│  📈 Scalability Features                                                    │
│  • Horizontal scaling support                                              │
│  • Microservices architecture ready                                        │
│  • Load balancing capabilities                                             │
│  • Real-time features with Socket.io clustering                            │
└─────────────────────────────────────────────────────────────────────────────┘