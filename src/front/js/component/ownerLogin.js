// import React, { useState, useContext } from "react";
// import { Context } from "../store/appContext";
// import { Link, Navigate } from 'react-router-dom';
// import "../../styles/login.css";

// const OwnerLogin = () => {
//     const { store, actions } = useContext(Context);
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     function sendData(e) {
//         e.preventDefault();
        
//         // Chiama il metodo di login
//         actions.ownerLogin(email, password);
//     }

//     // Se l'utente è autenticato (store.auth è true), lo reindirizziamo alla dashboard
//     if (store.auth === true) {
//         return <Navigate to="/owners/dashboard" />;
//     }

//     return (
//         <div className="container">
//             <h1 className="my-4">RestaurApp</h1>
//             <h2 className="mb-3">Inicio de sesión de propietario</h2>
//             <form className="container" onSubmit={sendData}>
//                 <div className="mb-3">
//                     <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
//                     <input 
//                         value={email} 
//                         onChange={(e) => setEmail(e.target.value)} 
//                         type="email" 
//                         className="form-control" 
//                         id="exampleInputEmail1" 
//                         placeholder="Write here your email" 
//                     />
//                 </div>
//                 <div className="mb-3">
//                     <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
//                     <input 
//                         value={password} 
//                         onChange={(e) => setPassword(e.target.value)} 
//                         type="password" 
//                         className="form-control" 
//                         id="exampleInputPassword1" 
//                         placeholder="Write here your password" 
//                     />
//                 </div>
//                 <button type="submit" className="btn btn-primary">Log in</button>
//             </form>
//             <p className="mt-4">No tienes una cuenta? <Link to="/owners/new" className="text-primary fw-bold">Regístrate aquí</Link></p>
//         </div>
//     );
// }

// export default OwnerLogin;

import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Link, Navigate } from 'react-router-dom';
import "../../styles/login.css";
import LoginImg from "../../img/LoginImg.jpeg";

const OwnerLogin = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function sendData(e) {
        e.preventDefault();
        actions.ownerLogin(email, password);
    }

    if (store.auth === true) {
        return <Navigate to="/owners/dashboard" />;
    }

    return (
        <div className="login-container">
            <div className="login-card">
                {/* Sezione immagine a sinistra */}
                <div className="login-image-container">
                    <img 
                        src={LoginImg} 
                        alt="Login Background" 
                        className="login-image"
                    />
                </div>
                
                {/* Sezione login a destra */}
                <div className="login-content">
                    <h1>RestaurApp</h1>
                    <h2 className="mb-4">Inicio de sesión de propietario</h2>
                    <form onSubmit={sendData}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                type="email" 
                                className="form-control" 
                                placeholder="Escribe aquí tu email" 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                type="password" 
                                className="form-control" 
                                placeholder="Escribe aquí tu password" 
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Log in</button>
                    </form>
                    <p className="mt-4 text-center">
                        No tienes una cuenta? 
                        <Link to="/owners/new" className="text-primary fw-bold"> Regístrate aquí</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default OwnerLogin;
