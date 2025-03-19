import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Link } from "react-router-dom";

import Restaurapp from './../../img/Restaurapp.jpg';

export const Home = () => {
    const { store, actions } = useContext(Context);

    return (
        <div className="home-container text-center mt-5">
            <h1 className="mb-4">Bienvenido a RestaurAPP</h1>
            <div className="button-container mb-4">
                <h3 className="mb-3">Soy Propietario</h3>
                <div className="d-flex justify-content-center gap-3">
                    <Link to="/owners/new">
                        <button type="button" className="btn btn-light">Owner Signup</button>
                    </Link>
                    <Link to="/owners/login">
                        <button type="button" className="btn btn-light">Owner Login</button>
                    </Link>
                </div>
            </div>
            <div className="button-container mb-4">
                <h3 className="mb-3">Soy Comensal</h3>
                <div className="d-flex justify-content-center gap-3">
                    <Link to="/diner/login">
                        <button className="btn btn-light">Diner Login</button>
                    </Link>
                    <Link to="/dinerform">
                        <button className="btn btn-light">Diner Sign up</button>
                    </Link>
                </div>
            </div>
            <div className="img-container mb-4">
                <img src={Restaurapp} alt="Restaurapp Logo" className="img-fluid" />
            </div>
        </div>
    );
};

