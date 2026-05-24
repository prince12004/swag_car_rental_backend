import { Response } from 'express';
import { FAQ } from '../models/FAQ';
import { AuthRequest } from '../middleware/auth';

export const getAllFAQs = async (req: AuthRequest, res: Response) => {
    try {
        const faqs = await FAQ.find({ is_published: true })
            .sort({ display_order: 1, createdAt: -1 });

        res.status(200).json(faqs);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getAdminFAQs = async (req: AuthRequest, res: Response) => {
    try {
        const faqs = await FAQ.find()
            .sort({ display_order: 1, createdAt: -1 });

        res.status(200).json(faqs);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const createFAQ = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { question, answer, display_order, is_published } = req.body;

        if (!question || !answer) {
            res.status(400).json({ message: 'Question and answer are required' });
            return;
        }

        const faq = await FAQ.create({
            question,
            answer,
            display_order: display_order || 0,
            is_published: is_published !== undefined ? is_published : true,
        });

        res.status(201).json(faq);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateFAQ = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { question, answer, display_order, is_published } = req.body;

        const faq = await FAQ.findByIdAndUpdate(
            id,
            {
                question,
                answer,
                display_order,
                is_published,
            },
            { new: true }
        );

        if (!faq) {
            res.status(404).json({ message: 'FAQ not found' });
            return;
        }

        res.status(200).json(faq);
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const deleteFAQ = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const faq = await FAQ.findByIdAndDelete(id);

        if (!faq) {
            res.status(404).json({ message: 'FAQ not found' });
            return;
        }

        res.status(200).json({ message: 'FAQ deleted' });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
