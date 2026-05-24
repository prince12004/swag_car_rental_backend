import mongoose, { Schema, Document } from 'mongoose';

interface IBlog extends Document {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    author: string;
    image: string;
    category: string;
    tags: string[];
    published: boolean;
    views: number;
    likes: number;
    createdAt: Date;
    updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
    {
        title: {
            type: String,
            required: [true, 'Blog title is required'],
            trim: true,
            index: true,
        },
        slug: {
            type: String,
            required: [true, 'Slug is required'],
            unique: true,
            lowercase: true,
        },
        content: {
            type: String,
            required: [true, 'Blog content is required'],
        },
        excerpt: {
            type: String,
            required: [true, 'Excerpt is required'],
            maxlength: 200,
        },
        author: {
            type: String,
            required: [true, 'Author is required'],
            default: 'SWAG Wheels Team',
        },
        image: {
            type: String,
            required: [true, 'Cover image is required'],
        },
        category: {
            type: String,
            enum: ['travel', 'tips', 'news', 'lifestyle', 'other'],
            default: 'other',
        },
        tags: [String],
        published: {
            type: Boolean,
            default: false,
        },
        views: {
            type: Number,
            default: 0,
        },
        likes: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

blogSchema.pre('validate', function (next) {
    if (!this.slug && this.title) {
        this.slug = this.title
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, '')
            .replace(/-+/g, '-');
    }
    next();
});

export const Blog = mongoose.model<IBlog>('Blog', blogSchema);
