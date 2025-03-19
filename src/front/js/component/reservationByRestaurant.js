import React, { useEffect, useContext } from 'react';
import { Context } from '../store/appContext';

const ReservationsByRestaurant = ({ restaurantId }) => {
    const { store, actions } = useContext(Context);

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
                                            onClick={() => actions.updateReservationStatus(res.id, "Accepted")}>
                                            Aceptar
                                        </button>
                                        <button className="btn btn-danger btn-sm mx-2"
                                            onClick={() => actions.updateReservationStatus(res.id, "Refused")}>
                                            Rechazar
                                        </button>
                                    </>
                                )}
                                {res.state !== "Canceled" && (
                                    <button className="btn btn-warning btn-sm"
                                        onClick={() => actions.updateReservationStatus(res.id, "Canceled")}>
                                        Cancelar
                                    </button>
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

// import React, { useEffect, useContext } from 'react';
// import { Context } from '../store/appContext';

// const ReservationsByRestaurant = ({ restaurantId }) => {
//     const { store, actions } = useContext(Context);

//     useEffect(() => {
//         actions.getAllReservationsByOwner(); // Carica tutte le prenotazioni dell'owner
//     }, []);

//     // Filtra solo le prenotazioni del ristorante selezionato
//     const reservations = store.ownerReservations.filter(res => {
//         console.log("Check reservation:", res);
//         console.log(`Compare res.id_fk_restaurant (${res.id_fk_restaurant}) with restaurantId (${restaurantId})`);
//         return res.id_fk_restaurant === restaurantId;
//     });
    
//     console.log(`Reservations for restaurant ${restaurantId}:`, reservations);

//     if (reservations.length === 0) {
//         return <p>No tienes reservas registradas para este restaurante.</p>;
//     }

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
//                     {reservations.map((res, index) => (
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
//                                 {res.state !== "Canceled" && (
//                                     <button className="btn btn-warning btn-sm"
//                                         onClick={() => actions.updateReservationStatus(res.id, "Canceled")}>
//                                         Cancelar
//                                     </button>
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


