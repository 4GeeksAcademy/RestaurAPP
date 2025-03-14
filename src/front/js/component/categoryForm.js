import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate, useParams } from "react-router-dom";

const CategoriesForm = () => {
  const [name, setName] = useState("");


  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const { categoryId } = useParams();

  useEffect(() => {
    if (categoryId) {
      const category = store.categories.find(
        (category) => category.id === parseInt(categoryId)
      );
      if (category) {
        setName(category.name || "");
      }
    } else {
      setName("");
    }
  }, [categoryId, store.categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (categoryId) {
      actions.modifyCategory(categoryId, {
        name
      });
    } else {
      actions.addCategory({name});
    }
    navigate("/categories");
  };

  return (
    <>
      <h1 className="container mt-3">Add a category</h1>
      <form className="container mt-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputname" className="form-label">
            Category name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
            id="exampleInputname"
            aria-describedby="textHelp"
          />
        </div>
 
        <button type="submit" className="btn btn-primary">
        {categoryId ? "Update Category" : "Add Category"}
        </button>
      </form>
    </>
  );
};

export default CategoriesForm;
