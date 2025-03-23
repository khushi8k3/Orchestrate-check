import React from "react";
import axios from "axios";

const RazorpayButton = ({ event, loggedInUser }) => {
    if (!event || typeof event.ticketPrice === "undefined") {
        return <button disabled className="pay-btn">Payment Not Available</button>;
    }

    const handlePayment = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/payment/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: event.ticketPrice  }),
            });

            const order = await response.json();

            const options = {
                key: "rzp_test_fTYhwgXS3lhJzR",
                amount: order.amount,
                currency: "INR",
                name: "Orchestrate",
                description: event.eventName,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const res = await axios.post(
                            "http://localhost:5000/api/events/payment-success",
                            { eventId: event._id, employeeName: loggedInUser.name },
                            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                        );

                        if (res.status === 200) {
                            alert("Payment successful! RSVP confirmed.");
                            window.location.reload(); // Reload to reflect RSVP update
                        } else {
                            alert(res.data.message || "Payment successful, but RSVP failed.");
                        }
                    } catch (error) {
                        alert("Payment failed!");
                        console.error("Payment error:", error);
                    }
                },
                prefill: {
                    name: loggedInUser?.name || "Guest",
                    email: loggedInUser?.email || "guest@example.com",
                    contact: "9999999999",
                },
                theme: { color: "#3399cc" },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            alert("Error initializing payment.");
            console.error("Payment initialization error:", error);
        }
    };

    return (
        <button onClick={handlePayment} className="pay-btn">
            Pay ₹{event.ticketPrice}
        </button>
    );
};

export default RazorpayButton;
