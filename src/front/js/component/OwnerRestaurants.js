import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "https://cuddly-palm-tree-r5wg7q9qgg5hx579-3001.app.github.dev";

const OwnerRestaurants = () => {
    const { owner_id } = useParams(); // Extraemos el owner_id de la URL
    const [restaurants, setRestaurants] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true); // Indicador de carga

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/owners/${owner_id}/restaurants`);
                if (response.data.length > 0) {
                    setRestaurants(response.data);
                } else {
                    setMessage("No se encontraron restaurantes para este propietario.");
                }
            } catch (error) {
                const errorMessage =
                    error.response?.data?.error || "Hubo un problema al obtener los restaurantes.";
                setMessage(errorMessage);
                console.error("Error fetching restaurants:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, [owner_id]);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Restaurantes del Propietario</h2>
            {loading ? (
                <p className="text-center">Cargando restaurantes...</p>
            ) : message ? (
                <p className="text-danger">{message}</p>
            ) : (
                <ul>
                    {restaurants.map((restaurant) => (
                        <li key={restaurant.id} className="mb-3">
                            <span><strong>Nombre:</strong> {restaurant.name}</span> <br />
                            <span><strong>Ubicación:</strong> {restaurant.location}</span> <br />
                            <span><strong>Capacidad:</strong> {restaurant.capacity}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OwnerRestaurants;
