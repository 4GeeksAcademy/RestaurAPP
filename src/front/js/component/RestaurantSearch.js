// import React, { useState, useEffect, useContext } from "react";
// import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
// import PlacesAutocomplete from "react-places-autocomplete";
// import { Context } from "../store/appContext";
// import "../../styles/RestaurantSearch.css";
// import { Link } from "react-router-dom";

// const libraries = ["places"];

// // Funzione per calcolare la distanza tra due coordinate con la formula di Haversine
// const haversineDistance = (lat1, lon1, lat2, lon2) => {
//   const toRad = (angle) => (Math.PI / 180) * angle;
//   const R = 6371; // Raggio della Terra in km
//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(toRad(lat1)) *
//     Math.cos(toRad(lat2)) *
//     Math.sin(dLon / 2) *
//     Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; // Distanza in km
// };

// const RestaurantSearch = ({ onSelect }) => {
//   const [address, setAddress] = useState("");
//   const [position, setPosition] = useState({ lat: 40.7128, lng: -74.006 });
//   const [cuisineType, setCuisineType] = useState(""); // Tipo de cocina
//   const { store, actions } = useContext(Context);
//   const [filteredRestaurants, setFilteredRestaurants] = useState([]);
//   const [restaurantStars, setRestaurantStars] = useState({});

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

//   const handleSearch = () => {
//     console.log("Búsqueda de restaurantes para la zona:", address, "y tipo de cocina:", cuisineType);

//     const filtered = store.restaurants.filter((restaurant) => {
//       const distance = haversineDistance(
//         position.lat,
//         position.lng,
//         restaurant.latitude,
//         restaurant.longitude
//       );
//       return distance <= 10;
//     });

//     setFilteredRestaurants(filtered);
//   };

//   return (
//     <LoadScript googleMapsApiKey={process.env.MAP_KEY} libraries={libraries}>
//       <div className="container">
//         <h2>Buscar un Restaurante</h2>

//         <div className="search-fields">
//           <div className="input-group">
//             <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
//               {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
//                 <div className="input-wrapper">
//                   <input {...getInputProps({ placeholder: "Indica la zona de tu búsqueda" })} className="search-input" />
//                   <div className="suggestions">
//                     {loading && <div>Cargando...</div>}
//                     {suggestions.map((suggestion) => (
//                       <div {...getSuggestionItemProps(suggestion)} key={suggestion.placeId}>
//                         {suggestion.description}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </PlacesAutocomplete>
//           </div>

//           <div className="input-group">
//             <input type="text" placeholder="Tipo de cocina" value={cuisineType} onChange={(e) => setCuisineType(e.target.value)} className="search-input" />
//           </div>

//           <button className="search-btn" onClick={handleSearch}>Buscar</button>
//         </div>

//         <div className="row">
//           <div className="col-md-6">
//             <div className="restaurant-list">
//               <h3 className="mt-3">Restaurantes en la zona</h3>
//               {filteredRestaurants.length === 0 ? (
//                 <p>Seleccione una zona</p>
//               ) : (
//                 <div className="row">
//                   {filteredRestaurants.map((restaurant) => (
//                     <div className="col-md-4 mb-4" key={restaurant.id}>
//                       <div className="card card-img-scale overflow-hidden bg-transparent rounded-3 shadow-sm">
//                         <div className="card-img-wrapper rounded-3">
//                           <img
//                             src={restaurant.image_url || "default_image_url_here"}
//                             className="card-img"
//                             alt="restaurant image"
//                             style={{ height: "200px", objectFit: "cover" }}
//                           />
//                         </div>
//                         <div className="card-body px-2">
//                           <h5 className="card-title d-flex justify-content-between">
//                             <Link to={`/perfil_restaurant/${restaurant.id}`} className="stretched-link">
//                               {restaurant.name}
//                             </Link>
//                             <h6>d</h6> 
//                           </h5>

//                           <div className="d-flex justify-content-between align-items-center">
//                             <h6 className="text-success mb-0">
//                               <small className="fw-light">Capacidad {restaurant.capacity} Personas</small>
//                             </h6>

//                             <h6 className="mb-0 d-flex align-items-center ms-auto">
//                               <i className="fas fa-map-marker-alt me-2"></i>
//                               {restaurant.location}
//                             </h6>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="col-md-6">
//             <GoogleMap mapContainerStyle={{ width: "100%", height: "400px" }} center={position} zoom={13}>
//               <Marker position={position} />

