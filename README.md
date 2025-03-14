# Retail Cart (Angular 18)

## Overview

Retail Cart is a high-performance, scalable **Single Page Application (SPA)** built with **Angular 18**. It simulates a retail shopping experience, allowing users to browse products, manage a cart, and apply discount codes with a seamless and responsive UI. The project is optimized for **performance, maintainability, offline support, and test coverage**.

## Features

- **Product Listing**: Displays products with images, names, and prices.
- **Cart Management**: Allows users to add, remove, and update product quantities dynamically.
- **Discount Codes**: Supports predefined discount codes (`SAVE10`, `SAVE5`) with validation.
- **Real-time Price Calculation**: Updates subtotal and total price instantly.
- **Offline Support**: Cart state persists using **Local Storage**.
- **Performance Optimization**: Utilizes **RxJS Signals** for efficient state management.
- **Modern UI**: Styled with **Angular Material & Tailwind** for a clean and responsive experience.
- **Unit Testing**: Ensures quality with **Jest** test coverage.

## Architecture & Best Practices

### Project Design

- **Component-Driven Architecture**: Modular and reusable UI components.
- **State Management**: Implements **RxJS Signals** for reactive and efficient state handling.
- **Separation of Concerns**: Business logic is encapsulated in services (`CartService`, `ProductService`).
- **Strict TypeScript Typing**: Ensures type safety with well-defined **interfaces** and **enums**.
- **Lazy Loading**: Optimized routes for performance and scalability.

### Project Structure

```
retail-cart/
├── src/
│   ├── app/
│   │   ├── components/       # Reusable components (ProductList, Cart, DiscountInput, etc.)
│   │   ├── pages/            # Main pages (Product Page, Cart Page)
│   │   ├── shared/services/  # Business logic (CartService, ProductService,  StorageService etc.)
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

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Gabynet01/retail-cart.git
cd retail-cart
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Application

```bash
ng serve
```

Then, open **http://localhost:4200/** in your browser.

## Running Tests

To execute unit tests with **Jest**, run:

```bash
npm test
```

This will launch Jest and execute the test suite.

## Live Demo

A live version of the project is available at:  
[**Retail Cart Demo**](https://retail-cart-seven.vercel.app)
