import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../store/appContext";

const ReservationList = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const { restaurant_id } = useParams();

    const [selectedReservations, setSelectedReservations] = useState([]); // Estado para reservas seleccionadas

    useEffect(() => {
        actions.getRestaurantReservations(restaurant_id);
    }, [restaurant_id]);

    const handleSelectReservation = (reservation_id) => {
        if (selectedReservations.includes(reservation_id)) {
            setSelectedReservations(selectedReservations.filter(id => id !== reservation_id));
        } else {
            setSelectedReservations([...selectedReservations, reservation_id]);
        }
    };

    const handleAcceptReservations = () => {
        selectedReservations.forEach(reservation_id => {
            actions.manageReservation(reservation_id, { state: "Accepted" });
        });
        setSelectedReservations([]); // Limpiar las reservas seleccionadas
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">Lista de Reservas</h1>
            <button
                type="button"
                className="btn btn-primary mb-3"
                onClick={() => navigate(`/reservations/new/${restaurant_id}`)}
            >
                ➕ Crear Nueva Reserva
            </button>

            {store.reservations.length === 0 ? (
                <p className="text-center text-danger">No hay reservas disponibles</p>
            ) : (
                <form>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Seleccionar</th>
                                <th>Comensal</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Personas</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store.reservations.map((reservation) => (
                                <tr key={reservation.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedReservations.includes(reservation.id)}
                                            onChange={() => handleSelectReservation(reservation.id)}
                                        />
                                    </td>
                                    <td>{reservation.diner_fullname}</td>
                                    <td>{reservation.date}</td>
                                    <td>{reservation.hour}</td>
                                    <td>{reservation.people}</td>
                                    <td>
                                        <button
                                            onClick={() => {
                                                if (window.confirm("¿Estás seguro de que deseas eliminar esta reserva?")) {
                                                    actions.deleteReservation(reservation.id);
                                                }
                                            }}
                                            className="btn btn-danger"
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={handleAcceptReservations}
                        disabled={selectedReservations.length === 0}
                    >
                        ✔️ Aceptar Seleccionadas
                    </button>
                </form>
            )}
        </div>
    );
};

export default ReservationList;
