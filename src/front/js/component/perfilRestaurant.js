import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import restaurappImageUrl from "../../img/imagenRestaurapp.jpg";

export const PerfilRestaurant = () => {
  const { store, actions } = useContext(Context);
  const { restaurant_id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [reservationDate, setReservationDate] = useState("");
  const [reservationHour, setReservationHour] = useState("");
  const [peopleCount, setPeopleCount] = useState(1);

  // Estado para controlar la visibilidad del mensaje de éxito
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (restaurant_id) {
      const restaurant = store.restaurants.find((r) => r.id === parseInt(restaurant_id));
      setRestaurant(restaurant);
    }
  }, [restaurant_id, store.restaurants]);

  const handleReserve = (e) => {
    e.preventDefault();
    if (!reservationDate || !reservationHour || !peopleCount) {
      return;
    }

    actions.createReservation({
      restaurant_id: restaurant.id,
      date: reservationDate,
      hour: reservationHour,
      people: peopleCount,
    });

    setShowSuccessMessage(true);
    setReservationDate("");
    setReservationHour("");
    setPeopleCount(1);
    actions.getDinerReserves();

    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 4000);
  };

  if (!restaurant) {
    return <div>Cargando restaurante...</div>;
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-6">
          <div className="card" style={{ width: "100%" }}>
            <img
               src={restaurant.image_url || "https://media.istockphoto.com/id/1428412216/es/foto/un-chef-masculino-vertiendo-salsa-en-la-comida.jpg?s=612x612&w=0&k=20&c=Wze2YwgkFMQOTWoxdiRYsUpa1azCIOm8yRaUEEYOgOU="}
               className="card-img hover-effect" 
               alt={restaurant.name}
               style={{ objectFit: 'cover', height: '200px', width: '100%' }}
            />
            <div className="card-body">
              <h5 className="card-title">{restaurant.name}</h5>
              <p className="card-text">Telefono {restaurant.telephone}</p>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Capacidad: {restaurant.capacity} Personas</li>
              <li className="list-group-item"> <i className="fas fa-map-marker-alt me-2"></i>Ubicación: {restaurant.location}</li>
            </ul>
          </div>
        </div>

        <div className="col-md-6">
          <h1>Reserva en {restaurant.name}</h1>
          <form onSubmit={handleReserve}>
            <div className="mb-3">
              <label htmlFor="date" className="form-label">Fecha</label>
              <input
                type="date"
                className="form-control"
                id="date"
                value={reservationDate}
                onChange={(e) => setReservationDate(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="hour" className="form-label">Hora</label>
              <input
                type="time"
                className="form-control"
                id="hour"
                value={reservationHour}
                onChange={(e) => setReservationHour(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="people" className="form-label">Número de Personas</label>
              <input
                type="number"
                className="form-control"
                id="people"
                value={peopleCount}
                onChange={(e) => setPeopleCount(e.target.value)}
                min="1"
                required
              />
            </div>
            <button type="submit" className="btn btn-warning text-light">Reservar</button>
          </form>
        </div>
      </div>

      {showSuccessMessage && (
        <div className="alert alert-success mt-3" role="alert">
          ¡Reserva realizada con éxito!
        </div>
      )}
    </div>
  );
};
