import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "https://turbo-space-disco-jp95rv6p69wc5w74-3001.app.github.dev";

const OwnerRestaurants = () => {
    const { owner_id } = useParams(); // Extraemos el owner_id de la URL
    const [restaurants, setRestaurants] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/owners/${owner_id}/restaurants`);
                setRestaurants(response.data);
            } catch (error) {
                setMessage("No se encontraron restaurantes para este propietario.");
                console.error("Error fetching restaurants:", error);
            }
        };

        fetchRestaurants();
    }, [owner_id]);

    return (
        <div className="container mt-5">
            <h2>Restaurantes del Propietario</h2>
            {message && <p className="text-danger">{message}</p>}
            <ul>
                {restaurants.map((restaurant) => (
                    <li key={restaurant.id}>
                        <span><strong>Nombre:</strong> {restaurant.name}</span> <br />
                        <span><strong>Ubicación:</strong> {restaurant.location}</span> <br />
                        <span><strong>Capacidad:</strong> {restaurant.capacity}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OwnerRestaurants;
