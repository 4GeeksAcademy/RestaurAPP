// import React, { useEffect, useRef } from 'react';

// const SearchAddress = ({ onAddressSelect }) => {
//   const inputRef = useRef(null);

//   useEffect(() => {
//     const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
//     autocomplete.setFields(["address_components", "geometry"]);

//     autocomplete.addListener("place_changed", () => {
//       const place = autocomplete.getPlace();
//       if (place.geometry) {
//         const location = {
//           lat: place.geometry.location.lat(),
//           lng: place.geometry.location.lng(),
//         };
//         onAddressSelect(location);
//       }
//     });
//   }, [onAddressSelect]);

//   return (
//     <input
//       ref={inputRef}
//       type="text"
//       placeholder="Buscar una dirección"
//       style={{ width: "100%", padding: "10px" }}
//     />
//   );
// };

// export default SearchAddress;


// import React, { useEffect, useRef } from 'react';

// const SearchAddress = ({ onAddressSelect }) => {
//   const inputRef = useRef(null);

//   useEffect(() => {
//     // Verifica se la libreria di Google Maps è caricata
//     if (window.google && window.google.maps) {
//       const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
//       autocomplete.setFields(["address_components", "geometry"]);

//       autocomplete.addListener("place_changed", () => {
//         const place = autocomplete.getPlace();
//         if (place.geometry) {
//           const location = {
//             lat: place.geometry.location.lat(),
//             lng: place.geometry.location.lng(),
//           };
//           const address = place.formatted_address;  // Ottieni l'indirizzo completo

//           // Passa latitudine, longitudine e indirizzo al genitore
//           onAddressSelect(location, address);
//         }
//       });
//     } else {
//       console.error("Google Maps non è caricato correttamente.");
//     }
//   }, [onAddressSelect]);

//   return (
//     <input
//       ref={inputRef}
//       type="text"
//       placeholder="Cerca un indirizzo"
//       style={{ width: "100%", padding: "10px" }}
//     />
//   );
// };

// export default SearchAddress;
