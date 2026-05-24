#!/bin/bash

# Seed initial data into MongoDB for SWAG Wheels

echo "🌱 Seeding MongoDB with initial data..."
echo ""

MONGODB_URI="mongodb://localhost:27017"
DB_NAME="swag-wheels"

# Sample Cars Data
mongo $MONGODB_URI/$DB_NAME <<EOF

// Drop existing collections (optional)
// db.cars.deleteMany({});
// db.blogs.deleteMany({});

// Insert sample cars
db.cars.insertMany([
  {
    name: "Swift VXi 2024",
    brand: "Maruti",
    model: "Swift",
    year: 2024,
    price: 500500,
    pricePerDay: 1500,
    description: "Compact hatchback with great mileage and comfort",
    image: "https://images.unsplash.com/photo-1606611283456-dfd5787aae4f?w=500",
    images: [],
    type: "hatchback",
    seats: 5,
    transmission: "manual",
    fuelType: "petrol",
    features: ["AC", "Power Steering", "Electric Windows", "Music System"],
    availability: true,
    rating: 4.5,
    reviews: 12,
    location: "Mumbai",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Hyundai Creta SX",
    brand: "Hyundai",
    model: "Creta",
    year: 2024,
    price: 1200000,
    pricePerDay: 3500,
    description: "Premium SUV with modern features and spacious interior",
    image: "https://images.unsplash.com/photo-1581550732898-7c1c64cb620d?w=500",
    images: [],
    type: "suv",
    seats: 5,
    transmission: "automatic",
    fuelType: "diesel",
    features: ["AC", "Power Steering", "Sunroof", "Rear Camera", "Music System", "ABS"],
    availability: true,
    rating: 4.7,
    reviews: 25,
    location: "Mumbai",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Mahindra XUV500",
    brand: "Mahindra",
    model: "XUV500",
    year: 2023,
    price: 1400000,
    pricePerDay: 4000,
    description: "Full-size SUV perfect for family trips and long journeys",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500",
    images: [],
    type: "suv",
    seats: 7,
    transmission: "automatic",
    fuelType: "diesel",
    features: ["AC", "Power Steering", "Sunroof", "DVD", "Rear Camera", "ABS", "Navigation"],
    availability: true,
    rating: 4.6,
    reviews: 18,
    location: "Mumbai",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Honda City",
    brand: "Honda",
    model: "City",
    year: 2024,
    price: 800000,
    pricePerDay: 2500,
    description: "Reliable sedan with excellent fuel efficiency",
    image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500",
    images: [],
    type: "sedan",
    seats: 5,
    transmission: "automatic",
    fuelType: "petrol",
    features: ["AC", "Power Steering", "Cruise Control", "Music System", "ABS"],
    availability: true,
    rating: 4.4,
    reviews: 20,
    location: "Mumbai",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("✅ Cars seeded successfully!");

// Insert sample blogs
db.blogs.insertMany([
  {
    title: "Top 5 Road Trip Destinations Near Mumbai",
    slug: "top-5-road-trip-destinations-near-mumbai",
    content: "Discover the best places to visit on a road trip from Mumbai...",
    excerpt: "Explore amazing destinations within 200km of Mumbai perfect for weekend getaways.",
    author: "SWAG Wheels Team",
    image: "https://images.unsplash.com/photo-1622543925424-de4b76d11c20?w=500",
    category: "travel",
    tags: ["travel", "road-trip", "mumbai", "weekend"],
    published: true,
    views: 245,
    likes: 34,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Car Maintenance Tips for Long Journeys",
    slug: "car-maintenance-tips-for-long-journeys",
    content: "Learn how to maintain your car during long journeys...",
    excerpt: "Essential car maintenance tips to ensure a safe and comfortable long-distance trip.",
    author: "SWAG Wheels Team",
    image: "https://images.unsplash.com/photo-1494728802297-0bde37ddd048?w=500",
    category: "tips",
    tags: ["maintenance", "tips", "travel"],
    published: true,
    views: 189,
    likes: 28,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("✅ Blogs seeded successfully!");

db.collection('cars').stats().then(stats => {
  print("Total cars: " + stats.count);
});

EOF

echo ""
echo "✨ Data seeding complete!"
echo ""
echo "Sample data added:"
echo "  • 4 Cars"
echo "  • 2 Blog posts"
echo ""
echo "Login and start managing your fleet! 🚗"
