require("dotenv").config();
const axios = require("axios");

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
