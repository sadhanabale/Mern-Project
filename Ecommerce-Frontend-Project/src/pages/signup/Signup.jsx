import './signup.css';
import React, { useState } from 'react';
import axios from 'axios';
import urlConfig from '../../utils/urlConfig.js';
import { Link, useNavigate } from "react-router-dom";

function Signup() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const navigate = useNavigate();
    const handleSubmit = async () => {

        try{

            setLoading(true);

            let userDetails= {
               name,
               email,
               password,
               confirmPassword 
            };

            const resp = await axios.post(urlConfig.SIGNUP_URL, userDetails);
            const data = resp.data;

            if(data) {
                setName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                navigate('/login')
            }
        }catch(err){
            setErrMsg("User is not resigtered successfully!");
            setTimeout(()=>{
                setErrMsg("");
            }, 2000);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <h1>Loading...</h1>
    return (
        <div className="signupscreen">
            <div className="container">
                <div className="innerContainer">
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: '20px',
                        }}
                    >
                        <div >
                            <i className="fas fa-arrow-circle-left fa-5x"></i>
                        </div>
                        <p>Signup</p>
                    </div>

                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your name.."
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />

                    <label htmlFor="email">Email</label>
                    <input
                        type="email"

                        name="email"
                        placeholder="Your email.."
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Your Password.."
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <label htmlFor="password">Confirm Password</label>
                    <input
                        type="password"
                        id="password"
                        name="confirmPassword"
                        placeholder="Your ConfirmPassword.."
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                    <Link to="/login" className="link">
                        <span>Already have an account ?</span>
                    </Link>

                    <br />
                    <input type="submit" value="Sign up" onClick={handleSubmit} />
                    <div className={errMsg ? "errContainer" : ""}>{errMsg}</div>
                </div>


            </div>
        </div>
    )
}

export default Signup;
