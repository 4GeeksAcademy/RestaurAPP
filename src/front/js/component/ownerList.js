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
    <div className="text-center mt-5">
      <h1>OWNERS LIST</h1>
      <button
        type="button"
        className="btn btn-primary mb-3"
        onClick={() => navigate("/owners/new")}
      >
        Create new owner
      </button>
      <ul>
        {store.owners.map((owner) => {
          return (
            <li key={owner.id}>
              <span>
                <strong>ID:</strong>
                {owner.id}{" "}
              </span>
              <span>
                <strong>Name:</strong> {owner.name}{" "}
              </span>
              <span>
                <strong>Telephone:</strong> {owner.telephone}
              </span>
              <span>
                <strong>Email:</strong> {owner.email}
              </span>
              <div className="gap-3 mt-2">
                <button
                  onClick={() => navigate(`/owners/${owner.id}`)}
                  className="btn btn-warning me-4"
                >
                  Modify owner
                </button>
                <button
                  onClick={() => actions.deleteOwner(owner.id)}
                  className="btn btn-danger me-4"
                >
                  Delete owner
                </button>
                {/* Agregamos el botón para gestionar los restaurantes del propietario */}
                <button
                  onClick={() => navigate(`/owners/${owner.id}/restaurants`)} // Cambiar a la ruta que muestra restaurantes del propietario
                  className="btn btn-success"
                >
                  View Restaurants
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default OwnerList;
