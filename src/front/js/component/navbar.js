import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import LogoEnteroRestaurApp from "../../img/LogoEnteroRestaurApp.png";

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");
    const isHome = location.pathname === "/";

    const dinerToken = localStorage.getItem("tokenDiner");
    const ownerToken = localStorage.getItem("token");


    const buttonStyle = {
        border: "none",
        background: "transparent",
        color: "#000"
    };


    const handleLogout = () => {
        actions.dinerLogout();
        actions.ownerLogout();
        localStorage.removeItem("dinerFullName");
        localStorage.removeItem("tokenDiner");
        localStorage.removeItem("token");

        navigate("/");

    };

    return (
        <nav className="navbar">
            <div className="container d-flex align-items-center justify-content-between">
                {/* Logo */}
                <Link to="/">
                    <img
                        src={LogoEnteroRestaurApp}
                        alt="Logo"
                        className="navbar-brand mb-0 h1"
                        style={{ cursor: "pointer", width: "210px", height: "auto", borderRadius: "8px" }}
                    />
                </Link>


                {/* Botones centrados */}
                <div className="d-flex align-items-center mx-auto">
                    {/* Buscar Restaurantes */}


                    {/* Perfil del dueño */}
                    {ownerToken && !store.dinerauth && !isHome && (
                        <div className="d-inline-block ms-2">
                            {/* Mis Reservas */}
                            <Link to="/owners/myReservations" className="ms-2">
                                <button type="button" className="btn" style={buttonStyle}>Mis Reservas</button>
                            </Link>

                            {/* Mis Restaurantes */}
                            <Link to="/owners/dashboard" className="ms-2">
                                <button type="button" className="btn" style={buttonStyle}>Mis Restaurantes</button>
                            </Link>

                            {/* Dropdown Mi Perfil */}
                            <div className="dropdown d-inline-block ms-2">
                                <button
                                    className="btn dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    style={buttonStyle}
                                >
                                    Mi Perfil
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><Link to="/owners/profile" className="dropdown-item">Mi Cuenta</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button className="btn dropdown-item" onClick={handleLogout} style={{ color: "red" }}>
                                            Log Out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Diner */}
                    {dinerToken && (
                        <div className="d-inline-block ms-2">
                            {/* Mis Reservas */}
                            <Link to="/restaurants-search">
                                <button type="button" className="btn ms-2" style={buttonStyle}>
                                    Buscar Restaurantes
                                </button>
                            </Link>
                            <Link to="/recommendation">
                                <button type="button" className="btn ms-2" style={buttonStyle}>
                                    Recomendaciones
                                </button>
                            </Link>
                            <Link to="/diner/reservations" className="ms-2">
                                <button type="button" className="btn" style={buttonStyle}>Mis Reservas</button>
                            </Link>

                            {/* Restaurantes */}
                            <Link to="/diner/dashboard" className="ms-2">
                                <button type="button" className="btn" style={buttonStyle}>Restaurantes</button>
                            </Link>

                            {/* Dropdown Mi Perfil */}
                            <div className="dropdown d-inline-block ms-2">
                                <button
                                    className="btn dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    style={buttonStyle}
                                >
                                    Mi Perfil
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><Link to="/dineraccount" className="dropdown-item">Mi Cuenta</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button className="btn dropdown-item" onClick={handleLogout} style={{ color: "red" }}>
                                            Log Out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                    {!dinerToken && !ownerToken && (
                        <>

                            <Link to="/restaurants-search">
                                <button type="button" className="btn ms-2" style={buttonStyle}>
                                    Buscar Restaurantes
                                </button>
                            </Link>
                            <Link to="/recommendation">
                                <button type="button" className="btn ms-2" style={buttonStyle}>
                                    Recomendaciones
                                </button>
                            </Link>
                            <Link to="/contact-us" className="ms-2">
                                <button type="button" className="btn" style={buttonStyle}>Contact Us</button>
                            </Link>
                            <Link to="/about-us">
                                <button type="button" className="btn ms-2" style={buttonStyle}>About Us</button>
                            </Link>
                        </>
                    )}

                </div>
            </div>
        </nav>
    );
};

