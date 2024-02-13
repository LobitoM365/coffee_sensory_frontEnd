import React, { useEffect, useState } from 'react'
import { Tablas } from "../componentes/tablas.jsx"
import Api from '../componentes/Api.jsx'
import { Alert } from '../componentes/alert.jsx'
import { FormResultados } from '../componentes/FormResultados.jsx'

export const Analisis = (userInfo) => {
    ///Variables para abrir modal de resultados
    const [modalFormResults, changeModalFormResults] = useState(false);
    const [dataModalAnalisis, setDataModalAnalisis] = useState(false);
    const [dataModalResultado, setDataModalResultado] = useState(false);
    const [dataModalResultadoAnalisis, setDataModalResultadoAnalisis] = useState(false);


    ///////
    let [dataFilterTable, setDataFilterTable] = useState({
        "filter": {
            "where": {

            }
        }
    })
        ;
    const [usuarios, setUsuarios] = useState([])
    const [usuarioEdit, setUsuarioEdit] = useState([])
    const [updateStatus, setUpdateStatus] = useState(false)
    const [municipios, setMunicipios] = useState([])
    const [countRegisters, setCountRegisters] = useState()
    const [errors, setErrors] = useState()
    const [statusAlert, setStatusAlert] = useState(false);
    const [dataAlert, setdataAlert] = useState({});
    const [modalForm, changeModalForm] = useState(false);
    let idAnalisis = 0;

    let [inputsForm, setInputsForm] = useState(
        {
            proceso: {
                type: "select",
                referencia: "Tipo de Proceso",
                values: ["nombre"],
                opciones: [{ nombre: "certificar" }, { nombre: "practica" }],
                upper_case: true,
                key: "nombre"
            }, muestras_id: {
                type: "select",
                referencia: "Muestra",
                values: ["numero_documento", "nombre_completo", "finca", "lote", "mu_id"],
                upper_case: true,
                key: "id"
            },
            usuario_formato_sca: {
                type: "select",
                referencia: "Catador Formato Sca",
                values: ["numero_documento", "nombre"],
                upper_case: true,
                key: "id"
            },
            usuario_formato_fisico: {
                type: "select",
                referencia: "Catador Formato Físico",
                values: ["numero_documento", "nombre"],
                upper_case: true,
                key: "id"
            },

        }
    )

    const keys = {
        "an_id": {
            "referencia": "Id",
        },
        "calidad": {
            "referencia": "Calidad",
        },
        "proceso": {
            "referencia": "Tipo de proceso",
            "upper_case": true
        },
        "muestras_id": {
            "referencia": "Muestra",
            "upper_case": true
        },
        "variedad": {
            "referencia": "Variedad",
            "upper_case": true
        },
        "finca": {
            "referencia": "Finca",
            "upper_case": true
        },
        "lote": {
            "referencia": "Lote",
            "upper_case": true
        },
        "permission_formato_sca": {
            "referencia": "Catador Formato Sca",
            "conditions": {
                "true": {
                    "element": {
                        "type": "button",
                        "referencia": "Ver",
                        "function": {
                            "value": xd,
                            "execute": {
                                "type": "table",
                                "value": "an_id"
                            }
                        }
                    }
                },
                "false": {
                    "element": {
                        "type": "text",
                        "referencia": "No disponible",
                        "class": "button-false-procedure"
                    }
                }
            },
            "upper_case": true
        },
        "permission_formato_fisico": {
            "referencia": "Catador Formato Físico",
            "conditions": {
                "true": {
                    "element": {
                        "type": "button",
                        "referencia": "Ver",
                        "function": {
                            "value": xd2,
                            "execute": {
                                "type": "table",
                                "value": "an_id"
                            }
                        }
                    }
                },
                "false": {
                    "element": {
                        "type": "text",
                        "referencia": "No disponible",
                        "class": "button-false-procedure"
                    }
                }
            },
            "upper_case": true
        },
        "fecha_creacion": {
            "referencia": "Fecha de creación",
            "format":true
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
        getAnalisis()
    }, [])
    useEffect(() => {
        getusuarios()
        getMuestras()

    }, [userInfo])

    async function xd(id) {
        setInfoFormato(id, 2)
    }
    function xd2(id) {
        setInfoFormato(id, 1)
    }
    async function setInfoFormato(id, tipo) {
        try {
            setDataModalAnalisis([])
            setDataModalResultado([])
            setDataModalResultadoAnalisis([])
            const response = await Api.post("analisis/buscar/" + id + "");
            if (response.data.status == true) {
                setDataModalAnalisis(response.data.data)
                const filterFormato = {
                    "filter": {
                        "where": {
                            "forma.analisis_id": {
                                "value": id,
                                "require": "and",
                                "group": 2
                            },
                            "forma.tipos_analisis_id": {
                                "value": tipo,
                                "require": "and",
                                "group": 2
                            }
                        }
                    },
                }
                const formato = await Api.post("formatos/buscar/not", filterFormato);
                console.log(formato, "formmaoooooooo")
                if (formato.data.status == true) {
                    setDataModalResultado(formato.data.data)
                    const resultado = await Api.post("resultado/buscar/" + formato.data.data[0].id + "");
                    console.log(resultado, formato, "dataaaaaaaaaaaaaaaaaa", formato.data.data[0].id)
                    if (resultado.data.status == true) {
                        setDataModalResultadoAnalisis(resultado.data.data)
                    } else {

                    }

                } else {

                }
                changeModalFormResults(true)

            } else if (response.data.find_error) {
            } else {
            }
        } catch (e) {
            console.log(e)
        }
    }
    async function getusuarios() {
        try {

            if (userInfo.userInfo) {

                if (userInfo.userInfo.rol == "administrador" && userInfo.userInfo.cargo == "administrador") {
                    let filter = {
                        "filter": {
                            "where": {
                                "us.rol": {
                                    "value": "catador",
                                    "require": "and"
                                },
                                "us.cargo": {
                                    "value": "instructor",
                                    "require": "and"
                                }
                            }
                        }
                    }
                    const response = await Api.post("usuarios/listar", filter);
                    let cafes = inputsForm;
                    if (!cafes["usuario_formato_sca"]) {
                        cafes["usuario_formato_sca"] = {}
                    }
                    cafes["usuario_formato_sca"]["opciones"] = response.data.data ? response.data.data : [];

                    if (!cafes["usuario_formato_fisico"]) {
                        cafes["usuario_formato_fisico"] = {}
                    }
                    cafes["usuario_formato_fisico"]["opciones"] = response.data.data ? response.data.data : [];

                    setInputsForm(cafes)

                }
            }

        } catch (e) {

        }
    }
    async function getMuestras() {
        try {
            let filter = {};
            if (userInfo.userInfo) {
                if (userInfo.userInfo.rol == "administrador" && userInfo.userInfo.cargo == "administrador") {
                    filter = {
                        "filter": {
                            "where": {
                                "us.rol": {
                                    "value": "cafetero",
                                    "require": "and"
                                },
                                "us.cargo": {
                                    "value": "cliente",
                                    "require": "and"
                                }
                            }
                        }
                    }
                }
            }
            const response = await Api.post("muestra/listar", filter);

            let cafes = inputsForm;
            if (!cafes["muestras_id"]) {
                cafes["muestras_id"] = {}
            }
            if (response.data.status == true) {

                cafes["muestras_id"]["opciones"] = response.data.data
            } else if (response.data.find_error) {
                cafes["muestras_id"]["opciones"] = []

            } else {

            }
            setInputsForm(cafes)

        } catch (e) {
        }
    }

    async function getAnalisis() {
        try {
            const response = await Api.post("analisis/listar", dataFilterTable);
            console.log('FILTER DATA: ', dataFilterTable)
            if (response.data.status == true) {
                setUsuarios(response.data.data)
                setCountRegisters(response.data.count)
            } else if (response.data.find_error) {
                setCountRegisters(0)
                setUsuarios(response.data)
            } else {
                setUsuarios(response.data)
            }
        } catch (e) {

        }
    }

    async function desactivarUsuario() {
        try {
            const axios = await Api.delete("analisis/eliminar/" + idAnalisis);
            if (axios.data.status == true) {
                getAnalisis();
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
            } else if (axios.data.admin_error) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "false",
                        description: axios.data.admin_error,
                        "tittle": "Nó lo hagas",
                    }
                )
            }
            else if (axios.data.permission_error) {
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
        idAnalisis = id;
        let tittle = ""
        let descripcion = ""
        if (estado == 0) {
            tittle = "Activarás el usuario " + id
            descripcion = "Estás apunto de activar el usuario, ten encuenta que esta accion no activará las dependencias de el usuario, pero si permitirá el uso de ellas.";
        } else if (estado == 1 || estado == 3 || estado == 4) {
            tittle = "¿Deseas desactivar el usuario " + id + " ?";
            descripcion = "Estás apunto de desactivar el usuario, por favor verifica si realmente quieres hacerlo. Esta acción conlleva a desactivar todos los registros de las  dependencias de este usuario."
        }
        setStatusAlert(true)
        setdataAlert(
            {
                status: "warning",
                description: descripcion,
                tittle: tittle,
                continue: {
                    "function": desactivarUsuario
                }
            }
        )

    }
    async function setUsuario(data) {
        try {

            const axios = await Api.post("analisis/registrar/", data);

            if (axios.data.status == true) {
                getAnalisis();
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
    async function updateUsuario(data, id) {

        try {
            const axios = await Api.put("analisis/actualizar/" + id, data);
            if (axios.data.status == true) {
                getAnalisis();
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
                        description: axios.data.message,
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
            cloneDataFilterTable.filter.where["an.estado"] = {
                "value": value,
                "require": "and"
            }

        } else {
            delete cloneDataFilterTable.filter.where["an.estado"]
        }
        setDataFilterTable(cloneDataFilterTable)
        getAnalisis(dataFilterTable)
    }
    async function getFiltersOrden(filter) {
        dataFilterTable.filter["order"] = filter
        getAnalisis();

    }
    async function limitRegisters(data) {
        dataFilterTable.filter["limit"] = data
        getAnalisis()

    }
    async function clearInputs() {
        if (inputsForm["usuario_formato_sca"]) {
            inputsForm["usuario_formato_sca"]["visibility"] = true
            inputsForm["usuario_formato_fisico"]["visibility"] = true
        }

    }
    async function buscarUsuario(id) {
        inputsForm["usuario_formato_sca"]["visibility"] = false
        inputsForm["usuario_formato_fisico"]["visibility"] = false

        const response = await Api.post("analisis/buscar/" + id);
        if (response.data.status == true) {
            setUsuarioEdit(response.data.data[0])
        } else if (response.data.find_error) {

        } else {

        }

    }
    async function updateTable() {
        getAnalisis();
    }
    async function editarUsuario(id) {
        buscarUsuario(id)
    }
    function filterSeacth(search) {
        let cloneDataFilterTable = { ...dataFilterTable }
        cloneDataFilterTable.filter["search"] = search
        setDataFilterTable(cloneDataFilterTable)
        getAnalisis(dataFilterTable)

    }
    async function setFormatoSca(data, id, tipoRegistro, tipoAnalisis) {
        let route = "";
        let method = "post";
        console.log(data)
        data["tipos_analisis_id"] = tipoAnalisis ? tipoAnalisis : ""
        data["formatos_id"] = id ? id : ""
        if (tipoRegistro == 1) {
            route = "resultado/registrar/"
            data["xd"] = "xd";
        } else {
            method = "put"
            route = "resultado/actualizar/" + id
        }
        
        const axios = await Api[method](route,data);
        console.log(axios)

    }
    return (
        <>
            <link rel="stylesheet" href="../../public/css/analisis.css" />

            <Tablas clearInputs={clearInputs} imgForm={"/img/formularios/registroUsuario.jpg"} changeModalForm={changeModalForm} modalForm={modalForm} filterSeacth={filterSeacth} updateStatus={updateStatus} editarStatus={setUpdateStatus} editar={editarUsuario} elementEdit={usuarioEdit} errors={errors} setErrors={setErrors} inputsForm={inputsForm} funcionregistrar={setUsuario} updateTable={updateTable} limitRegisters={limitRegisters} count={countRegisters} data={usuarios} keys={keys} cambiarEstado={cambiarEstado} updateEntitie={updateUsuario} tittle={"Análisis"} filterEstado={filterEstado} getFilterEstado={getFilterEstado} getFiltersOrden={getFiltersOrden} />
            <FormResultados setFormatoSca={setFormatoSca} dataModalResultadoAnalisis={dataModalResultadoAnalisis} dataModalResultado={dataModalResultado} dataModalAnalisis={dataModalAnalisis} changeModalFormResults={changeModalFormResults} modalFormResults={modalFormResults} />
            <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />
        </>
    )
}