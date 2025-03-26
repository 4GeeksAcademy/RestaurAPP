import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import CloudinaryUploader from "./CloudinaryUploader";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places"];

const CreateRestaurant = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [telephone, setTelephone] = useState("");
  const [capacity, setCapacity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [autocomplete, setAutocomplete] = useState(null);

  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  // Carga API Google Maps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.MAP_KEY,
    libraries: libraries,
  });

  useEffect(() => {
    if (id) {
      const restaurant = store.restaurants.find((r) => r.id === parseInt(id));
      if (restaurant) {
        setName(restaurant.name);
        setLocation(restaurant.location);
        setTelephone(restaurant.telephone);
        setCapacity(restaurant.capacity);
        setImageUrl(restaurant.image_url || "");
        setLatitude(restaurant.latitude || "");
        setLongitude(restaurant.longitude || "");
      } else {
        setErrorMessage("Restaurante no encontrado.");
      }
    }
  }, [id, store.restaurants]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!latitude || !longitude) {
      setErrorMessage("Seleccione una dirección valida.");
      return;
    }

    const restaurantData = {
      name,
      location,
      telephone,
      capacity,
      image_url: imageUrl,
      latitude,
      longitude,
    };

    if (token) {
      if (id) {
        actions
          .modifyRestaurant(id, restaurantData, token)
          .then(() => navigate("/owners/dashboard"))
          .catch(() => setErrorMessage("Error en la modificación del restaurante."));
      } else {
        actions
          .createRestaurant(restaurantData, token)
          .then(() => {
            setSuccessMessage("Restaurante creado exitosamente!");
            // navigate("/owners/dashboard");
          })
          .catch(() => {
            setErrorMessage("Error en la creacción del restaurante.");
          });
      }
    } else {
      setErrorMessage("Token no disponibile.");
    }
  };

  return (
    <>
      <div className="container d-flex justify-content-between align-items-center mt-3">
        <h1>Detalles de tu restaurante</h1>
        <button className="btn btn-primary" onClick={() => navigate("/owners/dashboard")}>
          Vuelva al dashboard
        </button>
      </div>

      {store.auth === true ? (
        <form className="container mt-4" onSubmit={handleSubmit}>
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          {/* Upload imagen */}
          <div className="mb-3">
            <label htmlFor="image" className="form-label">Imagen del restaurante</label>
            <CloudinaryUploader setImageUrl={setImageUrl} setErrorMessage={setErrorMessage} />
            {imageUrl && (
              <div className="mt-2">
                <img src={imageUrl} alt="Immagine del ristorante" className="img-fluid" />
              </div>
            )}
          </div>

          {/* Nombre del rest */}
          <div className="mb-3">
            <label htmlFor="restaurantName" className="form-label">Nombre del restaurante</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              id="restaurantName"
              required
            />
          </div>

          {/* Ubicación con Autocomplete */}
          {isLoaded && (
            <div className="mb-3">
              <label htmlFor="location" className="form-label">Ubicación</label>
              <Autocomplete
                onLoad={(auto) => setAutocomplete(auto)}
                onPlaceChanged={() => {
                  if (autocomplete) {
                    const place = autocomplete.getPlace();
                    if (place.geometry) {
                      setLocation(place.formatted_address);
                      setLatitude(place.geometry.location.lat());
                      setLongitude(place.geometry.location.lng());
                    }
                  }
                }}
              >
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="form-control"
                  id="location"
                  required
                />
              </Autocomplete>
            </div>
          )}

          {/* Telefóno */}
          <div className="mb-3">
            <label htmlFor="telephone" className="form-label">Telefóno</label>
            <input
              type="text"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="form-control"
              id="telephone"
              required
            />
          </div>

          {/* Capacidad */}
          <div className="mb-3">
            <label htmlFor="capacity" className="form-label">Capacidad</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="form-control"
              id="capacity"
              required
            />
          </div>

          {/* Lat y Long (escondidas) */}
          <input type="hidden" value={latitude} readOnly />
          <input type="hidden" value={longitude} readOnly />

          {/* send button */}
          <button type="submit" className="btn btn-primary">

            {id ? "Guardar Cambios" : "Crear Restaurante"}

          </button>
        </form>
      ) : (
        <Navigate to="/owners/login" />
      )}
    </>
  );
};

export default CreateRestaurant;
