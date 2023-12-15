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
    const [fincaEdit, setfincaEdit] = useState([])
    const [updateStatus, setUpdateStatus] = useState(false)
    const [municipios, setMunicipios] = useState([])
    const [countRegisters, setCountRegisters] = useState()
    const [errors, setErrors] = useState()
    let [inputsForm, setInputsForm] = useState(
        {
            nombre: {
                "type": "text",
                "referencia": "Nombre"
            },
            longitud: {
                "type": "text",
                "referencia": "Longitud"
            },
            latitud: {
                "type": "text",
                "referencia": "Latitud"
            },
            usuarios_id: {
                type: "select",
                referencia: "Usuario",
                values: ["numero_documento", "nombre"],
                upper_case: true,
                key: "id"
            },
            municipios_id: {
                type: "select",
                referencia: "Municipio",
                values: ["nombre"],
                capital_letter: true,
                key: "id"
            },
            nombre_vereda: {
                "type": "text",
                "referencia": "Nombre de la vereda"
            }
        }
    )

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
    useEffect(() => {
        getFincas()
        getMunicipios()
    }, [])
    getUsers()
    async function getFincas() {
        try {
            const response = await Api.post("finca/listar", dataFilterTable);
            if (response.data.status == true) {
                setFincas(response.data.data)
                setCountRegisters(response.data.count)
            } else if (response.data.find_error) {
                setCountRegisters(0)
                setFincas(response.data)
            } else {
                setFincas(response.data)
            }

        } catch (e) {
            console.log("Error " + e)
        }
    }


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
            console.log(axios)
        } catch (e) {

            console.log("Error: " + e)
        }
    }
    async function setFinca(data) {
        try {
            const axios = await Api.post("finca/registrar/", data);
            if (axios.data.status == true) {
                getFincas();
                setErrors({})

            } else if (axios.data.register_error) {
                setErrors({})

            } else if (axios.data.errors) {
                setErrors(axios.data.errors)
            } else {
                setErrors({})

            }
            console.log(axios )


        } catch (e) {

            console.log("Error: " + e)
        }
    }

    async function getUsers() {
        try {
            const response = await Api.get("usuarios/listar");
            if (response.data.status == true) {
                let users = inputsForm;
                if (!users["usuarios_id"]) {
                    users["usuarios_id"] = {}
                }
                users["usuarios_id"]["opciones"] = response.data.data
                setInputsForm(users)
            } else if (response.data.find_error) {

            } else {

            }
            console.log(response, "User")

        } catch (e) {
            console.log("Error " + e)
        }
    }
    async function getMunicipios() {
        try {
            const response = await Api.get("municipio/listar");
            if (response.data.status == true) {
                let municipios = inputsForm;
                if (!municipios["municipios_id"]) {
                    municipios["municipios_id"] = {}
                }
                municipios["municipios_id"]["opciones"] = response.data.data
                setInputsForm(users)
            } else if (response.data.find_error) {

            } else {

            }
            console.log(response, "User")

        } catch (e) {
            console.log("Error " + e)
        }
    }
    async function updateFinca(data,id) {

      try {
        const axios = await Api.put("finca/actualizar/" + id , data);
        if (axios.data.status == true) {
            getFincas();
            setErrors({})
        } else if (axios.data.update_error) {
            setErrors({})

        } else if (axios.data.errors) {
            setErrors(axios.data.errors)
        } else {
            setErrors({})

        }
        console.log(axios, "Updateeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")


    } catch (e) {

        console.log("Error: " + e)
    }
    }
    async function getFilterEstado(value) {
        let cloneDataFilterTable = { ...dataFilterTable }
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
        dataFilterTable.filter["order"] = filter
        getFincas();

    }
    async function limitRegisters(data) {
        dataFilterTable.filter["limit"] = data
        getFincas()

    }
    async function buscarFinca(id) {

        const response = await Api.get("finca/buscar/" + id);
        if (response.data.status == true) {
            setfincaEdit(response.data.data[0])
        } else if (response.data.find_error) {

        } else {

        }
        console.log(response, "Fincaaa")
    }
    async function updateTable() {
        getFincas();
    }
    async function editarFinca(id) {
        buscarFinca(id)
    }
  
    useEffect(() => {
        getUsers()
    }, [])
    return (
        <>
            <Tablas updateStatus={updateStatus} editarStatus={setUpdateStatus} editar={editarFinca} elementEdit={fincaEdit} errors={errors} inputsForm={inputsForm} funcionregistrar={setFinca} updateTable={updateTable} limitRegisters={limitRegisters} count={countRegisters} data={fincas} keys={keys} cambiarEstado={cambiarEstado} updateEntitie={updateFinca} tittle={"Fincas"} filterEstado={filterEstado} getFilterEstado={getFilterEstado} getFiltersOrden={getFiltersOrden} />

        </>
    )
}