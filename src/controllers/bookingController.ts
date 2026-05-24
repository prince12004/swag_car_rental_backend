import { Response } from 'express';
import { Booking } from '../models/Booking';
import whatsappService from '../utils/whatsappService';
import { AuthRequest } from '../middleware/auth';

export const createBooking = async (req: AuthRequest, res: Response) => {
    try {
        const {
            carId,
            carName,
            customerName,
            customerEmail,
            customerPhone,
            pickupDate,
            dropDate,
            pickupLocation,
            dropLocation,
            pricePerDay,
            specialRequests,
        } = req.body;

        const booking = await Booking.create({
            carId,
            carName,
            customerName,
            customerEmail,
            customerPhone,
            pickupDate,
            dropDate,
            pickupLocation,
            dropLocation,
            pricePerDay,
            specialRequests,
            status: 'pending',
            whatsappSent: false,
        });

        // Send WhatsApp confirmation
        const whatsappSent = await whatsappService.sendBookingConfirmation(
            customerPhone,
            booking
        );

        // Notify admin
        await whatsappService.notifyAdminNewBooking(booking);

        booking.whatsappSent = whatsappSent;
        await booking.save();

        res.status(201).json({
            message: 'Booking created successfully',
            booking,
            whatsappNotification: whatsappSent,
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getAllBookings = async (req: AuthRequest, res: Response) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const filter: any = {};

        if (status) filter.status = status;

        const skip = (Number(page) - 1) * Number(limit);
        const bookings = await Booking.find(filter)
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const total = await Booking.countDocuments(filter);

        res.status(200).json({
            count: bookings.length,
            total,
            page,
            pages: Math.ceil(total / Number(limit)),
            bookings,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getBookingById = async (req: AuthRequest, res: Response) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { status } = req.body;

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Send WhatsApp notification on status change
        if (status === 'confirmed') {
            await whatsappService.sendDetailedBookingMessage(
                booking.customerPhone,
                booking
            );
        }

        res.status(200).json({
            message: 'Booking status updated',
            booking,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: 'cancelled' },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({
            message: 'Booking cancelled',
            booking,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getBookingStats = async (req: AuthRequest, res: Response) => {
    try {
        const total = await Booking.countDocuments();
        const pending = await Booking.countDocuments({ status: 'pending' });
        const confirmed = await Booking.countDocuments({ status: 'confirmed' });
        const cancelled = await Booking.countDocuments({ status: 'cancelled' });
        const completed = await Booking.countDocuments({ status: 'completed' });

        const revenue = await Booking.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]);

        res.status(200).json({
            total,
            pending,
            confirmed,
            cancelled,
            completed,
            revenue: revenue[0]?.total || 0,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
