// src/pages/checkout/Checkout.js
import { useCart } from "../../context/cart/useCart";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import './checkout.css';

const Checkout = () => {
    const { cart } = useCart();
    const navigate = useNavigate(); // Initialize useNavigate

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
    });

    const netTotalPrice = Object.values(cart).reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Navigate to the Payment page, passing the total amount
        navigate('/payment', { state: { totalAmount: netTotalPrice } });
    };

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            <div className="checkout-summary">
                <h3>Order Summary</h3>
                <ul>
                    {Object.values(cart).map((item, index) => (
                        <li key={index}>
                            {item.name} x {item.quantity} - ${item.price * item.quantity}
                        </li>
                    ))}
                </ul>
                <div className="checkout-total">
                    <strong>Total: ${netTotalPrice.toFixed(2)}</strong>
                </div>
            </div>
            <form className="checkout-form" onSubmit={handleSubmit}>
                <h3>Shipping Details</h3>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Address:
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <button type="submit">Place Order</button>
            </form>
        </div>
    );
};

export default Checkout;
