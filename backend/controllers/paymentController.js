require("dotenv").config();
const axios = require("axios");
const Event = require("../models/Event");

// Create a Razorpay Order
exports.createOrder = async (req, res) => {
    try {
        const auth = Buffer.from(
            `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
        ).toString("base64");

        const response = await axios.post(
            "https://api.razorpay.com/v1/orders",
            {
                amount: req.body.amount * 100, // Convert to paisa
                currency: "INR",
                receipt: req.body.receipt,
                payment_capture: 1
            },
            {
                headers: {
                    "Authorization": `Basic ${auth}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error("Razorpay Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to create order" });
    }
};

// Confirm Payment and RSVP User
exports.confirmPayment = async (req, res) => {
    const { eventId, employeeName } = req.body;

    try {
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (event.attendees.includes(employeeName)) {
            return res.status(400).json({ message: "Already RSVP’d" });
        }

        // Add user to attendees list after payment
        event.attendees.push(employeeName);
        event.availableSlots -= 1;
        await event.save();

        res.status(200).json({ message: "Payment confirmed, RSVP successful", event });
    } catch (error) {
        console.error("Payment Confirmation Error:", error.message);
        res.status(500).json({ message: "Server error", error });
    }
};
