import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/home.css";

export const Home = () => {
    const [showOwnerOptions, setShowOwnerOptions] = useState(false);
    const [showDinerOptions, setShowDinerOptions] = useState(false);

    return (
        <div className="home-container text-center">
            <h1 className="mb-4">Bienvenido a RestaurAPP</h1>

            <div className="toggle-container">
                <button 
                    className="toggle-btn" 
                    onClick={() => setShowOwnerOptions(!showOwnerOptions)}
                >
                    Soy Propietario
                </button>
                <div className={`dropdown-container ${showOwnerOptions ? "show" : ""}`}>
                    <Link to="/owners/new">
                        <button className="btn-option">Registrarse</button>
                    </Link>
                    <Link to="/owners/login">
                        <button className="btn-option">Iniciar Sesión</button>
                    </Link>
                </div>
            </div>

            <div className="toggle-container">
                <button 
                    className="toggle-btn" 
                    onClick={() => setShowDinerOptions(!showDinerOptions)}
                >
                    Soy Comensal
                </button>
                <div className={`dropdown-container ${showDinerOptions ? "show" : ""}`}>
                    <Link to="/diner/login">
                        <button className="btn-option">Iniciar Sesión</button>
                    </Link>
                    <Link to="/dinerform">
                        <button className="btn-option">Registrarse</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
