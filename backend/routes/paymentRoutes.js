require("dotenv").config(); // Load environment variables
const express = require("express");
const {
  createOrder,
  confirmPayment,
} = require("../controllers/paymentController");
const authenticateUser = require("../middleware/authenticateUser");
const router = express.Router();

// Route to create an order
router.post("/create-order", authenticateUser, createOrder);

// Route to confirm payment and RSVP user
router.post("/confirm-payment", authenticateUser, confirmPayment);

module.exports = router;