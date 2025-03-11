import React, { useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || 'https://turbo-space-disco-jp95rv6p69wc5w74-3001.app.github.dev';

const AddRestaurant = () => {
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        telephone: "",
        latitude: "0.0000",
        longitude: "0.0000",
        capacity: "",
        owner_id: 1 // Aquí deberías reemplazar 1 con el ID del propietario logueado dinámicamente
    });
    const [message, setMessage] = useState("");

    // Manejador de cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Manejador de envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue al enviar el formulario
        try {
            // Realiza la solicitud POST al backend con los datos del formulario
            const response = await axios.post(`${BACKEND_URL}/api/restaurants`, formData);
            setMessage(response.data.message || "Restaurante añadido exitosamente");

            // Resetea el formulario después del éxito
            setFormData({
                name: "",
                location: "",
                telephone: "",
                latitude: "0.0000",
                longitude: "0.0000",
                capacity: "",
                owner_id: formData.owner_id // Mantenemos el ID del propietario logueado
            });
        } catch (error) {
            // Muestra un mensaje de error en caso de fallo
            console.error("Error al enviar el restaurante:", error); // Para depuración
            setMessage(error.response?.data?.error || "Hubo un error al añadir el restaurante");
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
                <button type="submit" className="btn btn-success">Añadir Restaurante</button>
            </form>
            {message && <p className="mt-3">{message}</p>}
        </div>
    );
};

export default AddRestaurant;

