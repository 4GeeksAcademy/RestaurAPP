import React, { useState } from "react";

const RequestReservation = () => {
    const [formData, setFormData] = useState({
        id_fk_restaurant: "",
        date: "",
        hour: "",
        people: "",
    });
    const [message, setMessage] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch("/api/reservations/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.json();
                setMessage(error.error || "Error al solicitar la reserva");
                return;
            }

            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            setMessage("Error al solicitar la reserva");
        }
    };

    return (
        <div>
            <h1>Solicitar Reserva</h1>
            <input
                name="id_fk_restaurant"
                placeholder="ID Restaurante"
                onChange={handleInputChange}
            />
            <input
                name="date"
                type="date"
                placeholder="Fecha"
                onChange={handleInputChange}
            />
            <input
                name="hour"
                type="time"
                placeholder="Hora"
                onChange={handleInputChange}
            />
            <input
                name="people"
                type="number"
                placeholder="Número de Personas"
                onChange={handleInputChange}
            />
            <button onClick={handleSubmit}>Solicitar</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default RequestReservation;