//               {filteredRestaurants.map((restaurant) => (
//                 <Marker key={restaurant.id} position={{ lat: restaurant.latitude, lng: restaurant.longitude }} label={restaurant.name} />
//               ))}
//             </GoogleMap>
//           </div>
//         </div>
//       </div>
//     </LoadScript>
//   );
// };

// export default RestaurantSearch;




// import React, { useState, useEffect, useContext } from "react"; 
// import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
// import PlacesAutocomplete from "react-places-autocomplete";
// import { Context } from "../store/appContext";
// import "../../styles/RestaurantSearch.css";
// import { Link } from "react-router-dom";

// const libraries = ["places"];

// const haversineDistance = (lat1, lon1, lat2, lon2) => {
//   const toRad = (angle) => (Math.PI / 180) * angle;
//   const R = 6371; // Raggio della Terra in km
//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(toRad(lat1)) *
//     Math.cos(toRad(lat2)) *
//     Math.sin(dLon / 2) *
//     Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; // Distanza en km
// };

// const RestaurantSearch = ({ onSelect }) => {
//   const [address, setAddress] = useState("");
//   const [position, setPosition] = useState({ lat: 40.7128, lng: -74.006 });
//   const [cuisineType, setCuisineType] = useState("");
//   const { store, actions } = useContext(Context);
//   const [filteredRestaurants, setFilteredRestaurants] = useState([]);
//   const [restaurantStars, setRestaurantStars] = useState({});

//   useEffect(() => {
//     actions.getAllRestaurants();
//   }, []); // <-- Chiamata solo una volta per evitare il loop infinito

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

//   const handleSearch = () => {
//     console.log("Búsqueda de restaurantes para la zona:", address, "y tipo de cocina:", cuisineType);

//     const filtered = store.restaurants.filter((restaurant) => {
//       const distance = haversineDistance(
//         position.lat,
//         position.lng,
//         restaurant.latitude,
//         restaurant.longitude
//       );
//       return distance <= 10;
//     });

//     setFilteredRestaurants(filtered);
//   };

//   return (
//     <LoadScript googleMapsApiKey={process.env.MAP_KEY} libraries={libraries}>
//       <div className="container">
//         <h2>Buscar un Restaurante</h2>

//         <div className="search-fields">
//           <div className="input-group">
//             <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
//               {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
//                 <div className="input-wrapper">
//                   <input {...getInputProps({ placeholder: "Indica la zona de tu búsqueda" })} className="search-input" />
//                   <div className="suggestions">
//                     {loading && <div>Cargando...</div>}
//                     {suggestions.map((suggestion) => (
//                       <div {...getSuggestionItemProps(suggestion)} key={suggestion.placeId}>
//                         {suggestion.description}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </PlacesAutocomplete>
//           </div>

//           <div className="input-group">
//             <input type="text" placeholder="Tipo de cocina" value={cuisineType} onChange={(e) => setCuisineType(e.target.value)} className="search-input" />
//           </div>

//           <button className="search-btn" onClick={handleSearch}>Buscar</button>
//         </div>

//         <div className="row">
//           <div className="col-md-6">
//             <div className="restaurant-list">
//               <h3 className="mt-3">Restaurantes en la zona</h3>
//               {filteredRestaurants.length === 0 ? (
//                 <p>Seleccione una zona</p>
//               ) : (
//                 <div className="row">       
//                   {filteredRestaurants.map((restaurant) => {
//                     // Assegna stelle casuali se non già assegnate
//                     if (!restaurantStars[restaurant.id]) {
//                       setRestaurantStars((prevStars) => ({
//                         ...prevStars,
//                         [restaurant.id]: Math.floor(Math.random() * 5) + 1,
//                       }));
//                     }

//                     return (
//                       <div className="col-md-4 mb-4" key={restaurant.id}>
//                         <div className="card card-img-scale overflow-hidden bg-transparent rounded-3 shadow-sm">
//                           <div className="card-img-wrapper rounded-3">
//                             <img
//                               src={restaurant.image_url || "default_image_url_here"}
//                               className="card-img"
//                               alt="restaurant image"
//                               style={{ height: "200px", objectFit: "cover" }}
//                             />
//                           </div>
//                           {/* Si el usuario está logueado, mostramos el enlace */}
//                           {store.dinerauth || localStorage.getItem("tokenDiner") ? (
//                             <div className="card-body px-2">
//                               <h5 className="card-title d-flex justify-content-between">
//                                 <Link to={`/perfil_restaurant/${restaurant.id}`} className="stretched-link">
//                                   {restaurant.name}
//                                 </Link>
//                                 <h6>{"⭐".repeat(restaurantStars[restaurant.id] || 1)}</h6> {/* Stelle random */}
//                               </h5>
//                             </div>
//                           ) : (
//                             <span>{restaurant.name}</span>
//                           )}

