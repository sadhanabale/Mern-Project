import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./login.css"
import urlConfig from '../../utils/urlConfig.js';
import axios from "axios";
import useAuth from '../../context/auth/useAuth.js';

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const navigate = useNavigate();

    const { setAuth } = useAuth();
    const handleSubmit = async () => {

          try{

            setLoading(true);

            let userDetails= {
               email,
               password,
            };

            console.log(userDetails);

            const resp = await axios.post(urlConfig.LOGIN_URL, userDetails);
            const data = resp.data;
            console.log(setAuth);

            if(data.status === "success") {
                setEmail("");
                setPassword("");
                navigate('/');
                console.log(data);
                setAuth(data);
            }
        }catch(err){
            console.log(err.message);
            setErrMsg("User is not loggedin successfully!");
            setTimeout(()=>{
                setErrMsg("");
            }, 2000);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <h1>Loading.....</h1>
    return (
        <div className="signinscreen">
            <div className="container">
                <div className="innerContainer">
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: '20px',
                            fontSize: '28px',
                        }}
                    >
                        <div style={{ cursor: 'pointer' }} onClick={() => { }}>
                            <i className="fas fa-arrow-circle-left fa-5x"></i>
                        </div>
                        <p>Sign In</p>
                    </div>

                    <label for="email">Email</label>
                    <input
                        type="email"
                        id="lname"
                        name="email"
                        placeholder="Your email.."
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <label for="password">Password</label>
                    <input
                        type="password"
                        id="lname"
                        name="password"
                        placeholder="Your Password.."
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Link to="/signup" className="link">
                        <span>Create a new account ?</span>
                    </Link>
                    <br />

                    <input type="submit" value="Sign in" onClick={handleSubmit} />
                    <div className="forgot-password">
                        <Link to="/forgotPassword" className="link">Forgot your password?</Link>
                    </div>
                    <div className={errMsg ? "errContainer" : ""}>{errMsg}</div>
                </div>
            </div>
        </div>
    )
}

export default Login