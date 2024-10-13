// src/Payment/Payment.js
import React, { useState } from 'react';
import './Payment.css'; // Import the CSS file

const Payment = () => {
    const [loading, setLoading] = useState(false);

    const handleMockPayment = () => {
        setLoading(true);

        // Simulate payment processing
        setTimeout(() => {
            alert('Payment successful! Payment ID: mock_payment_id_123');
            console.log({
                razorpay_payment_id: 'mock_payment_id_123',
                razorpay_order_id: 'mock_order_id_123',
                razorpay_signature: 'mock_signature_123',
            });
            setLoading(false);
        }, 1000); // Simulate network delay
    };

    return (
        <div className="payment-container">
            <h1>Payment Details</h1>
            <div className="payment-info">
                <h2>Total Amount: ₹500</h2>
                <div className="card-details">
                    <h3>Card Information</h3>
                    <input type="text" placeholder="Card Number" />
                    <input type="text" placeholder="Cardholder Name" />
                    <div className="expiry-cvc">
                        <input type="text" placeholder="MM/YY" className="expiry" />
                        <input type="text" placeholder="CVC" className="cvc" />
                    </div>
                </div>
            </div>
            <button className="pay-button" onClick={handleMockPayment} disabled={loading}>
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
        </div>
    );
};

export default Payment;
