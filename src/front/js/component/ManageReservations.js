/*
import React, { useEffect, useState } from "react";



const BASE_URL = process.env.REACT_APP_BASE_URL || "https://potential-telegram-9gw96rvrqwjfpvx6-3001.app.github.dev"; // Define la URL base del backend

const ManageReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [acceptedReservations, setAcceptedReservations] = useState([]); // Estado para reservas aceptadas
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
    const handleDecision = async (reservationId, decision, updates = {}) => {
        try {
            if (decision === "Accepted") {
                // Realizar PUT al nuevo endpoint específico para aceptar
                const response = await fetch(`${BASE_URL}/api/reservations/accept/${reservationId}/`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updates), // Datos opcionales para modificar detalles
                });
    
                if (!response.ok) {
                    throw new Error("Error al aceptar la reserva");
                }
    
                const data = await response.json();
    
                // Actualizar el estado y posibles detalles modificados en la lista local
                setReservations(prev =>
                    prev.map(r =>
                        r.id === reservationId ? { ...r, ...updates, state: "Accepted" } : r
                    )
                );
            }
    
            if (decision === "Rejected") {
                // Usar DELETE para rechazar y eliminar la reserva
                const response = await fetch(`${BASE_URL}/api/reservations/${reservationId}`, {
                    method: "DELETE",
                });
    
                if (!response.ok) {
                    throw new Error("Error al eliminar la reserva");
                }
    
                // Eliminar la reserva de la lista local
                setReservations(reservations.filter(r => r.id !== reservationId));
            }
        } catch (err) {
            console.error(err);
            setError("No se pudo gestionar la reserva. Intenta nuevamente.");
        }
    };
    
    
    
    
    

    return (
        <div>
            <h1>Gestionar Reservas</h1>

            
            {isLoading && <p>Cargando reservas...</p>}

           
            {error && <p style={{ color: "red" }}>{error}</p>}

           
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
                            Modificar
                        </button>
                        <button
                            onClick={() => handleDecision(reservation.id, "Rejected")}
                            style={{ backgroundColor: "red", color: "white" }}
                        >
                            Eliminar
                        </button>
                    </li>
                ))}
            </ul>

            
            {!isLoading && reservations.length === 0 && !error && (
                <p>No hay reservas pendientes en este momento.</p>
            )}
        </div>
    );
};

export default ManageReservations;
--------------------------------------CODIGO RESERVA-^----------------------------------->*/

import React, { useEffect, useState } from "react";

// URL base del backend
const BASE_URL = process.env.REACT_APP_BASE_URL || "https://potential-telegram-9gw96rvrqwjfpvx6-3001.app.github.dev";

