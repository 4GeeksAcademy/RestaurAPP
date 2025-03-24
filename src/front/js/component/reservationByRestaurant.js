import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../store/appContext';
import "../../styles/buttons.css";
import "../../styles/home.css";

const ReservationsByRestaurant = ({ restaurantId, restaurantName }) => {
    const { store, actions } = useContext(Context);
    const [cancelComment, setCancelComments] = useState({});
    const [isCanceling, setIsCanceling] = useState({}); // Stato separato per ogni prenotazione

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
        <div className="container mt-4">
            <table className="table">
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
                                        <button className="btn-primary-invertido btn-sm"
                                            onClick={() => actions.updateReservationStatus(res.id, "Accepted", null, restaurantId)}>
                                            Aceptar
                                        </button>
                                        <button className="btn-primary-invertido btn-sm mx-2"
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
                                                    value={cancelComment[res.id] || ""} // Accede al commento per quella prenotazione
                                                    onChange={(e) => handleCommentChange(e, res.id)} // Gestiasce il cambio del commento
                                                    rows="3"
                                                ></textarea>
                                            </div>
                                        )}

                                        <button
                                            className="btn-primary-invertido btn-sm mt-2"
                                            onClick={() => handleCancelMessage(res)}>
                                            {isCanceling[res.id] ? 'Confirmar cancelación' : 'Cancelar reserva'}
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReservationsByRestaurant;





