import React, { useEffect } from 'react'



export const Inicio = () => {
    useEffect(()=>{
        const script = document.createElement('script');
        script.src = '../../public/js/mainMapa.js';
        script.async = true;
        document.body.appendChild(script);
    },[])
    return (
        <>
        <link rel="stylesheet" href="css/style.css" />
            <iframe id='iframeMapa' className='iframe' src="src/mapa/mapa.html" frameBorder={0}></iframe>
        </>
    )
}