# 🛒 E-Commerce website with Dashboard

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Redux](https://img.shields.io/badge/Redux_Toolkit-State_Management-purple)
![React Query](https://img.shields.io/badge/TanStack_React_Query-Data_Fetching-red)
![Vitest](https://img.shields.io/badge/Vitest-Testing-green)
![RTL](https://img.shields.io/badge/React_Testing_Library-Testing-red)

A modern **E-Commerce web application** built with **React.js** and **TypeScript**, providing a complete shopping experience along with an **admin dashboard** for managing products and visualizing business insights.

The project focuses on **scalable architecture, type safety, maintainable code, and testability**, while delivering a smooth and interactive user experience.

# 🌐 Live Demo

https://ahmed-e-commerce.netlify.app

---

# 🚀 Features

## 👤 Authentication

- User **login and signup**
- Authentication state managed with **Redux Toolkit**
- **Role-based access control** (Admin / User)

---

## 🛍️ E-Commerce Features

- Browse products
- Add products to cart
- Update cart quantity
- Remove products from cart
- Responsive product layout

---

## 🧑‍💼 Admin Dashboard

Admin users can access a dedicated dashboard that includes:

- Add new products
- Edit existing products
- Delete products

- Add new categores and brands
- Edit existing categores and brands
- Delete categores and brands

- Add new home page slider imgs
- Delete new home page slider imgs

- Change order status
- Delete specific user accounts

- View store insights and statistics

---

## 📊 Data Visualization

- Interactive charts using **Chart.js**
- Data fetching and caching using **TanStack React Query**

---

## 📝 Forms

Product management forms are built using **React Hook Form**:

- High performance
- Easy validation
- Efficient form state management

---

## 🎨 UI & Animations

- Styled with **SCSS**
- Smooth UI animations using **Framer Motion**

---

# 🧪 Testing

The project includes a modern testing setup to ensure reliability and maintainability.

### Testing Stack

- **Vitest**
- **React Testing Library**
- **MSW (Mock Service Worker)**

### Tested Scenarios

- Component rendering
- User interactions
- API requests and responses
- Authentication flows
- Routing behavior

This setup allows the codebase to be **refactored and extended safely**.

---

# 🧰 Tech Stack

### Frontend

- React.js
- TypeScript
- SCSS

### State Management

- Redux Toolkit

### Data Fetching

- TanStack React Query

### Forms

- React Hook Form

### Charts

- Chart.js

### Animations

- Framer Motion

### Testing

- Vitest
- React Testing Library
- MSW

### Backend

For backend I made API with nextjs 14 and use api routes for handle HTTP requests, I use mongodb as a database, and store products images in cloudinary.

**API Documentation On Postman:** https://documenter.getpostman.com/view/26052098/2sAXxQeXiR

**API Repository On Github:** https://github.com/ahmedtarekwork/e-commerce-nextjs-api

---

<!-- # 🏗️ Architecture

The project follows a **feature-based architecture** to improve scalability and maintainability.

Key architecture principles:

- **Separation of concerns**
- **Reusable components**
- **Feature-driven folder structure**
- **Custom hooks for shared logic**

---

# 📂 Project Structure
```bash
src
│
├── store
│   ├── store.ts
│   └── features
│
├── features
│   ├── auth
│   │   ├── components
│   │   ├── hooks
│   │   ├── services
│   │   ├── authSlice.ts
│   │   └── types.ts
│   │
│   ├── cart
│   │   ├── components
│   │   ├── hooks
│   │   ├── cartSlice.ts
│   │   └── types.ts
│   │
│   ├── products
│   │   ├── components
│   │   ├── hooks
│   │   ├── services
│   │   ├── queries.ts
│   │   └── types.ts
│
├── pages
│   ├── Home
│   ├── Product
│   ├── Cart
│   ├── Login
│   └── Dashboard
│
├── components
│   ├── ui
│   └── layout
│
├── hooks
│
├── services
│   └── api
│
├── utils
│
├── styles
│
└── tests
``` -->

# ⚙️ Installation

- clone the repo or download the files of the project

```
  git clone https://github.com/ahmedtarekwork/e-commerce.git
```

- install dependencies that project stands on

```
  npm install
```

- run this command to make a local server runs on your machine

```
  npm run dev
```

- if you want to run test cases for this project by vitest and React Testing Library you can run this command in separate terminal window

```
  npm run test
```
