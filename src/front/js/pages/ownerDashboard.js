import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate } from "react-router-dom";

const OwnerDashboard = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [ownerName, setOwnerName] = useState(localStorage.getItem("ownerName") || "Dueño");

    useEffect(() => {
        if (store.ownerName) {
            setOwnerName(store.ownerName);
            localStorage.setItem("ownerName", store.ownerName);
        }
        actions.getRestaurantsForLoggedInOwner();
    }, [store.ownerName]);

    const handleDeleteRestaurant = (restaurantId) => {
        actions.deleteRestaurant(restaurantId);
    };

    const handleModifyRestaurant = (restaurantId) => {
        navigate(`/create_restaurant/${restaurantId}`);
    };

    const handleViewMore = (restaurantId) => {
        navigate(`/restaurants/${restaurantId}`);
    };

    return (
        <>
            {store.auth === true || localStorage.getItem("token") ? (
                <div className="container mt-4">
                    {/* Saluto all'utente */}
                    <div className="mb-4">
                        <h1>Hola, {ownerName}!</h1>
                        <p>Bienvenido a tu dashboard. Aquí puedes gestionar tus restaurantes y sus reservas.</p>
                    </div>

                    {/* Sezione per i ristoranti */}
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
            ) : (
                <Navigate to="/" />
            )}
        </>
    );
};

export default OwnerDashboard;
