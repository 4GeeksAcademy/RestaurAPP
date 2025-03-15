import React, { useEffect, useState } from "react";
import Map from "./Map"; // Importamos el componente Map.js

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]); // Estado para almacenar los restaurantes
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(""); // Mensaje de error

  // Función para cargar los restaurantes desde el backend
  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(true); // Indicar que estamos cargando
      setError(""); // Reiniciar errores previos

      try {
        const response = await fetch("/api/restaurants"); // Llamar a la API de tu backend
        if (!response.ok) {
          throw new Error("Error al cargar los restaurantes");
        }

        const data = await response.json(); // Convertir la respuesta a JSON
        setRestaurants(data); // Guardar los restaurantes en el estado
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los restaurantes. Intenta nuevamente.");
      } finally {
        setIsLoading(false); // Indicamos que la carga finalizó
      }
    };

    fetchRestaurants();
  }, []);

  // Renderizado del componente
  return (
    <div>
      <h1>Encuentra tu Restaurante</h1>

      {isLoading && <p>Cargando restaurantes...</p>} {/* Mensaje mientras se cargan los restaurantes */}
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Mensaje de error */}

      {/* Mostrar el mapa si hay restaurantes */}
      {restaurants.length > 0 && <Map restaurants={restaurants} />}

      {/* Mostrar la lista de restaurantes */}
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.id}>
            <strong>{restaurant.name}</strong> - {restaurant.location}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantList;
