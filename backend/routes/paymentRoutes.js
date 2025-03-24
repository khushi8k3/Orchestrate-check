const express = require("express");
const { createOrder , confirmPayment} = require("../controllers/paymentController");
const router = express.Router();

router.post("/create-order", createOrder);
// Route to confirm payment
router.post("/confirm-payment", confirmPayment);
module.exports = router;
