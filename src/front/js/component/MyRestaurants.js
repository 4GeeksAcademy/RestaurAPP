import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "https://zany-space-lamp-r5wg7q95j5xfw4j-3001.app.github.dev";

const MyRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [availableRestaurants, setAvailableRestaurants] = useState([]);
    const [message, setMessage] = useState("");

    // Obtén el owner_id desde la URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const ownerId = queryParams.get("owner_id");

    useEffect(() => {
        // Fetch restaurants for the owner
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/restaurants`, {
                    params: { owner_id: ownerId }
                });
                setRestaurants(response.data);
            } catch (error) {
                console.error("Error fetching owner's restaurants:", error);
            }
        };

        // Fetch all available restaurants to add
        const fetchAvailableRestaurants = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/restaurants`);
                setAvailableRestaurants(response.data);
            } catch (error) {
                console.error("Error fetching all restaurants:", error);
            }
        };

        if (ownerId) {
            fetchRestaurants();
            fetchAvailableRestaurants();
        }
    }, [ownerId]);

    const handleAddRestaurant = async (restaurantId) => {
        try {
            await axios.put(`${BACKEND_URL}/api/restaurants/${restaurantId}`, { owner_id: ownerId });
            setMessage("Restaurante añadido exitosamente.");
            setRestaurants([...restaurants, availableRestaurants.find(r => r.id === restaurantId)]);
        } catch (error) {
            console.error("Error adding restaurant to owner:", error);
            setMessage("Hubo un error al añadir el restaurante.");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Mis Restaurantes</h2>
            {message && <p className="text-success">{message}</p>}
            <h3>Restaurantes actuales</h3>
            {restaurants.length > 0 ? (
                <ul>
                    {restaurants.map((restaurant) => (
                        <li key={restaurant.id}>
                            <span>{restaurant.name} - {restaurant.location}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tienes restaurantes registrados.</p>
            )}

            <h3>Añadir Restaurante</h3>
            {availableRestaurants.length > 0 ? (
                <ul>
                    {availableRestaurants
                        .filter((r) => !restaurants.some((rest) => rest.id === r.id)) // Filtra los que ya están añadidos
                        .map((restaurant) => (
                            <li key={restaurant.id}>
                                <span>{restaurant.name} - {restaurant.location}</span>
                                <button
                                    className="btn btn-primary ms-3"
                                    onClick={() => handleAddRestaurant(restaurant.id)}
                                >
                                    Añadir
                                </button>
                            </li>
                        ))}
                </ul>
            ) : (
                <p>No hay restaurantes disponibles para añadir.</p>
            )}
        </div>
    );
};

export default MyRestaurants;
