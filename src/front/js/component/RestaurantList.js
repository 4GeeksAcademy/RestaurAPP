import React, { useEffect, useState } from "react";
import Map from "./Map"; // Importamos el componente del mapa

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]); // Estado para los restaurantes
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(""); // Estado de errores
  const [showMap, setShowMap] = useState(false); // Estado para controlar la visibilidad del mapa

  // Función para cargar los restaurantes desde el backend
  const fetchRestaurants = async () => {
    setIsLoading(true);
    setError("");
  
    try {
      const response = await fetch("https://cuddly-palm-tree-r5wg7q9qgg5hx579-3001.app.github.dev/api/restaurants");
      if (!response.ok) throw new Error("Error al cargar los restaurantes.");
  
      const result = await response.json(); // Parsear los datos devueltos por la API
      console.log("Datos de restaurantes cargados:", result.data);
      setRestaurants(result.data); // Guardar los restaurantes en el estado
      setShowMap(true); // Mostrar el mapa después de cargar los datos
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los restaurantes. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

  // Renderizado del componente
  return (
    <div>
      <h1>Encuentra tu Restaurante</h1>

      {/* Botón para buscar restaurantes */}
      <button onClick={fetchRestaurants} className="btn btn-primary">
        Buscar Restaurantes
      </button>

      {isLoading && <p>Cargando restaurantes...</p>} {/* Indicador de carga */}
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Mensaje de error */}

      {/* Mostrar el mapa si se han cargado los restaurantes */}
      {showMap && restaurants.length > 0 && <Map restaurants={restaurants} />}

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
