import React from 'react'
import { InicioPrueba } from "../componentes/inicioPrueba"


export const Home = () => {
    const hola = "hola"
    return (
        <>
            <h2>Inicio</h2>

            <InicioPrueba data1={hola} data2={"xd"} />
        </>
    )
}