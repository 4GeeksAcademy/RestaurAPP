import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Context } from "../store/appContext";

const OwnerList = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
		actions.getAllOwners();
	},[]) ;

    const navigate = useNavigate();

    return (
        <div className="text-center mt-5">
            <h1>OWNERS LIST</h1>
            <button type="button" className="btn btn-primary" onClick={() => navigate('/owners/new')} >Create new owner</button>
            <ul>
                {
                    store.owners.map((owner) => {
                        return (
                        <li key={owner.id}>
                            <span><strong>ID:</strong>{owner.id} </span>
                            <span><strong>Name:</strong> {owner.name} </span>
                            <span><strong>Telephone:</strong> {owner.telephone}</span>
                            <span><strong> Email:</strong> {owner.email}</span>
                            <div className="gap-3">
                                <button onClick={() => actions.modifyOwner(owner.id, { name: "Updated Name", telephone: owner.telephone, email: owner.email })}>Modify owner</button>
                                <button onClick={()=> actions.deleteOwner(owner.id)}>Delete owner</button>
                            </div>
                        </li>
                    )
                })
                }
            </ul>
        </div>
    )
}

export default OwnerList