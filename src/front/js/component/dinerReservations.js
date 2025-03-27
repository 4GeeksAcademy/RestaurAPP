// import React, { useContext, useEffect } from "react";
// import { Context } from "../store/appContext";
// import { Link, useNavigate } from "react-router-dom";


// export const DinerReservations = () => {
//     const { store, actions } = useContext(Context);
//     const navigate = useNavigate();



//     useEffect(() => {
//         if (localStorage.getItem("tokenDiner")) {
//             actions.getDinerReserves();
//             console.log("cargado el componente")
//         }
//     }, []);

//     const changeReservationStatusByDiner = (reservationId) => {
//         console.log("Cancelar reserva con id: ", reservationId);
//     };

//     return (
//         <>
//             <div className="container mt-5">
//                 <h1 className="text-center mb-4">Tienes {store.dinerReservations.length} Reservas!</h1>
//                 {store.dinerReservations.length > 0 ? (
//                     <div className="row">
//                         {store.dinerReservations.map((item, index) => (
//                             <div className="col-12 col-md-6 col-lg-4 mb-4" key={index}>
//                                 <div className="card shadow-sm">
//                                     <img
//                                         src={item.restaurant.image_url}
//                                         className="card-img-top"
//                                         alt={item.restaurant ? item.restaurant.name : "Imagen del restaurante"}
//                                     />
//                                     <div className="card-body">
//                                         <h5 className="card-title">{item.restaurant ? item.restaurant.name : 'Restaurante no disponible'}</h5>
//                                         <p className="card-text">
//                                             <strong>Fecha:</strong> {item.date}
//                                         </p>
//                                         <p className="card-text">
//                                             <strong>Hora:</strong> {item.hour}
//                                         </p>
//                                         <p className="card-text">
//                                             <strong>Personas:</strong> {item.people}
//                                         </p>
//                                         <p className="card-text">
//                                             <strong>Estado:</strong> {item.state}
//                                         </p>
//                                         <button
//                                             className="btn btn-danger w-100"
//                                             onClick={() => changeReservationStatusByDiner(item.id)}
//                                         >
//                                             Cancelar Reserva
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="alert alert-warning text-center" role="alert">
//                         No tienes reservas.
//                     </div>
//                 )}
//             </div>
//             <div className="mt-5 d-flex justify-content-between">
//                 <button type="button" className="btn btn-secondary" onClick={() => navigate("/diner/dashboard")}>
//                     Volver
//                 </button>
//             </div>
//         </>
//     );
// };
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/dinerReservations.css";

export const DinerReservations = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [cancelComments, setCancelComments] = useState({});
    const [isCanceling, setIsCanceling] = useState({});

    useEffect(() => {
        if (localStorage.getItem("tokenDiner")) {
            actions.getDinerReserves();
            console.log("cargado el componente");
        }
    }, []);

    const changeReservationStatusByDiner = (reservationId) => {
        console.log("Cancelar reserva con id: ", reservationId);

        actions.changeReservationStatusByDiner(reservationId, "Canceled", cancelComments[reservationId]);

        setIsCanceling((prevState) => ({ ...prevState, [reservationId]: true }));

        setTimeout(() => {
            setIsCanceling((prevState) => ({ ...prevState, [reservationId]: false }));
            actions.getDinerReserves();  
        }, 1500);
    };

    const handleCancelCommentChange = (e, reservationId) => {
        e.persist();
        setCancelComments((prevState) => ({
            ...prevState,
            [reservationId]: e.target.value  
        }));
    };

    return (
        <>
            <div className="container mt-5">
                <h1 className="text-center mb-4">Tienes {store.dinerReservations.length} Reservas!</h1>
                {store.dinerReservations.length > 0 ? (
                    <div className="row">
                        {store.dinerReservations.map((item, index) => (
                            <div className="col-12 col-md-6 col-lg-4 mb-4" key={index}>
                                <div className="card shadow-sm">
                                    <img
                                        src={item.restaurant.image_url}
                                        className="card-img hover-effect"
                                        alt="restaurant image"
                                        style={{ objectFit: 'cover', height: '200px', width: '100%' }}
                                    />
                                    <div className="card-body px-2">
                                        <h5 className="card-title">
                                            <a
                                                href={`/perfil_restaurant/${item.restaurant.id}`}
                                                className="stretched-link"
                                            >
                                                {item.restaurant.name}
                                            </a>
                                        </h5>

                                        <div className="d-flex justify-content-between align-items-center">
                                            <h6 className="text-success mb-0">
                                                <small className="fw-light">Capacidad {item.restaurant.capacity} Personas</small>
                                            </h6>

                                            <h6 className="mb-0 d-flex align-items-center ms-auto">
                                                <i className="fas fa-map-marker-alt me-2"></i>
                                                {item.restaurant.location}
                                            </h6>
                                        </div>
                                        <p className="card-text">
                                            <strong>Fecha:</strong> {item.date}
                                        </p>
                                        <p className="card-text">
                                            <strong>Hora:</strong> {item.hour}
                                        </p>
                                        <p className="card-text">
                                            <strong>Para {item.people} Personas</strong>
                                        </p>
                                        <p className="card-text hover-text">
                                            <strong>Estado:</strong> {item.state}    
                                        </p>
                                        <p className="card-text hover-text">
                                            <strong>Comentario:</strong> {item.cancelComment}
                                        </p>
                                        {item.state === "Pending" || item.state === "Accepted" ? (
                                            <>
                                                <textarea
                                                    className="form-control mt-2"
                                                    placeholder="Motivo de la cancelación (opcional)"
                                                    value={cancelComments[item.id] || ""}  
                                                    onChange={(e) => handleCancelCommentChange(e, item.id)}
                                                    rows="3"
                                                />
                                                <button
                                                    className="btn btn-danger w-100 mt-2 btn-hover"
                                                    onClick={() => changeReservationStatusByDiner(item.id)}
                                                    disabled={isCanceling[item.id]}
                                                >
                                                    {isCanceling[item.id] ? "Cancelando..." : "Cancelar Reserva"}
                                                </button>
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="alert alert-warning text-center" role="alert">
                        No tienes reservas.
                    </div>
                )}
                <div className="mt-5 d-flex justify-content-between">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/diner/dashboard")}>
                        Volver
                    </button>
                </div>
            </div>
        </>
    );
};
