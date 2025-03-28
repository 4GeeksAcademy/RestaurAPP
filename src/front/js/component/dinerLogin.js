import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Link, Navigate } from 'react-router-dom';
import "../../styles/login.css"; // Include your custom styling
import logo2 from "../../img/logo2.jpeg"; // Your logo

export const DinerLogin = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);

    // Function to handle form submission
    function sendData(e) {
        e.preventDefault();
        actions.dinerLogin(email, password).then(() => {
            setRedirect(true);  // If login is successful, redirect
        });
    }

    // If logged in or redirected, navigate to the diner dashboard
    if (redirect || store.dinerauth === true) {
        return <Navigate to="/diner/dashboard" />;
    }

    return (
        <div className="container mt-5">
            <div className="login-card">
                <div className="login-image-container">
                    <img
                        src="https://img.freepik.com/premium-vector/drawing-people-sitting-table-with-lamp-them_1087929-8168.jpg"
                        alt="Login Background"
                        className="login-image"
                    />
                </div>
                <div className="login-content">
                    <img
                        src={logo2}
                        style={{
                            cursor: 'pointer',
                            width: '60px',
                            height: 'auto',
                            borderRadius: '8px',
                            marginBottom: '20px',
                        }}
                        alt="Logo"
                    />
                    <h2 className="mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Bienvenido de nuevo
                    </h2>
                    <form onSubmit={sendData}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="mb-3 position-relative">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-warning w-100 mt-3"
                            style={{
                                padding: '10px 18px',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                borderRadius: '8px',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = "#e0a800"}
                            onMouseLeave={(e) => e.target.style.backgroundColor = "#ffc107"}
                        >
                            Log in
                        </button>
                    </form>
                    <p className="mt-4 text-center">
                        Don't have an account?{" "}
                        <Link to="/dinerform" className="text-warning fw-bold">Sign up here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
