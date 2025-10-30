# ZapEats - Modern Food Delivery App 🍔⚡

A full-stack, modern food delivery application built with React, Node.js, Express, and MongoDB. Features a clean, intuitive UI with smooth animations and comprehensive functionality for ordering food online.

## 🌟 Features

### 🔐 Authentication & User Management
- **Multi-method Login/Signup**: Email, phone number, Google, and Facebook authentication
- **Guest Browsing**: Browse restaurants without account (login required for checkout)
- **Secure JWT Authentication**: Token-based authentication with automatic refresh
- **Social Login Integration**: Ready for Google and Facebook OAuth implementation

### 🍽️ Restaurant & Menu Management
- **Restaurant Discovery**: Grid/list view with images, ratings, cuisines, and delivery times
- **Advanced Filters**: Veg/Non-Veg, cuisine type, price range, ratings, and dietary preferences
- **Smart Search**: Full-text search across restaurants, menus, and dishes
- **Sort Options**: By rating, delivery time, offers, and newest additions
- **Featured Restaurants**: Highlighted top-rated and trending establishments

### 🛒 Shopping Experience
- **Interactive Menu**: Organized categories (Starters, Main Course, Desserts, Beverages)
- **Item Customization**: Size variants, toppings, spice levels, and dietary options
- **Smart Cart**: Quantity controls, item modifications, and restaurant switching alerts
- **Smooth Animations**: Framer Motion powered interactions and transitions

### 💳 Ordering & Payments
- **Flexible Checkout**: Multiple payment methods (cards, wallets, UPI, cash)
- **Address Management**: Save multiple addresses with location mapping
- **Promo System**: Discount codes, loyalty points, and special offers
- **Order Confirmation**: Real-time updates and estimated delivery times

### 📦 Order Management
- **Live Tracking**: Real-time order status updates (Preparing → Delivery → Delivered)
- **Order History**: Complete order details with reorder functionality
- **Review System**: Rate food, delivery, and overall experience
- **Cancellation**: Order cancellation with refund processing

### 👤 User Profile & Gamification
- **Profile Management**: Personal details, preferences, and settings
- **Loyalty Program**: Points system with rewards and badges
- **Favorites**: Save favorite restaurants and dishes
- **Referral System**: Earn credits for inviting friends
- **Achievement Badges**: Gamified experience for frequent users

### 🚀 Advanced Features
- **AI Recommendations**: Personalized suggestions based on order history
- **Live Chat Support**: Real-time customer support integration
- **Push Notifications**: Order updates, offers, and re-engagement alerts
- **Smart Filters**: Health-conscious options (keto, vegan, low-calorie)
- **Delivery Tracking**: Real-time GPS tracking of delivery partners
- **Dark Mode**: Theme switching with user preferences
- **Mobile Responsive**: Optimized for all device sizes

## 🛠️ Tech Stack

### Frontend
- **React 18**: Latest React with TypeScript for type safety
- **Material-UI (MUI)**: Modern, accessible component library
- **Framer Motion**: Smooth animations and micro-interactions
- **React Router**: Client-side routing with lazy loading
- **React Query**: Server state management and caching
- **React Hook Form**: Performant forms with validation
- **Yup**: Schema validation for forms
- **Socket.io Client**: Real-time communication
- **Axios**: HTTP client with interceptors

### Backend
- **Node.js**: JavaScript runtime with Express.js framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **Socket.io**: Real-time bidirectional communication
- **Bcrypt**: Password hashing and security
- **Multer**: File upload handling
- **Cloudinary**: Image storage and optimization
- **Express Validator**: Input validation and sanitization
- **Helmet**: Security middleware
- **Compression**: Response compression
- **Rate Limiting**: API rate limiting protection

### Development Tools
- **TypeScript**: Type safety and better developer experience
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Concurrently**: Run multiple npm scripts simultaneously
- **Nodemon**: Automatic server restart during development

## 📁 Project Structure

```
zapeats/
├── client/                     # React frontend application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   └── Layout/         # Navigation and layout components
│   │   ├── contexts/           # React Context providers
│   │   ├── pages/              # Page components
│   │   │   └── Auth/           # Authentication pages
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API service functions
│   │   ├── utils/              # Utility functions
│   │   └── types/              # TypeScript type definitions
│   ├── package.json
│   └── .env                    # Environment variables
├── server/                     # Node.js backend API
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # API route handlers
│   ├── middleware/             # Express middleware
│   ├── controllers/            # Business logic
│   ├── services/               # External service integrations
│   ├── utils/                  # Helper functions
│   ├── index.js                # Server entry point
│   ├── package.json
│   └── .env                    # Environment variables
├── package.json                # Root package.json
└── README.md                   # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zapeats
   ```

2. **Install dependencies**
   ```bash
   npm run install-deps
   ```

3. **Environment Setup**
   
   Create `.env` files in both `server/` and `client/` directories:
   
   **Server (.env)**:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/zapeats
   JWT_SECRET=your-super-secret-jwt-key
   CLIENT_URL=http://localhost:3000
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```
   
   **Client (.env)**:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5000
   REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```
   
   This starts both frontend (http://localhost:3000) and backend (http://localhost:5000) servers.

### Individual Server Commands

- **Start backend only**: `npm run server`
- **Start frontend only**: `npm run client`
- **Build for production**: `npm run build`

## 🎨 Design System

### Color Palette
- **Primary**: Orange gradient (#FF6B35 to #F7931E)
- **Secondary**: Green (#2E7D32)
- **Background**: Light gray (#FAFAFA)
- **Paper**: White (#FFFFFF)

### Typography
- **Font Family**: Inter, Roboto, Arial
- **Headings**: Bold weights with appropriate sizing
- **Body**: Regular weight with good readability

### Components
- **Border Radius**: 12px default, 16px for cards
- **Shadows**: Subtle elevation with consistent depth
- **Animations**: Smooth transitions with Framer Motion

## 🔧 Configuration

### Database Models
- **User**: Authentication, preferences, loyalty points, addresses
- **Restaurant**: Details, location, ratings, operating hours
- **MenuItem**: Menu items with variants, customizations, dietary info
- **Order**: Complete order lifecycle with tracking and reviews

### API Endpoints
- `/api/auth` - Authentication routes
- `/api/restaurants` - Restaurant management
- `/api/menu` - Menu item operations
- `/api/orders` - Order processing and tracking
- `/api/users` - User profile management

## 🚀 Deployment

### Prerequisites for Production
- MongoDB Atlas or production MongoDB instance
- Cloudinary account for image storage
- Environment variables configured
- Payment gateway keys (Stripe/PayPal)
- Social authentication credentials

### Build Commands
```bash
# Build client for production
cd client && npm run build

# Start production server
cd server && npm start
```

## 📱 Mobile Experience

The app is built with mobile-first approach:
- Responsive design across all screen sizes
- Touch-friendly interface with appropriate touch targets
- Optimized images and lazy loading
- Progressive Web App (PWA) capabilities ready

## 🔒 Security Features

- JWT-based authentication with secure httpOnly cookies
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS configuration for cross-origin requests
- Helmet.js for security headers

## 🎯 Future Enhancements

- [ ] Push notifications implementation
- [ ] Offline mode with service workers
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Voice ordering integration
- [ ] AR menu visualization
- [ ] IoT integration for smart delivery

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, email support@zapeats.com or join our Discord community.

---

Built with ❤️ by the ZapEats team. Happy coding! 🚀