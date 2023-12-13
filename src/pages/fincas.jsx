import React, { useEffect, useState } from 'react'
import { Tablas } from "../componentes/tablas.jsx"
import Api from '../componentes/Api.jsx'



export const Fincas = () => {
    let dataFilterTable = {
        "filter": {
            "where": {

            }
        }
    };
    const [fincas, setFincas] = useState([])
    const keys = {
        "id": {
            "referencia": "Id",
            "typo": ""
        },
        "nombre": {
            "referencia": "Nombre",
            "upper_case": true
        },
        "usuarios_id": {
            "values": [
                "numero_documento_usuario",
                "nombre_completo_usuario"
            ],
            "referencia": "Usuario",
            "upper_case": true
        },
        "latitud": {
            "referencia": "Latitud"
        },
        "longitud": {
            "referencia": "Longitud"
        },
        "nombre_municipio": {
            "referencia": "Municipio",
            "upper_case": true
        },
        "nombre_vereda": {
            "referencia": "Vereda",
            "upper_case": true
        },
        "fecha_creacion": {
            "referencia": "Fecha creación"
        },
        "estado": {
            "referencia": "Estado"
        }
    }
    const filterEstado = {
        "Activo": {
            "value": 1
        },
        "Inactivo": {
            "value": 0
        }
    }
    async function getFincas() {
        console.log(dataFilterTable, "xdxd")
        const response = await Api.post("finca/listar", dataFilterTable);
        if (response.data.status == true) {
            setFincas(response.data.data)
            console.log(response.data.data)
        } else if (response.data.find_error) {
            setFincas(response.data)
        } else {
            setFincas(response.data)
        }
        console.log(response)
    }
    useEffect(() => {
        getFincas()
        function updateEstado() {

            console.log("xd")
        }
    }, [])
    async function cambiarEstado(id) {
        try {
            const axios = await Api.delete("finca/eliminar/" + id);
            if (axios.data.status == true) {
                getFincas();
            } else if (axios.data.delete_error) {
                console.log(axios)
            } else {
                console.log("Internal error")
            }
        } catch (e) {

            console.log("Error: " + e)
        }
    }
    async function updateEntitie(id) {
        alert(id)
    }
    async function getFilterEstado(value) {
        if (value !== false) {
            dataFilterTable.filter.where["fin.estado"] = {
                "value": value,
                "require": "and"
            }

        } else {
            delete dataFilterTable.filter.where["estado"]
        }


        getFincas(dataFilterTable)
    }
    return (
        <>
            <Tablas data={fincas} keys={keys} cambiarEstado={cambiarEstado} updateEntitie={updateEntitie} tittle={"Fincas"} filterEstado={filterEstado} getFilterEstado={getFilterEstado} />

        </>
    )
}