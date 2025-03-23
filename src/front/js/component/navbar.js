// import React, { useContext, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Context } from "../store/appContext";
// import LogoRestaurAPP from "../../img/LogoRestaurAPP.png";
// import { useNavigate } from "react-router-dom";

// export const Navbar = () => {
//     const { store, actions } = useContext(Context);
//     const location = useLocation(); // Obtener la ruta actual
//     const token = localStorage.getItem("token");
//        const navigate = useNavigate();

//     useEffect(() => {
//         console.log("Store auth è cambiato:", store.auth);
//     }, [store.auth]);

//     const handleLogout = () => {
//         actions.ownerLogout();
//         localStorage.clear();
//         navigate("/");
//     };

//     return (
//         <nav className="navbar navbar-light bg-light">
//             <div className="container">
//                 <Link to="/">
//                     <img
//                         src={LogoRestaurAPP}
//                         alt="Logo"
//                         className="navbar-brand mb-0 h1"
//                         style={{ cursor: 'pointer', width: '90px', height: 'auto', borderRadius: '8px' }}
//                     />
//                 </Link>
//                 <div className="ml-auto">
//                     {/* Botones siempre visibles: "Buscar Restaurantes", "Owner Signup", "Owner Login", "Diner Login", "Diner Sign up" */}
//                     <Link to="/restaurants-search">
//                         <button type="button" className="btn btn-light">Buscar Restaurantes</button>
//                     </Link>
//                     <Link to="/owners/new">
//                         <button type="button" className="btn btn-light">Owner Signup</button>
//                     </Link>
//                     <Link to="/owners/login">
//                         <button type="button" className="btn btn-light">Owner Login</button>
//                     </Link>
//                     <Link to="/diner/login">
//                         <button type="button" className="btn btn-light">Diner Login</button>
//                     </Link>
//                     <Link to="/dinerform">
//                         <button type="button" className="btn btn-light mx-1">Diner Sign up</button>
//                     </Link>

//                     {/* Si el usuario está autenticado como owner, mostrar estos botones sin "Buscar Restaurantes" */}
//                     {token ? (
//                         <>

//                             <Link to="/owners/dashboard">
//                                 <button className="btn btn-light">Owner Dashboard</button>
//                             </Link>
//                             {/* <Link to="/my-restaurants">
//                                 <button className="btn btn-success">Mis Restaurantes</button>
//                             </Link> */}
//                             <div class="dropdown">
//                                 <button class="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
//                                     Mi Perfil
//                                 </button>
//                                 <ul class="dropdown-menu">
//                                     <li>
//                                         <Link to="/owners/myReservations">
//                                         <button className="btn btn-light" style={{ backgroundColor: 'transparent', border: 'none', color: '#000' }} >Mis Reservas</button>
//                                         </Link>
//                                     </li>
//                                     <li>
//                                         <Link to="/owners/profile">
//                                             <button className="btn btn-light" style={{ backgroundColor: 'transparent', border: 'none', color: '#000' }}>Mi Cuenta</button>
//                                         </Link>
//                                     </li>
//                                     <li>
//                                     <button className="btn btn-light" style={{ backgroundColor: 'transparent', border: 'none', color: '#000' }} onClick={handleLogout} >Log Out</button>
//                                     </li>
//                                 </ul>
//                             </div>
//                         </>
//                     ) : null}


//                     {/* Si el usuario está autenticado como diner, mostrar el botón de "Diner list" */}
//                     {store.dinerauth ? (
//                         <>
//                             <Link to="/dinerlist">
//                                 <button className="btn btn-primary">Diner list</button>
//                             </Link>
//                         </>
//                     ) : null}

//                     {/* Botón "About Us" siempre visible */}
//                     <Link to="/about-us">
//                         <button type="button" className="btn btn-light">About Us</button>
//                     </Link>

