import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

export const OriginList = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [name, setName] = useState('');

    useEffect(() => {
        actions.getOriginList();
    }, []);

    function originDelete(id) {
        actions.originDelete(id)
        console.log('deleted origin')
    }

    function createOrigin(e) {
        e.preventDefault();
        const nameWithFood = name + " food";
        actions.createOrigin(nameWithFood);
        setName('');
    }



    return (
        <>
            <div className="container">
                <h2 className="mb-4 mt-4" >List of Origins Food</h2>
                <form onSubmit={createOrigin} className="row g-3">
                    <div className="col-auto">
                        <label htmlFor="inputOrigin" className="visually-hidden">Origin</label>
                        <input type="origin"
                            className="form-control"
                            id="inputOrigin"
                            placeholder="Origin"
                            value={name}
                            onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="col-auto">
                        <button type="submit" className="btn btn-primary mb-3">Create food origin</button>
                    </div>
                </form>
                <ul className="list-group">
                    {store.origins.length > 0 ? (
                        store.origins.map((origin, index) => (
                            <li key={index} className="list-group-item">
                                <h5>{origin.name}</h5>
                                <button onClick={(e) => originDelete(origin.id)}>Delete</button>
                            </li>

                        ))
                    ) : (
                        <p>No origin found.</p>
                    )}
                </ul>
                <br />
                <Link to="/dinerform">
                    <button className="btn btn-primary">Diner form</button>
                </Link>
            </div>
        </>
    );
};
