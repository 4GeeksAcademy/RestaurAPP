import React, {useState, useContext} from "react";
import {Context} from "../store/appContext";
import { Link, Navigate } from 'react-router-dom';
import OwnerDashboard from "../pages/ownerDashboard";

const OwnerLogin = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);    //estado para gestionar el redirect a dashboard, false al principio

    function sendData(e) {
        e.preventDefault();
        actions.ownerLogin(email, password)
        .then(() => {
        setRedirect(true);                            // después del login pasa a true
        });
    }

    if (redirect || store.auth === true) {                   //si login OK, va a dashboard
        return <Navigate to="/owners/dashboard" />;
    }

    return (
        <div className="container">
            <h1 className="my-4">RestaurApp</h1>
            <h2 className="mb-3">Owner Login</h2>
            <form className="container" onSubmit={sendData}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="write here your email"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" id="exampleInputPassword1" placeholder="write here your password"/>
                </div>
                <button type="submit" className="btn btn-primary">Log in</button>
            </form>
            <p className="mt-4">Don't have an account? <Link to="/new" className="text-primary fw-bold">Sign up here</Link></p>
        </div>
        
    )
}

export default OwnerLogin