import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate } from "react-router-dom";
import LogoEnteroRestaurApp from "../../img/LogoEnteroRestaurApp.png"
import "../../styles/ownerProfile.css";

const OwnerProfile = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [ownerName, setOwnerName] = useState(localStorage.getItem("ownerName") || "Dueño");

    useEffect(() => {

        if (store.ownerName) {
            setOwnerName(store.ownerName);
            localStorage.setItem("ownerName", store.ownerName);
        }

        if (store.ownerId && !store.specificOwner) {
            actions.getSpecificOwner(store.ownerId);
        }
    }, [store.ownerName, store.ownerId, store.specificOwner, actions]);


    useEffect(() => {
        console.log("Dettagli owner:", store.specificOwner);
        console.log("Owner ID:", store.ownerId);
    }, [store.specificOwner, store.ownerId]);


    useEffect(() => {
        const storedOwnerId = localStorage.getItem("ownerId");
        console.log("Owner ID from localStorage:" + storedOwnerId);

        if (storedOwnerId) {
            actions.getSpecificOwner(storedOwnerId);
        }
    }, []);


    const handleEditProfile = () => {
        navigate(`/owners/${store.specificOwner.id}`);
    };


    const handleDeleteProfile = () => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar tu cuenta?");

        if (confirmDelete) {
            actions.deleteOwner(store.specificOwner.id);
            actions.ownerLogout();
            navigate("/");
        }
    };

    return (
        <>
            {store.auth === true || localStorage.getItem("token") ? (
                <div className="container mt-4 mb-5">
                    <h1>Bienvenido, {ownerName}</h1>
                    <h2 className="my-4">Detalles del perfil</h2>
                    {store.specificOwner ? (
                        <div className="row">
                            <div className="col-md-8">
                                <div className="d-flex">
                                    <div class="avatar avatar-xxxl">
                                        <img class="avatar-img rounded-circle" src="data:image/png;base64,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" alt="avatar" />
                                    </div>
                                    <div className="mt-4 ms-5">
                                        <p><strong>Nombre:</strong> {store.specificOwner.name}</p>
                                        <p><strong>Email:</strong> {store.specificOwner.email}</p>
                                        <p><strong>Teléfono:</strong> {store.specificOwner.telephone}</p>
                                        <p><strong>Ubicación:</strong> {store.specificOwner.location}</p>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <button className="btn border bg-secondary me-2" onClick={handleEditProfile}>
                                        ✏️
                                    </button>
                                    <button className="btn border bg-danger" onClick={handleDeleteProfile}>
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            <div className="col-md-4 d-flex justify-content-center align-items-center">
                                <img
                                    src={LogoEnteroRestaurApp}
                                    alt="Owner"
                                    className="img-fluid rounded-3 hover-effect"
                                    style={{ width: "100%", height: "auto" }}
                                />
                            </div>
                        </div>
                    ) : (
                        <p>No hay detalles disponibles.</p>
                    )}
                </div>
            ) : (
                <Navigate to="/" />
            )}
            <div className="fixed-top" style={{ zIndex: 1030 }}>
                <div className="container">
                    <div className="col-md-4 mb-4">
                        <div className="d-flex justify-content-start mt-3">
                            <button 
                                type="button" 
                                className="btn btn-primary text-light" 
                                onClick={() => navigate("/owner/dashboard")}
                                style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1050 }}>
                                Volver
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OwnerProfile;
