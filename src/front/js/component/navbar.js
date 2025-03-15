import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
    const { store } = useContext(Context);

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
                    {/* <Link to="/demo">
                        <button className="btn btn-info">Otras funcionalidades RestaurAPP</button>
                    </Link> */}
                    <Link to="/categories">
                        <button className="btn btn-light">Categories List</button>
                    </Link>
                    <Link to="/categories/new">
                        <button className="btn btn-light">Add Categories</button>
                    </Link>

                    <Link to="/restaurant_categories">
                        <button className="btn btn-light">Restaurant-categories List</button>
                    </Link>
                    <Link to="/restaurant_categories/new">
                        <button className="btn btn-light">Add Restaurant-categories</button>
                    </Link>

                    <Link to="/owners/new">
                        <button type="button" className="btn btn-light">Owner Signup</button>
                    </Link>
                    <Link to="/owners">
                        <button className="btn btn-light">Owners List</button>
                    </Link>
                    {store.auth ? (
                        <Link to="/owners/dashboard">
                            <button className="btn btn-light">Owner Dashboard</button>
                        </Link>
                    ) : (
                        <Link to="/owners/login">
                            <button className="btn btn-light">Owner Login</button>
                        </Link>
                    )}
                    {store.auth ? (
                        <Link to="/diner/dashboard">
                            <button className="btn btn-light">Diner Dashboard</button>
                        </Link>
                    ) : (
                        <Link to="/diner/login">
                            <button className="btn btn-light">Diner Login</button>
                        </Link>
                    )}
                    <Link to="/dinerlist">
                        <button className="btn btn-primary">Diner list</button>
                    </Link>
                    <Link to="/dinerform">
                        <button className="btn btn-primary mx-1">Diner Sign up</button>
                    </Link>
                    {/* Mostrar el botón solo si el usuario logueado es owner */}
                    {store.user && store.user.role === "owner" && (
                        <Link to="/my-restaurants">
                            <button className="btn btn-success">Mis Restaurantes</button>
                        </Link>
                    )}

                </div>
            </div>
        </nav>
    );
};
