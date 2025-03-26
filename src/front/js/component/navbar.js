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

    const handleLogout = () => {
        actions.dinerLogout();
        actions.ownerLogout();
        localStorage.removeItem("dinerFullName");
        localStorage.removeItem("tokenDiner");
        localStorage.removeItem("token");
        navigate("/diner/login");
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
                
                {/* Bottoni centrati */}
                <div className="d-flex align-items-center mx-auto">
                    <Link to="/restaurants-search">
                        <button type="button" className="btn ms-2" style={{ border: 'none', background: 'transparent', color: '#000' }}>Buscar Restaurantes</button>
                    </Link>
                    
                    {token && !store.dinerauth && !isHome && (
                        <div className="dropdown d-inline-block ms-2">
                            <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" style={{ border: 'none', background: 'transparent', color: '#000' }}>
                                Mi Perfil
                            </button>
                            <ul className="dropdown-menu">
                                <li><Link to="/owners/dashboard" className="dropdown-item">Mis Restaurantes</Link></li>
                                <li><Link to="/owners/myReservations" className="dropdown-item">Mis Reservas</Link></li>
                                <li><Link to="/owners/profile" className="dropdown-item">Mi Cuenta</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button className="btn dropdown-item" onClick={handleLogout} style={{ color: 'red' }}>Log Out</button>
                                </li>
                            </ul>
                        </div>
                    )}
                    
                    {localStorage.getItem("tokenDiner") && (
                        <div className="dropdown ms-2">
                            <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" style={{ border: 'none', background: 'transparent', color: '#000' }}>
                                Mi Perfil
                            </button>
                            <ul className="dropdown-menu">
                                <li><Link to="/diner/reservations" className="dropdown-item">Mis Reservas</Link></li>
                                <li><Link to="/dineraccount" className="dropdown-item">Mi Cuenta</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button className="btn dropdown-item" onClick={handleLogout} style={{ color: 'red' }}>Log Out</button>
                                </li>
                            </ul>
                        </div>
                    )}
                    
                    <Link to="/contact-us" className="ms-2">
                        <button type="button" className="btn" style={{ border: 'none', background: 'transparent', color: '#000' }}>Contact Us</button>
                    </Link>
                    <Link to="/about-us">
                        <button type="button" className="btn ms-2" style={{ border: 'none', background: 'transparent', color: '#000' }}>About Us</button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

