import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import AddRestaurant from "../component/AddRestaurant";
import MyRestaurants from "../component/MyRestaurants";

const OwnerDashboard = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();


    // Usa il nome dell'owner direttamente dal store
    const [ownerName, setOwnerName] = useState(store.ownerName || 'Owner');

    useEffect(() => {
        // Se il nome dell'owner nel store cambia, aggiorna lo stato locale
        if (store.ownerName) {
            setOwnerName(store.ownerName);
        } else {
            // se l'ownerName non è nel store, usa il localStorage
            const storedName = localStorage.getItem('ownerName');
            setOwnerName(storedName || 'Owner');
        }
    }, [store.ownerName]); // Dipende dal valore di ownerName nel store

    const handleLogout = () => {
        actions.ownerLogout(); // Cancella autenticazione
        localStorage.removeItem("ownerName"); // Rimuove il nome dal localStorage
        setOwnerName("Owner"); // Resetta il nome
        navigate("/"); // Torna a Home
    };

    return (
        <>
            {store.auth == true ?
            <>
            <div className="container mt-4">
                <h1>Welcome, {ownerName}</h1>
            </div>
            <button type="button" class="btn btn-light ms-5" data-bs-toggle="modal" data-bs-target="#staticBackdrop">    {/* <!-- botón del modal --> */}
            Add new restaurant
            </button>

            {/* <!-- Modal --> */}
            <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Fill in to add a new restaurant</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <AddRestaurant/>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
            </div>
            <MyRestaurants/>
            <div className="container mt-5 d-flex justify-content-between">
                <button type="button" className="btn btn-danger" onClick={handleLogout}>
                    Log Out
                </button>
                <button type="button" className="btn btn-primary" onClick={() => navigate("/")}>
                    Go back to Home
                </button>
            </div>
            </>
            :
            <Navigate to="/"/>
            }
        </>
    );
};


export default OwnerDashboard
