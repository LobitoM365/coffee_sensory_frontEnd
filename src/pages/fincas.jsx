import React, { useEffect, useState } from 'react'
import { Tablas } from "../componentes/tablas.jsx"
import Api from '../componentes/Api.jsx'



export const Fincas = () => {
    const [fincas, setFincas] = useState([])
    const keys = {
        "id": {
            "referencia": "Id",
            "typo": ""
        },
        "nombre": {
            "referencia": "Nombre"
        },
        "usuarios_id": {
            "referencia": "Usuario"
        },
        "latitud": {
            "referencia": "Latitud"
        },
        "longitud": {
            "referencia": "Longitud"
        },
        "nombre_municipio": {
            "referencia": "Municipio"
        },
        "nombre_vereda": {
            "referencia": "Vereda"
        },
        "fecha_creacion": {
            "referencia": "Fecha"
        },
        "estado": {
            "referencia": "Estado"
        }
    }

    async function getFincas() {
        const response = await Api.get("finca/listar");
        if (response.data.status == true) {
            setFincas(response.data.data)
            console.log(response.data.data)
        }
    }
    useEffect(() => {
        getFincas()
        function updateEstado() {
            alert("xd"),
                console.log("xd")
        }
    }, [])

    return (
        <>
            <Tablas data={fincas.length > 0 ? fincas : ""} keys={keys} />
        </>
    )
}