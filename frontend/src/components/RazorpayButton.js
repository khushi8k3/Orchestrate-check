import React from "react";

const RazorpayButton = ({ amount }) => {
    const handlePayment = async () => {
        const response = await fetch("http://localhost:5000/api/payment/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount }),
        });
        const order = await response.json();

        const options = {
            key: "rzp_test_fTYhwgXS3lhJzR", 
            amount: order.amount,
            currency: "INR",
            name: "Orchestrate",
            description: "Event Registration Payment",
            order_id: order.id,
            handler: function (response) {
                alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
            },
            prefill: {
                name: "Alice",
                email: "alice@example.com",
                contact: "9999999999",
            },
            theme: { color: "#3399cc" },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    };

    return <button onClick={handlePayment} className="pay-btn">Pay ₹{amount}</button>;
};

export default RazorpayButton;
