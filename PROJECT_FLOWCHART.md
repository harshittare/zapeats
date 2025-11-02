# ZapEats - Food Delivery App Flowchart

## 🏗️ **System Architecture Overview**

```mermaid
graph TB
    A[User] --> B[Frontend React App]
    B --> C[Node.js Backend API]
    C --> D[MongoDB Database]
    E[Admin] --> F[Admin Panel]
    F --> C
```

## 🔐 **Authentication Flow**

```mermaid
flowchart TD
    A[User Opens App] --> B{Is Authenticated?}
    B -->|No| C[Redirect to Login]
    B -->|Yes| D[Access Protected Routes]
    
    C --> E[Login Page]
    E --> F{Login Method}
    F -->|Email/Phone + Password| G[Submit Credentials]
    F -->|New User| H[Register Page]
    
    G --> I[API: POST /auth/login]
    I --> J{Valid Credentials?}
    J -->|Yes| K[Return JWT Token + User Data]
    J -->|No| L[Show Error Message]
    L --> E
    
    K --> M[Store Token in localStorage]
    M --> N[Update Auth Context]
    N --> D
    
    H --> O[Registration Form]
    O --> P[API: POST /auth/register]
    P --> Q{Registration Success?}
    Q -->|Yes| K
    Q -->|No| R[Show Error Message]
    R --> H
```

## 🍽️ **Main Application Flow**

```mermaid
flowchart TD
    A[Authenticated User] --> B[Home Page]
    B --> C[Browse Restaurants]
    
    C --> D[Restaurant List Page]
    D --> E{Filter/Search?}
    E -->|Yes| F[Apply Filters]
    F --> G[Display Filtered Results]
    E -->|No| G
    
    G --> H[Select Restaurant]
    H --> I[Restaurant Details Page]
    I --> J[Browse Menu Items]
    
    J --> K{Add to Cart?}
    K -->|Yes| L[Add Item to Cart Context]
    K -->|No| J
    
    L --> M[Update Cart Badge]
    M --> N{Continue Shopping?}
    N -->|Yes| J
    N -->|No| O[Go to Cart]
    
    O --> P[Cart Page]
    P --> Q{Modify Cart?}
    Q -->|Yes| R[Update/Remove Items]
    R --> P
    Q -->|No| S[Proceed to Checkout]
    
    S --> T[Checkout Page]
    T --> U[Enter Delivery Address]
    U --> V[Select Payment Method]
    V --> W[Review Order]
    W --> X[Place Order]
    
    X --> Y[API: POST /orders]
    Y --> Z{Order Created?}
    Z -->|Yes| AA[Order Confirmation]
    Z -->|No| BB[Show Error]
    BB --> T
    
    AA --> CC[Order History Page]
```

## 📦 **Order Management Flow**

```mermaid
flowchart TD
    A[Order Placed] --> B[Status: Pending]
    B --> C[Restaurant Receives Order]
    C --> D[Status: Confirmed]
    D --> E[Kitchen Preparation]
    E --> F[Status: Preparing]
    F --> G[Food Ready]
    G --> H[Status: Ready]
    H --> I[Delivery Partner Pickup]
    I --> J[Status: Picked Up]
    J --> K[Out for Delivery]
    K --> L[Status: Out for Delivery]
    L --> M[Order Delivered]
    M --> N[Status: Delivered]
    
    B --> O{Cancel Order?}
    O -->|Yes| P[Status: Cancelled]
    O -->|No| C
    
    N --> Q[User Can Rate & Review]
    Q --> R[API: POST /orders/:id/review]
```

## 👤 **User Profile Management**

```mermaid
flowchart TD
    A[User Profile Page] --> B[Load User Data from AuthContext]
    B --> C[Display Profile Information]
    
    C --> D{Edit Profile?}
    D -->|Yes| E[Edit Profile Dialog]
    D -->|No| F[View Other Tabs]
    
    E --> G[Update Form Fields]
    G --> H[Save Changes]
    H --> I[Update AuthContext]
    I --> J[Update Local State]
    J --> K[Show Success Message]
    K --> C
    
    F --> L{Which Tab?}
    L -->|Addresses| M[Manage Addresses]
    L -->|Payment| N[Manage Payment Methods]
    L -->|Settings| O[Update Preferences]
    
    M --> P[Add/Edit/Delete Addresses]
    N --> Q[Add/Remove Payment Cards]
    O --> R[Toggle Notifications/Settings]
```

## 🏪 **Restaurant & Menu Management**

