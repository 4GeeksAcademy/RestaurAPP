import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const OwnerReservations = () => {
    const { store, actions } = useContext(Context);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [cancelingReservationId, setCancelingReservationId] = useState(null);
    const [cancelComment, setCancelComment] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        actions.getAllReservationsByOwner();
    }, []);

    if (!store.ownerReservations) {
        return <p>Cargando reservas...</p>;
    }

    if (store.ownerReservations.length === 0) {
        return <p>No tienes reservas registradas.</p>;
    }

    const handleCancelClick = (reservationId) => {
        setCancelingReservationId(reservationId);
    };

    const handleConfirmCancel = (res) => {
        actions.updateReservationStatus(res.id, "Canceled", cancelComment, res.restaurant_id);
        setCancelingReservationId(null);
        setCancelComment("");
    };

    const handleDeleteClick = (reservationId) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta reserva de tu historial?");
        if (confirmDelete) {
            actions.deleteReservation(reservationId);
        }
    };

    const handleShowModal = (reservation) => {
        setSelectedReservation(reservation);
        const modal = new window.bootstrap.Modal(document.getElementById('reservationModal'));
        modal.show();
    };

    const handleCloseModal = () => {
        setSelectedReservation(null);
        const modal = new window.bootstrap.Modal(document.getElementById('reservationModal'));
        modal.hide();
    };

    return (
        <div className="container mt-4">
            <h2>Todas mis Reservas</h2>
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
                        <th>Acciones disponibles sobre tus reservas</th>
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
                            <td className="d-flex justify-content-start w-100">
                                <div className="d-flex justify-content-start w-100">
                                    <button
                                        className="btn btn-primary btn-sm me-3"
                                        onClick={() => handleShowModal(res)}
                                    >
                                        Ver detalles
                                    </button>
                                    {res.state === "Accepted" ? (
                                        <button
                                            className="btn btn-warning btn-sm me-3"
                                            onClick={() => handleCancelClick(res.id)}
                                        >
                                            Cancelar la reserva
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-warning btn-sm me-3"
                                            disabled
                                        >
                                            {res.state === "Canceled" ? "Reserva cancelada" : "Reserva rechazada"}
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-danger btn-sm me-3"
                                        onClick={() => handleDeleteClick(res.id)}
                                    >
                                        Eliminar de mi historial
                                    </button>
                                </div>

                                {cancelingReservationId === res.id && (
                                    <div className="mt-2">
                                        <textarea
                                            className="form-control"
                                            placeholder="Motivo de la cancelación (opcional)"
                                            value={cancelComment}
                                            onChange={(e) => setCancelComment(e.target.value)}
                                            rows="2"
                                        ></textarea>
                                        <button className="btn btn-danger btn-sm mt-2 me-2" onClick={() => handleConfirmCancel(res)}>
                                            Confirmar cancelación
                                        </button>
                                        <button className="btn btn-secondary btn-sm mt-2" onClick={() => setCancelingReservationId(null)}>
                                            Cancelar
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modale Dettagli Prenotazione */}
            <div className="modal fade" id="reservationModal" tabIndex="-1" aria-labelledby="reservationModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="reservationModalLabel">Detalle de la Reserva</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}></button>
                        </div>
                        <div className="modal-body">
                            {selectedReservation && (
                                <>
                                    <p><strong>Restaurante:</strong> {selectedReservation.restaurant_name}</p>
                                    <p><strong>Fecha:</strong> {selectedReservation.date}</p>
                                    <p><strong>Hora:</strong> {selectedReservation.hour}</p>
                                    <p><strong>Personas:</strong> {selectedReservation.people}</p>
                                    <p><strong>Cliente:</strong> {selectedReservation.diner_name}</p>
                                    <p><strong>Teléfono del cliente:</strong> {selectedReservation.diner_phone}</p>
                                    <p><strong>Email del cliente:</strong> {selectedReservation.diner_email}</p>
                                </>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => {
                                    navigate(`/restaurants/${selectedReservation?.id_restaurant}`);
                                    window.location.reload();  // Forza un refresh della pagina
                                }}
                            >
                                Quieres gestionar tu reserva?
                            </button>

                            <button className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModal}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerReservations;
