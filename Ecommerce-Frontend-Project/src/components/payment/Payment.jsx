// src/Payment/Payment.js
import React, { useState } from 'react';
import './Payment.css'; // Import the CSS file
import Axios from 'axios';

const Payment = () => {
    const [loading, setLoading] = useState(false);

    const loadScript =()=>{
        return new Promise((resolve,reject)=>{
            const script = document.createElement('script');
            script.src = "https://checkout.razorpay.com/v1/checkout.js";


            script.onload = resolve;
            script.onerror = reject;Payment
            document.body.appendChild(script);
        });
    }

    const displayRazorpay = async() =>{
        await loadScript();

        const resp = await Axios.post('http://localhost:3000/checkout',{method:'post'});

        console.log(resp.data); 

        const {id, amount, currency} = resp.data.order;
        console.log("amount",amount)
        let options = {
            "key": "rzp_test_Tg4xwjyIeud4A6", // Enter the Key ID generated from the Dashboard
            "amount": amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": currency,
            "name": "Acme Corp",
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": function (response){
                alert(response.razorpay_payment_id);
                alert(response.razorpay_order_id);
                alert(response.razorpay_signature)
            },
            "prefill": {
                "name": "Sadhana Venkatesh",
                "email": "sadhana.v1989@gmail.com",
                "contact": "9900098662"
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        };

        const razorpayInst = new Razorpay(options);

        razorpayInst.open();

    }

    

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
            <button id="rzp-button1" onClick={displayRazorpay}>Pay with Razorpay</button>
            <button className="pay-button" onClick={handleMockPayment} disabled={loading}>
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
        </div>
    );
};

export default Payment;
