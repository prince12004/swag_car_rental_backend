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

        return res.status(201).json({
            message: 'Query submitted successfully',
            query,
            whatsappNotification: whatsappSent,
        });
    } catch (error: any) {
        return res.status(500).json({ message: 'Server error', error: error.message });
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

        return res.status(200).json({
            count: queries.length,
            total,
            page,
            pages: Math.ceil(total / Number(limit)),
            queries,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
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

        return res.status(200).json(query);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
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
        const message = `Hi ${query.name}, we received your query: "${query.subject}"\n\n Our reply:\n\n${adminReply}\n\nThank you for contacting SWAG Wheels!\n\nContact: +91 9289084361`;

        await (whatsappService as any).sendMessage(query.phone, message);

        return res.status(200).json({
            message: 'Reply sent successfully',
            query,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteQuery = async (req: AuthRequest, res: Response) => {
    try {
        const query = await ContactQuery.findByIdAndDelete(req.params.id);

        if (!query) {
            return res.status(404).json({ message: 'Query not found' });
        }

        return res.status(200).json({
            message: 'Query deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

export const getQueryStats = async (req: AuthRequest, res: Response) => {
    try {
        const total = await ContactQuery.countDocuments();
        const newQueries = await ContactQuery.countDocuments({ status: 'new' });
        const read = await ContactQuery.countDocuments({ status: 'read' });
        const replied = await ContactQuery.countDocuments({ status: 'replied' });

        return res.status(200).json({
            total,
            new: newQueries,
            read,
            replied,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
