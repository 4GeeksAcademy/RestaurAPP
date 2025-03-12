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

      {/* Manejo de estado al cargar propietarios */}
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

export default OwnerList;
