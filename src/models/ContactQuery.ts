import mongoose, { Schema, Document } from 'mongoose';

interface IContactQuery extends Document {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'replied';
    whatsappSent: boolean;
    adminReply?: string;
    createdAt: Date;
    updatedAt: Date;
}

const contactQuerySchema = new Schema<IContactQuery>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
        },
        subject: {
            type: String,
            required: [true, 'Subject is required'],
            trim: true,
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
        },
        status: {
            type: String,
            enum: ['new', 'read', 'replied'],
            default: 'new',
        },
        whatsappSent: {
            type: Boolean,
            default: false,
        },
        adminReply: String,
    },
    { timestamps: true }
);

export const ContactQuery = mongoose.model<IContactQuery>('ContactQuery', contactQuerySchema);
