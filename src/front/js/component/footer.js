import React, { Component } from "react";

export const Footer = () => (
	<footer className="footer mt-auto py-3 text-center">
		<div className="container">
			<footer className="py-3 my-4">
				<ul className="nav justify-content-center border-bottom pb-3 mb-3 hover-effect">
					<li className="nav-item"><a href="/" className="nav-link px-2 text-body-secondary">Home</a></li>
					<li className="nav-item"><a href="/avisos-legales" className="nav-link px-2 text-body-secondary">Avisos Legales</a></li>
					<li className="nav-item"><a href="/giftcard" className="nav-link px-2 text-body-secondary">Gift Cards</a></li>
					<li className="nav-item"><a href="/diner/dashboard" className="nav-link px-2 text-body-secondary">Restaurantes</a></li>
				</ul>
				<p className="text-center text-body-secondary">© 2025 RestaurApp, Inc</p>
			</footer>
		</div>
	</footer>
);
