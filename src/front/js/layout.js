import React, { useContext } from "react";
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

import OwnerList from "./component/ownerList";
import OwnerForm from "./component/ownerForm";
import OwnerRestaurants from "./component/OwnerRestaurants";

import PrivateRoute from "./component/PrivateRoute"; // Importar componente para proteger rutas
import ReservationList from "./component/ReservationList"; // Importar el componente del listado de reservas

import SearchAndReserve from "./component/SearchAndReserve"; // Importar el componente de búsqueda y reserva
import ManageReservations from "./component/ManageReservations"; // Importar el componente de gestión de reservas
import RequestReservation from "./component/RequestReservation";

const Layout = () => {
  const basename = process.env.BASENAME || "";

  if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "")
    return <BackendURL />;

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
            <Route element={<OwnerList />} path="/owners" />
            <Route element={<OwnerRestaurants />} path="/owners/:owner_id/restaurants" />
            <Route element={<OwnerForm />} path="/owners/new" />
            <Route element={<OwnerForm />} path="/owners/:ownerId" />
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
};

export default injectContext(Layout);
