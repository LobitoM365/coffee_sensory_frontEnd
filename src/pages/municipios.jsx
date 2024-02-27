import React, { useEffect, useState } from 'react'
import { Tablas } from "../componentes/tablas.jsx"
import Api from '../componentes/Api.jsx'
import { Alert } from '../componentes/alert.jsx'


export const Municipios = () => {
    let [dataFilterTable, setDataFilterTable] = useState({
        "filter": {
            "where": {

            }
        }
    })
        ;
    const [fincas, setEntities] = useState([])
    const [fincaEdit, setEntitieEdit] = useState([])
    const [updateStatus, setUpdateStatus] = useState(false)
    const [municipios, setMunicipios] = useState([])
    const [countRegisters, setCountRegisters] = useState()
    const [errors, setErrors] = useState()
    const [statusAlert, setStatusAlert] = useState(false);
    const [dataAlert, setdataAlert] = useState({});
    const [modalForm, changeModalForm] = useState(false);

    let idFincaCambiarEstado = 0;
    let [inputsDocumento, setinputsDocumento] = useState(
        {
            "fecha": {
                inputs: {
                    desde_registro: {
                        type: "date",
                        referencia: "Desde",
                        values: ["nombre"],
                        opciones: [{ nombre: "certificar" }, { nombre: "practica" }],
                        upper_case: true,
                        key: "nombre"
                    },
                    hasta_registro: {
                        type: "date",
                        referencia: "Hasta",
                        values: ["numero_documento", "nombre_completo", "finca", "lote", "mu_id"],
                        upper_case: true,
                        key: "id"
                    }
                },
                referencia: "Filtrar por fecha de registro"
            },
            "estado": {
                inputs: {
                    estado: {
                        type: "select",
                        referencia: "Estado",
                        values: ["nombre"],
                        opciones: [{ nombre: "activo", value: "1" }, { nombre: "inactivo", value: "0" }, { nombre: "pendiente", value: "2" }],
                        upper_case: true,
                        key: "value"
                    }
                },
                referencia: "Filtrar por estado"
            }
        }
    )
    let [inputsForm, setInputsForm] = useState(
        {
            nombre: {
                type: "text",
                referencia: "Nombre",
                upper_case: true,
            },
            departamentos_Id: {
                type: "select",
                referencia: "Departamento",
                values: ["nombre"],
                upper_case: true,
                key: "id"
            }
        }
    )

    const keys = {
        "muni_id": {
            "referencia": "Id",
        },
        "nombre": {
            "referencia": "Nombre",
            "upper_case": true
        },
        "departamento": {
            "referencia": "Departamento"
        },
        // "fecha_creacion": {
        //     "referencia": "Fecha creación"
        // }
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
        getEntities()

    }, [])
    getDepartamentos()
    async function getEntities() {
        try {
            const response = await Api.post("municipio/listar", dataFilterTable);
            console.log(dataFilterTable, "filterrrrrrrrrrrrr")
            if (response.data.status == true) {
                setEntities(response.data.data)
                setCountRegisters(response.data.count)
            } else if (response.data.find_error) {
                setCountRegisters(0)
                setEntities(response.data)
            } else {
                setEntities(response.data)
            }
        } catch (e) {

        }
    }

    async function desactivarEntitie() {
        try {
            const axios = await Api.delete("finca/eliminar/" + idFincaCambiarEstado);
            if (axios.data.status == true) {
                getEntities();
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "true",
                        description: axios.data.message,
                        "tittle": "Excelente",
                    }
                )
            } else if (axios.data.delete_error) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "false",
                        description: axios.data.delete_error,
                        "tittle": "Inténtalo de nuevo",
                    }
                )
            } else if (axios.data.permission_error) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "false",
                        description: axios.data.permission_error,
                        "tittle": "¿Qué haces aquí?",
                        continue: {
                            "function": procedureTrue,
                            location: "/dashboard"
                        }
                    }
                )
            }


        } catch (e) {
            setStatusAlert(true)
            setdataAlert(
                {
                    status: "warning",
                    description: "Error interno del servidor: " + e,
                    "tittle": "Inténtalo de nuevo"
                }
            )
        }
    }
    async function cambiarEstado(id, estado) {
        idFincaCambiarEstado = id;
        let tittle = ""
        let descripcion = ""
        if (estado == 0) {
            tittle = "Activarás las finca " + id
            descripcion = "Estás apunto de activar la finca, ten encuenta que esta accion no activará las dependencias de la finca, pero si permitirá el uso de ellas.";
        } else if (estado == 1 || estado == 3 || estado == 4) {
            tittle = "¿Deseas desactivar la finca " + id + " ?";
            descripcion = "Estás apunto de desactivar la finca, por favor verifica si realmente quieres hacerlo. Esta acción conlleva a desactivar todos los registros de las  dependencias de esta finca."
        }
        setStatusAlert(true)
        setdataAlert(
            {
                status: "warning",
                description: descripcion,
                tittle: tittle,
                continue: {
                    "function": desactivarEntitie
                }
            }
        )

    }
    async function setEntitie(data) {
        try {
            const axios = await Api.post("municipio/registrar/", data);
            if (axios.data.status == true) {
                getEntities();
                setErrors({})
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "true",
                        description: axios.data.message,
                        "tittle": "Excelente",
                        continue: {
                            "function": procedureTrue
                        }
                    }
                )
            } else if (axios.data.register_error) {
                setErrors({})
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "false",
                        description: axios.data.register_error,
                        "tittle": "Inténtalo de nuevo"
                    }
                )
            } else if (axios.data.errors) {
                setErrors(axios.data.errors)
            } else if (axios.data.permission_error) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "interrogative",
                        description: axios.data.permission_error,
                        "tittle": "¿Qué haces aquí?",
                        continue: {
                            "function": procedureTrue,
                            location: "/dashboard"
                        }
                    }
                )
            } else {
                setErrors({})
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "false",
                        description: axios.data.register_error,
                        "tittle": "Error!!!"
                    }
                )
            }


        } catch (e) {
            setStatusAlert(true)
            setdataAlert(
                {
                    status: "warning",
                    description: "Error interno del servidor: " + e,
                    "tittle": "Inténtalo de nuevo"
                }
            )
        }
    }

    async function getDepartamentos() {
        try {
            const response = await Api.post("departamento/listar");
            if (response.data.status == true) {
                let users = inputsForm;
                if (!users["departamentos_Id"]) {
                    users["departamentos_Id"] = {}
                }
                users["departamentos_Id"]["opciones"] = response.data.data
                setInputsForm(users)
            } else if (response.data.find_error) {

            } else {

            }
        } catch (e) {
        }
    }
    async function getMunicipios() {
        try {
            const response = await Api.get("municipio/listar");
            if (response.data.status == true) {
                let municipios = inputsForm;
                if (!municipios["municipios_Id"]) {
                    municipios["municipios_Id"] = {}
                }
                municipios["municipios_Id"]["opciones"] = response.data.data
                setInputsForm(municipios)
            } else if (response.data.find_error) {

            } else {

            }
        } catch (e) {
        }
    }

    async function procedureTrue() {
        changeModalForm(false)
        setUpdateStatus(false)
    }
    async function updateFinca(data, id) {

        try {
            const axios = await Api.put("finca/actualizar/" + id, data);
            if (axios.data.status == true) {
                getEntities();
                setErrors({})
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "true",
                        description: axios.data.message,
                        "tittle": "Excelente",
                        continue: {
                            "function": procedureTrue,
                            location: "/"
                        }
                    }
                )
            } else if (axios.data.update_error) {
                setErrors({})
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "false",
                        description: axios.data.update_error,
                        "tittle": "Inténtalo de nuevo"
                    }
                )
            } else if (axios.data.errors) {
                setErrors(axios.data.errors)
            } else {
                setErrors({})
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "false",
                        description: axios.data.update_error,
                        "tittle": "Inténtalo de nuevo"
                    }
                )
            }
        } catch (e) {
            setStatusAlert(true)
            setdataAlert(
                {
                    status: "warning",
                    description: "Error interno del servidor: " + e,
                    "tittle": "Inténtalo de nuevo"
                }
            )
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
        getEntities(dataFilterTable)
    }
    async function getFiltersOrden(filter) {
        dataFilterTable.filter["order"] = filter
        getEntities();

    }
    async function limitRegisters(data) {
        dataFilterTable.filter["limit"] = data
        getEntities()

    }
    async function buscarFinca(id) {

        const response = await Api.get("finca/buscar/" + id);
        if (response.data.status == true) {
            setEntitieEdit(response.data.data[0])
        } else if (response.data.find_error) {

        } else {

        }
    }
    async function updateTable() {
        getEntities();
    }
    async function editarFinca(id) {
        buscarFinca(id)
    }
    function filterSeacth(search) {
        let cloneDataFilterTable = { ...dataFilterTable }
        cloneDataFilterTable.filter["search"] = search
        setDataFilterTable(cloneDataFilterTable)
        getEntities(dataFilterTable)

    }
    useEffect(() => {
        getDepartamentos()
    }, [])
    async function getReporte(tipo, filter) {
        try {

            let filterReport = {
                "filter": {
                    "where": {

                    }
                },
                "limit": {
                    
                }
            }
            console.log(filter)
            if (filter.estado != "") {
                filterReport["filter"]["where"]["an.estado"] = {

                    "value": filter.estado ? filter.estado : "",
                    "operador": "=",
                    "require": "and"

                }
            }
            console.log(tipo, filter, filterReport)
            const response = await Api.post("municipio/listar", filterReport);
            console.log(response, "reponseee")
            let dataPdf = {
                data: response.data.data,
                table: keys
            }
            localStorage.setItem("dataGeneratePdfTable", JSON.stringify(dataPdf));
            window.open('/dashboard/generatePdfTable', '_blank')

        } catch (e) {
            console.log(e)
        }
    }
    return (
        <>
            <Tablas getReporte={getReporte} dataDocumento={inputsDocumento} imgForm={"/img/formularios/imgFinca.jpg"} changeModalForm={changeModalForm} modalForm={modalForm} filterSeacth={filterSeacth} updateStatus={updateStatus} editarStatus={setUpdateStatus} editar={editarFinca} elementEdit={fincaEdit} errors={errors} setErrors={setErrors} inputsForm={inputsForm} funcionregistrar={setEntitie} updateTable={updateTable} limitRegisters={limitRegisters} count={countRegisters} data={fincas} keys={keys} cambiarEstado={cambiarEstado} updateEntitie={updateFinca} hidden={['status', 'register', 'update']} tittle={"Municipio"} filterEstado={filterEstado} getFilterEstado={getFilterEstado} getFiltersOrden={getFiltersOrden} />

            <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />
        </>
    )
}