//                     {/* Los botones de administración y categorías solo se muestran en la página "/categories" */}
//                     {location.pathname === "/categories" && (
//                         <>
//                             <Link to="/add-restaurant">
//                                 <button className="btn btn-secondary">Añadir Restaurante</button>
//                             </Link>
//                             <Link to="/restaurant_categories">
//                                 <button className="btn btn-light">Restaurant-categories List</button>
//                             </Link>
//                             <Link to="/restaurant_categories/new">
//                                 <button className="btn btn-light">Add Restaurant-categories</button>
//                             </Link>
//                             <Link to="/owners">
//                                 <button className="btn btn-light">Owners List</button>
//                             </Link>
//                             <Link to="/owners/dashboard">
//                                 <button className="btn btn-light">Owner Dashboard</button>
//                             </Link>
//                             <Link to="/categories">
//                                 <button className="btn btn-light">Categories List</button>
//                             </Link>
//                             <Link to="/categories/new">
//                                 <button className="btn btn-light">Add Categories</button>
//                             </Link>
//                             <Link to="/my-restaurants">
//                                 <button className="btn btn-success">Mis Restaurantes</button>
//                             </Link>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </nav>
//     );
// };


// import React, { useContext, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Context } from "../store/appContext";
// import LogoRestaurAPP from "../../img/LogoRestaurAPP.png";
// import { useNavigate } from "react-router-dom";

// export const Navbar = () => {
//     const { store, actions } = useContext(Context);
//     const location = useLocation(); // Obtener la ruta actual
//     const token = localStorage.getItem("token");
//     const navigate = useNavigate();

//     useEffect(() => {
//         console.log("Store auth è cambiato:", store.auth);
//     }, [store.auth]);

//     const handleLogout = () => {
//         actions.ownerLogout();
//         localStorage.clear();
//         navigate("/");
//     };

//     return (
//         <nav className="navbar navbar-light bg-light">
//             <div className="container">
//                 <Link to="/">
//                     <img
//                         src={LogoRestaurAPP}
//                         alt="Logo"
//                         className="navbar-brand mb-0 h1"
//                         style={{ cursor: 'pointer', width: '90px', height: 'auto', borderRadius: '8px' }}
//                     />
//                 </Link>
//                 <div className="ml-auto">
//                     {/* Bottoni sempre visibili: "Buscar Restaurantes", "About Us" */}
//                     <Link to="/restaurants-search">
//                         <button type="button" className="btn btn-light">Buscar Restaurantes</button>
//                     </Link>
//                     <Link to="/about-us">
//                         <button type="button" className="btn btn-light">About Us</button>
//                     </Link>

   
//                     {token ? (
//                         <>
//                             <div className="dropdown">
//                                 <button className="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
//                                     Mi Perfil
//                                 </button>
//                                 <ul className="dropdown-menu">
//                                     <li>
//                                     <li>
//                                         <Link to="/owners/dashboard">
//                                             <button className="btn btn-light" style={{ backgroundColor: 'transparent', border: 'none', color: '#000' }}>Mis Restaurantes</button>
//                                         </Link>
//                                     </li>
//                                         <Link to="/owners/myReservations">
//                                             <button className="btn btn-light" style={{ backgroundColor: 'transparent', border: 'none', color: '#000' }}>Mis Reservas</button>
//                                         </Link>
//                                     </li>
//                                     <li>
//                                         <Link to="/owners/profile">
//                                             <button className="btn btn-light" style={{ backgroundColor: 'transparent', border: 'none', color: '#000' }}>Mi Cuenta</button>
//                                         </Link>
//                                     </li>
//                                     <li>
//                                         <button className="btn btn-light" style={{ backgroundColor: 'transparent', border: 'none', color: '#000' }} onClick={handleLogout}>Log Out</button>
//                                     </li>
//                                 </ul>
//                             </div>
//                         </>
//                     ) : null}

//                     {store.dinerauth ? (
//                         <>
//                             <Link to="/dinerlist">
//                                 <button className="btn btn-primary">Diner list</button>
//                             </Link>
//                         </>
//                     ) : null}

//                     {!token && !store.dinerauth ? (
//                         <>
//                             <Link to="/owners/new">
//                                 <button type="button" className="btn btn-light">Owner Signup</button>
//                             </Link>
//                             <Link to="/owners/login">
//                                 <button type="button" className="btn btn-light">Owner Login</button>
//                             </Link>
//                             <Link to="/diner/login">
//                                 <button type="button" className="btn btn-light">Diner Login</button>
//                             </Link>
//                             <Link to="/dinerform">
//                                 <button type="button" className="btn btn-light mx-1">Diner Sign up</button>
//                             </Link>
//                         </>
//                     ) : null}

