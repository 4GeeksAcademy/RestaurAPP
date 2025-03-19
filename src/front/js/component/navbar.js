import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Context } from "../store/appContext";
import LogoRestaurAPP from "../../img/LogoRestaurAPP.png";

export const Navbar = () => {
    const { store } = useContext(Context);
    const location = useLocation(); // Obtener la ruta actual

    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <Link to="/">
                    <img
                        src={LogoRestaurAPP}
                        alt="Logo"
                        className="navbar-brand mb-0 h1"
                        style={{ cursor: 'pointer', width: '90px', height: 'auto', borderRadius: '8px' }}
                    />
                </Link>
                <div className="ml-auto">
                    {/* Botones siempre visibles: "Buscar Restaurantes", "Owner Signup", "Owner Login", "Diner Login", "Diner Sign up" */}
                    <Link to="/search-restaurants">
                        <button type="button" className="btn btn-light">Buscar Restaurantes</button>
                    </Link>
                    <Link to="/owners/new">
                        <button type="button" className="btn btn-light">Owner Signup</button>
                    </Link>
                    <Link to="/owners/login">
                        <button type="button" className="btn btn-light">Owner Login</button>
                    </Link>
                    <Link to="/diner/login">
                        <button type="button" className="btn btn-light">Diner Login</button>
                    </Link>
                    <Link to="/dinerform">
                        <button type="button" className="btn btn-light mx-1">Diner Sign up</button>
                    </Link>

                    {/* Si el usuario está autenticado como owner, mostrar estos botones sin "Buscar Restaurantes" */}
                    {store.auth && store.user && store.user.role === "owner" && (
                        <>
                            <Link to="/add-restaurant">
                                <button className="btn btn-secondary">Añadir Restaurante</button>
                            </Link>
                            <Link to="/restaurant_categories">
                                <button className="btn btn-light">Restaurant-categories List</button>
                            </Link>
                            <Link to="/restaurant_categories/new">
                                <button className="btn btn-light">Add Restaurant-categories</button>
                            </Link>

                            <Link to="/owners">
                                <button className="btn btn-light">Owners List</button>
                            </Link>
                            <Link to="/owners/dashboard">
                                <button className="btn btn-light">Owner Dashboard</button>
                            </Link>
                            <Link to="/categories">
                                <button className="btn btn-light">Categories List</button>
                            </Link>
                            <Link to="/categories/new">
                                <button className="btn btn-light">Add Categories</button>
                            </Link>
                            <Link to="/my-restaurants">
                                <button className="btn btn-success">Mis Restaurantes</button>
                            </Link>
                        </>
                    )}

                    {/* Si el usuario está autenticado como diner, mostrar el botón de "Diner list" */}
                    {store.dinerauth ? (
                        <>
                            <Link to="/dinerlist">
                                <button className="btn btn-primary">Diner list</button>
                            </Link>
                        </>
                    ) : null}

                    {/* Botón "About Us" siempre visible */}
                    <Link to="/about-us">
                        <button type="button" className="btn btn-light">About Us</button>
                    </Link>

                    {/* Los botones de administración y categorías solo se muestran en la página "/categories" */}
                    {location.pathname === "/categories" && (
                        <>
                            <Link to="/add-restaurant">
                                <button className="btn btn-secondary">Añadir Restaurante</button>
                            </Link>
                            <Link to="/restaurant_categories">
                                <button className="btn btn-light">Restaurant-categories List</button>
                            </Link>
                            <Link to="/restaurant_categories/new">
                                <button className="btn btn-light">Add Restaurant-categories</button>
                            </Link>
                            <Link to="/owners">
                                <button className="btn btn-light">Owners List</button>
                            </Link>
                            <Link to="/owners/dashboard">
                                <button className="btn btn-light">Owner Dashboard</button>
                            </Link>
                            <Link to="/categories">
                                <button className="btn btn-light">Categories List</button>
                            </Link>
                            <Link to="/categories/new">
                                <button className="btn btn-light">Add Categories</button>
                            </Link>
                            <Link to="/my-restaurants">
                                <button className="btn btn-success">Mis Restaurantes</button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
