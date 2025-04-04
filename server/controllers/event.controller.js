import { Event } from "../models/event.js";

import asyncHandler from "express-async-handler";
export const createEvent = asyncHandler(async (req, res) => {
    const { title, description, date } = req.body;
    const user = req.user;

    // Validation checks
    if (!title || !description || !date) {
        return res.status(400).json({ status: false, message: "Please provide all required fields!" });
    }

    const event = new Event({
        user: user._id,
        title,
        description,
        date,
    });

    try {
        await event.save();
        res.status(201).json({ status: true, message: "Event created successfully!" });
    } catch (error) {
        res.status(500).json({ status: false, message: "Something went wrong!" });
    }
});
export const getEvents = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ status: false, message: "Unauthorized" });
    }
    const events = await Event.find({user:user._id}).populate('user');
    if (events) {
        return res.status(200).json({ status: true, events });
    }
    res.status(404).json({ status: false, message: "No events found!" });
});


export const getEventById = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ status: false, message: "Event ID is required!" });
    }
    const event = await Event.findById(req.params.id).populate('user', 'name email');
    if (!event) {
        return res.status(404).json({ status: false, message: "Event not found!" });
    }
    return res.status(200).json({ status: true, event });
});

export const updateEvent = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ status: false, message: "Event ID is required!" });
    }

    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (event) {
        return res.status(200).json({ status: true, message: "Event updated successfully!" });
    }
    res.status(404).json({ status: false, message: "Event not found!" });
});

export const deleteEvent = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ status: false, message: "Event ID is required!" });
    }
    const event = await Event.findByIdAndDelete(req.params.id);
    if (event) {
        return res.status(200).json({ status: true, message: "Event deleted successfully!" });
    }
    res.status(404).json({ status: false, message: "Event not found!" });
});