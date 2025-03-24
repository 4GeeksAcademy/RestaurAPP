import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';

export const DinerEdit = () => {
    const { store, actions } = useContext(Context);
    const [fullname, setfullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [telephone, setTelephone] = useState('');

    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();



    useEffect(() => {
        if (location.state) {
            const { id, fullname, email, telephone, password } = location.state;
            setfullname(fullname);
            setEmail(email);
            setTelephone(telephone);
            setPassword(password);
        }
    }, [location.state]);

    const handleEdit = (e) => {
        e.preventDefault();
        actions.handleEdit(id, fullname, email, telephone, password);
        navigate('/dineraccount');
    };

    return (
        <div className="container">
            <div className="d-flex align-items-center mt-3 bg-body-tertiary">
                <div className="form-signin w-100 m-auto">
                    <form onSubmit={handleEdit}>
                        <h1 className="h3 mb-3 fw-normal"><strong>Mi Cuenta</strong></h1>

                        <div className="form-floating mb-2">
                            <input
                                type="text"
                                className="form-control"
                                id="floatingfullname"
                                placeholder="fullname"
                                value={fullname}
                                onChange={(e) => setfullname(e.target.value)}
                            />
                            <label htmlFor="floatingInput">Full Name</label>
                        </div>

                        <div className="form-floating mb-2">
                            <input
                                type="email"
                                className="form-control"
                                id="floatingEmail"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="floatingInput">Email address</label>
                        </div>

                        <div className="form-floating mb-2">
                            <input
                                type="text"
                                className="form-control"
                                id="floatingTelephone"
                                placeholder="Telephone"
                                value={telephone}
                                onChange={(e) => setTelephone(e.target.value)}
                            />
                            <label htmlFor="floatingInput">Telephone</label>
                        </div>

                        <div className="form-floating">
                            <input
                                type="password"
                                className="form-control"
                                id="floatingPassword"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label htmlFor="floatingPassword">Password</label>
                        </div>
                        <button className="btn btn-primary w-100 py-2" type="submit">Guardar Cambios</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
