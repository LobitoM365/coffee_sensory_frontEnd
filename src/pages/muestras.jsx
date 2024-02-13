import React, { useEffect, useState } from 'react'
import { Tablas } from "../componentes/tablas.jsx"
import Api from '../componentes/Api.jsx'
import { Alert } from '../componentes/alert.jsx'


export const Muestras = () => {
    let [dataFilterTable, setDataFilterTable] = useState({
        "filter": {
            "where": {

            }
        }
    })
        ;
    const [fincas, setMuestras] = useState([])
    const [fincaEdit, setMuestraEdit] = useState([])
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
            cantidad: {
                type: "number",
                referencia: "Cantidad",
                upper_case: true,
            },
            cafes_id: {
                type: "select",
                referencia: "Café",
                upper_case: true,
                values: ["numero_documento", "usuario", "finca", "lote", "variedad"],
                key: "id"
            },
            codigo_externo: {
                type: "normal",
                referencia: "Codigo Externo",
                upper_case: true,
            },
            consecutivo_informe: {
                type: "normal",
                referencia: "Consecutivo Informe",
                upper_case: true,
            },
            muestreo: {
                type: "normal",
                referencia: "Muestreo",
                upper_case: true,
            },
            preparacion_muestra: {
                type: "normal",
                referencia: "Preparación",
                upper_case: true,
            },
            tipo_molienda: {
                type: "normal",
                referencia: "Tipo de Molienda",
                upper_case: true,
            },
            tipo_fermentacion: {
                type: "normal",
                referencia: "Tipo de Fermentación",
                upper_case: true,
            },
            densidad_cafe_verde: {
                type: "normal",
                referencia: "Densidad de Café Verde",
                upper_case: true,
            },
            tipo_tostion: {
                type: "normal",
                referencia: "Tipo de Tostión",
                upper_case: true,
            },
            tiempo_fermentacion: {
                type: "normal",
                referencia: "Tiempo de Fermentación",
                upper_case: true,
            },
            codigo_muestra: {
                type: "normal",
                referencia: "Código Muestra",
                upper_case: true,
            },
            actividad_agua: {
                type: "normal",
                referencia: "Actividad de Agua",
                upper_case: true,
            },
            tiempo_secado: {
                type: "normal",
                referencia: "Tiempo Secado",
                upper_case: true,
            },
            presentacion: {
                type: "normal",
                referencia: "Presentación",
                upper_case: true,
            },
        }
    )

    const keys = {
        "mu_id": {
            "referencia": "Id",
        },
        "codigo_externo": {
            "referencia": "Codigo Externo",
            "upper_case": true
        },
        "codigo_muestra": {
            "referencia": "Codigo Muestra",
            "upper_case": true
        },
        "cantidad": {
            "referencia": "Cantidad",
            "upper_case": true
        },
        "fecha_creacion": {
            "referencia": "Fecha creación",
            "format": true
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
        getMuestra()
        getCafes()
    }, [])
    async function getCafes() {
        try {
            let filter = {
                "filter": {
                    "where": {
                        "ca.estado": {
                            "operador": "!=",
                            "value": "0",
                            "require": "and"
                        }
                    }
                }
            }
            const response = await Api.post("cafes/listar", filter);
            if (response.data.status == true) {
                let cafes = inputsForm;
                if (!cafes["cafes_id"]) {
                    cafes["cafes_id"] = {}
                }
                cafes["cafes_id"]["opciones"] = response.data.data
                setInputsForm(cafes)
            } else if (response.data.find_error) {

            } else {

            }
        } catch (e) {
        }
    }
    async function getMuestra() {
        try {
            const response = await Api.post("muestra/listar", dataFilterTable);
            console.log('DATA FILTER: ', dataFilterTable);
            if (response.data.status == true) {
                setMuestras(response.data.data)
                setCountRegisters(response.data.count)
            } else if (response.data.find_error) {
                setCountRegisters(0)
                setMuestras(response.data)
            } else {
                setMuestras(response.data)
            }
        } catch (e) {

        }
    }

    async function desactivaMuestra() {
        try {
            const axios = await Api.delete("muestra/desactivar/" + idFincaCambiarEstado);
            if (axios.data.status == true) {
                getMuestra();
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
            tittle = "Activarás las muestra " + id
            descripcion = "Estás apunto de activar la muestra, ten encuenta que esta accion no activará las dependencias de la muestra, pero si permitirá el uso de ellas.";
        } else if (estado == 1 || estado == 3 || estado == 4) {
            tittle = "¿Deseas desactivar la muestra " + id + " ?";
            descripcion = "Estás apunto de desactivar la muestra, por favor verifica si realmente quieres hacerlo. Esta acción conlleva a desactivar todos los registros de las  dependencias de esta muestra."
        }
        setStatusAlert(true)
        setdataAlert(
            {
                status: "warning",
                description: descripcion,
                tittle: tittle,
                continue: {
                    "function": desactivaMuestra
                }
            }
        )

    }
    async function setMuestra(data) {
        try {
            const axios = await Api.post("muestra/registrar/", data);
            if (axios.data.status == true) {
                getMuestra();
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
    async function updateMuestra(data, id) {

        try {
            const axios = await Api.put("muestra/actualizar/" + id, data);
            if (axios.data.status == true) {
                getMuestra();
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
            cloneDataFilterTable.filter.where["mu.estado"] = {
                "value": value,
                "require": "and"
            }

        } else {
            delete cloneDataFilterTable.filter.where["mu.estado"]
        }
        setDataFilterTable(cloneDataFilterTable)
        getMuestra(dataFilterTable)
    }
    async function getFiltersOrden(filter) {
        dataFilterTable.filter["order"] = filter
        getMuestra();

    }
    async function limitRegisters(data) {
        dataFilterTable.filter["limit"] = data
        getMuestra()

    }
    async function buscarMuestra(id) {

        const response = await Api.get("muestra/buscar/" + id);
        if (response.data.status == true) {
            setMuestraEdit(response.data.data[0])
        } else if (response.data.find_error) {

        } else {

        }
    }
    async function updateTable() {
        getMuestra();
    }
    async function editarFinca(id) {
        buscarMuestra(id)
    }
    function filterSeacth(search) {
        let cloneDataFilterTable = { ...dataFilterTable }
        cloneDataFilterTable.filter["search"] = search
        setDataFilterTable(cloneDataFilterTable)
        getMuestra(dataFilterTable)

    }

    return (
        <>
            <Tablas imgForm={"/img/formularios/imgFinca.jpg"} changeModalForm={changeModalForm} modalForm={modalForm} filterSeacth={filterSeacth} updateStatus={updateStatus} editarStatus={setUpdateStatus} editar={editarFinca} elementEdit={fincaEdit} errors={errors} setErrors={setErrors} inputsForm={inputsForm} funcionregistrar={setMuestra} updateTable={updateTable} limitRegisters={limitRegisters} count={countRegisters} data={fincas} keys={keys} cambiarEstado={cambiarEstado} updateEntitie={updateMuestra} tittle={"Muestra"} filterEstado={filterEstado} getFilterEstado={getFilterEstado} getFiltersOrden={getFiltersOrden} />

            <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />
        </>
    )
}