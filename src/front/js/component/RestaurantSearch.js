import React, { useState, useEffect, useContext } from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import PlacesAutocomplete from "react-places-autocomplete";
import { Context } from "../store/appContext";
import "../../styles/RestaurantSearch.css";

const libraries = ["places"];

// Funzione per calcolare la distanza tra due coordinate con la formula di Haversine
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (angle) => (Math.PI / 180) * angle;
  const R = 6371; // Raggio della Terra in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distanza in km
};

const RestaurantSearch = ({ onSelect }) => {
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState({ lat: 40.7128, lng: -74.006 });
  const [cuisineType, setCuisineType] = useState(""); // Tipo de cocina
  const { store, actions } = useContext(Context);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  useEffect(() => {
    actions.getAllRestaurants();
  }, [actions]);

  const handleSelect = (selectedAddress) => {
    setAddress(selectedAddress);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: selectedAddress }, (results, status) => {
      if (status === "OK") {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        setPosition({ lat, lng });
        onSelect(lat, lng, selectedAddress);
      } else {
        alert("No se pudo obtener la ubicación");
      }
    });
  };

  const handleSearch = () => {
    console.log("Búsqueda de restaurantes para la zona:", address, "y tipo de cocina:", cuisineType);

    const filtered = store.restaurants.filter((restaurant) => {
      const distance = haversineDistance(
        position.lat,
        position.lng,
        restaurant.latitude,
        restaurant.longitude
      );
      return distance <= 10; // Filtra los rest entre de 10 km
    });

    setFilteredRestaurants(filtered);
  };

  return (
    <LoadScript googleMapsApiKey={process.env.MAP_KEY} libraries={libraries}>
      <div className="container">
        <h2>Buscar un Restaurante</h2>

        {/* Sezione di ricerca */}
        <div className="search-fields">
          <div className="input-group">
            <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div className="input-wrapper">
                  <input {...getInputProps({ placeholder: "Indica la zona de tu búsqueda" })} className="search-input" />
                  <div className="suggestions">
                    {loading && <div>Cargando...</div>}
                    {suggestions.map((suggestion) => (
                      <div {...getSuggestionItemProps(suggestion)} key={suggestion.placeId}>
                        {suggestion.description}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
          </div>

          <div className="input-group">
            <input type="text" placeholder="Tipo de cocina" value={cuisineType} onChange={(e) => setCuisineType(e.target.value)} className="search-input" />
          </div>

          <button className="search-btn" onClick={handleSearch}>Buscar</button>
        </div>

        {/* Mappa Google */}
        <GoogleMap mapContainerStyle={{ width: "100%", height: "400px" }} center={position} zoom={13}>
          <Marker position={position} />

          {filteredRestaurants.map((restaurant) => (
            <Marker key={restaurant.id} position={{ lat: restaurant.latitude, lng: restaurant.longitude }} label={restaurant.name} />
          ))}
        </GoogleMap>

        {/* Lista rest encontrados */}
        <div className="restaurant-list">
          <h3 className="mt-3">Restaurantes en la zona</h3>
          {filteredRestaurants.length === 0 ? (
            <p>No hay restaurante para la zona seleccionada.</p>
          ) : (
            <ul>
              {filteredRestaurants.map((restaurant) => (
                <li key={restaurant.id}>
                  <strong>{restaurant.name}</strong> - {restaurant.location} <br />
                  <small>Tel: {restaurant.telephone} | Capacidad: {restaurant.capacity}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </LoadScript>
  );
};

export default RestaurantSearch;
