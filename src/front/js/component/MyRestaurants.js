import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import restaurappImageUrl from "../../img/imagenRestaurapp.jpg";

const BACKEND_URL = process.env.BACKEND_URL || "https://cuddly-palm-tree-r5wg7q9qgg5hx579-3001.app.github.dev";

const MyRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]); // Restaurantes del propietario
    const [availableRestaurants, setAvailableRestaurants] = useState([]); // Restaurantes disponibles
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Obtén el owner_id desde la URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const owner_id = queryParams.get("owner_id");

    useEffect(() => {
        const fetchRestaurants = async () => {
            const token = localStorage.getItem("access_token");

            try {
                // Obtén los restaurantes del propietario
                const response = await axios.get(`${BACKEND_URL}/api/owners/${owner_id}/restaurants`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setRestaurants(response.data);
            } catch (err) {
                console.error("Error al obtener los restaurantes del propietario:", err);
                setError("Error al cargar los restaurantes del propietario.");
            }

            try {
                // Obtén todos los restaurantes disponibles
                const response = await axios.get(`${BACKEND_URL}/api/restaurants`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAvailableRestaurants(response.data);
            } catch (err) {
                console.error("Error al obtener todos los restaurantes:", err);
                setError("Error al cargar los restaurantes disponibles.");
            }
        };

        if (owner_id) fetchRestaurants();
    }, [owner_id]);

    const handleAddRestaurant = async (restaurant_id) => {
        const token = localStorage.getItem("access_token");

        try {
            // Asigna el restaurante al propietario
            const response = await axios.put(
                `${BACKEND_URL}/api/restaurants/${restaurant_id}`,
                { owner_id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setMessage("Restaurante añadido exitosamente.");

            // Actualiza los estados locales
            const addedRestaurant = availableRestaurants.find((r) => r.id === restaurant_id);
            setRestaurants([...restaurants, addedRestaurant]);
            setAvailableRestaurants(availableRestaurants.filter((r) => r.id !== restaurant_id));
        } catch (err) {
            console.error("Error al añadir el restaurante al propietario:", err);
            setMessage("");
            setError("Hubo un error al añadir el restaurante.");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Mis Restaurantes</h2>
            {message && <p className="text-success">{message}</p>}
            {error && <p className="text-danger">{error}</p>}

            <h3>Restaurantes actuales</h3>
            {restaurants.length > 0 ? (
                <ul>
                    {restaurants.map((restaurant) => (
                        <li key={restaurant.id}>
                            <span>
                                {restaurant.name} - {restaurant.location}
                            </span>
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
                        .filter((r) => !restaurants.some((rest) => rest.id === r.id))
                        .map((restaurant) => (
                            <li key={restaurant.id}>
                                <span>
                                    {restaurant.name} - {restaurant.location}
                                </span>
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
