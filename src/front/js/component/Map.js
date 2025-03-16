import React, { useEffect } from "react";

const Map = ({ restaurants }) => {
  useEffect(() => {
    // Inicializar el mapa centrado en un punto predeterminado (ej. Madrid, España)
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 40.416775, lng: -3.703790 }, // Coordenadas iniciales
      zoom: 12,
    });

    // Crear límites dinámicos para ajustar la vista del mapa
    const bounds = new window.google.maps.LatLngBounds();

    // Validación de restaurantes con coordenadas válidas
    const validRestaurants = restaurants.filter(
      (restaurant) => restaurant.latitude && restaurant.longitude
    );

    // Agregar marcadores y extender límites
    validRestaurants.forEach((restaurant) => {
      const marker = new window.google.maps.Marker({
        position: { lat: restaurant.latitude, lng: restaurant.longitude },
        map,
        title: restaurant.name,
      });

      // Agregar las coordenadas del restaurante a los límites del mapa
      bounds.extend(new window.google.maps.LatLng(restaurant.latitude, restaurant.longitude));

      // Mostrar información al hacer clic en un marcador
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div><h3>${restaurant.name}</h3><p>${restaurant.location}</p><p>Capacidad: ${restaurant.capacity}</p></div>`,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
    });

    // Ajustar el mapa para mostrar todos los marcadores
    if (validRestaurants.length > 0) {
      map.fitBounds(bounds);
    }
  }, [restaurants]);

  return <div id="map" style={{ width: "100%", height: "500px" }}></div>;
};

export default Map;
