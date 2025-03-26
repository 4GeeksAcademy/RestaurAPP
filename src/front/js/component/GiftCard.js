import React, { useState } from 'react';

const Giftcard = () => {


    return (
        <div className="css-z2ibqq e1qlfvh01">
            <div className="css-19sv1sj e1273mbj0">
                <h1 className="css-1ycxwo2 e7dhrrp0 text-center">
                    <span>Cómpralas para tu empresa</span>
                </h1>
                {/* Aquí se agrega la imagen */}
                <img
                    src="https://png.pngtree.com/template/20220425/ourmid/pngtree-gift-card-vector-voucher-mockup-illustration-banner-image_1445909.jpg"
                    alt="Tarjetas Regalo"
                    className="imagen-tarjeta-regalo hover-effect"
                />
                <div className="css-123z17s e1xxesyf0">
                    <p className="css-adea1e eulusyj0 mt-4">
                        <span>
                            <h2>
                                Las tarjetas regalo son una buena forma de dar las gracias a tus clientes y recompensar a tu equipo. Descubre cómo usar las tarjetas regalo de RestaurApp como agradecimiento para los clientes, incentivo promocional o recompensa por el trabajo bien hecho.
                            </h2>
                        </span>

                    </p>
                </div>
                <div className="css-17xqvre e1qlfvh00 mt-4">
                    <button
                        onClick={() => window.open("https://tarjetaregalo.restaurapp.es/b2b", "_blank")}
                        className="btn btn-danger me-2 css-191fya1 ektx8jp0"
                    >
                        <span>Más información</span>
                    </button>
                    <button
                        data-testid="buy-now-button-business"
                        onClick={() => window.open("https://tarjetaregalo.restaurapp.es/b2b", "_blank")}
                        className="btn btn-danger css-ysghcq ektx8jp0"
                    >
                        <span>Comprar ahora</span>
                    </button>
                </div>


            </div>
           
        </div>
    );
};

export default Giftcard;
