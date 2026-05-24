import { Response } from 'express';
import { Testimonial } from '../models/Testimonial';
import { AuthRequest } from '../middleware/auth';

export const getAllTestimonials = async (req: AuthRequest, res: Response) => {
    try {
        const testimonials = await Testimonial.find({ is_published: true })
            .sort({ display_order: 1, createdAt: -1 });

        res.status(200).json(testimonials);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getAdminTestimonials = async (req: AuthRequest, res: Response) => {
    try {
        const testimonials = await Testimonial.find()
            .sort({ display_order: 1, createdAt: -1 });

        res.status(200).json(testimonials);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const createTestimonial = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { customer_name, role, content, rating, display_order, is_published } = req.body;

        if (!customer_name || !content) {
            res.status(400).json({ message: 'Customer name and content are required' });
            return;
        }

        const testimonial = await Testimonial.create({
            customer_name,
            role: role || undefined,
            content,
            rating: rating || 5,
            display_order: display_order || 0,
            is_published: is_published !== undefined ? is_published : true,
        });

        res.status(201).json(testimonial);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateTestimonial = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { customer_name, role, content, rating, display_order, is_published } = req.body;

        const testimonial = await Testimonial.findByIdAndUpdate(
            id,
            {
                customer_name,
                role,
                content,
                rating,
                display_order,
                is_published,
            },
            { new: true }
        );

        if (!testimonial) {
            res.status(404).json({ message: 'Testimonial not found' });
            return;
        }

        res.status(200).json(testimonial);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const deleteTestimonial = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const testimonial = await Testimonial.findByIdAndDelete(id);

        if (!testimonial) {
            res.status(404).json({ message: 'Testimonial not found' });
            return;
        }

        res.status(200).json({ message: 'Testimonial deleted' });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
