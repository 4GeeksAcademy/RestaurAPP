import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
<<<<<<< HEAD
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/owners/new">
					<span className="navbar-brand mb-0 h1">Create owner</span>
				</Link>
				<div className="ml-auto">
					<Link to="/owners">
						<button className="btn btn-primary">Check owners</button>
					</Link>
				</div>
			</div>
		</nav>
	);
=======
    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <Link to="/">
                    <span className="navbar-brand mb-0 h1">Volver a Home</span>
                </Link>
                <div className="ml-auto">
                    <Link to="/search-restaurants">
                        <button className="btn btn-primary">Buscar Restaurantes</button>
                    </Link>
                    <Link to="/add-restaurant">
                        <button className="btn btn-secondary">Añadir Restaurante</button>
                    </Link>
                    <Link to="/demo">
                        <button className="btn btn-info">Otras funcionalidades RestaurAPP</button>
                    </Link>
                </div>
            </div>
        </nav>
    );
>>>>>>> develop
};
