import { Response } from 'express';
import { ContactQuery } from '../models/ContactQuery';
import whatsappService from '../utils/whatsappService';
import { AuthRequest } from '../middleware/auth';

export const createContactQuery = async (req: AuthRequest, res: Response) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        const query = await ContactQuery.create({
            name,
            email,
            phone,
            subject,
            message,
            status: 'new',
        });

        // Send WhatsApp confirmation to customer
        const whatsappSent = await whatsappService.sendContactQueryResponse(
            phone,
            name,
            subject
        );

        // Notify admin
        await whatsappService.notifyAdminNewQuery(query);

        query.whatsappSent = whatsappSent;
        await query.save();

        res.status(201).json({
            message: 'Query submitted successfully',
            query,
            whatsappNotification: whatsappSent,
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getAllQueries = async (req: AuthRequest, res: Response) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const filter: any = {};

        if (status) filter.status = status;

        const skip = (Number(page) - 1) * Number(limit);
        const queries = await ContactQuery.find(filter)
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const total = await ContactQuery.countDocuments(filter);

        res.status(200).json({
            count: queries.length,
            total,
            page,
            pages: Math.ceil(total / Number(limit)),
            queries,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getQueryById = async (req: AuthRequest, res: Response) => {
    try {
        const query = await ContactQuery.findById(req.params.id);

        if (!query) {
            return res.status(404).json({ message: 'Query not found' });
        }

        // Mark as read
        if (query.status === 'new') {
            query.status = 'read';
            await query.save();
        }

        res.status(200).json(query);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const replyToQuery = async (req: AuthRequest, res: Response) => {
    try {
        const { adminReply } = req.body;

        const query = await ContactQuery.findByIdAndUpdate(
            req.params.id,
            {
                adminReply,
                status: 'replied',
            },
            { new: true }
        );

        if (!query) {
            return res.status(404).json({ message: 'Query not found' });
        }

        // Send reply via WhatsApp
        const message = `Hi ${query.name}, we received your query: "${query.subject}"\n\n Our reply:\n\n${adminReply}\n\nThank you for contacting SWAG Wheels!\n\nContact: +91 88278 14985`;

        await whatsappService.sendMessage(query.phone, message);

        res.status(200).json({
            message: 'Reply sent successfully',
            query,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteQuery = async (req: AuthRequest, res: Response) => {
    try {
        const query = await ContactQuery.findByIdAndDelete(req.params.id);

        if (!query) {
            return res.status(404).json({ message: 'Query not found' });
        }

        res.status(200).json({
            message: 'Query deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getQueryStats = async (req: AuthRequest, res: Response) => {
    try {
        const total = await ContactQuery.countDocuments();
        const newQueries = await ContactQuery.countDocuments({ status: 'new' });
        const read = await ContactQuery.countDocuments({ status: 'read' });
        const replied = await ContactQuery.countDocuments({ status: 'replied' });

        res.status(200).json({
            total,
            new: newQueries,
            read,
            replied,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
