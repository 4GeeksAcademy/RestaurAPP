import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.BACKEND_URL || 'https://special-yodel-4jgq5rp6qp5gc5xwp-3001.app.github.dev/';

const AddRestaurant = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        telephone: "",
        latitude: "0.0000",
        longitude: "0.0000",
        capacity: "",
        owner_id: 1 // Asignamos el owner_id desde localStorage o un valor predeterminado
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('access_token');

        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/restaurants`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setMessage(response.data.message || "Restaurante añadido exitosamente");

            // Limpia el formulario después de enviar
            setFormData({
                name: "",
                location: "",
                telephone: "",
                latitude: "0.0000",
                longitude: "0.0000",
                capacity: "",
                owner_id: formData.owner_id
            });

            // Redirigir a otra página después de añadir el restaurante si es necesario
            // navigate("/my-restaurants"); // Descomenta esto si quieres redirigir

        } catch (error) {
            console.error("Error al enviar el restaurante:", error);
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

