# Multi-Language Online Store for Local Products

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Supported Languages](#supported-languages)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## 🎯 Project Overview

The **Multi-Language Online Store for Local Products** is a comprehensive e-commerce platform designed to promote and sell local products to a diverse, global audience. The platform breaks down language barriers by offering multi-language support, enabling local sellers to reach customers across different regions and enabling buyers to shop in their native language.

This full-stack application provides a seamless experience for both buyers and sellers, with features like product browsing, secure payment processing, seller management tools, and comprehensive review systems.

---

## 🚀 Problem Statement

Local products often struggle to gain visibility on generic e-commerce platforms due to:
- **Language barriers** preventing non-English speakers from discovering local products
- **Limited access** to diverse audience segments
- **Lack of localized shopping experience** for international customers
- **Difficulty for local merchants** in managing multi-language product catalogs

This project solves these challenges by creating a dedicated multi-language e-commerce platform that:
- Supports 11+ languages including Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Punjabi, Urdu, Malayalam, Bhojpuri, and English
- Provides localized shopping experiences
- Enables sellers to manage products in multiple languages
- Facilitates secure, reliable transactions
- Promotes local artisans and merchants globally

---

## ✨ Features

### For Buyers
- 🌍 **Multi-Language Support**: Browse and shop in 11+ languages
- 🔍 **Advanced Search & Filtering**: Find products by category, price, and ratings
- ⭐ **Product Reviews & Ratings**: Read and leave honest product reviews
- 🛒 **Shopping Cart Management**: Add, remove, and manage items
- 💳 **Secure Payment Gateway**: Integrated Razorpay for safe transactions
- 📦 **Order Tracking**: Monitor your orders from purchase to delivery
- 👤 **User Profile Management**: Manage account details and addresses
- 💬 **Wishlist & Saved Items**: Save products for later

### For Sellers
- 📊 **Seller Dashboard**: Comprehensive management tools
- ➕ **Product Management**: Add, edit, and manage product listings
- 💰 **Sales Analytics**: Track sales, revenue, and performance metrics
- 📋 **Order Management**: View and manage customer orders
- 🏷️ **Category Management**: Organize products by categories
- 📈 **AI-Powered Product Descriptions**: Generate product descriptions using Gemini AI

### General Features
- 🔐 **Secure Authentication**: JWT-based authentication system
- 🛡️ **Data Validation**: Server-side validation for all inputs
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Fast Performance**: Optimized for speed and user experience
- 🌐 **RESTful API**: Well-documented API endpoints

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js with Vite
- **Styling**: CSS3, Responsive Design
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Internationalization (i18n)**: Custom i18n implementation
- **Build Tool**: Vite
- **Package Manager**: npm/yarn

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs, bcrypt
- **Payment Gateway**: Razorpay
- **AI Integration**: Google Gemini API
- **Input Validation**: express-validator
- **Environment Management**: dotenv
- **Development**: Nodemon

### Database
- **Primary**: MongoDB (Atlas for production)
- **Collections**: Users, Products, Categories, Orders, Cart, Reviews, etc.

---

## 📁 Project Structure

```
CA2 Project/
├── backend/                          # Express.js server
│   ├── config/
│   │   └── db.js                    # Database connection configuration
│   ├── controllers/                  # Request handlers
│   │   ├── AuthController.js
│   │   ├── ProductController.js
│   │   ├── CartController.js
│   │   ├── OrderController.js
│   │   ├── PaymentController.js
│   │   ├── ReviewController.js
│   │   ├── UserController.js
│   │   ├── CategoryController.js
│   │   └── SellerController.js
│   ├── middleware/                   # Custom middleware
│   │   ├── auth.js                  # JWT authentication middleware
│   │   ├── validate.js              # Request validation
│   │   └── validators.js            # Validation schemas
│   ├── models/                       # MongoDB schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── Cart.js
│   │   ├── Review.js
│   │   └── Payment.js
│   ├── routes/                       # API route definitions
│   │   ├── AuthRoutes.js
│   │   ├── ProductRoutes.js
│   │   ├── CartRoutes.js
│   │   ├── OrderRoutes.js
│   │   ├── PaymentRoutes.js
│   │   ├── ReviewRoutes.js
│   │   ├── UserRoutes.js
│   │   ├── CategoryRoutes.js
│   │   └── SellerRoutes.js
│   ├── services/                     # Business logic
│   │   ├── categoryCreation.js
│   │   └── geminiService.js         # AI-powered descriptions
│   ├── testing/                      # Testing utilities
│   ├── .env                          # Development environment variables
│   ├── package.json
│   └── server.js                     # Main server file
│
├── frontend/                         # React.js client
│   ├── src/
│   │   ├── api/                      # API integration
│   │   │   ├── axios.js              # Axios configuration
│   │   │   ├── auth_api.js
│   │   │   ├── cart_api.js
│   │   │   ├── order_api.js
│   │   │   ├── product_api.js
│   │   │   └── review_api.js
│   │   ├── auth/                     # Authentication components
│   │   │   ├── AuthContext.jsx       # Auth state management
│   │   │   ├── ProtectedRoute.jsx    # Route protection
│   │   │   └── SellerRoute.jsx       # Seller-only routes
│   │   ├── components/               # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CategoryBar.jsx
│   │   │   ├── PaymentPopup.jsx
│   │   │   ├── ReviewList.jsx
│   │   │   └── LanguageSelector.jsx
│   │   ├── context/                  # Global context
│   │   │   └── CartContext.jsx
│   │   ├── pages/                    # Page components
│   │   │   ├── MarketPlace.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── UserOrders.jsx
│   │   │   ├── SellerDashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Search.jsx
│   │   │   ├── AddProduct.jsx
│   │   │   └── auth/
│   │   │       ├── Login.jsx
│   │   │       └── Signup.jsx
│   │   ├── locales/                  # Translation files
│   │   │   ├── en.json               # English
│   │   │   ├── hi.json               # Hindi
│   │   │   ├── bn.json               # Bengali
│   │   │   ├── ta.json               # Tamil
│   │   │   ├── te.json               # Telugu
│   │   │   ├── mr.json               # Marathi
│   │   │   ├── gu.json               # Gujarati
│   │   │   ├── pa.json               # Punjabi
│   │   │   ├── ur.json               # Urdu
│   │   │   ├── ml.json               # Malayalam
│   │   │   └── bh.json               # Bhojpuri
│   │   ├── i18n/
│   │   │   └── langMap.js            # Language mapping
│   │   ├── i18n.js                   # i18n configuration
│   │   ├── routes.jsx                # Route definitions
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css
│   ├── .env                          # Development environment variables
│   ├── package.json
│   ├── vite.config.js               # Vite configuration
│   └── index.html
│
└── Readme.md                         # This file
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v7.0.0 or higher) - Comes with Node.js
- **MongoDB** (Local or MongoDB Atlas account) - [MongoDB Community Server](https://www.mongodb.com/try/download/community) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** (for cloning the repository) - [Download](https://git-scm.com/)
- **Razorpay Account** (for payment testing) - [Sign up](https://razorpay.com/)
- **Google Gemini API Key** (for AI features) - [Get API Key](https://ai.google.dev/)

---

## 🔧 Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd "CA2 Project"
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## 🌍 Environment Configuration

The project requires environment variables to be configured for both the backend and frontend. These are stored in `.env` files (development) and can be extended for production.

### Backend Environment Configuration

#### File Location: `backend/.env`

Create a file named `.env` in the `backend` directory with the following configuration:

```dotenv
# ========================================
# DATABASE CONFIGURATION
# ========================================
# MongoDB connection URL for development
DATABASE_URL=mongodb://127.0.0.1:27017/EComm

# For MongoDB Atlas (Cloud):
# DATABASE_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database-name>

# ========================================
# SERVER CONFIGURATION
# ========================================
# Port on which the Express server will run
PORT=5000

# Frontend URL (for CORS configuration)
FRONTEND_URL=http://localhost:5173

# Node environment
NODE_ENV=development

# ========================================
# AUTHENTICATION
# ========================================
# JWT Secret key for signing tokens (use a strong, random string)
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_jwt_secret_key_here

# JWT expiration time
JWT_EXPIRATION=7d

# ========================================
# PAYMENT GATEWAY (Razorpay)
# ========================================
# Get these from: https://dashboard.razorpay.com/
# For testing, use test keys provided in your Razorpay dashboard

RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx

# ========================================
# AI SERVICE (Google Gemini API)
# ========================================
# Get API key from: https://ai.google.dev/
GEMINI_API_KEY=your_gemini_api_key_here

# ========================================
# OPTIONAL: THIRD-PARTY SERVICES
# ========================================
# Add any additional third-party service keys here
```

#### Example Configuration for Local Development:

```dotenv
DATABASE_URL=mongodb://127.0.0.1:27017/EComm
JWT_SECRET=ce3a367e4fbfc2786694bdfcacc9cceeb9b0d0d8452d90c34c114f2c140f404b
GEMINI_API_KEY=AIzaSyDwZcGcB0YDWoI6Ycc6jBqz9zGKjC-DtXA
RAZORPAY_KEY_ID=rzp_test_7VJfupYg7pdNlZ
RAZORPAY_KEY_SECRET=blgzFriD8idGfNPwo9sHnzOZ
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
JWT_EXPIRATION=7d
```

#### Production Configuration (`backend/.env.production`):

Create a separate `.env.production` file for production deployments:

```dotenv
# ========================================
# PRODUCTION DATABASE CONFIGURATION
# ========================================
DATABASE_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database-name>

# ========================================
# PRODUCTION SERVER CONFIGURATION
# ========================================
PORT=5000
FRONTEND_URL=https://yourdomain.com
NODE_ENV=production

# ========================================
# PRODUCTION AUTHENTICATION
# ========================================
JWT_SECRET=your_strong_production_jwt_secret
JWT_EXPIRATION=7d

# ========================================
# PRODUCTION PAYMENT GATEWAY
# ========================================
# Use LIVE keys for production
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx

# ========================================
# PRODUCTION AI SERVICE
# ========================================
GEMINI_API_KEY=your_production_gemini_api_key

# ========================================
# SECURITY & LOGGING
# ========================================
LOG_LEVEL=info
DEBUG=false
```

---

### Frontend Environment Configuration

#### File Location: `frontend/.env`

Create a file named `.env` in the `frontend` directory with the following configuration:

```dotenv
# ========================================
# API CONFIGURATION
# ========================================
# Backend API URL for development
VITE_API_URL=http://localhost:5000

# For production:
# VITE_API_URL=https://api.yourdomain.com

# ========================================
# PAYMENT GATEWAY CONFIGURATION
# ========================================
# Razorpay Key ID (same as backend)
# Get from: https://dashboard.razorpay.com/
VITE_RAZORPAY_KEY_ID=rzp_test_7VJfupYg7pdNlZ

# ========================================
# VITE CONFIGURATION
# ========================================
# Mode (development/production)
VITE_MODE=development
```

#### Example Configuration for Local Development:

```dotenv
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_7VJfupYg7pdNlZ
VITE_MODE=development
```

#### Production Configuration (`frontend/.env.production`):

```dotenv
# ========================================
# PRODUCTION API CONFIGURATION
# ========================================
VITE_API_URL=https://api.yourdomain.com

# ========================================
# PRODUCTION PAYMENT GATEWAY
# ========================================
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx

# ========================================
# PRODUCTION VITE CONFIGURATION
# ========================================
VITE_MODE=production
```

---

### Environment Setup Guide

#### 1. **MongoDB Setup**

**Local MongoDB:**
```bash
# Start MongoDB locally (Windows)
mongod

# Or use MongoDB Atlas (Cloud)
# 1. Create account at https://www.mongodb.com/cloud/atlas
# 2. Create a new cluster
# 3. Add a database user
# 4. Get connection string
# 5. Replace in DATABASE_URL
```

#### 2. **Razorpay Setup**

```bash
# 1. Sign up at https://razorpay.com/
# 2. Go to Settings → API Keys
# 3. Copy Key ID and Secret
# 4. Use Test Keys for development
# 5. Switch to Live Keys for production
```

#### 3. **Google Gemini API Setup**

```bash
# 1. Visit https://ai.google.dev/
# 2. Click "Get API Key"
# 3. Create a new API key
# 4. Add to .env files
```

#### 4. **JWT Secret Generation**

```bash
# Generate a strong JWT secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🚀 Running the Application

### Development Mode

#### Terminal 1: Start Backend Server

```bash
cd backend
npm install
npm start
```

Expected output:
```
Server running on port 5000
Connected to MongoDB
```

#### Terminal 2: Start Frontend Development Server

```bash
cd frontend
npm install
npm run dev
```

Expected output:
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### Accessing the Application

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

### Production Build & Deployment

#### Build Frontend

```bash
cd frontend
npm run build
```

#### Run Production Server

```bash
cd backend
NODE_ENV=production npm start
```

---

## 📚 API Endpoints

### Authentication Routes
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh JWT token

### Product Routes
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (Seller only)
- `PUT /api/products/:id` - Update product (Seller only)
- `DELETE /api/products/:id` - Delete product (Seller only)

### Category Routes
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Cart Routes
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

### Order Routes
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status (Admin/Seller)

### Payment Routes
- `POST /api/payments/razorpay` - Process Razorpay payment
- `POST /api/payments/verify` - Verify payment

### Review Routes
- `GET /api/reviews/:productId` - Get product reviews
- `POST /api/reviews` - Create product review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### User Routes
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/profile/picture` - Upload profile picture

### Seller Routes
- `GET /api/seller/dashboard` - Get seller dashboard data
- `GET /api/seller/products` - Get seller's products
- `GET /api/seller/orders` - Get seller's orders
- `GET /api/seller/analytics` - Get seller analytics

---

## 🌐 Supported Languages

The platform supports the following languages:

| Language Code | Language Name | Region |
|:---|:---|:---|
| en | English | International |
| hi | हिन्दी (Hindi) | India |
| bn | বাংলা (Bengali) | Bangladesh, India |
| ta | தமிழ் (Tamil) | India, Sri Lanka |
| te | తెలుగు (Telugu) | India |
| mr | मराठी (Marathi) | India |
| gu | ગુજરાતી (Gujarati) | India |
| pa | ਪੰਜਾਬੀ (Punjabi) | India, Pakistan |
| ur | اردو (Urdu) | Pakistan, India |
| ml | മലയാളം (Malayalam) | India |
| bh | भोजपुरी (Bhojpuri) | India |

All language files are stored in `frontend/src/locales/` in JSON format.

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/repo.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. **Make your changes** and commit with clear messages
   ```bash
   git commit -m "Add: Description of changes"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/YourFeatureName
   ```

5. **Submit a Pull Request** with a detailed description

### Contribution Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Test your changes before submitting
- Update documentation if needed
- Be respectful and constructive

---

## 🐛 Troubleshooting

### Backend Issues

#### MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: 
- Ensure MongoDB is running
- Check if `DATABASE_URL` is correct
- For MongoDB Atlas, verify IP whitelist settings

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**:
```bash
# Find and kill process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

#### JWT Authentication Error
```
Error: invalid token
```
**Solution**:
- Verify `JWT_SECRET` is set correctly
- Check token hasn't expired
- Ensure proper Authorization header format: `Bearer <token>`

### Frontend Issues

#### Port 5173 Already in Use
```bash
npm run dev -- --port 3000
```

#### CORS Errors
**Solution**:
- Verify `FRONTEND_URL` in backend `.env` matches frontend URL
- Ensure backend is running on correct port
- Check CORS middleware configuration

#### Blank Page or 404 Errors
**Solution**:
- Clear browser cache: `Ctrl+Shift+Delete` (or Cmd+Shift+Delete on Mac)
- Check browser console for errors: `F12`
- Verify `VITE_API_URL` points to running backend

### Common Issues

#### Dependencies Installation Fails
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Environment Variables Not Loading
- Ensure `.env` files are in correct directories
- Restart the development server after modifying `.env`
- Check for typos in variable names

---
