import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import ReservationsByRestaurant from './reservationByRestaurant';

const RestaurantDetail = () => {
    const { id } = useParams(); 
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            actions.getRestaurantById(id);
            setLoading(false);
        }
    }, [id, actions]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const restaurant = store.specificRestaurant;

    const handleDelete = () => {
        actions.deleteRestaurant(id);
        navigate('/owners/dashboard');
    };

    const handleEdit = () => {
        navigate(`/create_restaurant/${restaurant.id}`);
    };

    const handleViewReservations = () => {
        navigate(`/restaurant/${id}/reservations`); // Rotta per vedere le prenotazioni
    };

    const handleBackToDashboard = () => {
        navigate('/owners/dashboard');
    };

    return (
        <div className="container mt-4">
            {restaurant ? (
                <>
                    <h1>{restaurant.name}</h1>
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <img 
                                src={restaurant.image || "https://media.istockphoto.com/id/1428412216/es/foto/un-chef-masculino-vertiendo-salsa-en-la-comida.jpg?s=612x612&w=0&k=20&c=Wze2YwgkFMQOTWoxdiRYsUpa1azCIOm8yRaUEEYOgOU="} 
                                alt={restaurant.name} 
                                className="img-fluid"
                                style={{ height: "300px", objectFit: "cover" }}
                            />
                        </div>
                        
                        <div className="col-md-8">
                            <p><strong>Ubicación:</strong> {restaurant.location}</p>
                            <p><strong>Telefono:</strong> {restaurant.telephone}</p>
                            <p><strong>Capacidad:</strong> {restaurant.capacity}</p>
                            <p><strong>Latitutud:</strong> {restaurant.latitude}</p>
                            <p><strong>Longitud:</strong> {restaurant.longitude}</p>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end mt-3">
                        <button className="btn border border-secondary me-2 bg-light" onClick={handleEdit}>
                            ✏️
                        </button>
                        <button className="btn border border-secondary me-2 bg-light" onClick={handleDelete}>
                            🗑️
                        </button>
                    </div>

                    <div className="d-flex justify-content-end mt-3">
                        <button className="btn btn-primary" onClick={handleBackToDashboard}>
                            Volver al dashboard
                        </button>
                    </div>
                </>
            ) : (
                <p>No hay detalles disponibles.</p>
            )}
            <ReservationsByRestaurant restaurantId={id} />
        </div>
    );
};

export default RestaurantDetail;
