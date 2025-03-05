import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import SearchRestaurants from "./component/SearchRestaurants";  // Importar el componente de búsqueda de restaurantes
import  AddRestaurant  from "./component/AddRestaurant";  // Importar el componente de añadir restaurante
//import Signup from "./pages/Signup";  // Importar el componente de registro
//import Login from "./pages/Login";  // Importar el componente de inicio de sesión
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import OwnerList from "./component/ownerList";
import OwnerForm from "./component/ownerForm";

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<OwnerList/>} path="/owners" />
                        <Route element={<OwnerForm />} path="/owners/new" />
                        <Route element={<OwnerForm />} path="/owners/:ownerId" />
                        <Route element={<Demo />} path="/demo" />
<<<<<<< HEAD
=======
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<SearchRestaurants />} path="/search-restaurants" />  {/* Añadir ruta de búsqueda de restaurantes */}
                        <Route element={<AddRestaurant />} path="/add-restaurant" />  {/* Añadir ruta de añadir restaurante */} 
                        {/*<Route element={<Signup />} path="/signup" />*/}  {/* Añadir ruta de registro */}
                        {/*<Route element={<Login />} path="/login" />*/}  {/* Añadir ruta de inicio de sesión */}
>>>>>>> develop
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    {/* <Footer /> */}
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
