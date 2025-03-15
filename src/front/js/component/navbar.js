import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
  const { store } = useContext(Context); // Usamos el contexto para acceder al usuario logueado
  const [showReservationOptions, setShowReservationOptions] = useState(false); // Estado para mostrar/ocultar botones adicionales

  const toggleReservationOptions = () => {
    setShowReservationOptions(!showReservationOptions);
  };

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        <Link to="/">
          <span className="navbar-brand mb-0 h1">Volver a Home</span>
        </Link>
        <div className="ml-auto">
          <Link to="/search-restaurants">
            <button className="btn btn-primary">Buscar Restaurantes</button>
          </Link>
          <Link to="/add-restaurant">
            <button className="btn btn-secondary">Añadir Restaurante</button>
          </Link>
          <Link to="/demo">
            <button className="btn btn-info">
              Otras funcionalidades RestaurAPP
            </button>
          </Link>
          <Link to="/owners/new">
            <span className="navbar-brand mb-0 h1">Create owner</span>
          </Link>
          <Link to="/owners">
            <button className="btn btn-primary">Owners list</button>
          </Link>
          <Link to="/dinerlist">
            <button className="btn btn-primary">Diner list</button>
          </Link>
          {/* Botón para acceder a la lista de reservas */}
          <button className="btn btn-warning" onClick={toggleReservationOptions}>
            Reservation
          </button>

          {/* Opciones adicionales para Reservations */}
          {showReservationOptions && (
            <div style={{ marginTop: "10px" }}>
              <Link to="/request-reservation">
                <button className="btn btn-primary">Solicitar Reserva (Diner)</button>
              </Link>
              <Link to="/manage-reservations">
                <button className="btn btn-warning">Gestionar Reservas (Owner)</button>
              </Link>
    
        </div>
      )}
    </div>
  </div>
</nav>
);
};
