# Product App

## Setup

```bash
npm install
npm run dev
```

Open:

http://localhost:3000

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- TanStack Query (React Query)
- Context API
- DummyJSON API

## Features

- User Registration (UI Demo)
- JWT Authentication
- Protected Routes
- Product Listing
- Product Details Page
- Search by Product Title
- Category Filtering
- Pagination
- Loading Skeletons
- Error Handling
- React Query Caching
- Responsive Design

## Project Structure

```text
app/
components/
context/
hooks/
lib/
types/
```

## API

https://dummyjson.com/docs/products

## Authentication

This project uses DummyJSON for authentication.

Note: DummyJSON does not support real user registration. The register form is a UI demonstration only — it attempts to log in using the provided credentials. To successfully authenticate, you must use an existing DummyJSON account.

Test account:

Username: emilys
Password: emilyspass

All available test accounts: https://dummyjson.com/users

## API Documentation

Postman Collection: https://web.postman.co/workspace/My-Workspace~44a66124-e352-4276-8f91-2555cb38c78c/collection/28362501-bf13536b-fc42-4731-845f-79cf674c3ce9?action=share&source=copy-link&creator=28362501

POST /auth/login
GET /products
GET /products/{id}
GET /products/categories

## Caching Strategy

The application uses React Query for server-state management and caching.

- Products are cached per page.
- Product details are cached by product ID.
- Categories are cached and reused across the application.
- Refetch on window focus is disabled for better UX.

## Demo

Vercel Link