const ManageReservations = () => {
    const [reservations, setReservations] = useState([]); // Lista de reservas
    const [editingReservationId, setEditingReservationId] = useState(null); // Para identificar la reserva que está siendo editada
    const [isLoading, setIsLoading] = useState(false); // Estado de carga
    const [error, setError] = useState(""); // Mensajes de error

    // Fetch inicial de reservas pendientes al cargar el componente
    useEffect(() => {
        const fetchReservations = async () => {
            setIsLoading(true);
            setError(""); // Reinicia el error

            try {
                const response = await fetch(`${BASE_URL}/api/reservations/`);
                if (!response.ok) {
                    throw new Error("Error al obtener reservas");
                }

                const data = await response.json();
                // Filtra solo las reservas pendientes
                setReservations(data.filter((r) => r.state === "Pending"));
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
            if (decision === "Accepted") {
                const response = await fetch(
                    `${BASE_URL}/api/reservations/accept/${reservationId}/`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                    }
                );

                if (!response.ok) {
                    throw new Error("Error al aceptar la reserva");
                }

                const data = await response.json();

                // Actualiza el estado de la reserva en la lista
                setReservations((prev) =>
                    prev.map((r) =>
                        r.id === reservationId ? { ...r, state: "Accepted" } : r
                    )
                );
            } else if (decision === "Rejected") {
                const response = await fetch(
                    `${BASE_URL}/api/reservations/${reservationId}`,
                    {
                        method: "DELETE",
                    }
                );

                if (!response.ok) {
                    throw new Error("Error al eliminar la reserva");
                }

                // Elimina la reserva de la lista local
                setReservations((prev) => prev.filter((r) => r.id !== reservationId));
            }
        } catch (err) {
            console.error(err);
            setError("No se pudo gestionar la reserva. Intenta nuevamente.");
        }
    };

    // Manejar la actualización de una reserva (modificar)
    const handleUpdate = async (reservationId, updates) => {
        try {
            // Asegura el formato correcto de la fecha
            const formattedDate = new Date(updates.date).toISOString().split('T')[0];
            updates.date = formattedDate;

            // No incluyas el campo 'state'
            delete updates.state;

            // Agrega un console.log para inspeccionar los datos antes de enviarlos
            console.log("Datos enviados al backend:", updates);

            const response = await fetch(`${BASE_URL}/api/reservations/${reservationId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),  // Envía los datos actualizados
            });

            if (!response.ok) {
                throw new Error("Error al actualizar la reserva");
            }

            const updatedReservation = await response.json();

            // Actualiza la lista de reservas localmente
            setReservations(prev =>
                prev.map(r =>
                    r.id === reservationId ? updatedReservation : r
                )
            );

            // Recargar la página después de la actualización
            window.location.reload();

            // Salir del modo edición
            setEditingReservationId(null);
        } catch (err) {
            console.error(err);  // Captura errores relacionados
            setError("No se pudo actualizar la reserva. Intenta nuevamente.");
        }
    };

    // Renderizar el formulario para editar una reserva
    const renderEditForm = (reservation) => (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const updates = {
                    date: e.target.date.value,
                    hour: e.target.hour.value,
                    people: parseInt(e.target.people.value),
                };

                // Agrega los console.log justo antes de la llamada a handleUpdate
                console.log("ID de la reserva:", reservation.id);
                console.log("Datos para actualizar:", updates);

                handleUpdate(reservation.id, updates);  // Llama a la función handleUpdate
            }}
        >
            <label>
                Fecha:
                <input
                    type="date"
                    name="date"
                    defaultValue={reservation.date.split('/').reverse().join('-')}  // Fecha por defecto en formato YYYY-MM-DD
                    required
                />
            </label>
            <label>
                Hora:
                <input
                    type="time"
                    name="hour"
                    defaultValue={reservation.hour}
                    required
                />
            </label>
            <label>
                Personas:
                <input
                    type="number"
                    name="people"
                    defaultValue={reservation.people}
                    required
                />
            </label>
            <button
                type="submit"
                style={{ backgroundColor: "blue", color: "white", marginLeft: "10px" }}
            >
                Guardar
            </button>
        </form>
    );

    return (
        <div>
            <h1>Gestionar Reservas</h1>

            {isLoading && <p>Cargando reservas...</p>}

            {error && <p style={{ color: "red" }}>{error}</p>}

            <ul>
                {reservations.map((reservation, index) => (
                    <li key={`${reservation.id}-${index}`}>  {/* Agregar un índice para asegurar una clave única */}
                        <p>
                            Reserva de <strong>{reservation.people}</strong> personas para{" "}
                            <strong>{reservation.date}</strong> a las{" "}
                            <strong>{reservation.hour}</strong> por <strong>{reservation.diner}</strong>.
                        </p>

                        {editingReservationId === reservation.id ? (
                            renderEditForm(reservation)
                        ) : (
                            <>
                                <button
                                    onClick={() => setEditingReservationId(reservation.id)}
                                    style={{
                                        marginRight: "10px",
                                        backgroundColor: "green",
                                        color: "white",
                                    }}
                                >
                                    Modificar
                                </button>
                                <button
                                    onClick={() => handleDecision(reservation.id, "Rejected")}
                                    style={{ backgroundColor: "red", color: "white" }}
                                >
                                    Eliminar
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>

            {!isLoading && reservations.length === 0 && !error && (
                <p>No hay reservas pendientes en este momento.</p>
            )}
        </div>
    );
};

export default ManageReservations;

