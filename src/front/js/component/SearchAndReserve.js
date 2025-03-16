import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";

const SearchAndReserve = () => {
    const { store, actions } = useContext(Context);
    const [location, setLocality] = useState("");
    const [people, setPeople] = useState("");
    const [results, setResults] = useState([]);

    const searchRestaurants = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/restaurants/search?location=${location}&people=${people}`);
            if (!response.ok) throw new Error("Error al buscar restaurantes");
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error(error);
        }
    };

    const reserve = async (restaurantId) => {
        const reservationData = {
            id_fk_restaurant: restaurantId,
            id_fk_diner: store.user.id, // Asegúrate de que el usuario esté autenticado
            date: "15/04/2025", // Sustituir por inputs dinámicos
            hour: "20:00",
            people: parseInt(people)
        };

        await actions.createReservation(reservationData); // Acción en flux.js
    };

    return (
        <div className="container">
            <h1>Busca y Reserva en un Restaurante</h1>
            <div>
                <input
                    type="text"
                    placeholder="Localidad"
                    value={location}
                    onChange={(e) => setLocality(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Número de personas"
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                />
                <button onClick={searchRestaurants}>Buscar Restaurantes</button>
            </div>

            <div>
                {results.length > 0 ? (
                    <ul>
                        {results.map((restaurant) => (
                            <li key={restaurant.id}>
                                {restaurant.name} - {restaurant.location}
                                <button onClick={() => reserve(restaurant.id)}>Reservar</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No se encontraron resultados</p>
                )}
            </div>
        </div>
    );
};

export default SearchAndReserve;
