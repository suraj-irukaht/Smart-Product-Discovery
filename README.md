# Smart Product Discovery

React
Node.js
Express
MongoDB
License

A **full-stack product discovery platform** built using **React, Node.js, Express, and MongoDB**.  
The system allows users to discover products, manage orders, interact with sellers, and view analytics through role-based dashboards.

The platform supports **three main user roles**:

- **Buyer** – browse products, add favorites, place orders, review products
- **Seller** – manage products, track orders, view seller analytics
- **Admin** – manage users, categories, products, and platform analytics

The project follows a **scalable MERN-style architecture** with a modular backend and feature-based frontend.

---

## Project Highlights

• Full-stack MERN architecture (React + Node.js + MongoDB)

• Feature-based frontend architecture for scalability

• Modular MVC backend design

• Role-based authentication (Buyer, Seller, Admin)

• Product discovery system with trending, popular, and related products

• Real-time notification capability using Server-Sent Events (SSE)

• Pagination utilities for scalable product browsing

• Clean and modern UI with TailwindCSS

---

# Features

## Product Discovery

- Trending products
- Popular products
- Related products
- Category filtering
- Product search
- Recently viewed products

---

## Buyer Features

- Browse products
- Search products
- Add products to cart
- Place orders
- Add products to favorites
- Leave product reviews
- View order history

---

## Seller Features

- Seller dashboard
- Add new products
- Edit products
- Delete products
- Manage inventory
- Track incoming orders

---

## Admin Features

- Admin dashboard
- Manage buyers
- Manage sellers
- Manage categories
- Monitor orders
- Platform analytics
- Revenue tracking

---

## Screenshots

### Login Page

Login

### Home Page

Home

### Admin Dashboard

Admin

### Seller Dashboard

Seller

---

# Tech Stack

## Frontend

- React
- Vite
- TailwindCSS
- Axios
- React Hooks

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

## Authentication

- JWT (JSON Web Tokens)

## Architecture

- REST API
- MVC Backend Architecture
- Feature-based Frontend Architecture

---

# Project Architecture

```
Frontend (React + Vite)
        │
        │ REST API
        ▼
Backend (Node.js + Express)
        │
        ▼
MongoDB Database
```

---

## Backend Structure

```
backend/
│
├ config/
│   └ db.js
│
├ controllers/
│   ├ admin.controller.js
│   ├ auth.controller.js
│   ├ cart.controller.js
│   ├ category.controller.js
│   ├ discovery.controller.js
│   ├ favorite.controller.js
│   ├ notification.controller.js
│   ├ order.controller.js
│   ├ product.controller.js
│   ├ review.controller.js
│   └ user.controller.js
│
├ middlewares/
│   ├ auth.middleware.js
│   ├ role.middleware.js
│   └ setRole.middleware.js
│
├ models/
│   ├ cart.model.js
│   ├ category.model.js
│   ├ favorite.model.js
│   ├ notification.model.js
│   ├ order.model.js
│   ├ orderItem.model.js
│   ├ product.model.js
│   ├ recentlyViewed.model.js
│   ├ review.model.js
│   └ user.model.js
│
├ routes/
│   ├ admin.route.js
│   ├ auth.route.js
│   ├ cart.route.js
│   ├ category.route.js
│   ├ discovery.route.js
│   ├ favourite.route.js
│   ├ notification.routes.js
│   ├ order.route.js
│   ├ product.review.route.js
│   ├ product.route.js
│   ├ product.seller.routes.js
│   └ user.route.js
│
├ services/
│   ├ email.service.js
│   └ storage.service.js
│
├ utils/
│   ├ pagination.js
│   └ sse.js
│
├ app.js
└ server.js
```

---

## Frontend Structure

The frontend follows a **feature-based architecture** to improve scalability and maintainability.

```
frontend/
│
├ public/
│   └ placeholder-image.jpg
│
├ src/
│   │
│   ├ components/
│   │   ├ icons/
│   │   ├ ui/
│   │   └ ScrollToTop.jsx
│   │
│   ├ config/
│   │   └ config.pagination.js
│   │
│   ├ features/
│   │   ├ admin/
│   │   ├ auth/
│   │   ├ buyer/
│   │   ├ categories/
│   │   ├ products/
│   │   └ seller/
│   │
│   ├ lib/
│   │
│   ├ pages/
│   │   ├ CartPage.jsx
│   │   ├ FavoritesPage.jsx
│   │   ├ HomePage.jsx
│   │   ├ OrderPage.jsx
│   │   ├ ProductPage.jsx
│   │   └ ProductSinglePage.jsx
│   │
│   ├ routes/
│   │
│   ├ services/
│   │   └ api.js
│   │
│   ├ store/
│   │   └ authStore.js
│   │
│   ├ utils/
│   │   ├ product.utils.js
│   │   └ request.js
│   │
│   ├ App.jsx
│   ├ main.jsx
│   └ index.css
│
├ index.html
├ package.json
├ vite.config.js
└ README.md
```

---

## Frontend Feature Modules

```
features/
│
├ admin
│   ├ api
│   ├ components
│   ├ hooks
│   └ pages
│
├ auth
│   ├ api
│   ├ components
│   ├ hooks
│   └ pages
│
├ buyer
│   ├ cart
│   ├ favorites
│   ├ orders
│   └ home
│
├ categories
│   ├ api
│   ├ components
│   └ hooks
│
├ products
│   ├ api
│   ├ components
│   └ hooks
│
└ seller
    ├ api
    ├ components
    ├ pages
    └ hooks
```

# Database Design

| Collection    | Description             |
| ------------- | ----------------------- |
| Users         | Buyers, Sellers, Admins |
| Products      | Product catalog         |
| Categories    | Product categories      |
| Orders        | Purchase records        |
| Reviews       | Product ratings         |
| Favorites     | Saved products          |
| Cart          | Shopping cart items     |
| Notifications | System notifications    |

---

# Authentication & Authorization

Authentication is implemented using **JWT tokens**.

### Authentication Flow

1. User logs in
2. Server generates JWT
3. Client stores the token
4. Token is sent with every request
5. Middleware verifies the token

### Role-Based Access

| Role   | Permissions                       |
| ------ | --------------------------------- |
| Buyer  | Browse products, purchase, review |
| Seller | Manage products and orders        |
| Admin  | Full platform management          |

---

# Installation

## Clone Repository

```bash
git clone https://github.com/suraj-irukaht/smart-product-discovery.git
cd smart-product-discovery
```

---

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# Environment Variables

Create a `.env` file inside the **backend** folder.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

---

# Example API Endpoints

### Authentication

```
POST /auth/register
POST /auth/login
POST /auth/forgot-password
```

### Products

```
GET /products
GET /products/:id
POST /products
PUT /products/:id
DELETE /products/:id
```

### Orders

```
POST /orders
GET /orders
GET /orders/:id
```

### Reviews

```
POST /reviews
GET /products/:id/reviews
```

---

# Future Improvements

- AI-based product recommendations
- Payment gateway integration
- Redis caching
- Advanced search ranking
- Real-time analytics dashboard
- Microservices architecture

---

# Author

**Suraj Shahi**

Full-Stack Developer

Interests:

- Full-stack systems
- Scalable backend architecture
- Machine learning & AI
- Software engineering

---

# License

This project is licensed under the **MIT License**.