//                           <div className="d-flex justify-content-between">
//                             <h6>cocina {restaurant.cuisine_type}</h6>
//                             <h6>{restaurant.average_price}</h6>
//                           </div>

//                           <div className="d-flex justify-content-between align-items-center">
//                             <h6 className="text-success mb-0">
//                               <small className="fw-light">Capacidad {restaurant.capacity} Personas</small>
//                             </h6>

//                             <h6 className="mb-0 d-flex align-items-center ms-auto">
//                               <i className="fas fa-map-marker-alt me-2"></i>
//                               {restaurant.location}
//                             </h6>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="col-md-6 mb-5">
//             <GoogleMap mapContainerStyle={{ width: "100%", height: "400px" }} center={position} zoom={13}>
//               <Marker position={position} />

//               {filteredRestaurants.map((restaurant) => (
//                 <Marker key={restaurant.id} position={{ lat: restaurant.latitude, lng: restaurant.longitude }} label={restaurant.name} />
//               ))}
//             </GoogleMap>
//           </div>
//         </div>
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
import { Link } from "react-router-dom";

const libraries = ["places"];

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
  const [cuisineType, setCuisineType] = useState("");
  const { store, actions } = useContext(Context);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [restaurantStars, setRestaurantStars] = useState({});

  useEffect(() => {
    actions.getAllRestaurants();
  }, []);

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
    const filtered = store.restaurants.filter((restaurant) => {
      const distance = haversineDistance(
        position.lat,
        position.lng,
        restaurant.latitude,
        restaurant.longitude
      );
      return distance <= 10;
    });
    setFilteredRestaurants(filtered);
  };

  return (
    <LoadScript googleMapsApiKey={process.env.MAP_KEY} libraries={libraries}>
      <div className="container">
        <h2>Buscar un Restaurante</h2>

        <div className="search-fields">
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

          <input type="text" placeholder="Tipo de cocina" value={cuisineType} onChange={(e) => setCuisineType(e.target.value)} className="search-input" />

          <button className="search-btn" onClick={handleSearch}>Buscar</button>
        </div>

        <div className="row">
          <div className="col-md-6">
            <h3 className="mt-3">Restaurantes en la zona</h3>
            {filteredRestaurants.length === 0 ? (
              <p>Seleccione una zona</p>
            ) : (
              <div className="row">
                {filteredRestaurants.map((restaurant) => {
                  if (!restaurantStars[restaurant.id]) {
                    setRestaurantStars((prevStars) => ({
                      ...prevStars,
                      [restaurant.id]: Math.floor(Math.random() * 5) + 1,
                    }));
                  }

                  return (
                    <div className="col-md-4 mb-4" key={restaurant.id}>
                      <div className="card overflow-hidden bg-transparent rounded-3 shadow-sm">
                        <img src={restaurant.image_url || "default_image_url_here"} className="card-img" alt="restaurant" style={{ height: "200px", objectFit: "cover" }} />
                        <div className="card-body px-2">
                          <h5 className="card-title d-flex justify-content-between">
                            {/* {store.dinerauth || localStorage.getItem("tokenDiner") ? ( */}
                              <Link to={`/perfil_restaurant/${restaurant.id}`} className="stretched-link">{restaurant.name}</Link>
  
                            <h6>{"⭐".repeat(restaurantStars[restaurant.id] || 1)}</h6>
                          </h5>
                          <div className="d-flex justify-content-between">
                            <h6>cocina {restaurant.cuisine_type}</h6>
                            <h6>{restaurant.average_price}</h6>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="text-success mb-0">
                              <small className="fw-light">Capacidad {restaurant.capacity} Personas</small>
                            </h6>
                            <h6 className="mb-0 d-flex align-items-center ms-auto">
                              <i className="fas fa-map-marker-alt me-2"></i>
                              {restaurant.location}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="col-md-6 mb-5">
            <GoogleMap mapContainerStyle={{ width: "100%", height: "400px" }} center={position} zoom={13}>
              <Marker position={position} />
              {filteredRestaurants.map((restaurant) => (
                <Marker key={restaurant.id} position={{ lat: restaurant.latitude, lng: restaurant.longitude }} label={restaurant.name} />
              ))}
            </GoogleMap>
          </div>
        </div>
      </div>
    </LoadScript>
  );
};

export default RestaurantSearch;


