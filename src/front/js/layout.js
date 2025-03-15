<<<<<<< HEAD
import React, { useContext } from "react";
=======

import React, { useEffect, useContext } from "react";
>>>>>>> develop
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import SearchRestaurants from "./component/SearchRestaurants"; // Importar el componente de búsqueda de restaurantes
import AddRestaurant from "./component/AddRestaurant"; // Importar el componente de añadir restaurante
import MyRestaurants from "./component/MyRestaurants";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

import { Dinerform } from "./component/dinerform";
import { Dinerlist } from "./component/dinerlist";
import { DinerEdit } from "./component/dineredit";
import { DinerLogin } from "./component/dinerLogin";
import { DinerDashboard } from "./component/dinerDashboard";

import OwnerList from "./component/ownerList";
import OwnerForm from "./component/ownerForm";
import OwnerRestaurants from "./component/OwnerRestaurants";
import OwnerLogin from "./component/ownerLogin";
import OwnerDashboard from "./pages/ownerDashboard";

import { OriginList } from "./component/originList";

import CategoriesList from "./component/categoriesList";
import CategoriesForm from "./component/categoryForm";



import PrivateRoute from "./component/PrivateRoute"; // Importar componente para proteger rutas
<<<<<<< HEAD
import ReservationList from "./component/ReservationList"; // Importar el componente del listado de reservas

import SearchAndReserve from "./component/SearchAndReserve"; // Importar el componente de búsqueda y reserva
import ManageReservations from "./component/ManageReservations"; // Importar el componente de gestión de reservas
import RequestReservation from "./component/RequestReservation";
=======
import { Context } from "./store/appContext";
import CreateRestaurant from "./component/createRestaurant";

>>>>>>> develop

const Layout = () => {
<<<<<<< HEAD
  const basename = process.env.BASENAME || "";
=======
    // the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";
    const { actions } = useContext(Context);
>>>>>>> develop

  if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "")
    return <BackendURL />;

<<<<<<< HEAD
  return (
    <div>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <Navbar />
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Dinerform />} path="/dinerform" />
            <Route element={<Dinerlist />} path="/dinerlist" />
            <Route element={<DinerEdit />} path="/diners/:diner_id/edit" />
            <Route element={<OwnerList />} path="/owners" />
            <Route element={<OwnerRestaurants />} path="/owners/:owner_id/restaurants" />
            <Route element={<OwnerForm />} path="/owners/new" />
            <Route element={<OwnerForm />} path="/owners/:owner_id/edit" />
            <Route element={<Demo />} path="/demo" />
            <Route element={<Single />} path="/single/:theid" />
            <Route element={<SearchRestaurants />} path="/search-restaurants" /> {/* Ruta de búsqueda de restaurantes */}
            <Route element={<AddRestaurant />} path="/add-restaurant" /> {/* Ruta de añadir restaurante */}
            <Route element={<SearchAndReserve />} path="/search-and-reserve" /> {/* Ruta de búsqueda y reserva */}
            <Route element={<ManageReservations />} path="/manage-reservations" /> {/* Ruta de gestión de reservas */}
            <Route element={<MyRestaurants />} path="/my-restaurants" />
            <Route element={<RequestReservation />} path="/request-reservation" />
            <Route element={<ReservationList />} path="/restaurants/:restaurantId/reservations" /> {/* Ruta para el listado de reservas */}
  
            <Route element={<h1>Not found!</h1>} />
          </Routes>
          {/* <Footer /> */}
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
=======
    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />

                        <Route element={<Dinerform />} path="/dinerform" />
                        <Route element={<Dinerlist />} path="/dinerlist" />
                        <Route element={<DinerEdit />} path="/dineredit/:id" />
                        <Route element={<DinerLogin />} path="/diner/login" />
                        <Route element={<DinerDashboard />} path="/diner/dashboard" />

                        <Route element={<OriginList />} path="/origins" />

                        <Route element={<CategoriesList />} path="/categories" />
                        <Route element={<CategoriesForm />} path="/categories/new" />
                        <Route element={<CategoriesForm />} path="/categories/:categoryId" />

                        <Route element={<OwnerList />} path="/owners" />
                        <Route element={<OwnerRestaurants />} path="/owners/:owner_id/restaurants" />
                        <Route element={<OwnerForm />} path="/owners/new" />
                        <Route element={<OwnerForm />} path="/owners/:ownerId" />
                        <Route element={<OwnerLogin/>} path="/owners/login" />
                        <Route element={<OwnerDashboard/>} path="/owners/dashboard" />

                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<SearchRestaurants />} path="/search-restaurants" />  {/* Ruta de búsqueda de restaurantes */}
                        <Route element={<AddRestaurant />} path="/add-restaurant" />  {/* Ruta de añadir restaurante */}
                        <Route element={<CreateRestaurant />} path="/create_restaurant" />

                        {/* Ruta protegida para propietarios */}
                        <Route
                            path="/my-restaurants"
                            element={
                                <PrivateRoute requiredRole="owner"> {/* Verifica que el usuario sea propietario */}
                                    <MyRestaurants />
                                </PrivateRoute>
                            }
                        />

                        {/*<Route element={<Signup />} path="/signup" />*/}  {/* Ruta de registro */}
                        {/*<Route element={<Login />} path="/login" />*/}  {/* Ruta de inicio de sesión */}
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    {/* <Footer /> */}
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
>>>>>>> develop
};

export default injectContext(Layout);
