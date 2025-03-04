import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
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
};
