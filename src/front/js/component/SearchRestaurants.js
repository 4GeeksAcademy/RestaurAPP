import React, { useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || 'https://zany-space-lamp-r5wg7q95j5xfw4j-3001.app.github.dev';

const SearchRestaurants = () => {
    const [city, setCity] = useState("");
    const [capacity, setCapacity] = useState(1);
    const [restaurants, setRestaurants] = useState([]);
    const [editRestaurant, setEditRestaurant] = useState(null);
    const [message, setMessage] = useState("");

    const handleSearch = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/restaurants`, {
                params: { location: city, capacity }
            });
            setRestaurants(response.data);
        } catch (error) {
            console.error("Error fetching restaurants:", error);
        }
    };

    const handleDelete = async (restaurantId) => {
        try {
            await axios.delete(`${BACKEND_URL}/api/restaurants/${restaurantId}`);
            setRestaurants(restaurants.filter(restaurant => restaurant.id !== restaurantId));
        } catch (error) {
            console.error("Error deleting restaurant:", error);
        }
    };

    const handleEdit = (restaurant) => {
        setEditRestaurant({ ...restaurant }); // Abre el modal y carga los datos del restaurante
    };

    const handleSaveEdit = async () => {
        try {
            await axios.put(`${BACKEND_URL}/api/restaurants/${editRestaurant.id}`, editRestaurant);
            setMessage("Restaurante modificado exitosamente");
            // Actualiza la lista localmente para reflejar los cambios
            setRestaurants(restaurants.map(r => r.id === editRestaurant.id ? editRestaurant : r));
            setEditRestaurant(null); // Cierra el modal
        } catch (error) {
            console.error("Error updating restaurant:", error);
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
                    onChange={(e) => setCapacity(e.target.value)}
                />
            </div>
            <button className="btn btn-primary mb-4" onClick={handleSearch}>Buscar</button>
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
                                    <button className="btn btn-warning me-2" onClick={() => handleEdit(restaurant)}>Editar</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(restaurant.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay restaurantes disponibles en esta ciudad para la capacidad especificada</p>
            )}

            {/* Modal para editar restaurante */}
            {editRestaurant && (
                <div className="modal" style={{ display: "block", background: "rgba(0, 0, 0, 0.8)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Editar Restaurante</h5>
                                <button className="btn-close" onClick={() => setEditRestaurant(null)}></button>
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
                                <button className="btn btn-secondary" onClick={() => setEditRestaurant(null)}>Cancelar</button>
                                <button className="btn btn-success" onClick={handleSaveEdit}>Guardar Cambios</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchRestaurants;
