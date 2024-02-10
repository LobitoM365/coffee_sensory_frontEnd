import React, { useEffect, useState } from 'react'
import { Tablas } from "../componentes/tablas.jsx"
import Api from '../componentes/Api.jsx'
import { Alert } from '../componentes/alert.jsx'


export const Analisis = (userInfo) => {
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
    let idUsuarioCambiarEstado = 0;

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
            }

        }
    )

    const keys = {
        "us_id": {
            "referencia": "Id",
        },
        "nombre": {
            "referencia": "Nombre",
            "upper_case": true
        },
        "apellido": {
            "referencia": "Apelido",
            "upper_case": true
        },
        "numero_documento": {
            "referencia": "Numero de documento",
            "upper_case": true
        },
        "telefono": {
            "referencia": "Teléfono"
        },
        "correo_electronico": {
            "referencia": "Correo electrónico"
        },
        "tipo_documento": {
            "referencia": "Tipo de documento",
            "upper_case": true
        },
        "rol": {
            "referencia": "Rol",
            "upper_case": true
        },
        "cargo": {
            "referencia": "Cargo",
            "upper_case": true
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
                    if (!cafes["usuarios_id"]) {
                        cafes["usuarios_id"] = {}
                    }
                    cafes["usuarios_id"] = {
                        type: "select",
                        referencia: "Usuario",
                        values: ["numero_documento", "nombre_completo"],
                        opciones: response.data.status == true ? response.data.data : [],
                        upper_case: true,
                        key: "id"
                    }

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
            const response = await Api.post("muestra/listar",filter);

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
            const axios = await Api.delete("usuarios/desactivar/" + idUsuarioCambiarEstado);
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
        idUsuarioCambiarEstado = id;
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
            let route = "registrar"
            if (userInfo.userInfo.rol == "administrador" && userInfo.userInfo.cargo == "administrador") {
                route = "asignar"
            }
            const axios = await Api.post("analisis/" + route + "/", data);
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
            const axios = await Api.put("usuarios/actualizar/" + id, data);
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
            cloneDataFilterTable.filter.where["us.estado"] = {
                "value": value,
                "require": "and"
            }

        } else {
            delete cloneDataFilterTable.filter.where["us.estado"]
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
        if (inputsForm["usuarios_id"]) {
            inputsForm["usuarios_id"]["visibility"] = true
        }
    }
    async function buscarUsuario(id) {
   
        const response = await Api.get("usuarios/buscar/" + id);
        if (response.data.status == true) {

            setUsuarioEdit(response.data.data)
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

    return (
        <>
            <Tablas clearInputs={clearInputs} imgForm={"/img/formularios/registroUsuario.jpg"} changeModalForm={changeModalForm} modalForm={modalForm} filterSeacth={filterSeacth} updateStatus={updateStatus} editarStatus={setUpdateStatus} editar={editarUsuario} elementEdit={usuarioEdit} errors={errors} setErrors={setErrors} inputsForm={inputsForm} funcionregistrar={setUsuario} updateTable={updateTable} limitRegisters={limitRegisters} count={countRegisters} data={usuarios} keys={keys} cambiarEstado={cambiarEstado} updateEntitie={updateUsuario} tittle={"Análisis"} filterEstado={filterEstado} getFilterEstado={getFilterEstado} getFiltersOrden={getFiltersOrden} />
            <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />
        </>
    )
}