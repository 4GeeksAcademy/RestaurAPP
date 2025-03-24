import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Link, Navigate } from 'react-router-dom';
import "../../styles/login.css";
import LoginImg from "../../img/LoginImg.jpeg";
import logo2 from "../../img/logo2.jpeg";
const OwnerLogin = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    function sendData(e) {
        e.preventDefault();
        actions.ownerLogin(email, password);
    }
    if (store.auth === true) {
        return <Navigate to="/owners/dashboard" />;
    }
    return (
        <div className="login-container">
            <div className="login-card">
                {/* Sezione immagine a sinistra */}
                <div className="login-image-container">
                    <img
                        src={LoginImg}
                        alt="Login Background"
                        className="login-image"
                    />
                </div>
                {/* Sezione login a destra */}
                <div className="login-content">
                    <img src={logo2} style={{ cursor: 'pointer', width: '60px', height: 'auto', borderRadius: '8px', marginBottom: '20px' }}></img>
                    <h2 className="mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>Bienvenido de nuevo</h2>
                    <form onSubmit={sendData}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                className="form-control"
                                placeholder="Escribe aquí tu email"
                            />
                        </div>
                        <div className="position-relative">
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                placeholder="Escribe aquí tu password"
                            />
                            <span
                                className="position-absolute end-0 p-2 cursor-pointer text-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    cursor: "pointer",
                                    fontSize: "18px",
                                    color: "#6c757d",
                                    top: "48%",  /* Regolato per alzarlo leggermente */
                                    transform: "translateY(-50%)"
                                }}
                            >
                                <i className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
                            </span>
                        </div>
                        <button type="submit" className="btn btn-primary w-100 mt-4">Log in</button>
                    </form>
                    <p className="mt-4 text-center">
                        No tienes una cuenta?
                        <Link to="/owners/new" className="text-primary fw-bold"> Regístrate aquí</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
export default OwnerLogin;
