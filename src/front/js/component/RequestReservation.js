import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

const RequestReservation = () => {
    const { store } = useContext(Context); // Obtenemos información del usuario logueado
    const [reservations, setReservations] = useState([]); // Lista de reservas
    const [formData, setFormData] = useState({
        id_fk_restaurant: "",
        date: "",
        hour: "",
        people: "",
    }); // Datos del formulario
    const [message, setMessage] = useState(""); // Mensajes de éxito/error

    // Cargar las reservas realizadas por el diner logueado
    useEffect(() => {
        const fetchReservations = async () => {
            if (!store.user?.id || store.user.role !== "diner") return; // Verificación adicional
            try {
                console.log("Obteniendo reservas del diner:", store.user.id);
                const response = await fetch(`/api/reservations/diner?diner_id=${store.user.id}`);
                const data = await response.json();
                if (!response.ok) {
                    setMessage(data.error || "Error al cargar reservas.");
                    return;
                }
                setReservations(data.reservations);
            } catch (error) {
                console.error("Error al cargar reservas:", error);
                setMessage("Error al cargar reservas.");
            }
        };

        fetchReservations();
    }, [store.user]);

    // Manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Validar el formulario antes de enviarlo
    const validateForm = () => {
        if (!formData.id_fk_restaurant || !formData.date || !formData.hour || !formData.people) {
            setMessage("Todos los campos son obligatorios.");
            return false;
        }
        if (isNaN(Number(formData.people)) || Number(formData.people) <= 0) {
            setMessage("El número de personas debe ser un número positivo.");
            return false;
        }
        return true;
    };

    // Crear una nueva reserva
    const handleCreateReservation = async () => {
        if (!validateForm()) return; // Detener si el formulario no es válido

        try {
            console.log("Enviando solicitud de reserva:", formData);
            const response = await fetch("/api/reservations/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_fk_diner: store.user.id,
                    ...formData,
                }),
            });

            console.log("Respuesta del servidor:", response);

            if (!response.ok) {
                const error = await response.json();
                setMessage(error.error || "Error al crear la reserva.");
                return;
            }
            const newReservation = await response.json();
            setMessage("Reserva creada exitosamente!");
            setFormData({ id_fk_restaurant: "", date: "", hour: "", people: "" }); // Limpiar el formulario
            setReservations((prev) => [...prev, newReservation.reservation]);
        } catch (error) {
            console.error("Error al crear la reserva:", error);
            setMessage("Error al crear la reserva.");
        }
    };

    // Eliminar una reserva
    const handleDeleteReservation = async (reservationId) => {
        try {
            console.log("Eliminando reserva:", reservationId);
            const response = await fetch(`/api/reservations/${reservationId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                setMessage("Error al eliminar la reserva.");
                return;
            }
            setMessage("Reserva eliminada exitosamente!");
            setReservations((prev) => prev.filter((r) => r.id !== reservationId));
        } catch (error) {
            console.error("Error al eliminar la reserva:", error);
            setMessage("Error al eliminar la reserva.");
        }
    };

    return (
        <div className="container">
            <h1>Mis Reservas</h1>

            {/* Lista de Reservas */}
            {reservations.length > 0 ? (
                <ul>
                    {reservations.map((reservation) => (
                        <li key={reservation.id}>
                            {reservation.people} personas, el {reservation.date} a las {reservation.hour} - Estado: {reservation.state}
                            <button
                                className="btn btn-danger"
                                onClick={() => handleDeleteReservation(reservation.id)}
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tienes reservas realizadas.</p>
            )}

            {/* Formulario de Nueva Reserva */}
            <div>
                <h2>Solicitar Nueva Reserva</h2>
                <input
                    type="text"
                    name="id_fk_restaurant"
                    placeholder="ID Restaurante"
                    onChange={handleInputChange}
                    value={formData.id_fk_restaurant}
                />
                <input
                    type="date"
                    name="date"
                    placeholder="Fecha"
                    onChange={handleInputChange}
                    value={formData.date}
                />
                <input
                    type="time"
                    name="hour"
                    placeholder="Hora"
                    onChange={handleInputChange}
                    value={formData.hour}
                />
                <input
                    type="number"
                    name="people"
                    placeholder="Número de Personas"
                    onChange={handleInputChange}
                    value={formData.people}
                />
                <button className="btn btn-primary" onClick={handleCreateReservation}>
                    Solicitar Reserva
                </button>
            </div>

            {/* Mensajes */}
            {message && <p>{message}</p>}
        </div>
    );
};

export default RequestReservation;
