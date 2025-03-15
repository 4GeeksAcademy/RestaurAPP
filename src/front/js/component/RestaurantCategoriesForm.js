// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Context } from "../store/appContext";
// import MyRestaurants from "./MyRestaurants";


// const RestaurantCategoriesForm = ({ restaurants = [] }) => {  // Assicura che restaurants sia un array vuoto di default
//   console.log("Restaurants prop:", restaurants);
//   const [idRestaurant, setIdRestaurant] = useState("");
//   const [idCategory, setIdCategory] = useState("");

//   const navigate = useNavigate();
//   const { restaurantCategoryId } = useParams();
//   const { store, actions } = useContext(Context);
//   console.log("Store categories:", store.categories); 

//   useEffect(() => {
//     actions.getAllCategories();

//     console.log("RestaurantCategoryId:", restaurantCategoryId);  // Verifica si hay ID
//     console.log("Store categories:", store.categories);  // Verifica si las categorias se cargan
//     if (restaurantCategoryId) {
//       const restaurantCategory = store.restaurantCategories.find(
//         (rc) => rc.id === parseInt(restaurantCategoryId)
//       );
//       if (restaurantCategory) {
//         setIdRestaurant(restaurantCategory.id_restaurant || "");
//         setIdCategory(restaurantCategory.id_category || "");
//       }
//     } else {
//       setIdRestaurant("");
//       setIdCategory("");
//     }
//   }, [restaurantCategoryId]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("idRestaurant:", idRestaurant);
//     console.log("idCategory:", idCategory);
//     // Logica para enviar el form
//     navigate("/restaurant_categories");
//   };

//   return (
//     <>
//       <h1 className="container mt-3">Add a Restaurant Category</h1>
//       <form className="container mt-4" onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label htmlFor="restaurantSelect" className="form-label">
//             Select Restaurant
//           </label>
//           <select
//             id="restaurantSelect"
//             className="form-control"
//             value={idRestaurant}
//             onChange={(e) => setIdRestaurant(e.target.value)}
//           >
//             <option value="">Choose a restaurant</option>
//             {restaurants.length > 0 && restaurants.map((restaurant) => (  // Controlo que restaurants non está vacío
//               <option key={restaurant.id} value={restaurant.id}>
//                 {restaurant.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="mb-3">
//           <label htmlFor="categorySelect" className="form-label">
//             Select Category
//           </label>
//           <select
//             id="categorySelect"
//             className="form-control"
//             value={idCategory}
//             onChange={(e) => setIdCategory(e.target.value)}
//           >
//             <option value="">Choose a category</option>
//             {store.categories.map((category) => (
//               <option key={category.id} value={category.id}>
//                 {category.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <button type="submit" className="btn btn-primary">
//           {restaurantCategoryId ? "Update Restaurant Category" : "Add Restaurant Category"}
//         </button>
//       </form>
//     </>
//   );
// };

// export default RestaurantCategoriesForm;

import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate, useParams } from "react-router-dom";

const RestaurantCategoriesForm = () => {
  const [idRestaurant, setIdRestaurant] = useState("");
  const [idCategory, setIdCategory] = useState("");

  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const { restaurantCategoryId } = useParams();

  useEffect(() => {
    console.log("restaurantCategoryId:", restaurantCategoryId); 

    // Carica rist e cat se non sono ancora nel store
    if (store.restaurants.length === 0) {
      actions.getAllRestaurants();
    }
    if (store.categories.length === 0) {
      actions.getAllCategories();
    }

    if (restaurantCategoryId) {
      const restaurantCategory = store.restaurantCategories.find(
        (rc) => rc.id === parseInt(restaurantCategoryId)
      );
      if (restaurantCategory) {
        setIdRestaurant(restaurantCategory.id_restaurant || "");
        setIdCategory(restaurantCategory.id_category || "");
      }
    } else {
      setIdRestaurant("");
      setIdCategory("");
    }
  }, [restaurantCategoryId, store.restaurants, store.categories, actions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (restaurantCategoryId) {
      actions.modifyRestaurantCategory(restaurantCategoryId, {
        id_restaurant: idRestaurant,
        id_category: idCategory,
      });
    } else {
      actions.addRestaurantCategory({
        id_restaurant: idRestaurant,
        id_category: idCategory,
      });
    }
    navigate("/restaurant_categories");
  };

  // Mostra un'opzione di caricamento se i dati non sono ancora pronti
  const isLoading = store.restaurants.length === 0 || store.categories.length === 0;

  return (
    <>
      <h1 className="container mt-3">
        {restaurantCategoryId ? "Edit Restaurant Category" : "Add Restaurant Category"}
      </h1>
      <form className="container mt-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="restaurantSelect" className="form-label">
            Select Restaurant
          </label>
          <select
            id="restaurantSelect"
            className="form-control"
            value={idRestaurant}
            onChange={(e) => setIdRestaurant(e.target.value)}
            disabled={isLoading}
          >
            <option value="">Choose a restaurant</option>
            {isLoading ? (
              <option>Loading...</option>
            ) : (
              store.restaurants.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="categorySelect" className="form-label">
            Select Category
          </label>
          <select
            id="categorySelect"
            className="form-control"
            value={idCategory}
            onChange={(e) => setIdCategory(e.target.value)}
            disabled={isLoading}
          >
            <option value="">Choose a category</option>
            {isLoading ? (
              <option>Loading...</option>
            ) : (
              store.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            )}
          </select>
        </div>

        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {restaurantCategoryId ? "Save changes" : "Add Category"}
        </button>
      </form>
    </>
  );
};

export default RestaurantCategoriesForm;