//                     {/* I bottoni di amministrazione e categorie si vedono solo in "/categories" */}
//                     {location.pathname === "/categories" && (
//                         <>
//                             <Link to="/add-restaurant">
//                                 <button className="btn btn-secondary">Añadir Restaurante</button>
//                             </Link>
//                             <Link to="/restaurant_categories">
//                                 <button className="btn btn-light">Restaurant-categories List</button>
//                             </Link>
//                             <Link to="/restaurant_categories/new">
//                                 <button className="btn btn-light">Add Restaurant-categories</button>
//                             </Link>
//                             <Link to="/owners">
//                                 <button className="btn btn-light">Owners List</button>
//                             </Link>
//                             <Link to="/owners/dashboard">
//                                 <button className="btn btn-light">Owner Dashboard</button>
//                             </Link>
//                             <Link to="/categories">
//                                 <button className="btn btn-light">Categories List</button>
//                             </Link>
//                             <Link to="/categories/new">
//                                 <button className="btn btn-light">Add Categories</button>
//                             </Link>
//                             <Link to="/my-restaurants">
//                                 <button className="btn btn-success">Mis Restaurantes</button>
//                             </Link>
//                         </>

import React, { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Context } from "../store/appContext";
import LogoRestaurAPP from "../../img/LogoRestaurAPP.png";
import logo2 from "../../img/logo2.jpeg";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
    const { store, actions } = useContext(Context);
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

    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <Link to="/">
                    <img
                        src={logo2}
                        alt="Logo"
                        className="navbar-brand mb-0 h1"
                        style={{ cursor: 'pointer', width: '60px', height: 'auto', borderRadius: '8px' }}
                    />
                </Link>
                <div className="ml-auto d-flex align-items-center">
                    {/* Se l'owner è autenticato */}
                    {token && store.auth && !store.dinerauth ? (
                        <>
                            <div className="dropdown d-inline-block ms-2">
                                <button className="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
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
                                <button type="button" className="btn btn-light">Contact Us</button>
                            </Link>
                            <Link to="/about-us" className="d-inline-block ms-2">
                                <button type="button" className="btn btn-light">About Us</button>
                            </Link>
                        </>
                    ) : null}

                    {/* Se il diner è autenticato */}
                    {store.dinerauth ? (
                        <>
                            <Link to="/restaurants-search" className="d-inline-block ms-2">
                                <button type="button" className="btn btn-light">Buscar Restaurantes</button>
                            </Link>

                            <Link to="/contact-us" className="d-inline-block ms-2">
                                <button type="button" className="btn btn-light">Contact Us</button>
                            </Link>
                            <Link to="/about-us" className="d-inline-block ms-2">
                                <button type="button" className="btn btn-light">About Us</button>
                            </Link>
                        </>
                    ) : null}

                    {/* Se nessuno è autenticato */}
                    {!token && !store.dinerauth ? (
                        <>
                            <Link to="/restaurants-search" className="d-inline-block ms-2">
                                <button type="button" className="btn btn-light">Buscar Restaurantes</button>
                            </Link>
                            <Link to="/owners/new" className="d-inline-block ms-2">
                                <button type="button" className="btn btn-light">Owner Signup</button>
                            </Link>
                            <Link to="/owners/login" className="d-inline-block ms-2">
                                <button type="button" className="btn btn-light">Owner Login</button>
                            </Link>
                            <Link to="/dinerform" className="d-inline-block ms-2">
                                <button type="button" className="btn btn-light">Diner Sign up</button>
                            </Link>
                            <Link to="/diner/login" className="d-inline-block ms-2">
                                <button type="button" className="btn btn-light">Diner Login</button>
                            </Link>

                            <Link to="/contact-us" className="d-inline-block ms-2">
                                <button type="button" className="btn btn-light">Contact Us</button>
                            </Link>
                            <Link to="/about-us" className="d-inline-block ms-2">
                                <button type="button" className="btn btn-light">About Us</button>
                            </Link>
                        </>
                    ) : null}
                </div>
            </div>
        </nav>
    );
};





