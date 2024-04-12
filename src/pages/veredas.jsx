import React, { useEffect, useState } from 'react'
import { Tablas } from "../componentes/tablas.jsx"
import Api from '../componentes/Api.jsx'
import { Alert } from '../componentes/alert.jsx'


export const Veredas = () => {
    let [dataFilterTable, setDataFilterTable] = useState({
        "filter": {
            "where": {

            }
        }
    })

    const [buttonsHeaderTable, setButtonsHeaderTable] = useState({
        "buttons": {
            "add": {
                "status": true,
                "rol": ["administrador", "catador"]
            },
            "reporte": {
                "status": true,
                "rol": ["administrador"]
            },
        }
    });


    const [fincas, setVariedads] = useState([])
    const [fincaEdit, setVariedadEdit] = useState([])
    const [updateStatus, setUpdateStatus] = useState(false)
    const [municipios, setMunicipios] = useState([])
    const [countRegisters, setCountRegisters] = useState()
    const [errors, setErrors] = useState()
    const [statusAlert, setStatusAlert] = useState(false);
    const [dataAlert, setdataAlert] = useState({});
    const [modalForm, changeModalForm] = useState(false);
    let idFincaCambiarEstado = 0;

    let [inputsForm, setInputsForm] = useState(
        {
            nombre: {
                type: "text",
                referencia: "Nombre de la vereda",
                upper_case: true,
            },
            departamentos_id: {
                type: "select",
                referencia: "Departamento",
                values: ["nombre"],
                key: "id",
                upper_case: true,
                function: {
                    value: getMunicipios,
                    execute: {
                        type: "own",
                        value: "key"
                    }
                },
                search: {
                    clean: ["municipios_id", "veredas_id"]
                }
            },
            municipios_id: {
                type: "select",
                referencia: "Municipio",
                values: ["nombre"],
                key: "id",
                upper_case: true,
            }
        }
    )

    const keys = {
        "ve_id": {
            "referencia": "Id",
        },
        "nombre": {
            "referencia": "Nombre",
            "upper_case": true
        },
        "municipio": {
            "referencia": "Municipio",
            "upper_case": true
        },
        "departamento": {
            "referencia": "Departamento",
            "upper_case": true
        },
        "fecha_creacion": {
            "referencia": "Fecha creación",
            "format": true
        },
        "actualizar": {
            "referencia": "actualizar"
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
        getVariedades()
        getDepartamentos()
    }, [])


    async function getMunicipios(data) {
        console.log('MINCIPIOS EXCUTE: ', data);
        try {
            let filterReport = {
                "filter": {
                    "where": {
                        "mu.departamentos_id": {
                            "value": data,
                            "require": "and"
                        }
                    },
                    "limit": {
                        inicio: 0,
                        fin: 4444
                    }
                }
            }
            const response = await Api.post("municipio/listar", filterReport);
            let municipios = { ...inputsForm };

            if (response.data.status == true) {
                if (!municipios["municipios_id"]) {
                    municipios["municipios_id"] = {}
                }
                municipios["municipios_id"]["opciones"] = response.data.data
                console.log("MUNICIPIOS GET: ", municipios)
                setInputsForm(municipios)
            } else if (response.data.find_error) {
                if (municipios["municipios_id"]) {
                    municipios["municipios_id"]["opciones"] = []
                }
                setInputsForm(municipios)
            } else {

            }
        } catch (e) {
        }
    }

    //Obtener Veredas
    async function getVeredas(data) {   
        try {
            let filterReport = {
                "filter": {
                    "where": {
                        "ve.municipios_id": {
                            "value": data,
                            "require": "and"
                        }
                    },
                    "limit": {
                        inicio: 0,
                        fin: 4444
                    }
                }
            }
            const response = await Api.post("veredas/listar", filterReport);
            console.log('VEREDAS: ', response);
            let veredas = inputsForm;

            if (response.data.status == true) {
                if (!veredas["veredas_id"]) {
                    veredas["veredas_id"] = {}
                }
                veredas["veredas_id"]["opciones"] = response.data.data
                setInputsForm(veredas)
            } else if (response.data.find_error) {
                if (veredas["veredas_id"]) {
                    veredas["veredas_id"]["opciones"] = []
                }
                setInputsForm(veredas)

            } else {

            }
        } catch (e) {
        }
    }
    async function getVariedades() {
        try {
            const response = await Api.post("veredas/listar", dataFilterTable);
            if (response.data.status == true) {
                setVariedads(response.data.data)
                setCountRegisters(response.data.count)
            } else if (response.data.find_error) {
                setCountRegisters(0)
                setVariedads(response.data)
            } else {
                setVariedads(response.data)
            }
        } catch (e) {

        }
    }
    async function getDepartamentos() {
        try {
            let filterReport = {
                "filter": {

                    "limit": {
                        inicio: 0,
                        fin: 4444
                    }
                }
            }
            const response = await Api.post("departamento/listar", filterReport);
            let departamentos = inputsForm;

            if (response.data.status == true) {
                if (!departamentos["departamentos_id"]) {
                    departamentos["departamentos_id"] = {}
                }
                departamentos["departamentos_id"]["opciones"] = response.data.data
                setInputsForm(departamentos)
            } else if (response.data.find_error) {
                if (departamentos["departamentos_id"]) {
                    departamentos["departamentos_id"]["opciones"] = []
                }
                setInputsForm(departamentos)
            } else {

            }
        } catch (e) {
        }
    }

    async function desactivarFinca() {
        try {
            const axios = await Api.delete("finca/eliminar/" + idFincaCambiarEstado);
            if (axios.data.status == true) {
                getVariedades();
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
                    "function": desactivarFinca
                }
            }
        )

    }
    async function setVariedad(data) {
        try {
            const axios = await Api.post("veredas/registrar/", data);
            if (axios.data.status == true) {
                getVariedades();
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



    async function procedureTrue() {
        changeModalForm(false)
        setUpdateStatus(false)
    }
    async function updateFinca(data, id) {

        try {
            const axios = await Api.put("veredas/actualizar/" + id, data);
            if (axios.data.status == true) {
                getVariedades();
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
        getVariedades(dataFilterTable)
    }
    async function getFiltersOrden(filter) {
        dataFilterTable.filter["order"] = filter
        getVariedades();

    }
    async function limitRegisters(data) {
        dataFilterTable.filter["limit"] = data
        getVariedades()

    }
    async function buscarFinca(id) {

        const response = await Api.post("veredas/buscar/" + id);
        if (response.data.status == true) {
            console.log(response.data.data[0], "veeeeeeeeeeeeeeee")
            setVariedadEdit(response.data.data[0])
            if (response.data.data[0].departamentos_id) {
                getMunicipios(response.data.data[0].departamentos_id)
            }

        } else if (response.data.find_error) {

        } else {

        }
    }
    async function updateTable() {
        getVariedades();
    }
    async function editarFinca(id) {
        buscarFinca(id)
    }
    function filterSeacth(search) {
        let cloneDataFilterTable = { ...dataFilterTable }
        cloneDataFilterTable.filter["search"] = search
        setDataFilterTable(cloneDataFilterTable)
        getVariedades(dataFilterTable)

    }

    return (
        <>
            <Tablas buttonsHeaderTable={buttonsHeaderTable} imgForm={"/img/formularios/imgFinca.jpg"} changeModalForm={changeModalForm} modalForm={modalForm} filterSeacth={filterSeacth} updateStatus={updateStatus} editarStatus={setUpdateStatus} editar={editarFinca} elementEdit={fincaEdit} errors={errors} setErrors={setErrors} inputsForm={inputsForm} funcionregistrar={setVariedad} updateTable={updateTable} limitRegisters={limitRegisters} count={countRegisters} data={fincas} keys={keys} cambiarEstado={cambiarEstado} updateEntitie={updateFinca} tittle={"Vereda"} filterEstado={filterEstado} getFilterEstado={getFilterEstado} getFiltersOrden={getFiltersOrden} hidden={'status'} />
            <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />
        </>
    )
}