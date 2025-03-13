import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

const RequestReservation = () => {
  const { store, actions } = useContext(Context);
  const [searchData, setSearchData] = useState({ location:"", people:"" });
  const [phoneNumber, setPhoneNumber] = useState(""); // Para identificar al diner
  const [selectedRestaurant, setSelectedRestaurant] = useState(""); // ID del restaurante
  const [reservationData, setReservationData] = useState({
    date: "",
    hour: "",
    name: "",
    email: ""
  });
  const [message, setMessage] = useState("");

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchData({ ...searchData, [name]: value });
  };

  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleReservationDataChange = (e) => {
    const { name, value } = e.target;
    setReservationData({ ...reservationData, [name]: value });
  };

  const searchRestaurants = async () => {
    if (!searchData.location || !searchData.people) {
      setMessage("Por favor ingresa localidad y número de personas.");
      return;
    }

    await actions.getAvailableRestaurants(searchData.location, parseInt(searchData.people));
  };

  const handleReservation = async () => {
    if (!selectedRestaurant || !phoneNumber) {
      setMessage("Selecciona un restaurante y proporciona tu número de teléfono.");
      return;
    }

    // Verificar si el usuario ya está registrado en la base de datos
    const diner = store.diners.find(d => d.telephone === phoneNumber);

    if (diner) {
      // Diner registrado: solo pedir fecha y hora
      await actions.createReservation({
        id_fk_restaurant: selectedRestaurant,
        id_fk_diner: diner.id,
        date: reservationData.date,
        hour: reservationData.hour,
        people: parseInt(searchData.people)
      });
    } else {
      // Diner no registrado: pedir nombre, correo electrónico, fecha y hora
      await actions.createReservation({
        id_fk_restaurant: selectedRestaurant,
        phone: phoneNumber,
        name: reservationData.name,
        email: reservationData.email,
        date: reservationData.date,
        hour: reservationData.hour,
        people: parseInt(searchData.people)
      });
    }

    setMessage("Reserva realizada exitosamente.");
  };

  return (
    <div className="container">
      <h1>Buscar Restaurante y Reservar</h1>

      {/* Formulario de Búsqueda */}
      <input
        type="text"
        name="location"
        placeholder="Localidad"
        value={searchData.location}
        onChange={handleSearchChange}
      />
      <input
        type="number"
        name="people"
        placeholder="Número de Personas"
        value={searchData.people}
        onChange={handleSearchChange}
      />
      <input
        type="text"
        placeholder="Teléfono"
        value={phoneNumber}
        onChange={handlePhoneChange}
      />
      <button onClick={searchRestaurants}>Buscar Restaurantes</button>

      {/* Lista de Restaurantes Disponibles */}
      {store.availableRestaurants?.length > 0 && (
        <div>
          <h2>Restaurantes Disponibles</h2>
          <ul>
            {store.availableRestaurants.map((restaurant) => (
              <li key={restaurant.id}>
                {restaurant.name} - {restaurant.location}
                <button onClick={() => setSelectedRestaurant(restaurant.id)}>
                  Seleccionar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Formulario de Reserva */}
      {selectedRestaurant && (
        <div>
          <h2>Completar Reserva</h2>
          <input
            type="date"
            name="date"
            placeholder="Fecha"
            value={reservationData.date}
            onChange={handleReservationDataChange}
          />
          <input
            type="time"
            name="hour"
            placeholder="Hora"
            value={reservationData.hour}
            onChange={handleReservationDataChange}
          />
          {!store.diners.find(d => d.telephone === phoneNumber) && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={reservationData.name}
                onChange={handleReservationDataChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Correo Electrónico"
                value={reservationData.email}
                onChange={handleReservationDataChange}
              />
            </>
          )}
          <button onClick={handleReservation}>Reservar</button>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default RequestReservation;
