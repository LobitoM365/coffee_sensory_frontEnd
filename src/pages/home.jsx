import React from 'react';
import { Graficos } from '../componentes/Graficos';

export const Home = () => {
    return (

        <>
            <link rel="stylesheet" href="src\css\graficas.css" />
            <h2>Inicio</h2>
            <div className='BoxMain'>
                <Graficos/>
            </div>
        </>
    );
};
