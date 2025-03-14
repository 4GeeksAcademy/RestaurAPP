import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const CategoriesList = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getAllCategories(); // Llama a la acción para obtener la lista de categorias
  }, []);

  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h1 className="text-center">Categories List</h1>
      <button
        type="button"
        className="btn btn-primary mb-3"
        onClick={() => navigate("/categories/new")}
      >
        ➕ Create new category
      </button>

      {store.categories?.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {store.categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>
                  <button
                    onClick={() => navigate(`/categories/${category.id}`)}
                    className="btn btn-warning me-2"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => actions.deleteCategory(category.id)}
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
        <p className="text-center">No categories available</p>
      )}
    </div>
  );
};

export default CategoriesList;