import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import AddRestaurant from "../component/AddRestaurant";
import MyRestaurants from "../component/MyRestaurants";
import CreateRestaurant from "../component/createRestaurant";

const OwnerDashboard = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();


    const [ownerName, setOwnerName] = useState(localStorage.getItem('ownerName') || 'Owner');
    const [ownerId, setOwnerId] = useState(localStorage.getItem('ownerId') || 'Id');

    useEffect(() => {

        if (store.ownerName) {
            setOwnerName(store.ownerName);
            localStorage.setItem('ownerName', store.ownerName);
        }

        if (store.ownerId) {
            setOwnerId(store.ownerId);
            localStorage.setItem('ownerId', store.ownerId);
        }
    }, [store.ownerName, store.ownerId]);

    const handleLogout = () => {
        actions.ownerLogout();
        localStorage.removeItem("ownerName");
        localStorage.removeItem("ownerId");
        localStorage.removeItem("authToken");
        setOwnerName("Owner");
        setOwnerId("Id");
        navigate("/");
    };

    return (
        <>
            {store.auth === true ? (
                <>
                    <div className="container mt-4">
                        <h1>Welcome, {ownerName}</h1>
                    </div>
                    <div className="d-flex justify-content-between align-items-start">
                        <div className="col-3 d-flex justify-content-center">
                            <button
                                type="button"
                                className="btn btn-primary w-100"
                                onClick={() => navigate("/create_restaurant")}
                            >
                                Crear Nuevo Restaurante
                            </button>
                        </div>


                        <div className="col-8">
                            <MyRestaurants />
                        </div>
                    </div>

                    <button
                        type="button"
                        className="btn btn-light ms-5"
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop"
                    >
                        Add new restaurant
                    </button>

                    {/* Modal */}
                    <div
                        className="modal fade"
                        id="staticBackdrop"
                        data-bs-backdrop="static"
                        data-bs-keyboard="false"
                        tabIndex="-1"
                        aria-labelledby="staticBackdropLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="staticBackdropLabel">
                                        Fill in to add a new restaurant
                                    </h1>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <AddRestaurant />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
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

export default OwnerDashboard;