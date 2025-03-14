# Retail Cart (Angular 18)

## 🚀 Overview

Retail Cart is a high-performance, scalable **Single Page Application (SPA)** built with **Angular 18**. It simulates a simple retail shopping experience, allowing users to browse products, manage a cart, and apply discount codes with a seamless and responsive UI. The project is optimized for **performance, maintainability, offline support, and test coverage**.

## ✅ Features

- **Product Listing**: View a list of products with images, names, and prices.
- **Cart Management**: Add, remove, and update product quantities dynamically.
- **Discount Codes**: Apply predefined discount codes (`SAVE10`, `SAVE5`) with validation.
- **Real-time Price Calculation**: Instant subtotal and total price updates.
- **Offline Support**: Cart state persists using **Local Storage**.
- **Performance Optimization**: Uses **RxJS Signals** for efficient state management.
- **Modern UI**: Styled with **Angular Material & Bootstrap** for a sleek, responsive experience.
- **Unit Testing**: Comprehensive test coverage using **Jest**.

## 🏗️ Architecture & Best Practices

### 📌 Project Design

- **Component-Driven Architecture**: Modular and reusable UI components.
- **State Management**: Utilizes **RxJS Signals** for reactive, efficient state handling.
- **Separation of Concerns**: Business logic is encapsulated in services (`CartService`, `ProductService`).
- **Strict TypeScript Typing**: Ensures type safety with well-defined **interfaces** and **enums**.
- **Lazy Loading**: Routes optimized for performance and scalability.

### 📂 Project Structure

```
retail-cart/
├── src/
│   ├── app/
│   │   ├── components/       # Reusable components (ProductList, Cart, DiscountInput, etc.)
│   │   ├── pages/            # Main pages (Product Page, Cart Page)
│   │   ├── shared/services/  # Business logic (CartService, ProductService, etc.)
│   │   ├── shared/models/    # TypeScript interfaces (Product, CartItem, etc.)
│   │   ├── shared/helpers    # Helper functions (search, etc.)
│   │   ├── app.routes.ts     # Angular routing configuration
│   │   ├── app.config.ts     # Application-wide configurations
│   ├── assets/               # Static assets (Images, mock data, etc.)
│   ├── styles.scss           # Global styles
│
├── angular.json              # Angular project configuration
├── package.json              # Dependencies and scripts
├── jest.config.js            # Jest testing configuration
├── README.md                 # Project documentation
```

## 🛠 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Gabynet01/retail-cart.git
cd retail-cart
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run the Application

```bash
ng serve
```

Then, open **http://localhost:4200/** in your browser.

## 🧪 Running Tests

To execute unit tests with **Jest**, run:

```bash
npm test
```

This will launch Jest and execute the test suite.

## 🌐 Live Demo

A live version of the project is available at:
➡️ [https://retail-cart-seven.vercel.app]
