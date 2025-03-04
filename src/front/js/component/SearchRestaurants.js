import React, { useState } from "react";
import axios from "axios";

const SearchRestaurants = () => {
    const [city, setCity] = useState("");
    const [capacity, setCapacity] = useState(1);
    const [restaurants, setRestaurants] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/restaurants", {
                params: { city, capacity }
            });
            setRestaurants(response.data);
        } catch (error) {
            console.error("Error fetching restaurants:", error);
        }
    };

    const handleDelete = async (restaurantId) => {
        try {
            await axios.delete(import.meta.env.VITE_BACKEND_URL + `/api/restaurants/${restaurantId}`);
            setRestaurants(restaurants.filter(restaurant => restaurant.id !== restaurantId));
        } catch (error) {
            console.error("Error deleting restaurant:", error);
        }
    };

    return (
        <div className="search-restaurants">
            <h2>Buscar Restaurantes por Ciudad y Capacidad</h2>
            <div>
                <label>Ciudad:</label>
                <input
                    type="text"
                    placeholder="Ingresa la ciudad"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
            </div>
            <div>
                <label>Capacidad de Mesa:</label>
                <input
                    type="number"
                    min="1"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                />
            </div>
            <button onClick={handleSearch}>Buscar</button>
            <h3>Resultados</h3>
            {restaurants.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Ubicación</th>
                            <th>Teléfono</th>
                            <th>Latitud</th>
                            <th>Longitud</th>
                            <th>Capacidad</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurants.map((restaurant) => (
                            <tr key={restaurant.id}>
                                <td>{restaurant.name}</td>
                                <td>{restaurant.location}</td>
                                <td>{restaurant.telephone}</td>
                                <td>{restaurant.latitude}</td>
                                <td>{restaurant.longitude}</td>
                                <td>{restaurant.capacity}</td>
                                <td>
                                    <button onClick={() => handleDelete(restaurant.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay restaurantes disponibles en esta ciudad para la capacidad especificada</p>
            )}
        </div>
    );
};

export default SearchRestaurants;
