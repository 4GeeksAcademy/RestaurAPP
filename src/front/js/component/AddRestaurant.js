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
                latitude: "",
                longitude: "",
                capacity: ""
            });
        } catch (error) {
            setMessage(error.response?.data?.error || "Hubo un error al añadir el restaurante");
        }
    };

    return (
        <div className="add-restaurant">
            <h2>Añadir Nuevo Restaurante</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Ubicación:</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Teléfono:</label>
                    <input
                        type="text"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Latitud:</label>
                    <input
                        type="text"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Longitud:</label>
                    <input
                        type="text"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Capacidad:</label>
                    <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Añadir Restaurante</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddRestaurant;
