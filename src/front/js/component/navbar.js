import React, { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Context } from "../store/appContext";
import logo2 from "../../img/logo2.jpeg";
import LogoEnteroRestaurApp from "../../img/LogoEnteroRestaurApp.png";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation(); // Obtener la ruta actual
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Store auth è cambiato:", store.auth);
    }, [store.auth]);

    const handleLogout = () => {
        actions.ownerLogout();
        localStorage.clear();
        navigate("/");
    };

    // Verifica se siamo nella home (modifica in base al tuo path della home)
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
                {/* Logo e Bottoni nello stesso div */}
                <div className="d-flex align-items-center w-100">
                    {/* Logo */}
                    <Link to="/">
                        <img
                            src={LogoEnteroRestaurApp}
                            alt="Logo"
                            className="navbar-brand mb-0 h1"
                            style={{ cursor: 'pointer', width: '210px', height: 'auto', borderRadius: '8px' }}
                        />
                    </Link>

                    {/* Bottoni al centro */}
                    <div className="d-flex align-items-center justify-content-center w-100">
                        {/* Se siamo sulla home, mostra solo questi bottoni */}
                        {isHome && (
                            <>
                                <Link to="/restaurants-search" className="d-inline-block ms-2">
                                    <button type="button" className="btn btn-light" style={{ border: 'none', background: 'transparent', color: '#000' }}>Buscar Restaurantes</button>
                                </Link>
                                <Link to="/contact-us" className="d-inline-block ms-2">
                                    <button type="button" className="btn btn-light" style={{ border: 'none', background: 'transparent', color: '#000' }}>Contact Us</button>
                                </Link>
                                <Link to="/about-us" className="d-inline-block ms-2">
                                    <button type="button" className="btn btn-light" style={{ border: 'none', background: 'transparent', color: '#000' }}>About Us</button>
                                </Link>
                            </>
                        )}

                        {/* Se l'owner è autenticato */}
                        {token && !store.dinerauth && !isHome ? (
                            <>
                                <div className="dropdown d-inline-block ms-2">
                                    <button className="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ border: 'none', background: 'transparent', color: '#000' }}>
                                        Mi Perfil
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <Link to="/owners/dashboard">
                                                <button className="btn btn-light" style={{ backgroundColor: 'transparent', border: 'none', color: '#000' }}>Mis Restaurantes</button>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/owners/myReservations">
                                                <button className="btn btn-light" style={{ backgroundColor: 'transparent', border: 'none', color: '#000' }}>Mis Reservas</button>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/owners/profile">
                                                <button className="btn btn-light" style={{ backgroundColor: 'transparent', border: 'none', color: '#000' }}>Mi Cuenta</button>
                                            </Link>
                                        </li>
                                        <li>
                                            <button className="btn btn-light" style={{ backgroundColor: 'transparent', border: 'none', color: '#000' }} onClick={handleLogout}>Log Out</button>
                                        </li>
                                    </ul>
                                </div>

                                <Link to="/contact-us" className="d-inline-block ms-2">
                                    <button type="button" className="btn btn-light" style={{ border: 'none', background: 'transparent', color: '#000' }}>Contact Us</button>
                                </Link>
                                <Link to="/about-us" className="d-inline-block ms-2">
                                    <button type="button" className="btn btn-light" style={{ border: 'none', background: 'transparent', color: '#000' }}>About Us</button>
                                </Link>
                            </>
                        ) : null}

                        {/* Se il diner è autenticato */}
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
                        ) : null}

                        {/* Se nessuno è autenticato e non siamo sulla home */}
                        {!token && !store.dinerauth && !isHome ? (
                            <>
                                <Link to="/restaurants-search" className="d-inline-block ms-2">
                                    <button type="button" className="btn btn-light" style={{ border: 'none', background: 'transparent', color: '#000' }}>Buscar Restaurantes</button>
                                </Link>
                                <Link to="/owners/new" className="d-inline-block ms-2">
                                    <button type="button" className="btn btn-light" style={{ border: 'none', background: 'transparent', color: '#000' }}>Owner Signup</button>
                                </Link>
                                <Link to="/owners/login" className="d-inline-block ms-2">
                                    <button type="button" className="btn btn-light" style={{ border: 'none', background: 'transparent', color: '#000' }}>Owner Login</button>
                                </Link>
                                <Link to="/dinerform" className="d-inline-block ms-2">
                                    <button type="button" className="btn btn-light" style={{ border: 'none', background: 'transparent', color: '#000' }}>Diner Sign up</button>
                                </Link>
                                <Link to="/diner/login" className="d-inline-block ms-2">
                                    <button type="button" className="btn btn-light" style={{ border: 'none', background: 'transparent', color: '#000' }}>Diner Login</button>
                                </Link>

                                <Link to="/contact-us" className="d-inline-block ms-2">
                                    <button type="button" className="btn btn-light" style={{ border: 'none', background: 'transparent', color: '#000' }}>Contact Us</button>
                                </Link>
                                <Link to="/about-us" className="d-inline-block ms-2">
                                    <button type="button" className="btn btn-light" style={{ border: 'none', background: 'transparent', color: '#000' }}>About Us</button>
                                </Link>
                            </>
                        ) : null}

                </div>
            </div>
        </nav>
    );
};
