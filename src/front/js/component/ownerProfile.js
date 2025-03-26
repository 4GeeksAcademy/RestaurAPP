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
        console.log("Owner ID from localStorage:", storedOwnerId);
        
        if (storedOwnerId) {
            actions.getSpecificOwner(storedOwnerId);
        }
    }, []);


    const handleEditProfile = () => {
        navigate(`/owners/${store.ownerId}`);
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
                <div className="container mt-4">
                    <h1>Bienvenido, {ownerName}</h1>
                    <h2 className="my-4">Detalles del perfil</h2>
                    {store.specificOwner ? (
                        <div className="row">
                            <div className="col-md-8">
                                <p><strong>Nombre:</strong> {store.specificOwner.name}</p>
                                <p><strong>Email:</strong> {store.specificOwner.email}</p>
                                <p><strong>Teléfono:</strong> {store.specificOwner.telephone}</p>
                                <p><strong>Ubicación:</strong> {store.specificOwner.location}</p>
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
        </>
    );
};

export default OwnerProfile;
