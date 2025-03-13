/*

import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const OwnerList = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getAllOwners(); // Llama a la acción para obtener la lista de propietarios
  }, []);
  console.log("Propietarios en el store:", store.owners);


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

      
      {store.owners === undefined ? (
        <div className="text-center mt-5">Loading...</div>
      ) : store.owners.length > 0 ? (
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
                    onClick={() => navigate(`/owners/${owner.id}/edit`)}
                    className="btn btn-warning me-2"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this owner?")) {
                        actions.deleteOwner(owner.id);
                      }
                    }}
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
        <p className="text-center text-danger">No owners available</p>
      )}
    </div>
  );
};

export default OwnerList;*/



import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const OwnerList = () => {
  const { store, actions } = useContext(Context);
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga
  const [error, setError] = useState(""); // Para manejar errores

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        setLoading(true);
        setError("");
        await actions.getAllOwners();
      } catch (err) {
        console.error("Error fetching owners:", err);
        setError("Failed to load owners. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOwners();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Owners List</h1>

      
      <div className="text-center">
        <button
          type="button"
          className="btn btn-primary mb-3"
          onClick={() => navigate("/owners/new")}
        >
          ➕ Create New Owner
        </button>
      </div>

     
      {loading ? (
        <div className="text-center mt-5">
          <p>Loading owners...</p>
        </div>
      ) : error ? (
        <div className="text-center text-danger mt-5">
          <p>{error}</p>
        </div>
      ) : store.owners.length > 0 ? (
        // Renderizar la tabla de propietarios
        <table className="table table-hover">
          <thead className="thead-light">
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
                    onClick={() => navigate(`/owners/${owner.id}/edit`)}
                    className="btn btn-warning btn-sm me-2"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete "${owner.name}"?`
                        )
                      ) {
                        actions.deleteOwner(owner.id);
                      }
                    }}
                    className="btn btn-danger btn-sm me-2"
                  >
                    🗑️ Delete
                  </button>
                  <button
                    onClick={() => navigate(`/owners/${owner.id}/restaurants`)}
                    className="btn btn-success btn-sm"
                  >
                    🔎 View Restaurants
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        // Mensaje si no hay propietarios
        <p className="text-center text-danger">No owners available.</p>
      )}
    </div>
  );
};

export default OwnerList;

