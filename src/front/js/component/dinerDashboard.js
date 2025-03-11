import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import SearchRestaurants from "./SearchRestaurants";
import { OriginList } from "./originList";



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

    return (
        <>
            {store.auth == true ?
                <>
                    <div className="container mt-4">
                        <h1>Welcome, {dinerFullName}</h1>
                    </div>
                    <h2>My Reservations</h2>
                    <SearchRestaurants />
                    <OriginList />
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
                <Navigate to="/" />
            }
        </>
    );
};



