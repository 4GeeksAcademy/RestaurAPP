import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Navigate, Link } from "react-router-dom";
import restaurappImageUrl from "../../img/imagenRestaurapp.jpg";

export const DinerDashboard = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [dinerFullName, setDinerFullName] = useState(store.fullname || 'fullname');
    const [activeTab, setActiveTab] = useState("restaurantes");  

    useEffect(() => {
        if (store.dinerFullName) {
            setDinerFullName(store.dinerFullName);
        } else {
            const storedName = localStorage.getItem('dinerFullName');
            setDinerFullName(storedName || 'Diner');
        }
    }, [store.dinerFullName]);

    useEffect(() => {
        if (store.dinerauth) {
            actions.getDinerReserves();
        }
    }, [store.dinerauth, actions]);

    useEffect(() => {
        console.log(store.dinerauth)
        console.log(store.dinerauth)
        if (!store.restaurants || store.restaurants.length === 0) {
            actions.getAllRestaurants();
        }
    }, []);

    const handleLogout = () => {
        actions.dinerLogout(); 
        localStorage.removeItem("dinerFullName");
        setDinerFullName("Diner");
        navigate("/diner/login");
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleDeleteReservation = (reservation_id) => {
        actions.DinerDeleteReservation(reservation_id);
    }

    return (
        <>
            {store.dinerauth === true  || localStorage.getItem("tokenDiner") ? (
                <>
                    <div className="container mt-4">
                        <h1>Bienvenido {dinerFullName}!</h1>
                    </div>

                    <ul className="nav nav-tabs justify-content-center">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'restaurantes' ? 'active' : ''}`}
                                aria-current="page"
                                onClick={() => handleTabClick("restaurantes")}
                            >
                                Restaurantes
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'reservas' ? 'active' : ''}`}
                                onClick={() => handleTabClick("reservas")}
                            >
                                Mis Reservas
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'cuenta' ? 'active' : ''}`}
                                onClick={() => handleTabClick("cuenta")}
                            >
                                Cuenta
                            </button>
                        </li>
                    </ul>

                    {activeTab === "restaurantes" && (
                        <div className="row mt-4 mx-2">
                            {store.restaurants && store.restaurants.length > 0 ? (
                                store.restaurants.map((restaurant, index) => (
                                    <div className="col-12 col-sm-6 col-md-3 mb-4" key={index}>
                                        <div className="card" style={{ width: '18rem' }}>
                                            <img
                                                src={restaurappImageUrl}
                                                className="card-img-top"
                                                alt="Card image"
                                            />
                                            <div className="card-body">
                                                <h5 className="card-title">{restaurant.name}</h5>
                                                <p className="card-text">{restaurant.location}</p>
                                            </div>
                                            <ul className="list-group list-group-flush">
                                                <li className="list-group-item">Capacidad: {restaurant.capacity}</li>
                                                <li className="list-group-item">Ubicación: {restaurant.location}</li>
                                            </ul>
                                            <div className="card-body">
                                                <Link to={`/perfil_restaurant/${restaurant.id}`} className="card-link">Hacer Reservación</Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No restaurants available.</p>
                            )}
                        </div>
                    )}

                    {activeTab === "reservas" && (
                        <div className="container mt-4">
                            <h1>Tienes {store.dinerReservations.length} Reservas!</h1>
                            <ul className="list-group list-group-horizontal text-center">
                                {store.dinerReservations.length > 0 ? (
                                    store.dinerReservations.map((item, index) => (
                                        <li className="list-group-item" key={index}>
                                            {item.restaurant ? <strong>{item.restaurant.name}</strong> : 'Restaurante no disponible'}
                                            <div className="list-group-item">Fecha: {item.date}</div>
                                            <div className="list-group-item">Hora: {item.hour}</div>
                                            <div className="list-group-item">Para {item.people} Personas</div>
                                            <button
                                                className="btn btn-danger mt-2"
                                                onClick={(reservation_id) => handleDeleteReservation(item.id)}
                                            >
                                                Eliminar Reserva
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <li className="list-group-item">No tienes reservas.</li>
                                )}
                            </ul>
                        </div>
                    )}

                    {activeTab === "cuenta" && (
                        <div className="container mt-4">
                            <h2>Mi Cuenta</h2>
                            <p>Hola {dinerFullName}!</p>
                        </div>
                    )}

                    <div className="container mt-5 d-flex justify-content-between">
                        <button type="button" className="btn btn-danger" onClick={() => handleLogout()}>
                            Log Out
                        </button>
                        <button type="button" className="btn btn-primary" onClick={() => navigate("/")}>
                            Go back to Home
                        </button>
                    </div>
                </>
            ) : (
                <Navigate to="/" />
            )}
        </>
    );
};
