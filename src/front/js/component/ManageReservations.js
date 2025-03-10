import React, { useEffect, useState } from "react";

const ManageReservations = () => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            const response = await fetch("/api/reservations");
            const data = await response.json();
            setReservations(data.reservations.filter(r => r.state === "Pending"));
        };

        fetchReservations();
    }, []);

    const handleDecision = async (reservationId, decision) => {
        try {
            const response = await fetch(`/api/reservations/manage/${reservationId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ state: decision }),
            });

            if (!response.ok) {
                console.error("Error al gestionar reserva");
                return;
            }

            setReservations(reservations.filter(r => r.id !== reservationId));
        } catch (error) {
            console.error("Error en la decisión:", error);
        }
    };

    return (
        <div>
            <h1>Gestionar Reservas</h1>
            <ul>
                {reservations.map(reservation => (
                    <li key={reservation.id}>
                        Reserva de {reservation.people} personas para {reservation.date} a las {reservation.hour}.
                        <button onClick={() => handleDecision(reservation.id, "Accepted")}>
                            Aceptar
                        </button>
                        <button onClick={() => handleDecision(reservation.id, "Rejected")}>
                            Rechazar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageReservations;
