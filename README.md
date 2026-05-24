# SWAG Wheels Backend

Node.js + Express + MongoDB API for SWAG Wheels Car Rental System

## Features

- 🔐 Admin Authentication (JWT)
- 🚗 Car Management (CRUD)
- 📝 Blog Management
- 📅 Booking System
- 💬 Contact Queries
- 📱 WhatsApp Integration

## Setup

### Prerequisites
- Node.js >= 18
- MongoDB (Local or Atlas)

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and update:

```env
PORT=5005
MONGODB_URI=mongodb://localhost:27017/swag-wheels
JWT_SECRET=your_secret_key
ADMIN_EMAIL=admin@swagwheels.com
ADMIN_PASSWORD=admin123456
WHATSAPP_PHONE_NUMBER=91YOUR_PHONE_NUMBER
```

### Run Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Admin
- `POST /api/admin/register` - Register admin
- `POST /api/admin/login` - Login admin
- `GET /api/admin/profile` - Get admin profile (Protected)
- `PUT /api/admin/profile` - Update profile (Protected)
- `PUT /api/admin/change-password` - Change password (Protected)

### Cars
- `GET /api/cars` - Get all cars
- `GET /api/cars/search?query=...` - Search cars
- `GET /api/cars/:id` - Get car by ID
- `POST /api/cars` - Create car (Admin)
- `PUT /api/cars/:id` - Update car (Admin)
- `DELETE /api/cars/:id` - Delete car (Admin)
- `PATCH /api/cars/:id/availability` - Toggle availability (Admin)

### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/slug/:slug` - Get blog by slug
- `POST /api/blogs/:id/like` - Like blog
- `POST /api/blogs` - Create blog (Admin)
- `PUT /api/blogs/:id` - Update blog (Admin)
- `DELETE /api/blogs/:id` - Delete blog (Admin)
- `PATCH /api/blogs/:id/publish` - Publish/unpublish (Admin)

### Bookings
- `POST /api/bookings` - Create booking (with WhatsApp notification)
- `GET /api/bookings` - Get all bookings (Admin)
- `GET /api/bookings/stats` - Get booking stats (Admin)
- `GET /api/bookings/:id` - Get booking (Admin)
- `PUT /api/bookings/:id/status` - Update booking status (Admin)
- `PUT /api/bookings/:id/cancel` - Cancel booking (Admin)

### Contact Queries
- `POST /api/contact` - Create contact query (with WhatsApp notification)
- `GET /api/contact` - Get all queries (Admin)
- `GET /api/contact/stats` - Get query stats (Admin)
- `GET /api/contact/:id` - Get query (Admin)
- `PUT /api/contact/:id/reply` - Reply to query (Admin)
- `DELETE /api/contact/:id` - Delete query (Admin)

## Authentication

Include JWT token in headers:
```
Authorization: Bearer <token>
```

## WhatsApp Integration

The system sends automatic WhatsApp messages for:
- Booking confirmations
- Contact query responses
- Admin notifications for new bookings and queries

Configure WhatsApp phone number in `.env`:
```env
WHATSAPP_PHONE_NUMBER=91YOUR_NUMBER
```

### Optional Integrations:
- Twilio WhatsApp API
- WhatsApp Business API
- Custom webhook

## Database Schema

### Admin
- email, password, name, role, isActive, lastLogin

### Car
- name, brand, model, year, price, description, image, type, seats, transmission, fuelType, features, availability, rating, location, pricePerDay

### Blog
- title, slug, content, excerpt, author, image, category, tags, published, views, likes

### Booking
- carId, carName, customerName/Email/Phone, pickupDate, dropDate, locations, totalPrice, status, paymentStatus, whatsappSent

### ContactQuery
- name, email, phone, subject, message, status, whatsappSent, adminReply
