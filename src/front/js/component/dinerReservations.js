import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";


export const DinerReservations = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();



    useEffect(() => {
        if (localStorage.getItem("tokenDiner")) {
            actions.getDinerReserves();
            console.log("cargado el componente")
        }
    }, []);

    const handleDeleteReservation = (reservationId) => {
        console.log("Cancelar reserva con id: ", reservationId);
    };

    return (
        <>
            <div className="container mt-5">
                <h1 className="text-center mb-4">Tienes {store.dinerReservations.length} Reservas!</h1>
                {store.dinerReservations.length > 0 ? (
                    <div className="row">
                        {store.dinerReservations.map((item, index) => (
                            <div className="col-12 col-md-6 col-lg-4 mb-4" key={index}>
                                <div className="card shadow-sm">
                                    <img
                                        src={item.restaurant.image_url}
                                        className="card-img-top"
                                        alt={item.restaurant ? item.restaurant.name : "Imagen del restaurante"}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{item.restaurant ? item.restaurant.name : 'Restaurante no disponible'}</h5>
                                        <p className="card-text">
                                            <strong>Fecha:</strong> {item.date}
                                        </p>
                                        <p className="card-text">
                                            <strong>Hora:</strong> {item.hour}
                                        </p>
                                        <p className="card-text">
                                            <strong>Personas:</strong> {item.people}
                                        </p>
                                        <button
                                            className="btn btn-danger w-100"
                                            onClick={() => handleDeleteReservation(item.id)}
                                        >
                                            Cancelar Reserva
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="alert alert-warning text-center" role="alert">
                        No tienes reservas.
                    </div>
                )}
            </div>
            <div className="mt-5 d-flex justify-content-between">
                <button type="button" className="btn btn-secondary" onClick={() => navigate("/diner/dashboard")}>
                    Volver
                </button>
            </div>
        </>
    );
};