import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate } from "react-router-dom";
import OwnerReservations from "../component/ownerReservations";

const OwnerDashboard = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [ownerName, setOwnerName] = useState(localStorage.getItem("ownerName") || "Dueño");
    const [activeTab, setActiveTab] = useState("restaurants");  // default "restaurants"

    useEffect(() => {
        if (store.ownerName) {
            setOwnerName(store.ownerName);
            localStorage.setItem("ownerName", store.ownerName);
        }
        actions.getRestaurantsForLoggedInOwner();
        actions.getSpecificOwner(store.ownerId); //detalles del owner
    }, [store.ownerName, store.ownerId]);

    const handleLogout = () => {
        actions.ownerLogout();
        localStorage.clear();
        navigate("/");
    };

    // Elimina restaurante
    const handleDeleteRestaurant = (restaurantId) => {
        actions.deleteRestaurant(restaurantId);
    };

    // Modifica restaurante
    const handleModifyRestaurant = (restaurantId) => {
        navigate(`/create_restaurant/${restaurantId}`);
    };

    const handleViewMore = (restaurantId) => {
        navigate(`/restaurants/${restaurantId}`);
    };

    // Edita perfil
    const handleEditProfile = () => {
        navigate(`/owners/${store.ownerId}`);
    };

    // Elimina perfil
    const handleDeleteProfile = () => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar tu cuenta?");

        if (confirmDelete) {
            actions.deleteOwner(store.specificOwner.id);
            actions.ownerLogout();
            navigate("/"); 
        }
    };

    return (
        <>
            {store.auth === true || localStorage.getItem("token") ? (
                <>
                    <div className="container mt-4">
                        {/* Tabs */}
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <a
                                    className={`nav-link ${activeTab === "restaurants" ? "active" : ""}`}
                                    id="restaurants-tab"
                                    data-bs-toggle="tab"
                                    href="#restaurants"
                                    role="tab"
                                    onClick={() => setActiveTab("restaurants")}
                                >
                                    Restaurantes
                                </a>
                            </li>
                            <li className="nav-item" role="presentation">
                                <a
                                    className={`nav-link ${activeTab === "reservations" ? "active" : ""}`}
                                    id="reservations-tab"
                                    data-bs-toggle="tab"
                                    href="#reservations"
                                    role="tab"
                                    onClick={() => setActiveTab("reservations")}
                                >
                                    Reservas
                                </a>
                            </li>
                            <li className="nav-item" role="presentation">
                                <a
                                    className={`nav-link ${activeTab === "details" ? "active" : ""}`}
                                    id="details-tab"
                                    data-bs-toggle="tab"
                                    href="#details"
                                    role="tab"
                                    onClick={() => setActiveTab("details")}
                                >
                                    Detalles
                                </a>
                            </li>
                        </ul>
                        <div className="tab-content mt-4" id="myTabContent">
                            {/* Tab Restaurants */}
                            <div
                                className={`tab-pane fade ${activeTab === "restaurants" ? "show active" : ""}`}
                                id="restaurants"
                                role="tabpanel"
                                aria-labelledby="restaurants-tab"
                            >
                                <div className="d-flex justify-content-between align-items-center mb-5">
                                    <h2>Tus Restaurantes</h2>
                                    <button type="button" className="btn btn-light border-0" onClick={() => navigate("/create_restaurant")}>
                                        Crear nuevo restaurante
                                    </button>
                                </div>

                                {store.restaurants && store.restaurants.length > 0 ? (
                                    <div className="row">
                                        {store.restaurants.map((restaurant) => (
                                            <div key={restaurant.id} className="col-md-4 mb-4">
                                                <div className="card shadow-lg rounded-4" style={{ overflow: 'hidden', transition: 'transform 0.3s ease' }}>
                                                    <img
                                                        src={restaurant.image_url || "https://media.istockphoto.com/id/1428412216/es/foto/un-chef-masculino-vertiendo-salsa-en-la-comida.jpg?s=612x612&w=0&k=20&c=Wze2YwgkFMQOTWoxdiRYsUpa1azCIOm8yRaUEEYOgOU="}
                                                        className="card-img-top"
                                                        alt={restaurant.name}
                                                        style={{
                                                            height: "200px", 
                                                            objectFit: "cover", 
                                                            transition: 'transform 0.3s ease'
                                                        }}
                                                    />
                                                    <div className="card-body" style={{ padding: '20px' }}>
                                                        <h5 className="card-title" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{restaurant.name}</h5>
                                                        <p className="card-text" style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                                                            <strong>Ubicación:</strong> {restaurant.location}
                                                        </p>
                                                        <p className="card-text" style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                                                            <strong>Capacidad:</strong> {restaurant.capacity}
                                                        </p>
                                                        <p className="card-text" style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                                                            <strong>Teléfono:</strong> {restaurant.telephone}
                                                        </p>

                                                        <div className="d-flex justify-content-between">
                                                            <div className="d-flex">
                                                                <button
                                                                    className="btn btn-outline-primary rounded-3 p-2 mx-1"
                                                                    onClick={() => handleModifyRestaurant(restaurant.id)}
                                                                    style={{ transition: 'background-color 0.3s ease' }}
                                                                >
                                                                    ✏️
                                                                </button>
                                                                <button
                                                                    className="btn btn-outline-danger rounded-3 p-2 mx-1"
                                                                    onClick={() => handleDeleteRestaurant(restaurant.id)}
                                                                    style={{ transition: 'background-color 0.3s ease' }}
                                                                >
                                                                    🗑️
                                                                </button>
                                                            </div>
                                                            <button
                                                                className="btn btn-outline-info rounded-3 p-2 mx-1"
                                                                onClick={() => handleViewMore(restaurant.id)}
                                                                style={{ transition: 'background-color 0.3s ease' }}
                                                            >
                                                                🔎
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No tienes restaurantes disponibles.</p>
                                )}
                            </div>

                            {/* Tab Reservations */}
                            <div
                                className={`tab-pane fade ${activeTab === "reservations" ? "show active" : ""}`}
                                id="reservations"
                                role="tabpanel"
                                aria-labelledby="reservations-tab"
                            >
                                <h2>Tus reservas</h2>
                                <OwnerReservations />
                            </div>

                            {/* Tab Details */}
                            <div
                                className={`tab-pane fade ${activeTab === "details" ? "show active" : ""}`}
                                id="details"
                                role="tabpanel"
                                aria-labelledby="details-tab"
                            >
                                <h2>Detalles del perfil</h2>
                                {store.specificOwner ? (
                                    <div>
                                        <p><strong>Nombre:</strong> {store.specificOwner.name}</p>
                                        <p><strong>Email:</strong> {store.specificOwner.email}</p>
                                        <p><strong>Teléfono:</strong> {store.specificOwner.telephone}</p>
                                        <p><strong>Ubicación:</strong> {store.specificOwner.location}</p>

                                        <div className="d-flex justify-content-end">
                                            <button className="btn border bg-light me-2" onClick={handleEditProfile}>✏️</button>
                                            <button className="btn border bg-light" onClick={handleDeleteProfile}>🗑️</button>
                                        </div>
                                    </div>
                                ) : (
                                    <p>No hay detalles disponibles.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="container mt-5 d-flex justify-content-between">
                        <button type="button" className="btn btn-danger" onClick={handleLogout}>Cerrar sesión</button>
                        <button type="button" className="btn btn-primary" onClick={() => navigate("/")}>
                            Home page
                        </button>
                    </div>
                </>
            ) : (
                <Navigate to="/" />
            )}
        </>
    );
};

export default OwnerDashboard;
