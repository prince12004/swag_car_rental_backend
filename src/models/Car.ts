import mongoose, { Schema } from 'mongoose';

interface ICar {
    name: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    description: string;
    image: string;
    images: string[];
    type: 'sedan' | 'suv' | 'hatchback' | 'truck' | 'luxury';
    seats: number;
    transmission: 'manual' | 'automatic';
    fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
    features: string[];
    availability: boolean;
    rating: number;
    reviews: number;
    location: string;
    pricePerDay: number;
    createdAt: Date;
    updatedAt: Date;
}

const carSchema = new Schema<ICar>(
    {
        name: {
            type: String,
            required: [true, 'Car name is required'],
            trim: true,
        },
        brand: {
            type: String,
            required: [true, 'Brand is required'],
            trim: true,
        },
        model: {
            type: String,
            required: [true, 'Model is required'],
            trim: true,
        },
        year: {
            type: Number,
            required: [true, 'Year is required'],
        },
        price: {
            type: Number,
            default: 0,
        },
        description: {
            type: String,
            default: '',
        },
        image: {
            type: String,
            default: '',
        },
        images: [String],
        type: {
            type: String,
            enum: ['sedan', 'suv', 'hatchback', 'truck', 'luxury', 'sports', 'budget'],
            default: 'sedan',
        },
        seats: {
            type: Number,
            required: [true, 'Number of seats is required'],
        },
        transmission: {
            type: String,
            enum: ['manual', 'automatic'],
            default: 'automatic',
        },
        fuelType: {
            type: String,
            enum: ['petrol', 'diesel', 'electric', 'hybrid'],
            default: 'petrol',
        },
        features: [String],
        availability: {
            type: Boolean,
            default: true,
        },
        rating: {
            type: Number,
            default: 5,
            min: 0,
            max: 5,
        },
        reviews: {
            type: Number,
            default: 0,
        },
        location: {
            type: String,
            default: 'Mumbai',
        },
        pricePerDay: {
            type: Number,
            required: [true, 'Price per day is required'],
        },
    },
    { timestamps: true }
);

export const Car = mongoose.model<ICar>('Car', carSchema);
