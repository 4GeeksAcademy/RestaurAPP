import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate } from "react-router-dom";
import "../../styles/moreButtons.css";

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
          
                    <div className="mb-4">
                        <h1>Hola, {ownerName}!</h1>
                        <p>Bienvenido a tu dashboard. Aquí puedes gestionar tus restaurantes y sus reservas.</p>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <h2>Tus Restaurantes</h2>
                        <button type="button" className="button-52" onClick={() => navigate("/create_restaurant")}>
                            Crear nuevo restaurante
                        </button>
                    </div>

                    {store.restaurants && store.restaurants.length > 0 ? (
                        <div className="row g-4">
                            {store.restaurants.map((restaurant) => (
                                <div key={restaurant.id} className="col-sm-6 col-xl-3 d-flex">
                                    <div className="card card-img-scale overflow-hidden bg-transparent d-flex flex-column" style={{ height: '100%' }}>
                                        <div className="card-img-scale-wrapper rounded-3" style={{ flex: '1 0 auto' }}>
                                            <img
                                                src={restaurant.image_url || "https://media.istockphoto.com/id/1428412216/es/foto/un-chef-masculino-vertiendo-salsa-en-la-comida.jpg?s=612x612&w=0&k=20&c=Wze2YwgkFMQOTWoxdiRYsUpa1azCIOm8yRaUEEYOgOU="}
                                                className="card-img hover-effect"
                                                alt={restaurant.name}
                                                style={{ objectFit: 'cover', height: '200px', width: '100%' }}
                                            />
                                        </div>

                            
                                        <div className="card-body px-2 d-flex flex-column" style={{ flex: '1 0 auto' }}>
                                      
                                            <h5 className="card-title" style={{ cursor: "pointer" }} onClick={() => handleViewMore(restaurant.id)}>
                                                {restaurant.name}
                                            </h5>

                                            <p className="card-text text-muted" style={{ fontSize: "0.9rem" }}>
                                                <i className="bi bi-geo-alt me-2"></i>
                                                {restaurant.location}
                                            </p>

                                       
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h6 className="text-success mb-0">
                                                    <small className="fw-light">Capacidad {restaurant.capacity} Personas</small>
                                                </h6>
                                                <h6 className="mb-0">
                                                    {restaurant.rating || "N/A"}
                                                    <i className="fa-solid fa-star text-warning ms-1"></i>
                                                </h6>
                                            </div>

                                  
                                            <div className="d-flex justify-content-end mt-3">
                                                <button
                                                    className="btn btn-outline-info rounded-3 p-2 mx-1"
                                                    onClick={() => handleViewMore(restaurant.id)}
                                                    style={{ transition: "background-color 0.3s ease" }}
                                                >
                                                    👁
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




