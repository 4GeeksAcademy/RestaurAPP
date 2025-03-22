// import React, { useEffect, useContext, useState } from 'react';
// import { Context } from '../store/appContext';

// const ReservationsByRestaurant = ({ restaurantId }) => {
//     const { store, actions } = useContext(Context);
//     const [cancelComment, setCancelComments] = useState("");

//     useEffect(() => {
//         if (restaurantId) {
//             console.log("Fetching reservations for restaurant ID:", restaurantId);
//             actions.getReservationsByRestaurant(restaurantId);
//         }
//     }, [restaurantId]);

//     useEffect(() => {
//         console.log("restaurantReservations:", store.restaurantReservations);
//     }, [store.restaurantReservations]);

//     console.log("OWNER RESERVAT: ", store.restaurantReservations);

//     if (store.restaurantReservations.length === 0) {
//         return <p>No tienes reservas registradas para este restaurante.</p>;
//     }

//     const handleCancelMessage = (res) => {
//         if (cancelComment.trim() === "") {
//             alert("Por favor, añada una motivación para la cancelación");
//             return;
//         }
//         // Passiamo il commento alla funzione di aggiornamento della prenotazione e aggiorniamo lo stato
//         actions.updateReservationStatus(res.id, "Canceled", cancelComment, restaurantId);
//         setCancelComments(""); // Reset del commento dopo l'invio
//         actions.getReservationsByRestaurant(restaurantId);
//     };

//     return (
//         <div className="container mt-4">
//             <h2>Reservas para el Restaurante {restaurantId}</h2>
//             <table className="table">
//                 <thead>
//                     <tr>
//                         <th>Número de reserva</th>
//                         <th>Nombre Cliente</th>
//                         <th>Fecha</th>
//                         <th>Hora</th>
//                         <th>Personas</th>
//                         <th>Estado</th>
//                         <th>Acción</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {store.restaurantReservations.map((res, index) => (
//                         <tr key={res.id}>
//                             <td>{index + 1}</td>
//                             <td>{res.diner_name}</td>
//                             <td>{res.date}</td>
//                             <td>{res.hour}</td>
//                             <td>{res.people}</td>
//                             <td>{res.state}</td>
//                             <td>
//                                 {res.state === "Pending" && (
//                                     <>
//                                         <button className="btn btn-success btn-sm"
//                                             onClick={() => actions.updateReservationStatus(res.id, "Accepted")}>
//                                             Aceptar
//                                         </button>
//                                         <button className="btn btn-danger btn-sm mx-2"
//                                             onClick={() => actions.updateReservationStatus(res.id, "Refused")}>
//                                             Rechazar
//                                         </button>
//                                     </>
//                                 )}
//                                 {res.state === "Accepted" && (
//                                     <>
//                                         <div className="mt-2">
//                                             <textarea
//                                                 className="form-control"
//                                                 placeholder="Motivo de la cancelación"
//                                                 value={cancelComment}
//                                                 onChange={(e) => setCancelComments(e.target.value)}
//                                                 rows="3"
//                                             ></textarea>

//                                             <button className="btn btn-danger btn-sm mt-2" onClick={() => handleCancelMessage(res)}>
//                                                 Cancelar y enviar mensaje de cancelación
//                                             </button>
//                                         </div>
//                                         <button className="btn btn-warning btn-sm"
//                                             onClick={() => actions.updateReservationStatus(res.id, "Canceled")}>
//                                             Cancelar sin mensaje de cancelación
//                                         </button>
//                                     </>
//                                 )}
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default ReservationsByRestaurant;

import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../store/appContext';

const ReservationsByRestaurant = ({ restaurantId }) => {
    const { store, actions } = useContext(Context);
    const [cancelComment, setCancelComments] = useState("");
    const [isCanceling, setIsCanceling] = useState(false); // Per tenere traccia se l'utente sta per cancellare

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
        if (!isCanceling) {
            // Se non è ancora attivo il processo di cancellazione, attiviamo la modalità per aggiungere un commento
            setIsCanceling(true);
            return;
        }
        
        // Se l'utente non ha inserito un commento, possiamo procedere comunque
        actions.updateReservationStatus(res.id, "Canceled", cancelComment, restaurantId);
        setCancelComments(""); // Reset del commento dopo l'invio
        setIsCanceling(false); // Ripristiniamo lo stato di cancellazione
        actions.getReservationsByRestaurant(restaurantId);
    };

    return (
        <div className="container mt-4">
            <h2>Reservas para el Restaurante {restaurantId}</h2>
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
                                        <button className="btn btn-success btn-sm"
                                            onClick={() => actions.updateReservationStatus(res.id, "Accepted", null, restaurantId)}>
                                            Aceptar
                                        </button>
                                        <button className="btn btn-danger btn-sm mx-2"
                                            onClick={() => actions.updateReservationStatus(res.id, "Refused", null, restaurantId)}>
                                            Rechazar
                                        </button>
                                    </>
                                )}
                                {res.state === "Accepted" && (
                                    <>
                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() => handleCancelMessage(res)}>
                                            {isCanceling ? 'Confirmar cancelación' : 'Cancelar reserva'}
                                        </button>

                                        {isCanceling && (
                                            <div className="mt-2">
                                                <textarea
                                                    className="form-control"
                                                    placeholder="Motivo de la cancelación (opcional)"
                                                    value={cancelComment}
                                                    onChange={(e) => setCancelComments(e.target.value)}
                                                    rows="3"
                                                ></textarea>
                                            </div>
                                        )}
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






