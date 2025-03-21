import { useEffect, useRef } from 'react';

const SearchAddress = ({ onAddressSelect }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
    autocomplete.setFields(["address_components", "geometry"]);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        onAddressSelect(location);
      }
    });
  }, [onAddressSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Buscar una dirección"
      style={{ width: "100%", padding: "10px" }}
    />
  );
};

export default SearchAddress;
