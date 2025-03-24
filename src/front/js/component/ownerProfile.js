import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate } from "react-router-dom";

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

    // Edita perfil
    const handleEditProfile = () => {
        navigate(`/owners/${store.ownerId}`);
    };

    // Elimina perfil
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
                        <div>
                            <p><strong>Nombre:</strong> {store.specificOwner.name}</p>
                            <p><strong>Email:</strong> {store.specificOwner.email}</p>
                            <p><strong>Teléfono:</strong> {store.specificOwner.telephone}</p>
                            <p><strong>Ubicación:</strong> {store.specificOwner.location}</p>
                            <div className="d-flex justify-content-end">
                                <button className="btn border bg-light me-2" onClick={handleEditProfile}>
                                    ✏️
                                </button>
                                <button className="btn border bg-light" onClick={handleDeleteProfile}>
                                    🗑️
                                </button>
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