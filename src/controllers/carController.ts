import { Response } from 'express';
import { Car } from '../models/Car';
import { AuthRequest } from '../middleware/auth';

export const getAllCars = async (req: AuthRequest, res: Response) => {
    try {
        const { type, availability, sortBy } = req.query;
        const filter: any = {};

        if (type) filter.type = type;
        if (availability) filter.availability = availability === 'true';

        let query = Car.find(filter);

        if (sortBy === 'price-asc') query = query.sort({ pricePerDay: 1 });
        else if (sortBy === 'price-desc') query = query.sort({ pricePerDay: -1 });
        else if (sortBy === 'rating') query = query.sort({ rating: -1 });
        else query = query.sort({ createdAt: -1 });

        const cars = await query;

        res.status(200).json({
            count: cars.length,
            cars,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getCarById = async (req: AuthRequest, res: Response) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createCar = async (req: AuthRequest, res: Response) => {
    try {
        const {
            name,
            brand,
            model,
            year,
            price,
            description,
            image,
            images,
            type,
            seats,
            transmission,
            fuelType,
            features,
            pricePerDay,
            location,
        } = req.body;

        const car = await Car.create({
            name,
            brand,
            model,
            year,
            price,
            description,
            image,
            images: images || [image],
            type,
            seats,
            transmission,
            fuelType,
            features: features || [],
            pricePerDay,
            location: location || 'Mumbai',
            availability: true,
        });

        res.status(201).json({
            message: 'Car added successfully',
            car,
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateCar = async (req: AuthRequest, res: Response) => {
    try {
        const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        res.status(200).json({
            message: 'Car updated successfully',
            car,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteCar = async (req: AuthRequest, res: Response) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id);

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        res.status(200).json({
            message: 'Car deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const toggleCarAvailability = async (req: AuthRequest, res: Response) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        car.availability = !car.availability;
        await car.save();

        res.status(200).json({
            message: 'Car availability updated',
            car,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const searchCars = async (req: AuthRequest, res: Response) => {
    try {
        const { query, type, priceMax, priceMin } = req.query;
        const filter: any = { availability: true };

        if (query) {
            filter.$or = [
                { name: { $regex: query, $options: 'i' } },
                { brand: { $regex: query, $options: 'i' } },
                { model: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
            ];
        }

        if (type) filter.type = type;

        if (priceMin || priceMax) {
            filter.pricePerDay = {};
            if (priceMin) filter.pricePerDay.$gte = Number(priceMin);
            if (priceMax) filter.pricePerDay.$lte = Number(priceMax);
        }

        const cars = await Car.find(filter).sort({ rating: -1 });

        res.status(200).json({
            count: cars.length,
            cars,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
