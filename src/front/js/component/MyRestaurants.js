import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import restaurappImageUrl from "../../img/imagenRestaurapp.jpg";

const BACKEND_URL = process.env.BACKEND_URL || "https://zany-space-lamp-r5wg7q95j5xfw4j-3001.app.github.dev";

const MyRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [message, setMessage] = useState("");


    useEffect(() => {
        const fetchRestaurants = async () => {
            const token = localStorage.getItem('access_token');
            const ownerId = 1;  

            try {
                const response = await axios.get(
                    `${BACKEND_URL}/api/owners/${ownerId}/restaurants`, 
                    {
                        headers: {
                            Authorization: `Bearer ${token}` 
                        }
                    }
                );
                setRestaurants(response.data); 
            } catch (error) {
                setMessage("No se pudieron cargar los restaurantes.");
            }
        };

        fetchRestaurants();
    }, []);

    return (
        <div className="restaurants-list container mt-5">
            <h2 className="mb-4">Mis Restaurantes</h2>
            {message && <p>{message}</p>}
            {restaurants.length > 0 ? (
                restaurants.map((restaurant) => (
                    <div key={restaurant.id} className="card mb-2" style={{ width: '18rem' }}>
                        <img src={restaurappImageUrl} className="card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">{restaurant.name}</h5>
                            <p className="card-text">{restaurant.location}</p>
                        </div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">{restaurant.telephone}</li>
                            <li className="list-group-item">{restaurant.capacity} personas</li>
                        </ul>
                    </div>
                ))
            ) : (
                <p>No tienes restaurantes.</p>
            )}
        </div>
    );
};

export default MyRestaurants;
