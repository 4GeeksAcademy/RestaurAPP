import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import restaurappImageUrl from "../../img/imagenRestaurapp.jpg";

export const DinerDashboard = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [dinerFullName, setDinerFullName] = useState(store.fullname || 'fullname');

    useEffect(() => {
        if (store.dinerFullName) {
            setDinerFullName(store.dinerFullName);
        } else {
            const storedName = localStorage.getItem('dinerFullName');
            setDinerFullName(storedName || 'Diner');
        }
    }, [store.dinerFullName]);

    const handleLogout = () => {
        actions.dinerLogout();
        localStorage.removeItem("dinerFullName");
        setDinerFullName("Diner");
        navigate("/diner/login");
    };

    const chargeRestaurants = () => {
        actions.getAllRestaurants();
    };

    return (
        <>
            {store.dinerauth === true ? (
                <>
                    <div className="container mt-4">
                        <h1>Bienvenido!, {dinerFullName}</h1>
                    </div>

                    <ul className="nav nav-tabs justify-content-center">
                        <li className="nav-item">
                            <button
                                className="nav-link active"
                                aria-current="page"
                                onClick={() => chargeRestaurants()}
                            >
                                Restaurantes
                            </button>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/link1">reservas</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/link2">Cuenta</Link>
                        </li>
                    </ul>

                    <div className="row mt-4 mx-2">
                        {store.restaurants && store.restaurants.length > 0 ? (
                            store.restaurants.map((restaurant, index) => (
                                <div className="col-12 col-sm-6 col-md-3 mb-4" key={index}>
                                    <div className="card" style={{ width: '18rem' }}>
                                        <img
                                            src={restaurappImageUrl}
                                            className="card-img-top"
                                            alt="Card image"
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{restaurant.name}</h5>
                                            <p className="card-text">{restaurant.location}</p>
                                        </div>
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item">capacidad: {restaurant.capacity}</li>
                                            <li className="list-group-item">Ubicacion: {restaurant.location}</li>
                                        </ul>
                                        <div className="card-body">
                                            <Link to="#" className="card-link">Hacer Reservacion</Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No restaurants available.</p>
                        )}
                    </div>

                    <div className="container mt-5 d-flex justify-content-between">
                        <button type="button" className="btn btn-danger" onClick={handleLogout}>
                            Log Out
                        </button>
                        <button type="button" className="btn btn-primary" onClick={() => navigate("/")}>
                            Go back to Home
                        </button>
                    </div>
                </>
            ) : (
                <Navigate to="/" />
            )}
        </>
    );
};
