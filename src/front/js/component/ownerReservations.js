import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";

const OwnerReservations = () => {
    const { store, actions } = useContext(Context);
    const [selectedReservation, setSelectedReservation] = useState(null); // Estado para la reserve seleccionada

    useEffect(() => {
        actions.getAllReservationsByOwner();
    }, []);

    if (!store.ownerReservations) {
        return <p>Cargando reservas...</p>;
    }

    if (store.ownerReservations.length === 0) {
        return <p>No tienes reservas registradas.</p>;
    }

    return (
        <div className="container mt-4">
            <h2>Mis Reservas</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Numero de reserva</th>
                        <th>Restaurante</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Cliente</th>
                        <th>Personas</th>
                        <th>Estado</th>
                        <th>Acciones</th> {/* Colonna per i bottoni */}
                    </tr>
                </thead>
                <tbody>
                    {store.ownerReservations.map((res, index) => (
                        <tr key={res.id}>
                            <td>{index + 1}</td>
                            <td>{res.restaurant_name}</td>
                            <td>{res.date}</td>
                            <td>{res.hour}</td>
                            <td>{res.diner_name}</td>
                            <td>{res.people}</td>
                            <td>{res.state}</td>
                            <td>
                                <button 
                                    className="btn btn-primary btn-sm me-2"
                                    onClick={() => setSelectedReservation(res)}
                                >
                                    Ver
                                </button>
                                <button 
                                    className="btn btn-danger btn-sm"
                                    onClick={() => actions.deleteReservation(res.id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* muestra si se da clic a ver más  */}
            {selectedReservation && (
                <div className="card mt-4">
                    <div className="card-body">
                        <h5 className="card-title">Detalle de la Reserva</h5>
                        <p><strong>Restaurante:</strong> {selectedReservation.restaurant_name}</p>
                        <p><strong>Fecha:</strong> {selectedReservation.date}</p>
                        <p><strong>Hora:</strong> {selectedReservation.hour}</p>
                        <p><strong>Cliente:</strong> {selectedReservation.diner_name}</p>
                        <p><strong>Personas:</strong> {selectedReservation.people}</p>
                        <button className="btn btn-secondary" onClick={() => setSelectedReservation(null)}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerReservations;
