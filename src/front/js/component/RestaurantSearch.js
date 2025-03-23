// import React, { useState, useEffect, useContext } from "react";
// import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
// import PlacesAutocomplete from "react-places-autocomplete";
// import { Context } from "../store/appContext";

// const libraries = ["places"];

// const RestaurantSearch = ({ onSelect }) => {
//   const [address, setAddress] = useState("");
//   const [position, setPosition] = useState({ lat: 40.7128, lng: -74.0060 });
//   const { store, actions } = useContext(Context);

//   useEffect(() => {
//     actions.getAllRestaurants();
//   }, [actions]);

//   const handleSelect = (selectedAddress) => {
//     setAddress(selectedAddress);
//     const geocoder = new window.google.maps.Geocoder();
//     geocoder.geocode({ address: selectedAddress }, (results, status) => {
//       if (status === "OK") {
//         const lat = results[0].geometry.location.lat();
//         const lng = results[0].geometry.location.lng();
//         setPosition({ lat, lng });
//         onSelect(lat, lng, selectedAddress);
//       } else {
//         alert("No se pudo obtener la ubicación");
//       }
//     });
//   };

//   return (
//     <LoadScript googleMapsApiKey={process.env.MAP_KEY} libraries={libraries}>
//       <div>
//         <h2>Buscar un Restaurante</h2>
//         <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
//           {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
//             <div>
//               <input {...getInputProps({ placeholder: "Ingresa una dirección..." })} />
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

//         <GoogleMap
//           mapContainerStyle={{ width: "100%", height: "400px" }}
//           center={position}
//           zoom={15}
//         >
//           <Marker position={position} />
//           {/* Render ristoranti sulla mappa */}
//           {store.restaurants && store.restaurants.map((restaurant) => (
//             <Marker
//               key={restaurant.id}
//               position={{ lat: restaurant.latitude, lng: restaurant.longitude }}
//               label={restaurant.name}
//             />
//           ))}
//         </GoogleMap>
//       </div>
//     </LoadScript>
//   );
// };

// export default RestaurantSearch;


import React, { useState, useEffect, useContext } from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import PlacesAutocomplete from "react-places-autocomplete";
import { Context } from "../store/appContext";
import "../../styles/RestaurantSearch.css";


const libraries = ["places"];

const RestaurantSearch = ({ onSelect }) => {
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState({ lat: 40.7128, lng: -74.0060 });
  const [cuisineType, setCuisineType] = useState(""); // Stato per il tipo di cucina
  const { store, actions } = useContext(Context);

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
    // Logica per la ricerca
    console.log("Búsqueda de restaurantes para la zona:", address, "y tipo de cocina:", cuisineType);
    // Chiamata per cercare i ristoranti in base alla zona e al tipo di cucina (questa parte deve essere implementata)
  };

  return (
    <LoadScript googleMapsApiKey={process.env.MAP_KEY} libraries={libraries}>
      <div className="container">
        <h2>Buscar un Restaurante</h2>
        {/* Sezione di ricerca con due input e un pulsante */}
        <div className="search-fields">
          <div className="input-group">
            
            <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div className="input-wrapper">
                  <input
                    {...getInputProps({ placeholder: "Indica la zona de tu búsqueda" })}
                    className="search-input"
                  />
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
            <input
              type="text"
              placeholder="Tipo de cocina"
              value={cuisineType}
              onChange={(e) => setCuisineType(e.target.value)}
              className="search-input"
            />
          </div>

          <button className="search-btn" onClick={handleSearch}>Buscar</button>
        </div>

        {/* Mappa di Google */}
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "400px" }}
          center={position}
          zoom={15}
        >
          <Marker position={position} />
          {/* Render ristoranti sulla mappa */}
          {store.restaurants &&
            store.restaurants.map((restaurant) => (
              <Marker
                key={restaurant.id}
                position={{ lat: restaurant.latitude, lng: restaurant.longitude }}
                label={restaurant.name}
              />
            ))}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default RestaurantSearch;
