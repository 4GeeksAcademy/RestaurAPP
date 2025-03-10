import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

export const OriginList = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [edit, setEdit] = useState('');
    const [editId, setEditId] = useState(null); 

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

    
    function editOrigin(e) {
        e.preventDefault();
        if (editId !== null) {  
            let updatedName = edit.trim(); 
            if (!updatedName.endsWith(" food")) {
                updatedName += " food";  
            }
    
            actions.editOrigin(updatedName, editId);
            setEdit('');
            setEditId(null);  
            actions.getOriginList();
        }
    }
    

    function handleEditClick(id, name) {
        setEditId(id);
        setEdit(name); 
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
                                <div>
                                    <button onClick={(e) => originDelete(origin.id)}>Delete</button>
                                    <button onClick={() => handleEditClick(origin.id, origin.name)}>Edit</button>
                                    {editId === origin.id && (
                                        <form onSubmit={editOrigin} className="row g-3">
                                            <div className="col-auto">
                                                <label htmlFor="inputOrigin" className="visually-hidden">Edit Origin</label>
                                                <input type="text"
                                                    className="form-control"
                                                    id="inputEditOrigin"
                                                    placeholder="Edit Origin"
                                                    value={edit}
                                                    onChange={(e) => setEdit(e.target.value)} />
                                            </div>
                                            <div className="col-auto">
                                                <button type="submit" className="btn btn-primary mb-3">Edit Origin</button>
                                            </div>
                                        </form>
                                    )}
                                </div>
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

