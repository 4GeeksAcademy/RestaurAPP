
import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

export const Dinerlist = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        actions.getDinerList();
    }, []);

    function handleDelete(id){ 
        actions.handleDelete(id)
        console.log('se elimino')
    }

    function handleEdit(id, fullname, email, telephone, password) {
        console.log('se edito');
        navigate(`/dineredit/${id}`, { state: { id, fullname, email, telephone, password } });
    }
    

    return (
        <>
            <div className="container">
                <h2>List of Diners</h2>
                <ul className="list-group">
                    {store.diners.length > 0 ? (
                        store.diners.map((diner, index) => (
                            <li key={index} className="list-group-item">
                                <h5>{diner.fullname}</h5>
                                <p>{diner.email}</p>
                                <p>{diner.telephone}</p>
                                <button onClick={(e)=>handleEdit(diner.id, diner.fullname, diner.email, diner.telephone, diner.password)}>Edit</button>
                                <button onClick={(e)=>handleDelete(diner.id)}>Delete</button>
                            </li>

                        ))
                    ) : (
                        <p>No diners found.</p>
                    )}
                </ul>
                <br />
                <Link to="/dinerform">
                    <button className="btn btn-primary">Diner Sign Up</button>
                </Link>
            </div>
        </>
    );
};
