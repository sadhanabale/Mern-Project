import React, { useState } from 'react';
import './Payment.css';
import Axios from 'axios';

const Payment = () => {
    const [loading, setLoading] = useState(false);

    const loadScript = () => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    };

    const displayRazorpay = async () => {
        setLoading(true);
        await loadScript();

        const resp = await Axios.post('http://localhost:3000/checkout', { method: 'post' });

        const { id, amount, currency } = resp.data.order;

        const options = {
            key: "rzp_test_Tg4xwjyIeud4A6",
            amount,
            currency,
            name: "Acme Corp",
            description: "Test Transaction",
            image: "https://example.com/your_logo",
            order_id: id,
            handler: function (response) {
                alert("Payment successful!");
                console.log({
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                });
            },
            prefill: {
                name: "Guest User",
                email: "guest@example.com",
                contact: "9999999999"
            },
            notes: {
                address: "Virtual Checkout"
            },
            theme: {
                color: "#3399cc"
            }
        };

        const razorpayInst = new Razorpay(options);
        razorpayInst.open();
        setLoading(false);
    };

    return (
        <div className="payment-container">
            <h1>Checkout Summary</h1>
            <div className="payment-info">
                <h2>Total Amount: ₹500</h2>
                <p>
                    Your order is almost complete! Click the button below to securely pay using Razorpay. 
                    No need to enter card details here — the Razorpay popup will handle everything for you.
                </p>
            </div>
            <button
                className="pay-button"
                onClick={displayRazorpay}
                disabled={loading}
            >
                {loading ? 'Processing...' : 'Pay with Razorpay'}
            </button>
        </div>
    );
};

export default Payment;


