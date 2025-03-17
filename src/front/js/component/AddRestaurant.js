import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.BACKEND_URL || 'https://cuddly-palm-tree-r5wg7q9qgg5hx579-3001.app.github.dev';

const AddRestaurant = () => {
    const navigate = useNavigate();

    const [owners, setOwners] = useState([]); // Estado para almacenar propietarios
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        telephone: "",
        latitude: "0.0000",
        longitude: "0.0000",
        capacity: "",
        owner_id: "", // Inicialmente vacío para obligar la selección de un propietario
    });

    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Obtener lista de propietarios al montar el componente
    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/owners`);
                setOwners(response.data.data); // Actualiza el estado con los propietarios
                console.log("Propietarios cargados:", response.data.data);
            } catch (error) {
                console.error("Error al obtener propietarios:", error);
            }
        };
        fetchOwners();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        // Validaciones antes de enviar
        if (!formData.name || !formData.location || !formData.telephone || !formData.latitude || !formData.longitude || !formData.capacity || !formData.owner_id) {
            setMessage("Todos los campos son obligatorios, incluido el propietario.");
            setIsLoading(false);
            return;
        }

        const parsedFormData = {
            ...formData,
            capacity: parseInt(formData.capacity, 10),
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
        };
        console.log("Datos enviados al backend (formateados):", parsedFormData);

        try {
            const response = await axios.post(`${BACKEND_URL}/api/restaurants`, parsedFormData);
            setMessage(response.data.message || "Restaurante añadido exitosamente");
            setFormData({
                name: "",
                location: "",
                telephone: "",
                latitude: "0.0000",
                longitude: "0.0000",
                capacity: "",
                owner_id: "",
            });
        } catch (error) {
            console.error("Error al enviar el restaurante:", error);
            if (error.response) {
                console.log("Error del backend (respuesta):", error.response.data);
                setMessage(error.response.data.error || "Error del servidor.");
            } else if (error.request) {
                console.log("Error de conexión (request):", error.request);
                setMessage("No se pudo conectar al servidor. Por favor, intenta más tarde.");
            } else {
                console.log("Error inesperado:", error.message);
                setMessage("Ocurrió un error inesperado.");
            }
        } finally {
            setIsLoading(false);
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
                <div className="mb-3">
                    <label className="form-label">Propietario:</label>
                    <select
                        name="owner_id"
                        className="form-control"
                        value={formData.owner_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione un propietario</option>
                        {owners.map((owner) => (
                            <option key={owner.id} value={owner.id}>
                                {owner.name} ({owner.email})
                            </option>
                        ))}
                    </select>
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


