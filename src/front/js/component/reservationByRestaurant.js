import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../store/appContext';
import "../../styles/buttons.css";
import "../../styles/stateButtons.css";
import { useNavigate } from "react-router-dom";

const ReservationsByRestaurant = ({ restaurantId, restaurantName }) => {
    const { store, actions } = useContext(Context);
    const [cancelComment, setCancelComments] = useState({});
    const [isCanceling, setIsCanceling] = useState({}); 
     const navigate = useNavigate();

    useEffect(() => {
        if (restaurantId) {
            console.log("Fetching reservations for restaurant ID:", restaurantId);
            actions.getReservationsByRestaurant(restaurantId);
        }
    }, [restaurantId]);

    useEffect(() => {
        console.log("restaurantReservations:", store.restaurantReservations);
    }, [store.restaurantReservations]);

    console.log("OWNER RESERVAT: ", store.restaurantReservations);

    if (store.restaurantReservations.length === 0) {
        return <p>No tienes reservas registradas para este restaurante.</p>;
    }

    const handleCancelMessage = (res) => {
        if (!isCanceling[res.id]) {
            setIsCanceling((prev) => ({ ...prev, [res.id]: true }));
            return;
        }

        actions.updateReservationStatus(res.id, "Canceled", cancelComment[res.id], restaurantId);
        setCancelComments((prev) => ({ ...prev, [res.id]: "" })); // Reset del commento per quella prenotazione
        setIsCanceling((prev) => ({ ...prev, [res.id]: false })); // Ripristiniamo lo stato di cancellazione per quella prenotazione
        actions.getReservationsByRestaurant(restaurantId);
    };

    const handleCommentChange = (e, resId) => {
        // persist per evitare errori con gli eventi riutilizzati
        e.persist();
        setCancelComments((prev) => ({ ...prev, [resId]: e.target.value }));
    };

    return (
        <div className="container mt-4 mb-5">
            <table className="table" style={{ fontFamily: 'Roboto, sans-serif' }}>
                <thead>
                    <tr>
                        <th>Número de reserva</th>
                        <th>Nombre Cliente</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Personas</th>
                        <th>Estado</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {store.restaurantReservations.map((res, index) => (
                        <tr key={res.id}>
                            <td>{index + 1}</td>
                            <td>{res.diner_name}</td>
                            <td>{res.date}</td>
                            <td>{res.hour}</td>
                            <td>{res.people}</td>
                            <td>{res.state}</td>
                            <td>
                                {res.state === "Pending" && (
                                    <>
                                        <button className="btn-warning text-light btn-sm mx-2"
                                            onClick={() => actions.updateReservationStatus(res.id, "Accepted", null, restaurantId)}>
                                            Aceptar
                                        </button>
                                        <button className="btn-danger btn-sm mx-2"
                                            onClick={() => actions.updateReservationStatus(res.id, "Refused", null, restaurantId)}>
                                            Rechazar
                                        </button>
                                    </>
                                )}
                                {res.state === "Accepted" && (
                                    <>
                                        {isCanceling[res.id] && (
                                            <div className="mt-2">
                                                <textarea
                                                    className="form-control"
                                                    placeholder="Motivo de la cancelación (opcional)"
                                                    value={cancelComment[res.id] || ""} 
                                                    onChange={(e) => handleCommentChange(e, res.id)} 
                                                    rows="3"
                                                ></textarea>
                                            </div>
                                        )}
                                        <button
                                            className="btn-danger btn-sm mx-2"
                                            onClick={() => handleCancelMessage(res)}>
                                            {isCanceling[res.id] ? 'Cancelar' : 'Cancelar reserva'}
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="fixed-top" style={{ zIndex: 1030 }}>
                <div className="container">
                    <div className="col-md-4 mb-4">
                        <div className="d-flex justify-content-start mt-3">
                            <button
                                type="button"
                                className="btn btn-warning text-light"
                                onClick={() => navigate("/owners/dashboard")}
                                style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1050 }}>
                                Volver
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};    
export default ReservationsByRestaurant;





