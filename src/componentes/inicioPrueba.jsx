import React from "react";




export const InicioPrueba = (data) => {
    const info = data;

    return (<>
        <h1> {info.data1}</h1>
        <h1> {info.data2}</h1>
    </>
    )
}