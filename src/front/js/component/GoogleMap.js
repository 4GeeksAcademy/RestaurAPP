import React, { useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MyMapComponent = ({ restaurantes }) => {
  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  const center = {
    lat: 40.712776, //( fijo : New York)
    lng: -74.005974 //( fijo : New York)
  };

 
  const isValidLatLng = (lat, lng) => {
    return !isNaN(lat) && !isNaN(lng) && lat !== null && lng !== null;
  };

  useEffect(() => {
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
          const lat = restaurant.latitude;  
          const lng = restaurant.longitude;

          // Log delle coordinate prima di passare a setPosition
          console.log(`Coordinate ristorante ${index}: lat = ${lat}, lng = ${lng}`);

          // Verifica se latitudine e longitudine siano validi
          if (isValidLatLng(lat, lng)) {
            return (
              <Marker
                key={index}
                position={{ lat, lng }}
              />
            );
          } else {
            console.error(`Coordinate non valide per il ristorante ${restaurant.name}: lat: ${lat}, lng: ${lng}`);
            return null;
          }
        })}
      </GoogleMap>
    </LoadScript>
  );
};

export default MyMapComponent;



