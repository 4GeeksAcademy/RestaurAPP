import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../store/appContext";

const ReservationList = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const { restaurant_id } = useParams(); // Tomar el id del restaurante desde la URL
    const [selectedReservations, setSelectedReservations] = useState([]); // Selección múltiple
    const [error, setError] = useState(""); // Manejo de errores locales
    const [loading, setLoading] = useState(true); // Estado para la carga

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                setLoading(true);
                setError("");
                // Llama al action para obtener las reservas del restaurante
                await actions.getRestaurantReservations(restaurant_id);
            } catch (err) {
                console.error("Error al cargar reservas:", err);
                setError("No se pudieron cargar las reservas. Por favor, intenta nuevamente.");
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [restaurant_id]);

    // Seleccionar/deseleccionar reservas
    const handleSelectReservation = (reservation_id) => {
        if (selectedReservations.includes(reservation_id)) {
            setSelectedReservations(selectedReservations.filter((id) => id !== reservation_id));
        } else {
            setSelectedReservations([...selectedReservations, reservation_id]);
        }
    };

    // Aceptar reservas seleccionadas
    const handleAcceptReservations = async () => {
        if (window.confirm(`¿Aceptar las ${selectedReservations.length} reservas seleccionadas?`)) {
            try {
                await Promise.all(
                    selectedReservations.map((reservation_id) =>
                        actions.manageReservation(reservation_id, { state: "Accepted" })
                    )
                );
                setSelectedReservations([]); // Limpia la selección tras aceptar
            } catch (err) {
                console.error("Error al aceptar reservas:", err);
                setError("Hubo un error al aceptar las reservas. Intenta nuevamente.");
            }
        }
    };

    // Eliminar una reserva
    const handleDelete = async (reservation_id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta reserva?")) {
            try {
                await actions.deleteReservation(reservation_id);
                // Actualizar el estado local eliminando la reserva
                actions.getRestaurantReservations(restaurant_id); // Refresca las reservas
            } catch (err) {
                console.error("Error al eliminar reserva:", err);
                setError("Hubo un error al eliminar la reserva.");
            }
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">Lista de Reservas</h1>

            {/* Botón para crear nueva reserva */}
            <button
                type="button"
                className="btn btn-primary mb-3"
                onClick={() => navigate(`/reservations/new/${restaurant_id}`)}
            >
                ➕ Crear Nueva Reserva
            </button>

            {/* Manejo de errores y carga */}
            {loading ? (
                <p className="text-center">Cargando reservas...</p>
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : store.reservations.length === 0 ? (
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
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() =>
                                                navigate(`/reservations/${reservation.id}/edit`)
                                            }
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(reservation.id)}
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Botón para aceptar múltiples reservas */}
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
