import React, { useContext } from "react";
import { Link } from "react-router-dom";
import restaurante2 from "../../img/restaurante2.jpg"; // Imagen del restaurante
import { Context } from "../store/appContext";
import modelodashboard from "../../img/modelodashboard.jpg"
import "../../styles/demo.css"


export const Demo = () => {
	return (
		<section className="pt-3 pt-lg-5">
			<div className="container">
				<div className="row g-4 g-lg-5">
					<div className="col-lg-6 position-relative mb-4 mb-md-0">
						<h1 className="mb-4 mt-md-5 display-5">
							<div className="custom-heading">Encuentra los mejores</div>
							<div className="custom-heading position-relative z-index-9">
								Restaurantes cercanos.
							</div>
						</h1>
						<p className="mb-4">
							¡Reserva tu mesa en el mejor restaurante de la ciudad en segundos y sin complicaciones! 🍽️ ¡Haz tu reserva ahora y disfruta de una experiencia única!
						</p>
						<div className="hstack gap-4 flex-wrap align-items-center">

							<a href="/restaurants-search" className="btn btn-primary-soft mb-0">
								Descubrelo ahora!
							</a>

						</div>
					</div>
					<div className="col-lg-6 position-relative">
						<img
							src={modelodashboard}
							className="img-fluid w-100 custom-rounded hover-effect"
							alt="restaurante"
						/>
						<figure className="position-absolute end-0 bottom-0">
							<svg width="163px" height="163px" viewBox="0 0 163 163">
							</svg>
						</figure>
					</div>

				</div>
			</div>
		</section>
	);
};
