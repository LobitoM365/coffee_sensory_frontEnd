import React, { useEffect, useState } from 'react'
import { Tablas } from "../componentes/tablas.jsx"
import Api from '../componentes/Api.jsx'



export const Fincas = () => {
    let [dataFilterTable, setDataFilterTable] = useState({
        "filter": {
            "where": {

            }
        }
    })
        ;
    const [fincas, setFincas] = useState([])
    const [countRegisters, setCountRegisters] = useState()
    const keys = {
        "fin_id": {
            "referencia": "Id",
        },
        "nombre": {
            "referencia": "Nombre",
            "upper_case": true
        },
        "numero_documento_usuario": {
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
        try {
            const response = await Api.post("finca/listar", dataFilterTable);
            if (response.data.status == true) {
                setFincas(response.data.data)
                setCountRegisters(response.data.count)
            } else if (response.data.find_error) {
                setFincas(response.data)
            } else {
                setFincas(response.data)
            }

        } catch (e) {
            console.log("Error " + e)
        }
    }
    useEffect(() => {
        getFincas()
        function updateEstado() {

        }
    }, [])
    async function cambiarEstado(id) {
        try {
            console.log(id)
            const axios = await Api.delete("finca/eliminar/" + id);
            if (axios.data.status == true) {
                getFincas();
            } else if (axios.data.delete_error) {
                console.log(axios)
            } else {
                console.log("Internal error")
            }
            console.log(axios)
        } catch (e) {

            console.log("Error: " + e)
        }
    }
    async function updateEntitie(id) {
        alert(id)
    }
    async function getFilterEstado(value) {
        let cloneDataFilterTable = { ...dataFilterTable }
        console.log(value, "Estadoo")
        if (value !== false) {
            cloneDataFilterTable.filter.where["fin.estado"] = {
                "value": value,
                "require": "and"
            }

        } else {
            delete cloneDataFilterTable.filter.where["fin.estado"]
        }
        setDataFilterTable(cloneDataFilterTable)
        getFincas(dataFilterTable)
    }
    async function getFiltersOrden(filter) {
        console.log("xdxd", filter)
        dataFilterTable.filter["order"] = filter
        getFincas();

    }
    async function limitRegisters(data) {
        console.log("dataaaaaaaaaa" , data)
        dataFilterTable.filter["limit"] = data
        getFincas()

    }
    async function updateTable() {
        console.log("tableUpdateee")
        getFincas();
    }
    return (
        <>
            <Tablas updateTable={updateTable} limitRegisters={limitRegisters} count={countRegisters} tableReference={"fin"} data={fincas} keys={keys} cambiarEstado={cambiarEstado} updateEntitie={updateEntitie} tittle={"Fincas"} filterEstado={filterEstado} getFilterEstado={getFilterEstado} getFiltersOrden={getFiltersOrden} />

        </>
    )
}