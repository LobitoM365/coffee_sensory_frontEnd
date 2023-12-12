import React from 'react'
import { Graficos } from '../componentes/Graficos';


export const Home = () => {
    const data = [
        { fecha: '2023-11-22 00:00:00', promedio: 10},
        { fecha: "2023-07-03 ", promedio: 6},
        { fecha: "2023-06-03", promedio: 9,  },
        { fecha: "2023-06-03 ", promedio: 6},
        { fecha: "2023-06-03 ", promedio: 7 },
        { fecha: "2023-06-03 ", promedio: 11 },
        
      ];
    return (
        <>
            <h2>Inicio</h2>
            <Graficos datos={data} titulo={'Promedio Calidad mes a mes'}/>
        </>
    )
}