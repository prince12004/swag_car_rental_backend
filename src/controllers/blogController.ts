import { Response } from 'express';
import { Blog } from '../models/Blog';
import { AuthRequest } from '../middleware/auth';

export const getAllBlogs = async (req: AuthRequest, res: Response) => {
    try {
        const { published, category, sortBy, page = 1, limit = 10 } = req.query;
        const filter: any = {};

        if (published !== undefined) filter.published = published === 'true';
        if (category) filter.category = category;

        let query = Blog.find(filter);

        if (sortBy === 'views') query = query.sort({ views: -1 });
        else if (sortBy === 'likes') query = query.sort({ likes: -1 });
        else query = query.sort({ createdAt: -1 });

        const skip = (Number(page) - 1) * Number(limit);
        const blogs = await query.skip(skip).limit(Number(limit));
        const total = await Blog.countDocuments(filter);

        res.status(200).json({
            count: blogs.length,
            total,
            page,
            pages: Math.ceil(total / Number(limit)),
            blogs,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getBlogBySlug = async (req: AuthRequest, res: Response) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug });

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        blog.views += 1;
        await blog.save();

        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createBlog = async (req: AuthRequest, res: Response) => {
    try {
        const { title, content, excerpt, author, image, category, tags, published } = req.body;

        const blog = await Blog.create({
            title,
            content,
            excerpt,
            author: author || 'SWAG Wheels Team',
            image,
            category: category || 'other',
            tags: tags || [],
            published: published || false,
        });

        res.status(201).json({
            message: 'Blog created successfully',
            blog,
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateBlog = async (req: AuthRequest, res: Response) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.status(200).json({
            message: 'Blog updated successfully',
            blog,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteBlog = async (req: AuthRequest, res: Response) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.status(200).json({
            message: 'Blog deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const publishBlog = async (req: AuthRequest, res: Response) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        blog.published = !blog.published;
        await blog.save();

        res.status(200).json({
            message: `Blog ${blog.published ? 'published' : 'unpublished'} successfully`,
            blog,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const likeBlog = async (req: AuthRequest, res: Response) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        blog.likes += 1;
        await blog.save();

        res.status(200).json({
            message: 'Blog liked',
            blog,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
