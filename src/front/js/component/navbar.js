import React, { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import LogoRestaurAPP from "../../img/LogoRestaurAPP.png";

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation(); // Obtener la ruta actual

    const handleLogout = () => {
        actions.dinerLogout();
        actions.ownerLogout();  
        localStorage.removeItem("dinerFullName");
        localStorage.removeItem("tokenDiner");
        localStorage.removeItem("token");  
        navigate("/diner/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link to="/" className="navbar-brand">
                    <img
                        src={LogoRestaurAPP}
                        alt="Logo"
                        style={{ cursor: 'pointer', width: '90px', height: 'auto', borderRadius: '8px' }}
                    />
                </Link>
                <div className="d-flex align-items-center">
                    <Link to="/search-restaurants">
                        <button type="button" className="btn btn-light ms-2">Buscar Restaurantes</button>
                    </Link>

                    {/* si es owner se veran estos botones */}
                    {store.auth && (
                        <>
                            <Link to="/add-restaurant">
                                <button className="btn btn-secondary ms-2">Añadir Restaurante</button>
                            </Link>
                            <Link to="/restaurant_categories">
                                <button className="btn btn-light ms-2">Restaurant-categories List</button>
                            </Link>
                            <Link to="/restaurant_categories/new">
                                <button className="btn btn-light ms-2">Add Restaurant-categories</button>
                            </Link>
                            <Link to="/owners">
                                <button className="btn btn-light ms-2">Owners List</button>
                            </Link>
                            <Link to="/owners/dashboard">
                                <button className="btn btn-light ms-2">Owner Dashboard</button>
                            </Link>
                            <Link to="/categories">
                                <button className="btn btn-light ms-2">Categories List</button>
                            </Link>
                            <Link to="/categories/new">
                                <button className="btn btn-light ms-2">Add Categories</button>
                            </Link>
                            <Link to="/my-restaurants">
                                <button className="btn btn-success ms-2">Mis Restaurantes</button>
                            </Link>
                        </>
                    )}

                    {localStorage.getItem("tokenDiner") && (
                        <div className="dropdown ms-2">
                            <button
                                className="btn btn-light dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Mi Perfil
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <li>
                                    <Link to="/diner/reservations" className="dropdown-item">Mis Reservas</Link>
                                </li>
                                <li>
                                    <Link to="/dineraccount" className="dropdown-item">Mi Cuenta</Link>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button
                                        type="button"
                                        className="btn btn-danger dropdown-item"
                                        onClick={() => handleLogout()}
                                    >
                                        Log Out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* este siempre sera visible */}
                    <Link to="/about-us">
                        <button type="button" className="btn btn-light ms-2">About Us</button>
                    </Link>

                    {/* solo en categories */}
                    {location.pathname === "/categories" && (
                        <>
                            <Link to="/add-restaurant">
                                <button className="btn btn-secondary ms-2">Añadir Restaurante</button>
                            </Link>
                            <Link to="/restaurant_categories">
                                <button className="btn btn-light ms-2">Restaurant-categories List</button>
                            </Link>
                            <Link to="/restaurant_categories/new">
                                <button className="btn btn-light ms-2">Add Restaurant-categories</button>
                            </Link>
                            <Link to="/owners">
                                <button className="btn btn-light ms-2">Owners List</button>
                            </Link>
                            <Link to="/owners/dashboard">
                                <button className="btn btn-light ms-2">Owner Dashboard</button>
                            </Link>
                            <Link to="/categories">
                                <button className="btn btn-light ms-2">Categories List</button>
                            </Link>
                            <Link to="/categories/new">
                                <button className="btn btn-light ms-2">Add Categories</button>
                            </Link>
                            <Link to="/my-restaurants">
                                <button className="btn btn-success ms-2">Mis Restaurantes</button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
