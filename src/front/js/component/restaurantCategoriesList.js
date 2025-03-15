import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const RestaurantCategoriesList = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getAllRestaurantCategories(); // Chiamata per ottenere le categorie dei ristoranti
  }, []);

  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h1 className="text-center">Restaurant Categories List</h1>
      <button
        type="button"
        className="btn btn-primary mb-3"
        onClick={() => navigate("/restaurant_categories/new")}
      >
        ➕ Create new restaurant-category
      </button>

      {store.restaurantCategories?.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Restaurant</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {store.restaurantCategories.map((rc) => (
              <tr key={rc.id}>
                <td>{rc.restaurant_name}</td>
                <td>{rc.category_name}</td>
                <td>
                  <button
                    onClick={() => navigate(`/restaurant_categories/${rc.id}`)}
                    className="btn btn-warning me-2"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => actions.deleteRestaurantCategory(rc.id)}
                    className="btn btn-danger me-2"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No restaurant categories available</p>
      )}
    </div>
  );
};

export default RestaurantCategoriesList;
