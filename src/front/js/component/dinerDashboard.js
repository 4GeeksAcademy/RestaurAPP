
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Navigate, Link } from "react-router-dom";
import restaurappImageUrl from "../../img/imagenRestaurapp.jpg";
import { Demo } from "../pages/demo";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../../styles/dinerDashboard.css"

export const DinerDashboard = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [dinerFullName, setDinerFullName] = useState(store.fullname || "fullname");
    const [email, setEmail] = useState(store.email || "email");
    const [telephone, setTelephone] = useState(store.telephone || "telephone");
    const [password, setPassword] = useState("");

    const [activeTab, setActiveTab] = useState("restaurantes");

    useEffect(() => {
        if (store.dinerFullName) {
            setDinerFullName(store.dinerFullName);
        } else {
            const storedName = localStorage.getItem("dinerFullName");
            setDinerFullName(storedName || "Diner");
        }
        if (store.email) setEmail(store.email);
        if (store.telephone) setTelephone(store.telephone);
    }, [store.dinerFullName, store.email, store.telephone]);

    useEffect(() => {
        if (!store.restaurants || store.restaurants.length === 0) {
            actions.getAllRestaurants();
        }
    }, [store.restaurants, actions]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>
            {store.dinerauth === true || localStorage.getItem("tokenDiner") ? (
        <>
            <div className="container mt-4">
                <h1 className="bienvenido">Bienvenido {dinerFullName}!</h1>
            </div>

            <ul className="nav nav-tabs justify-content-center">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "restaurantes" ? "active" : ""}`}
                        aria-current="page"
                        onClick={() => handleTabClick("restaurantes")}
                    >
                        Restaurantes
                    </button>
                </li>
            </ul>

            {activeTab === "restaurantes" && (
                <div className="container mt-4">
                    <div className="row g-4">
                        <h1 className="destacados hover-effect text-center w-100">Restaurantes Destacados</h1>
                        {store.restaurants && store.restaurants.length > 0 ? (
                            store.restaurants.map((restaurant, index) => (
                                <div className="col-sm-6 col-xl-3" key={index}>
                                    <div className="card card-img-scale overflow-hidden bg-transparent">
                                        <div className="card-img-wrapper rounded-3">
                                            <img
                                                src={restaurant.image_url || restaurappImageUrl}
                                                className="card-img hover-effect"
                                                alt="restaurant image"
                                                style={{ objectFit: 'cover', height: '200px', width: '100%' }}
                                            />
                                        </div>

                                        <div className="card-body px-2">
                                            <h5 className="card-title">
                                                <Link to={`/perfil_restaurant/${restaurant.id}`} className="stretched-link">
                                                    <a href="hotel-detail.html" className="stretched-link">{restaurant.name}</a>
                                                </Link>
                                            </h5>

                                            <div className="d-flex justify-content-between align-items-center">
                                                <h6 className="text-success mb-0">
                                                    <small className="fw-light">Capacidad {restaurant.capacity} Personas</small>
                                                    <h6 className="mb-0">
                                                    {restaurant.rating || "N/A"}
                                                    <i className="fa-solid fa-star text-warning ms-1"></i>
                                                </h6>
                                                </h6>

                                                <h6 className="mb-0 d-flex align-items-center ms-auto">
                                                    <i className="fas fa-map-marker-alt me-2"></i>
                                                    {restaurant.location}
                                                </h6>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Card END */}
                                </div>
                            ))
                        ) : (
                            <p>No restaurants available.</p>
                        )}
                    </div>
                </div>
            )}
            <Demo />
            <div className="container">
                <div className="col-md-4 mb-4">
                    <div className="card mb-4 rounded-3 shadow-sm hover-effect">
                        <div className="card-header py-3">
                            <h2 className="my-0 fw-normal">Gratis</h2>
                        </div>
                        <div className="card-body">
                            <h1 className="card-title pricing-card-title">$0<small className="text-body-secondary fw-light">/mo</small></h1>
                            <ul className="list-unstyled mt-3 mb-4">
                                <li>la primera gift card va por nuestra cuenta al utilizar nuestra app!</li>
                                <li>Puedes redimir tu tarjeta hasta en un año.</li>
                                <li>Redimelas en cualquier restaurante RestauraPP de España!</li>
                                <li>Sortearemos mensualmente gift cards entre nuestros usuarios!</li>
                            </ul>
                            <button 
                                type="button" onClick={() => navigate("/giftcard")} className="w-100 btn btn-lg btn-outline-secundary">Quiero mi Gift Card</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="fixed-top" style={{ zIndex: 1030 }}>
                <div className="container">
                    <div className="col-md-4 mb-4">
                        <div className="d-flex justify-content-start mt-3">
                            <button 
                                type="button" 
                                className="btn btn-primary" 
                                onClick={() => navigate("/")}
                                style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1050 }}>
                                Volver
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
            ) : (
                <Navigate to="/" />
            )}
        </>
    );
};
