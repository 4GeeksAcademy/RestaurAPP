import React, { useEffect } from "react";

const Map = ({ restaurants }) => {
  useEffect(() => {
    // Inicializar el mapa centrado en un punto predeterminado (ej. Madrid, España)
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 40.416775, lng: -3.703790 }, // Coordenadas iniciales
      zoom: 12,
    });

    // Agregar marcadores para cada restaurante
    restaurants.forEach((restaurant) => {
      const marker = new window.google.maps.Marker({
        position: { lat: restaurant.latitude, lng: restaurant.longitude },
        map,
        title: restaurant.name,
      });

      // Mostrar información al hacer clic en un marcador
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div><h3>${restaurant.name}</h3><p>${restaurant.location}</p><p>Capacidad: ${restaurant.capacity}</p></div>`,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
    });
  }, [restaurants]);

  return <div id="map" style={{ width: "100%", height: "500px" }}></div>;
};

export default Map;
