import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";

export const Dinerform = () => {
    const { store, actions } = useContext(Context);
    const [fullname, setfullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [telephone, setTelephone] = useState('');

    
    const handleSignup = (e) => {
        console.log('has creado tu usuario')
        actions.DinerForm(fullname, email, telephone, password )          
    };

    return (
        <>
            <div className="container">
                <div className="d-flex align-items-center mt-3 bg-body-tertiary">
                    <div className="form-signin w-100 m-auto">
                        <form onSubmit={handleSignup}>
                            <h1 className="h3 mb-3 fw-normal"><strong>Diner Sign up </strong></h1>

                            <div className="form-floating mb-2">
                                <input
                                    type="name"
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
                                    type="telephone"
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
                                    autoComplete="current-password"
                                />
                                <label htmlFor="floatingPassword">Password</label>
                            </div>
                            <button className="btn btn-primary w-100 py-2" type="submit">Sign up</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

