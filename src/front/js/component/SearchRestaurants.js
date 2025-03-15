import React, { useState } from "react";
import axios from "axios";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  "https://cuddly-palm-tree-r5wg7q9qgg5hx579-3001.app.github.dev";

const SearchRestaurants = () => {
  const [city, setCity] = useState("");
  const [capacity, setCapacity] = useState(1);
  const [restaurants, setRestaurants] = useState([]);
  const [editRestaurant, setEditRestaurant] = useState(null);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    // Verifica si los valores de entrada son válidos
    if (capacity <= 0) {
      setMessage("Por favor, ingresa una capacidad mayor a 0.");
      return;
    }
  
    try {
      console.log(
        city.trim()
          ? `Buscando restaurantes en "${city}" con capacidad para ${capacity} personas.`
          : `Buscando los primeros 10 restaurantes con capacidad para ${capacity} personas.`
      );
  
      // Configura los parámetros de la solicitud
      const params = city.trim()
        ? { location: city, capacity }
        : { capacity }; // Sin "location" si no se especifica una ciudad
  
      const response = await axios.get(`${BACKEND_URL}/api/restaurants`, {
        params,
      });
  
      console.log("Respuesta del backend:", response.data);
  
      // Filtrar y limitar resultados si no hay una ciudad especificada
      const restaurantList = response.data.data || [];
      const filteredRestaurants = !city.trim()
        ? restaurantList.slice(0, 10) // Obtener los primeros 10
        : restaurantList;
  
      if (filteredRestaurants.length > 0) {
        setRestaurants(filteredRestaurants);
        setMessage("");
      } else {
        setMessage(
          city.trim()
            ? "No se encontraron restaurantes para los criterios especificados."
            : "No hay restaurantes disponibles en este momento."
        );
        setRestaurants([]);
      }
    } catch (error) {
      console.error("Error al buscar restaurantes:", error.response?.data || error.message);
      setMessage("Error al buscar restaurantes. Por favor, inténtalo de nuevo.");
    }
  };
  
  


  const handleDelete = async (restaurant_id) => {
    try {
      console.log("BACKEND_URL:", BACKEND_URL);

      await axios.delete(`${BACKEND_URL}/api/restaurants/${restaurant_id}`);
      setRestaurants(
        restaurants.filter((restaurant) => restaurant.id !== restaurant_id)
      );
      setMessage("Restaurante eliminado exitosamente");
    } catch (error) {
      console.error(
        "Error al eliminar restaurante:",
        error.response?.data || error.message
      );
      setMessage("Error al eliminar el restaurante");
    }
  };

  const handleEdit = (restaurant) => {
    setEditRestaurant({ ...restaurant }); // Abre el modal y carga los datos del restaurante
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(
        `${BACKEND_URL}/api/restaurants/${editRestaurant.id}`,
        editRestaurant
      );
      setMessage("Restaurante modificado exitosamente");
      // Actualiza la lista localmente para reflejar los cambios
      setRestaurants(
        restaurants.map((r) =>
          r.id === editRestaurant.id ? editRestaurant : r
        )
      );
      setEditRestaurant(null); // Cierra el modal
    } catch (error) {
      console.error(
        "Error al modificar restaurante:",
        error.response?.data || error.message
      );
      setMessage("Error al modificar el restaurante");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditRestaurant({ ...editRestaurant, [name]: value });
  };

  return (
    <div className="search-restaurants container mt-5">
      <h2 className="mb-4">Buscar Restaurantes por Ciudad y Capacidad</h2>
      <div className="mb-3">
        <label className="form-label">Ciudad:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Ingresa la ciudad"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Capacidad de Mesa:</label>
        <input
          type="number"
          className="form-control"
          min="1"
          value={capacity}
          onChange={(e) => setCapacity(parseInt(e.target.value, 10) || 0)} // Conviertes el valor a un número
        />
      </div>
      <button className="btn btn-primary mb-4" onClick={handleSearch}>
        Buscar
      </button>
      {message && <p className="text-success">{message}</p>}
      <h3>Resultados</h3>
      {restaurants.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Ubicación</th>
              <th>Teléfono</th>
              <th>Latitud</th>
              <th>Longitud</th>
              <th>Capacidad</th>
              <th>Acciones</th>
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
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => handleEdit(restaurant)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(restaurant.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>
          No hay restaurantes disponibles en esta ciudad para la capacidad
          especificada.
        </p>
      )}

      {/* Modal para editar restaurante */}
      {editRestaurant && (
        <div
          className="modal"
          style={{ display: "block", background: "rgba(0, 0, 0, 0.8)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Restaurante</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditRestaurant(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre:</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={editRestaurant.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ubicación:</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    value={editRestaurant.location}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Teléfono:</label>
                  <input
                    type="text"
                    name="telephone"
                    className="form-control"
                    value={editRestaurant.telephone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Capacidad:</label>
                  <input
                    type="number"
                    name="capacity"
                    className="form-control"
                    value={editRestaurant.capacity}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditRestaurant(null)}
                >
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={handleSaveEdit}>
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchRestaurants;
