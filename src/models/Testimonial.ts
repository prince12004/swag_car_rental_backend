import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
    customer_name: string;
    role?: string;
    content: string;
    rating: number;
    display_order: number;
    is_published: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
    {
        customer_name: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: 5,
        },
        display_order: {
            type: Number,
            default: 0,
        },
        is_published: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const Testimonial = mongoose.model<ITestimonial>('Testimonial', testimonialSchema);
