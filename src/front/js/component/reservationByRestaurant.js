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
    const handleCancelMessage = (res) => {
        if (!isCanceling[res.id]) {
            // Si no estamos cancelando, mostrar el textarea
            setIsCanceling(prev => ({ ...prev, [res.id]: true }));
        } else {
            // Si ya estamos en modo cancelación, proceder con la cancelación
            actions.updateReservationStatus(res.id, "Canceled", cancelComment[res.id] || "", restaurantId);
            // Limpiar el comentario y ocultar el textarea
            setCancelComments(prev => ({ ...prev, [res.id]: "" }));
            setIsCanceling(prev => ({ ...prev, [res.id]: false }));
        }
    };
    const handleCommentChange = (e, resId) => {
        setCancelComments(prev => ({ ...prev, [resId]: e.target.value }));
    };
    const handleCancelCancellation = (resId) => {
        setIsCanceling(prev => ({ ...prev, [resId]: false }));
        setCancelComments(prev => ({ ...prev, [resId]: "" }));
    };
    // Estado de carga
    if (!store.restaurantReservations) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3">Cargando reservaciones...</p>
            </div>
        );
    }
    // Sin reservaciones
    if (store.restaurantReservations.length === 0) {
        return (
            <div className="container mt-5">
                <div className="card shadow-sm border-0">
                    <div className="card-body text-center p-5">
                        <i className="fas fa-calendar-xmark fa-4x text-muted mb-4"></i>
                        <h3 className="fw-light">No hay reservas disponibles</h3>
                        <p className="text-muted">No tienes reservas registradas para este restaurante.</p>
                        <button
                            className="btn btn-warning text-dark rounded-pill fw-bold shadow-sm mt-3"
                            onClick={() => navigate("/owners/dashboard")}>
                            <i className="fas fa-arrow-left me-2"></i>Volver
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="container-fluid py-5" style={{ fontFamily: 'Poppins, sans-serif', background: '#F8F9FA' }}>
            {/* Botón de regreso con posición fija */}
            <div className="position-fixed top-0 start-0 m-4" style={{ zIndex: 1050 }}>
                <button
                    type="button"
                    className="btn btn-warning text-dark rounded-pill shadow-sm fw-bold"
                    onClick={() => navigate("/owners/dashboard")}>
                    <i className="fas fa-arrow-left me-2"></i>Volver
                </button>
            </div>
            <div className="container">
                {/* Título de la sección */}
                <div className="row mb-5">
                    <div className="col-12 text-center">
                        <h2 className="display-6 fw-bold mb-2">Gestión de Reservas</h2>
                        <p className="text-muted">
                            {restaurantName ? `${restaurantName}` : 'Tu Restaurante'} |
                            Total: <span className="badge bg-warning text-dark ms-1">{store.restaurantReservations.length}</span>
                        </p>
                        <div className="d-flex justify-content-center mt-4">
                            <div className="legend-item me-3">
                                <span className="status-badge pending me-1"></span> Pendiente
                            </div>
                            <div className="legend-item me-3">
                                <span className="status-badge accepted me-1"></span> Aceptada
                            </div>
                            <div className="legend-item me-3">
                                <span className="status-badge refused me-1"></span> Rechazada
                            </div>
                            <div className="legend-item">
                                <span className="status-badge canceled me-1"></span> Cancelada
                            </div>
                        </div>
                    </div>
                </div>
                {/* Tabla de reservas */}
                <div className="row">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="ps-4">#</th>
                                                <th>Cliente</th>
                                                <th>Fecha</th>
                                                <th>Hora</th>
                                                <th>Personas</th>
                                                <th>Estado</th>
                                                <th className="text-end pe-4">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {store.restaurantReservations.map((res, index) => (
                                                <tr key={res.id}>
                                                    <td className="ps-4 fw-bold">{index + 1}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div className="avatar-circle me-2">
                                                                {res.diner_name.charAt(0).toUpperCase()}
                                                            </div>
                                                            {res.diner_name}
                                                        </div>
                                                    </td>
                                                    <td>{res.date}</td>
                                                    <td>{res.hour}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <i className="fas fa-user me-1"></i> {res.people}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge ${res.state.toLowerCase()}`}>
                                                            {res.state}
                                                        </span>
                                                    </td>
                                                    <td className="text-end pe-4">
                                                        {res.state === "Pending" && (
                                                            <div className="action-buttons">
                                                                <button
                                                                    className="btn btn-success btn-sm rounded-pill me-2"
                                                                    onClick={() => actions.updateReservationStatus(res.id, "Accepted", null, restaurantId)}>
                                                                    <i className="fas fa-check me-1"></i>Aceptar
                                                                </button>
                                                                <button
                                                                    className="btn btn-danger btn-sm rounded-pill"
                                                                    onClick={() => actions.updateReservationStatus(res.id, "Refused", null, restaurantId)}>
                                                                    <i className="fas fa-times me-1"></i>Rechazar
                                                                </button>
                                                            </div>
                                                        )}
                                                        {res.state === "Accepted" && (
                                                            <div>
                                                                {isCanceling[res.id] ? (
                                                                    <div className="cancel-form p-3 bg-light rounded shadow-sm mt-2">
                                                                        <textarea
                                                                            className="form-control mb-2 border-0 bg-white"
                                                                            placeholder="Motivo de la cancelación (opcional)"
                                                                            value={cancelComment[res.id] || ""}
                                                                            onChange={(e) => handleCommentChange(e, res.id)}
                                                                            rows="2"
                                                                        ></textarea>
                                                                        <div className="d-flex justify-content-end">
                                                                            <button
                                                                                className="btn btn-sm btn-outline-secondary me-2"
                                                                                onClick={() => handleCancelCancellation(res.id)}>
                                                                                <i className="fas fa-undo me-1"></i>Volver
                                                                            </button>
                                                                            <button
                                                                                className="btn btn-sm btn-danger"
                                                                                onClick={() => handleCancelMessage(res)}>
                                                                                <i className="fas fa-ban me-1"></i>Confirmar
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        className="btn btn-outline-danger btn-sm rounded-pill"
                                                                        onClick={() => handleCancelMessage(res)}>
                                                                        <i className="fas fa-calendar-xmark me-1"></i>Cancelar
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Estilos CSS en línea */}
            <style jsx>{`
                .status-badge {
                    display: inline-block;
                    padding: 6px 12px;
                    border-radius: 30px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .pending {
                    background-color: #FFC107;
                    color: #000;
                }
                .accepted {
                    background-color:rgb(51, 206, 59);
                    color: white;
                }
                .refused {
                    background-color: #DC3545;
                    color: white;
                }
                .canceled {
                    background-color: #6C757D;
                    color: white;
                }
                .avatar-circle {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background-color: #FFC107;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 14px;
                }
                
                .legend-item {
                    display: flex;
                    align-items: center;
                    font-size: 0.85rem;
                }
                .legend-item .status-badge {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    padding: 0;
                    margin-right: 5px;
                }
                .action-buttons {
                    white-space: nowrap;
                }
                .cancel-form {
                    max-width: 300px;
                    margin-left: auto;
                }
            `}</style>
        </div>
    );
};
export default ReservationsByRestaurant;