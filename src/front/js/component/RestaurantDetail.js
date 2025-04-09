// import React, { useContext, useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Context } from '../store/appContext';
// import ReservationsByRestaurant from './reservationByRestaurant';

// const RestaurantDetail = () => {
//     const { id } = useParams(); 
//     const { store, actions } = useContext(Context);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (id) {
//             actions.getRestaurantById(id);
//             setLoading(false);
//         }
//     }, [id, actions]);

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     const restaurant = store.specificRestaurant;

//     const handleDelete = () => {
//         actions.deleteRestaurant(id);
//         navigate('/owners/dashboard');
//     };

//     const handleEdit = () => {
//         navigate(`/create_restaurant/${restaurant.id}`);
//     };

//     const handleViewReservations = () => {
//         navigate(`/restaurant/${id}/reservations`); // Rotta per vedere le prenotazioni
//     };

//     const handleBackToDashboard = () => {
//         navigate('/owners/dashboard');
//     };

//     return (
//         <div className="container mt-4">
//             <h1 className='mb-5'>Aquí tienes los detalles de tu restaurante</h1>
//             {restaurant ? (
//                 <>
//                     <div className="row">
//                         <div className="col-md-4 mb-4">
//                             <img 
//                                 src={restaurant.image || "https://media.istockphoto.com/id/1428412216/es/foto/un-chef-masculino-vertiendo-salsa-en-la-comida.jpg?s=612x612&w=0&k=20&c=Wze2YwgkFMQOTWoxdiRYsUpa1azCIOm8yRaUEEYOgOU="} 
//                                 alt={restaurant.name} 
//                                 className="img-fluid"
//                                 style={{ height: "300px", objectFit: "cover" }}
//                             />
//                         </div>
                        
//                         <div className="col-md-8">
//                             <h2 className='my-4'>{restaurant.name}</h2>
//                             <p><strong>Ubicación:</strong> {restaurant.location}</p>
//                             <p><strong>Telefono:</strong> {restaurant.telephone}</p>
//                             <p><strong>Capacidad:</strong> {restaurant.capacity}</p>
//                             <p><strong>Latitutud:</strong> {restaurant.latitude}</p>
//                             <p><strong>Longitud:</strong> {restaurant.longitude}</p>
//                         </div>
//                     </div>

//                     <div className="d-flex justify-content-end mt-3">
//                         <button className="btn border border-secondary me-2 bg-light" onClick={handleEdit}>
//                             ✏️
//                         </button>
//                         <button className="btn border border-secondary me-2 bg-light" onClick={handleDelete}>
//                             🗑️
//                         </button>
//                     </div>

//                     <div className="d-flex justify-content-end mt-3">
//                         <button className="btn btn-primary" onClick={handleBackToDashboard}>
//                             Volver al dashboard
//                         </button>
//                     </div>
//                 </>
//             ) : (
//                 <p>No hay detalles disponibles.</p>
//             )}
//             <ReservationsByRestaurant restaurantId={id} />
//         </div>
//     );
// };

// export default RestaurantDetail;


import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import ReservationsByRestaurant from './reservationByRestaurant';
import "../../styles/stateButtons.css";



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
        return <div className="text-center py-5"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...</div>;
    }

    const restaurant = store.specificRestaurant;

    const handleDelete = () => {
        actions.deleteRestaurant(id);
        navigate('/owners/dashboard');
    };

    const handleEdit = () => {
        navigate(`/create_restaurant/${restaurant.id}`);
    };

    const handleBackToDashboard = () => {
        navigate('/owners/dashboard');
    };

    return (
        <div className="container mt-4 mb-4">
            <h1 className="mb-5 text-center">Detalles del Restaurante</h1>

            <div className="card shadow-lg">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4 mb-4 rounded-3">
                            <img 
                                src={restaurant.image_url || "https://media.istockphoto.com/id/1428412216/es/foto/un-chef-masculino-vertiendo-salsa-en-la-comida.jpg?s=612x612&w=0&k=20&c=Wze2YwgkFMQOTWoxdiRYsUpa1azCIOm8yRaUEEYOgOU="} 
                                alt={restaurant.name} 
                                className="img-fluid rounded shadow-sm hover-effect"
                                style={{ height: "300px", objectFit: "cover" }}
                            />
                        </div>

                        <div className="col-md-8">
                            <h2 className="my-4">{restaurant.name}</h2>
                            <p><strong>Ubicación:</strong> {restaurant.location}</p>
                            <p><strong>Teléfono:</strong> {restaurant.telephone}</p>
                            <p><strong>Capacidad:</strong> {restaurant.capacity}</p>
                            <p><strong>Cocina:</strong> {restaurant.cuisine_type}</p>
                            <p><strong>Precio promedio:</strong> {restaurant.average_price}</p>
                        </div>
                    </div>

                    <div className="d-flex justify-content-start mt-4">
                        <button className="btn btn-secondary rounded-pill shadow-sm me-2 fw-bold" onClick={handleEdit}>
                            ✏️ Editar
                        </button>

                        <button className="btn btn-danger rounded-pill shadow-sm fw-bold" onClick={handleDelete}>
                            🗑️ Eliminar 

                        </button>
                    </div>

                    {/* <div className="d-flex justify-content-end mt-3">
                        <button className="button-37" onClick={handleBackToDashboard}>
                            Volver al dashboard
                        </button>
                    </div> */}
                </div>
            </div>

            <div className="mt-5 mb-5">
                <h2 className="text-center">Reservas de {restaurant.name}</h2>
                <ReservationsByRestaurant restaurantId={id} restaurantName={restaurant.name} />
            </div>
        </div>
    );
};

export default RestaurantDetail;
