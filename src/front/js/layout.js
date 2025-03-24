
import React, { useEffect, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";

// import SearchRestaurants from "./component/SearchRestaurants"; 
import AddRestaurant from "./component/AddRestaurant";  // Importar el componente de añadir restaurante
import MyRestaurants from "./component/MyRestaurants";
import injectContext from "./store/appContext";
import RestaurantSearch from "./component/RestaurantSearch";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

import { Dinerform } from "./component/dinerform";
import { Dinerlist } from "./component/dinerlist";
import { DinerEdit } from "./component/dineredit";
import { DinerLogin } from "./component/dinerLogin";
import { DinerDashboard } from "./component/dinerDashboard";
import { PerfilRestaurant } from "./component/perfilRestaurant";
import { DinerReservations } from "./component/dinerReservations";
import { DinerAccount } from "./component/mydinerAccount";

import OwnerList from "./component/ownerList";
import OwnerForm from "./component/ownerForm";
import OwnerRestaurants from "./component/OwnerRestaurants";
import OwnerLogin from "./component/ownerLogin";
import OwnerDashboard from "./pages/ownerDashboard";
import OwnerProfile from "./component/ownerProfile";
import OwnerLogout from "./component/OwnerLogOut";

import { OriginList } from "./component/originList";

import CategoriesList from "./component/categoriesList";
import CategoriesForm from "./component/categoryForm";

import RestaurantCategoriesList from "./component/restaurantCategoriesList";
import RestaurantCategoriesForm from "./component/RestaurantCategoriesForm";
import CreateRestaurant from "./component/createRestaurant";
import RestaurantDetail from "./component/RestaurantDetail";

import OwnerReservations from "./component/ownerReservations";

import AboutUs from "./component/aboutUs";
import ContactUs from "./component/contactUs";

import PrivateRoute from "./component/PrivateRoute"; // Importar componente para proteger rutas
import { Context } from "./store/appContext";




//create your first component
const Layout = () => {
    // the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";
    const { actions } = useContext(Context);

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

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
                        <Route element={<DinerReservations />} path="/diner/reservations" />
                        <Route element={<DinerAccount />} path="/dineraccount" />


                        <Route element={<OriginList />} path="/origins" />

                        <Route element={<CategoriesList />} path="/categories" />
                        <Route element={<CategoriesForm />} path="/categories/new" />
                        <Route element={<CategoriesForm />} path="/categories/:categoryId" />

                        <Route element={<RestaurantCategoriesList />} path="/restaurant_categories" />
                        <Route element={<RestaurantCategoriesForm />} path="/restaurant_categories/new" />
                        <Route element={<RestaurantCategoriesForm />} path="/restaurant_categories/:restaurantCategoryId" />
                        <Route element={<PerfilRestaurant />} path="/perfil_restaurant/:restaurant_id"  />
                       


                        <Route element={<OwnerList />} path="/owners" />
                        <Route element={<OwnerRestaurants />} path="/owners/:owner_id/restaurants" />
                        <Route element={<OwnerForm />} path="/owners/new" />
                        <Route element={<OwnerForm />} path="/owners/:ownerId" />
                        <Route element={<OwnerLogin/>} path="/owners/login" />
                        <Route element={<OwnerDashboard/>} path="/owners/dashboard" />
                        <Route element={<OwnerReservations/>} path="/owners/myReservations" />
                        <Route element={<OwnerProfile/>} path="/owners/profile" />
                        <Route element={<OwnerLogout/>} path="/owners/logout" />


                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<AddRestaurant />} path="/add-restaurant" />  
                        <Route element={<CreateRestaurant />} path="/create_restaurant" />  {/* añade rest a un owner */}
                        <Route element={<CreateRestaurant />} path="/create_restaurant/:id" />
                        <Route element={<CreateRestaurant />} path="/create_restaurant/:ownerId" />
                        <Route element={<RestaurantDetail />} path="/restaurants/:id" />
                        <Route element={<RestaurantSearch />} path="/restaurants-search" />


                        {/* <Route element={<SearchAndReserve />} path="/search-and-reserve" /> 
                        <Route element={<ManageReservations />} path="/manage-reservations" /> 
                        <Route element={<RequestReservation />} path="/request-reservation" /> */}
                        {/* <Route element={<ReservationList />} path="/restaurants/:restaurant_id/reservations" /> */}
                        <Route element={<OwnerReservations />} path="/reservation_by_owner" />

                        <Route element={<AboutUs />} path="/about-us" />
                        <Route element={<ContactUs />} path="/contact-us" /> 

                        {/* Ruta protegida para propietarios
                        <Route
                            path="/my-restaurants"
                            element={
                                <PrivateRoute requiredRole="owner"> {/* Verifica que el usuario sea propietario */}
                                    {/* <MyRestaurants />
                                </PrivateRoute> */}
                            {/* } */}
                        {/* /> */} */}

                        {/*<Route element={<Signup />} path="/signup" />*/}  {/* Ruta de registro */}
                        {/*<Route element={<Login />} path="/login" />*/}  {/* Ruta de inicio de sesión */}
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    {/* <Footer /> */}
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