```mermaid
flowchart TD
    A[Restaurant Page Load] --> B{Data Source}
    B -->|Mock Data| C[Load Static Restaurant Data]
    B -->|API Data| D[API: GET /restaurants]
    
    C --> E[Display Restaurant Cards]
    D --> F{API Success?}
    F -->|Yes| G[Transform API Data]
    F -->|No| H[Fallback to Mock Data]
    G --> E
    H --> E
    
    E --> I[User Clicks Restaurant]
    I --> J[Restaurant Details Page]
    J --> K[Load Menu Items]
    K --> L[API: GET /restaurants/:id/menu]
    
    L --> M{Menu Loaded?}
    M -->|Yes| N[Display Menu Categories]
    M -->|No| O[Show Loading State]
    
    N --> P[User Selects Item]
    P --> Q{Customizations Available?}
    Q -->|Yes| R[Show Customization Options]
    Q -->|No| S[Add to Cart Directly]
    
    R --> T[User Selects Options]
    T --> S
    S --> U[Update Cart Context]
    U --> V[Show Success Toast]
```

## 🛒 **Cart Management Flow**

```mermaid
flowchart TD
    A[Cart Context] --> B[Initialize Empty Cart]
    B --> C{User Action}
    
    C -->|Add Item| D[Add Item to Cart Array]
    C -->|Update Quantity| E[Modify Item Quantity]
    C -->|Remove Item| F[Remove from Cart Array]
    C -->|Clear Cart| G[Empty Cart Array]
    
    D --> H[Calculate Totals]
    E --> H
    F --> H
    G --> I[Reset Cart State]
    
    H --> J[Update Subtotal]
    J --> K[Calculate Delivery Fee]
    K --> L[Calculate Taxes]
    L --> M[Calculate Final Total]
    M --> N[Update Cart Badge Count]
    N --> O[Persist to localStorage]
```

## 🔄 **State Management Flow**

```mermaid
flowchart TD
    A[Application Start] --> B[Initialize Contexts]
    
    B --> C[AuthContext]
    C --> D[Check localStorage for Token]
    D --> E{Token Exists?}
    E -->|Yes| F[Validate Token with API]
    E -->|No| G[Set Unauthenticated State]
    
    F --> H{Token Valid?}
    H -->|Yes| I[Set User Data + Authenticated]
    H -->|No| J[Clear Token + Unauthenticated]
    
    B --> K[CartContext]
    K --> L[Load Cart from localStorage]
    L --> M[Initialize Cart State]
    
    I --> N[App Ready]
    J --> N
    G --> N
    M --> N
    
    N --> O[Render Main App]
```

## 🚀 **Deployment & Build Flow**

```mermaid
flowchart TD
    A[Development] --> B[Code Changes]
    B --> C[Git Commit & Push]
    
    C --> D{Deployment Target}
    D -->|Netlify| E[Netlify Build Process]
    D -->|Local| F[Local Build]
    
    E --> G[Run npm run build]
    F --> G
    
    H --> I{Build Success?}
    I -->|Yes| J[Generate Static Files]
    I -->|No| K[Show Build Errors]
    
    J --> L[Deploy to CDN]
    L --> M[Update Live Site]
    
    K --> N[Fix Errors]
    N --> B
```

## 📊 **Data Flow Architecture**

```mermaid
flowchart LR
    A[User Interface] --> B[React Components]
    B --> C[Context Providers]
    C --> D[API Calls]
    D --> E[Express Routes]
    E --> F[Middleware]
    F --> G[Controllers]
    G --> H[MongoDB Models]
    H --> I[Database]
    
    I --> H
    H --> G
    G --> E
    E --> D
    D --> C
    C --> B
    B --> A
```

## 🔧 **Error Handling Flow**

```mermaid
flowchart TD
    A[User Action] --> B[API Call]
    B --> C{Request Success?}
    
    C -->|Yes| D[Process Response]
    C -->|No| E[Check Error Type]
    
    E --> F{Error Type}
    F -->|401 Unauthorized| G[Redirect to Login]
    F -->|403 Forbidden| H[Show Access Denied]
    F -->|404 Not Found| I[Show Not Found Message]
    F -->|500 Server Error| J[Show Server Error]
    F -->|Network Error| K[Show Network Error]
    
    G --> L[Clear Auth State]
    H --> M[Show Error Toast]
    I --> M
    J --> M
    K --> M
    
    D --> N[Update UI State]
    L --> O[Redirect to Login Page]
    M --> P[Allow User Retry]
```

---

## 📋 **Technology Stack Summary**

### **Frontend (Port 3002)**
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **UI Library**: Material-UI (MUI)
- **State Management**: Context API + useReducer
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast

### **Backend (Port 5001)**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **Validation**: Express Validator
- **CORS**: Enabled for cross-origin requests

### **Database Collections**
- **users**: User profiles and authentication
- **restaurants**: Restaurant information
- **menuitems**: Menu items and categories
- **orders**: Order history and tracking
- **reviews**: User reviews and ratings

### **Key Features Implemented**
- ✅ User Authentication (Login/Register)
- ✅ Restaurant Browsing with Filters
- ✅ Menu Item Selection with Customization
- ✅ Cart Management with Persistence
- ✅ Order Placement and Tracking
- ✅ User Profile Management
- ✅ Order History with Reviews
- ✅ Real-time Status Updates
- ✅ Responsive Design
- ✅ Error Handling & Validation

This flowchart provides a comprehensive overview of your ZapEats application architecture and user flows! 🎉