import mongoose, { Schema, Document } from 'mongoose';

export interface IFAQ extends Document {
    question: string;
    answer: string;
    display_order: number;
    is_published: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const faqSchema = new Schema<IFAQ>(
    {
        question: {
            type: String,
            required: true,
            trim: true,
        },
        answer: {
            type: String,
            required: true,
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

export const FAQ = mongoose.model<IFAQ>('FAQ', faqSchema);
