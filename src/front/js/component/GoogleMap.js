import React from "react";
import { GoogleMap as Map, Marker, LoadScript } from "@react-google-maps/api"; // Componentes necesarios

const GoogleMap = ({ center }) => {
    return (
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
            <Map
                center={center} // Muestra el mapa centrado en la ubicación
                zoom={14} // Nivel de zoom
                mapContainerStyle={{ width: "100%", height: "400px" }} // Estilo del mapa
            >
                <Marker position={center} /> {/* Marcador en la ubicación */}
            </Map>
        </LoadScript>
    );
};

export default GoogleMap;
