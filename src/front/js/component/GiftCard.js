import React, { useState } from 'react';

const Giftcard = () => {


    return (
        <div className="css-z2ibqq e1qlfvh01">
            <div className="css-19sv1sj e1273mbj0 mt-4">
                <h1 className="css-1ycxwo2 e7dhrrp0 text-center pt-4 pb-4">
                    <span>Cómpralas para tu empresa</span>
                </h1>
                {/* Aquí se agrega la imagen */}
                <img
                    src="https://png.pngtree.com/template/20220425/ourmid/pngtree-gift-card-vector-voucher-mockup-illustration-banner-image_1445909.jpg"
                    alt="Tarjetas Regalo"
                    className="imagen-tarjeta-regalo hover-effect"
                />
                <div className="text-black mt-5 mb-5 ">
                    <p className="text-black mt-4">
                        <span>
                            <h2 className='text-black'>
                                Las tarjetas regalo son una buena forma de dar las gracias a tus clientes y recompensar a tu equipo. Descubre cómo usar las tarjetas regalo de RestaurApp como agradecimiento para los clientes, incentivo promocional o recompensa por el trabajo bien hecho.
                            </h2>
                        </span>
                    </p>
                </div>

                <div className="css-17xqvre e1qlfvh00 mt-3 mb-5 d-flex justify-content-center">
                    <a 
                        href="mailto:mikebedoya28@gmail.com" 
                        className="btn btn-warning btn-lg"  
                    >
                        <span>Más información</span>
                    </a>
                </div>
            </div>

        </div>
    );
};

export default Giftcard;
