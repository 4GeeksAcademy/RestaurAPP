import React, { useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MyMapComponent = ({ restaurantes }) => {
  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  const center = {
    lat: 40.712776, // Latitudine predefinita (es. New York)
    lng: -74.005974 // Longitudine predefinita (es. New York)
  };

  // Funzione per verificare se una coordinata è valida
  const isValidLatLng = (lat, lng) => {
    return !isNaN(lat) && !isNaN(lng) && lat !== null && lng !== null;
  };

  useEffect(() => {
    // Log per vedere quali coordinate stai ricevendo
    restaurantes.forEach((restaurant, index) => {
      console.log(`Ristorante ${index}:`, restaurant);
    });
  }, [restaurantes]);

  return (
    <LoadScript googleMapsApiKey="process.env.MAP_KEY">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
      >
        {restaurantes.map((restaurant, index) => {
          const lat = restaurant.latitude;  // Assicurati di usare `latitude`
          const lng = restaurant.longitude; // Assicurati di usare `longitude`

          // Log delle coordinate prima di passare a setPosition
          console.log(`Coordinate ristorante ${index}: lat = ${lat}, lng = ${lng}`);

          // Verifica che latitudine e longitudine siano validi
          if (isValidLatLng(lat, lng)) {
            return (
              <Marker
                key={index}
                position={{ lat, lng }}  // Passa le coordinate corrette
              />
            );
          } else {
            // Log per errori di coordinate non valide
            console.error(`Coordinate non valide per il ristorante ${restaurant.name}: lat: ${lat}, lng: ${lng}`);
            return null; // Non aggiunge il marker se le coordinate non sono valide
          }
        })}
      </GoogleMap>
    </LoadScript>
  );
};

export default MyMapComponent;



