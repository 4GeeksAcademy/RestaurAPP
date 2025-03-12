import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "https://glorious-space-capybara-575qvj6jgqqh767x-3001.app.github.dev/";

const MyRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [availableRestaurants, setAvailableRestaurants] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Obtén el owner_id desde la URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const owner_id = queryParams.get("owner_id"); // Cambiado a owner_id

    useEffect(() => {
        // Fetch restaurants for the owner
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/restaurants`, {
                    params: { owner_id }, // Se asegura de usar "owner_id"
                });
                setRestaurants(response.data);
            } catch (err) {
                console.error("Error al obtener los restaurantes del propietario:", err);
                setError("Error al cargar los restaurantes del propietario.");
            }
        };

        // Fetch all available restaurants to add
        const fetchAvailableRestaurants = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/restaurants`);
                setAvailableRestaurants(response.data);
            } catch (err) {
                console.error("Error al obtener todos los restaurantes:", err);
                setError("Error al cargar los restaurantes disponibles.");
            }
        };

        if (owner_id) {
            fetchRestaurants();
            fetchAvailableRestaurants();
        }
    }, [owner_id]);

    const handleAddRestaurant = async (restaurant_id) => {
        try {
            const response = await axios.put(
                `${BACKEND_URL}/api/restaurants/${restaurant_id}`,
                { owner_id } // Usa owner_id como parte de la solicitud
            );
            setMessage("Restaurante añadido exitosamente.");
            // Actualiza el estado local para reflejar el cambio
            setRestaurants([...restaurants, availableRestaurants.find(r => r.id === restaurant_id)]);
            setAvailableRestaurants(
                availableRestaurants.filter(r => r.id !== restaurant_id) // Elimina el añadido de la lista disponible
            );
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
                        <li key={restaurant.restaurant_id}>
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
                        .filter((r) => !restaurants.some((rest) => rest.restaurant_id === r.id)) // Filtra los que ya están añadidos
                        .map((restaurant) => (
                            <li key={restaurant.restaurant_id}>
                                <span>
                                    {restaurant.name} - {restaurant.location}
                                </span>
                                <button
                                    className="btn btn-primary ms-3"
                                    onClick={() => handleAddRestaurant(restaurant.restaurant_id)}
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

