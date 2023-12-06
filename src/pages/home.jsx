import React from 'react'
import { Graficos } from '../componentes/graficos'


export const Home = () => {
    const data = [
        { nombre: "Enero", promedio: 10},
        { nombre: "Febrero", promedio: 6},
        { nombre: "Marzo", promedio: 9,  },
        { nombre: "Abril", promedio: 6},
        { nombre: "Mayo", promedio: 7 },
        { nombre: "Mayo", promedio: 11 },
        
      ];
    return (
        <>
            <h2>Inicio</h2>
            <Graficos datos={data}/>
        </>
    )
}