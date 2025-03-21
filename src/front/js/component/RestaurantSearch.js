// import React, { useState } from "react";
// import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
// import PlacesAutocomplete from "react-places-autocomplete";

// // Estilos del contenedor del mapa
// const mapContainerStyle = {
//   width: "100%",
//   height: "400px",
// };

// // Ubicación inicial por defecto (puedes cambiarla a tu ciudad)
// const defaultCenter = { lat: 41.9028, lng: 12.4964 }; // Roma

// const RestaurantSearch = ({ onSelect }) => {
//   console.log("MAP_KEY:", process.env.MAP_KEY);
//   const [address, setAddress] = useState(""); // Estado para la dirección ingresada
//   const [position, setPosition] = useState(defaultCenter); // Estado para la posición en el mapa

//   // Función que se ejecuta cuando el usuario selecciona una dirección
//   const handleSelect = (selectedAddress) => {
//     setAddress(selectedAddress);
//     const geocoder = new window.google.maps.Geocoder(); // Inicializa el geocodificador

//     geocoder.geocode({ address: selectedAddress }, (results, status) => {
//       if (status === "OK") {
//         const lat = results[0].geometry.location.lat(); // Obtiene la latitud
//         const lng = results[0].geometry.location.lng(); // Obtiene la longitud
//         setPosition({ lat, lng }); // Actualiza la posición en el mapa
//         onSelect(lat, lng, selectedAddress); // Envía los datos al componente padre
//       } else {
//         alert("No se pudo obtener la ubicación"); // Muestra una alerta si hay un error
//       }
//     });
//   };

//   const key=process.env.MAP_KEY


//   return (
//     <LoadScript googleMapsApiKey={key} libraries={["places"]}>
//       <div>
//         <h2>Buscar un Restaurante</h2>
        
//         {/* Input de autocompletado para buscar direcciones */}
//         <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
//           {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
//             <div>
//               <input {...getInputProps({ placeholder: "Ingrese una dirección..." })} />
//               <div>
//                 {loading && <div>Cargando...</div>}
//                 {suggestions.map((suggestion) => (
//                   <div {...getSuggestionItemProps(suggestion)} key={suggestion.placeId}>
//                     {suggestion.description}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </PlacesAutocomplete>

//         {/* Mapa de Google con un marcador en la ubicación seleccionada */}
//         <GoogleMap mapContainerStyle={mapContainerStyle} center={position} zoom={15}>
//           <Marker position={position} />
//         </GoogleMap>
//       </div>
//     </LoadScript>
//   );
// };

// export default RestaurantSearch;


import React, { useState } from "react"; // Importa React
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import PlacesAutocomplete from "react-places-autocomplete";

// Definir las librerías fuera del componente para evitar recargas innecesarias
const libraries = ["places"];

const RestaurantSearch = ({ onSelect }) => {
  console.log("MAP_KEY:", process.env.MAP_KEY); // Verificar que la clave API está correcta
  const [address, setAddress] = useState(""); // Estado para la dirección
  const [position, setPosition] = useState({ lat: 40.7128, lng: -74.0060 }); // Posición inicial (Ejemplo: Nueva York)

  // Función para manejar la selección de la dirección
  const handleSelect = (selectedAddress) => {
    setAddress(selectedAddress);
    const geocoder = new window.google.maps.Geocoder();

    // Obtener latitud y longitud de la dirección seleccionada
    geocoder.geocode({ address: selectedAddress }, (results, status) => {
      if (status === "OK") {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        setPosition({ lat, lng });
        onSelect(lat, lng, selectedAddress); // Llamar la función onSelect con la nueva posición
      } else {
        alert("No se pudo obtener la ubicación");
      }
    });
  };

  return (
    <LoadScript googleMapsApiKey={process.env.MAP_KEY} libraries={libraries}>
      <div>
        <h2>Buscar un Restaurante</h2>
        {/* Input para autocompletar la dirección */}
        <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <input {...getInputProps({ placeholder: "Ingresa una dirección..." })} />
              <div>
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

        {/* Mapa de Google con el marcador */}
        <GoogleMap mapContainerStyle={{ width: "100%", height: "400px" }} center={position} zoom={15}>
          <Marker position={position} />
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default RestaurantSearch;
