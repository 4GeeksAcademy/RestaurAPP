/*
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
                                <button 
                                    onClick={() => navigate(`/owners/${owner.id}`)}
                                    className="btn btn-warning me-4"
                                >
                                    Modify owner
                                </button>
                                <button onClick={()=> actions.deleteOwner(owner.id)} className="btn btn-danger">Delete owner</button>
                            </div>
                        </li>
                    )
                })
                }
            </ul>
        </div>
    )
}

export default OwnerList*/

import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const OwnerList = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getAllOwners(); // Llama a la acción para obtener la lista de propietarios
  }, []);

  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h1 className="text-center">Owners List</h1>
      <button
        type="button"
        className="btn btn-primary mb-3"
        onClick={() => navigate("/owners/new")}
      >
        ➕ Create new owner
      </button>

      {store.owners?.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Telephone</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {store.owners.map((owner) => (
              <tr key={owner.id}>
                <td>{owner.name}</td>
                <td>{owner.telephone}</td>
                <td>{owner.email}</td>
                <td>
                  <button
                    onClick={() => navigate(`/owners/${owner.id}`)}
                    className="btn btn-warning me-2"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => actions.deleteOwner(owner.id)}
                    className="btn btn-danger me-2"
                  >
                    🗑️ Delete
                  </button>
                  <button
                    onClick={() => navigate(`/owners/${owner.id}/restaurants`)}
                    className="btn btn-success"
                  >
                    🔎 View Restaurants
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No owners available</p>
      )}
    </div>
  );
};

export default OwnerList;