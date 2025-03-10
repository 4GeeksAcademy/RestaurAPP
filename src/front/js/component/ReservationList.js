import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const ReservationList = () => {
    const { store, actions } = useContext(Context); // Acceso al estado global y acciones
    const navigate = useNavigate(); // Para manejar la navegación entre páginas

    // Llamada a la acción para obtener las reservas cuando el componente se monta
    useEffect(() => {
        actions.getAllReservations(); // Llama a la acción en flux.js
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center">Reservations List</h1>
            <button
                type="button"
                className="btn btn-primary mb-3"
                onClick={() => navigate("/reservations/new")} // Botón para crear una nueva reserva
            >
                ➕ Create New Reservation
            </button>

            {/* Renderizado condicional */}
            {store.reservations.length === 0 ? (
                <p className="text-center text-danger">No reservations available</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Restaurant</th>
                            <th>Diner</th>
                            <th>Date</th>
                            <th>Hour</th>
                            <th>People</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.reservations.map((reservation) => (
                            <tr key={reservation.id}>
                                <td>{reservation.restaurant_id}</td>
                                <td>{reservation.diner_id}</td>
                                <td>{reservation.date}</td>
                                <td>{reservation.hour}</td>
                                <td>{reservation.people}</td>
                                <td>
                                    <button
                                        onClick={() => navigate(`/reservations/${reservation.id}`)}
                                        className="btn btn-warning me-2"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm("Are you sure you want to delete this reservation?")) {
                                                actions.deleteReservation(reservation.id);
                                            }
                                        }}
                                        className="btn btn-danger"
                                    >
                                        🗑️ Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ReservationList;
