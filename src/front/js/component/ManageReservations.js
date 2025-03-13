import React, { useEffect, useState } from "react";


const BASE_URL = process.env.REACT_APP_BASE_URL || "https://potential-telegram-9gw96rvrqwjfpvx6-3001.app.github.dev"; // Define la URL base del backend

const ManageReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch inicial de reservas pendientes
    useEffect(() => {
        const fetchReservations = async () => {
            setIsLoading(true);
            setError(""); // Reiniciar el error
            try {
                const response = await fetch(`${BASE_URL}/api/reservations/`);
                console.log("BASE_URL:", BASE_URL);

                if (!response.ok) {
                    throw new Error("Error al obtener reservas");
                }
                const data = await response.json();
                console.log("Datos recibidos AAAQQQUIII del backend:", data);
                // Filtrar por estado pendiente
                setReservations(data.filter(r => r.state === "Pending"));
            } catch (err) {
                console.error(err);
                setError("No se pudo cargar las reservas. Intenta de nuevo más tarde.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchReservations();
    }, []);

    // Manejar la decisión de aceptar o rechazar una reserva
    const handleDecision = async (reservationId, decision) => {
        try {
            const response = await fetch(`${BASE_URL}/reservations/manage/${reservationId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ state: decision }),
            });

            if (!response.ok) {
                throw new Error("Error al gestionar reserva");
            }

            // Remover la reserva gestionada de la lista
            setReservations(reservations.filter(r => r.id !== reservationId));
        } catch (err) {
            console.error(err);
            setError("No se pudo actualizar el estado de la reserva. Intenta nuevamente.");
        }
    };

    return (
        <div>
            <h1>Gestionar Reservas</h1>

            {/* Indicador de carga */}
            {isLoading && <p>Cargando reservas...</p>}

            {/* Mostrar mensajes de error */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Lista de reservas */}
            <ul>
                {reservations.map(reservation => (
                    <li key={reservation.id}>
                        <p>
                            Reserva de <strong>{reservation.people}</strong> personas para{" "}
                            <strong>{reservation.date}</strong> a las <strong>{reservation.hour}</strong>.
                        </p>
                        <button
                            onClick={() => handleDecision(reservation.id, "Accepted")}
                            style={{ marginRight: "10px", backgroundColor: "green", color: "white" }}
                        >
                            Aceptar
                        </button>
                        <button
                            onClick={() => handleDecision(reservation.id, "Rejected")}
                            style={{ backgroundColor: "red", color: "white" }}
                        >
                            Rechazar
                        </button>
                    </li>
                ))}
            </ul>

            {/* Mensaje si no hay reservas */}
            {!isLoading && reservations.length === 0 && !error && (
                <p>No hay reservas pendientes en este momento.</p>
            )}
        </div>
    );
};

export default ManageReservations;
