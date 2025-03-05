import React, { useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || 'https://zany-space-lamp-r5wg7q95j5xfw4j-3001.app.github.dev';

const AddRestaurant = () => {
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        telephone: "",
        latitude: "0.0000",
        longitude: "0.0000",
        capacity: ""
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BACKEND_URL}/api/restaurants`, formData);
            setMessage(response.data.message);
            setFormData({
                name: "",
                location: "",
                telephone: "",
                latitude: "0.0000",
                longitude: "0.0000",
                capacity: ""
            });
        } catch (error) {
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
