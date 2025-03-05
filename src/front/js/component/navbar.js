import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <Link to="/">
                    <span className="navbar-brand mb-0 h1">Volver a Home</span>
                </Link>
                <div className="ml-auto">
                    <Link to="/search-restaurants">
                        <button className="btn btn-primary">Buscar Restaurantes</button>
                    </Link>
                    <Link to="/add-restaurant">
                        <button className="btn btn-secondary">Añadir Restaurante</button>
                    </Link>
                    <Link to="/demo">
                        <button className="btn btn-info">Otras funcionalidades RestaurAPP</button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};
