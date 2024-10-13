import React, { useState } from 'react';
import axios from 'axios';
import './forgotPassword.css';
import urlConfig from '../../utils/urlConfig.js';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const resp = await axios.post(urlConfig.FORGOT_PASSWORD_URL, { email });
            setMessage(resp.data.message);
            setEmail("");
        } catch (error) {
            setMessage("Error sending reset email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Your email.."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>
            <div className="message">{message}</div>
        </div>
    );
};

export default ForgotPassword;
