import mongoose, { Schema, Document } from 'mongoose';

interface IBooking extends Document {
    carId: mongoose.Types.ObjectId;
    carName: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    pickupDate: Date;
    dropDate: Date;
    pickupLocation: string;
    dropLocation: string;
    totalDays: number;
    pricePerDay: number;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    paymentStatus: 'pending' | 'paid' | 'failed';
    specialRequests: string;
    whatsappSent: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
    {
        carId: {
            type: Schema.Types.ObjectId,
            ref: 'Car',
            required: [true, 'Car ID is required'],
        },
        carName: {
            type: String,
            required: [true, 'Car name is required'],
        },
        customerName: {
            type: String,
            required: [true, 'Customer name is required'],
            trim: true,
        },
        customerEmail: {
            type: String,
            required: [true, 'Customer email is required'],
            lowercase: true,
        },
        customerPhone: {
            type: String,
            required: [true, 'Customer phone is required'],
        },
        pickupDate: {
            type: Date,
            required: [true, 'Pickup date is required'],
        },
        dropDate: {
            type: Date,
            required: [true, 'Drop date is required'],
        },
        pickupLocation: {
            type: String,
            required: [true, 'Pickup location is required'],
        },
        dropLocation: {
            type: String,
            required: [true, 'Drop location is required'],
        },
        totalDays: Number,
        pricePerDay: Number,
        totalPrice: {
            type: Number,
            required: [true, 'Total price is required'],
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'pending',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        specialRequests: String,
        whatsappSent: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

bookingSchema.pre('save', function (next) {
    if (this.pickupDate && this.dropDate) {
        const days = Math.ceil(
            (this.dropDate.getTime() - this.pickupDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        this.totalDays = Math.max(days, 1);
        if (this.pricePerDay) {
            this.totalPrice = this.totalDays * this.pricePerDay;
        }
    }
    next();
});

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
