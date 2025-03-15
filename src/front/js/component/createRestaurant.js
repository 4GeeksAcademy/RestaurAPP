import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate } from "react-router-dom";
import { Link } from "react-router-dom";


const CreateRestaurant = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [telephone, setTelephone] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [capacity, setCapacity] = useState("");

  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/owners/login");
    }
  }, [token, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRestaurant = {
      name,
      location,
      telephone,
      latitude,
      longitude,
      capacity,
    };

    if (token) {
      // Asegúrate de que el token sea pasado correctamente
      actions.createRestaurant(newRestaurant, token)
        .then(() => {
          navigate("/restaurants");
        })
        .catch((error) => {
          console.error("Error al crear restaurante:", error);
        });
    } else {
      console.error("Token is not available");
    }
  };

  return (
    <>
      <h1 className="container mt-3">Crear Nuevo Restaurante</h1>
      {store.auth === true ? (
        <form className="container mt-4" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="restaurantName" className="form-label">
              Nombre del Restaurante
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              id="restaurantName"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="location" className="form-label">
              Ubicacion
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="form-control"
              id="location"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="telephone" className="form-label">
              Telefono
            </label>
            <input
              type="text"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="form-control"
              id="telephone"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="latitude" className="form-label">
              Latitud
            </label>
            <input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="form-control"
              id="latitude"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="longitude" className="form-label">
              Longitud
            </label>
            <input
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="form-control"
              id="longitude"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="capacity" className="form-label">
              Capacidad
            </label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="form-control"
              id="capacity"
              required
            />
          </div>
          <Link to="/owners/dashboard">
          <button type="submit" className="btn btn-primary">
            Crear Restaurante
          </button>
          </Link>
        </form>
      ) : (
        <Navigate to="/owners/login" />
      )}
    </>
  );
};

export default CreateRestaurant;
