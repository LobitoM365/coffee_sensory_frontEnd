import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';


export const Inicio = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = '../../public/js/mainMapa.js';
        script.async = true;
        document.body.appendChild(script);
    }, [])
    return (
        <>
            <link rel="stylesheet" href="css/style.css" />
            <img className='img-fondo' src="/img/regiones-de-colombia-mapa-cultura-fauna-flora-paisajes-viajes-turismo-996x560.jpg" alt="" />
            {/* <iframe id='iframeMapa' className='iframe' src="src/mapa/mapa.html" frameBorder={0}></iframe> */}
        </>
    )
}