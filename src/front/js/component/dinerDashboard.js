import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Navigate, Link } from "react-router-dom";
import restaurappImageUrl from "../../img/imagenRestaurapp.jpg";

export const DinerDashboard = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    
 
    const [dinerFullName, setDinerFullName] = useState(store.fullname || 'fullname');
    const [email, setEmail] = useState(store.email || 'email');
    const [telephone, setTelephone] = useState(store.telephone || 'telephone');
    const [password, setPassword] = useState('');
    
    const [activeTab, setActiveTab] = useState("restaurantes");

    useEffect(() => {
        if (store.dinerFullName) {
            setDinerFullName(store.dinerFullName);
        } else {
            const storedName = localStorage.getItem('dinerFullName');
            setDinerFullName(storedName || 'Diner');
        }
        if (store.email) setEmail(store.email);
        if (store.telephone) setTelephone(store.telephone);
    }, [store.dinerFullName, store.email, store.telephone]);


    useEffect(() => {
        if (!store.restaurants || store.restaurants.length === 0) {
            actions.getAllRestaurants();
        }
    }, [store.restaurants, actions]);


    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>
            {store.dinerauth === true || localStorage.getItem("tokenDiner") ? (
                <>
                    <div className="container mt-4">
                        <h1>Bienvenido {dinerFullName}!</h1>
                    </div>
                    <ul className="nav nav-tabs justify-content-center">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'restaurantes' ? 'active' : ''}`}
                                aria-current="page"
                                onClick={() => handleTabClick("restaurantes")}
                            >
                                Restaurantes
                            </button>
                        </li>
                        
                    </ul>
                    {activeTab === "restaurantes" && (
                        <div className="row mt-4 mx-2">
                            {store.restaurants && store.restaurants.length > 0 ? (
                                store.restaurants.map((restaurant, index) => (
                                    <div className="col-12 col-sm-6 col-md-3 mb-4" key={index}>
                                        <div className="card" style={{ width: '18rem' }}>
                                            <img
                                                src={restaurant.image_url || restaurappImageUrl}
                                                className="card-img-top"
                                                alt="Card image"
                                            />
                                            <div className="card-body">
                                                <h5 className="card-title">{restaurant.name}</h5>
                                                <p className="card-text">{restaurant.location}</p>
                                            </div>
                                            <ul className="list-group list-group-flush">
                                                <li className="list-group-item">Capacidad: {restaurant.capacity} Personas</li>
                                                <li className="list-group-item">Ubicación: {restaurant.location}</li>
                                                <li className="list-group-item">Telefono: {restaurant.telephone}</li>
                                                
                                                
                                            </ul>
                                            <div className="card-body">
                                                <Link to={`/perfil_restaurant/${restaurant.id}`} className="card-link">Hacer Reservación</Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No restaurants available.</p>
                            )}
                        </div>
                    )}
                    <div className="container mt-5 d-flex justify-content-between">
                        <button type="button" className="btn btn-primary" onClick={() => navigate("/")}>
                            Volver
                        </button>
                    </div>
                </>
            ) : (
                <Navigate to="/" />
            )}
        </>
    );
};


