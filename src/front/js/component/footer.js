import React from "react";
import { useLocation } from "react-router-dom"; // Importamos useLocation
import LogoEnteroRestaurApp from "../../img/LogoEnteroRestaurApp.png";
import "../../styles/footer.css"; 

export const Footer = () => {
  const location = useLocation(); // Detectamos la ruta actual
  
  // Condición para saber si estamos en la página de inicio
  const isHomePage = location.pathname === "/";

  return (
    <footer
      className="footer mt-auto py-3 text-center"
      style={{
        backgroundColor: "#DAA520",
        marginTop: isHomePage ? "0" : "5rem" // Si estamos en la home, no tendrá margen arriba, si no, tendrá margin-top de 5rem
      }}
    >
      <div className="container">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-5 my-5 border-top">
          <div className="col mb-3 d-flex justify-content-center align-items-center">				
            <a href="/" className="d-flex align-items-center mb-3 link-body-emphasis text-decoration-none hover-effect">
              <img 
                src={LogoEnteroRestaurApp} 
                alt="Logo de RestaurApp"
                width="250"  
                height="auto"
                style={{
                  borderRadius: '8px', 
                }}
              />
            </a>
          </div>
          <div className="col mb-3"></div>

          <div className="col mb-3">
            <h5>Page</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2"><a href="/" className="nav-link p-0 text-black ">Home</a></li>
              <li className="nav-item mb-2"><a href="/about-us" className="nav-link p-0 text-black">About Us</a></li>
              <li className="nav-item mb-2"><a href="contact-us" className="nav-link p-0 text-black">Contact us</a></li>
            </ul>
          </div>				
          <div className="col mb-3">
            <h5>Links</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2"><a href="/" className="nav-link p-0 text-black">Home</a></li>
              <li className="nav-item mb-2"><a href="/diner/login" className="nav-link p-0 text-black">Diner Login</a></li>
              <li className="nav-item mb-2"><a href="/owners/login" className="nav-link p-0 text-black">Owner Login</a></li>
              <li className="nav-item mb-2"><a href="/dinerform" className="nav-link p-0 text-black">Diner Sign Up </a></li>
              <li className="nav-item mb-2"><a href="/owners/new" className="nav-link p-0 text-black">Owner Sign up</a></li>
            </ul>
          </div>
          <div className="col mb-3">
            <h5>Offerts</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2"><a href="/" className="nav-link p-0 text-black">Home</a></li>
              <li className="nav-item mb-2"><a href="/giftcard" className="nav-link p-0 text-black">Gift Cards</a></li>						
            </ul>
          </div>
        </div>
        <div className="py-3 my-4">
          <ul className="nav justify-content-center border-bottom pb-3 mb-3 hover-effect">
            <li className="nav-item"><a href="/" className="nav-link px-2 text-black">Home</a></li>
            <li className="nav-item"><a href="/avisos-legales" className="nav-link px-2 text-black">Avisos Legales</a></li>
            <li className="nav-item"><a href="/giftcard" className="nav-link px-2 text-black">Gift Cards</a></li>
            <li className="nav-item"><a href="/diner/dashboard" className="nav-link px-2 text-black">Restaurantes</a></li>
          </ul>
          <p className="text-center text-black">© 2025 RestaurApp, Inc</p>
        </div>
      </div>
    </footer>
  );
};
