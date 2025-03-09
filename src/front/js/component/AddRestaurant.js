import React, { useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || 'https://glorious-space-capybara-575qvj6jgqqh767x-3001.app.github.dev';

const AddRestaurant = () => {
    // Obtiene dinámicamente el ID del propietario logueado (por ejemplo, desde localStorage)
    const ownerId = localStorage.getItem("owner_id") || 1; // Reemplaza 1 con un valor adecuado

    const [formData, setFormData] = useState({
        name: "",
        location: "",
        telephone: "",
        latitude: "0.0000",
        longitude: "0.0000",
        capacity: "",
        owner_id: ownerId // Usamos el ID dinámico
    });

    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Indicador de carga

    // Manejador de cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Manejador de envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita el refresh del navegador
        setIsLoading(true); // Muestra el indicador de carga
        setMessage("");

        // Validaciones antes de enviar
        if (!formData.name || !formData.location || !formData.telephone || !formData.latitude || !formData.longitude || !formData.capacity) {
            setMessage("Todos los campos son obligatorios.");
            setIsLoading(false);
            return;
        }
        if (isNaN(formData.latitude) || isNaN(formData.longitude)) {
            setMessage("Latitud y longitud deben ser números válidos.");
            setIsLoading(false);
            return;
        }
        if (formData.capacity <= 0) {
            setMessage("La capacidad debe ser un número entero positivo.");
            setIsLoading(false);
            return;
        }

        try {
            // Realiza la solicitud al backend
            const response = await axios.post(`${BACKEND_URL}/api/restaurants`, formData);
            setMessage(response.data.message || "Restaurante añadido exitosamente");
            // Resetea el formulario excepto el owner_id
            setFormData({
                name: "",
                location: "",
                telephone: "",
                latitude: "0.0000",
                longitude: "0.0000",
                capacity: "",
                owner_id: ownerId // Conservamos el owner_id
            });
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.error || "Error del servidor.");
            } else if (error.request) {
                setMessage("No se pudo conectar al servidor. Por favor, intenta más tarde.");
            } else {
                setMessage("Ocurrió un error inesperado.");
            }
        } finally {
            setIsLoading(false); // Oculta el indicador de carga
        }
    };

    return (
        <div className="add-restaurant container mt-5">
            <h2 className="mb-4">Añadir Nuevo Restaurante</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre:</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Ubicación:</label>
                    <input
                        type="text"
                        name="location"
                        className="form-control"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Teléfono:</label>
                    <input
                        type="text"
                        name="telephone"
                        className="form-control"
                        value={formData.telephone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Latitud:</label>
                    <input
                        type="text"
                        name="latitude"
                        className="form-control"
                        value={formData.latitude}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Longitud:</label>
                    <input
                        type="text"
                        name="longitude"
                        className="form-control"
                        value={formData.longitude}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Capacidad:</label>
                    <input
                        type="number"
                        name="capacity"
                        className="form-control"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success">
                    {isLoading ? "Procesando..." : "Añadir Restaurante"}
                </button>
            </form>
            {message && <p className="mt-3">{message}</p>}
        </div>
    );
};

export default AddRestaurant;
