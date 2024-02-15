import React, { useEffect, useState } from 'react'
import { Tablas } from "../componentes/tablas.jsx"
import Api from '../componentes/Api.jsx'
import { Alert } from '../componentes/alert.jsx'


export const RegistrosUsuarios = () => {
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
            nombre: {
                type: "text",
                referencia: "Nombre",
                upper_case: true,
            },
            apellido: {
                type: "text",
                referencia: "Apellido",
                upper_case: true,
            },
            tipo_documento: {
                type: "select",
                referencia: "Tipo de documento",
                values: ["nombre"],
                opciones: [{ nombre: "cedula de ciudadania" }, { nombre: "tarjeta de identidad" }],
                upper_case: true,
                key: "nombre"
            },
            numero_documento: {
                type: "number",
                referencia: "Número de documento"
            },
            telefono: {
                type: "number",
                referencia: "Teléfono"
            },

            rol: {
                type: "select",
                referencia: "Rol",
                values: ["nombre"],
                opciones: [{ nombre: "catador" }, { nombre: "cafetero" }],
                upper_case: true,
                key: "nombre"
            },
            cargo: {
                type: "select",
                referencia: "Cargo",
                values: ["nombre"],
                opciones: [{ nombre: "instructor" }, { nombre: "aprendiz" }, { nombre: "cliente" }],
                upper_case: true,
                key: "nombre"
            },
            correo_electronico: {
                type: "email",
                referencia: "Correo electrónico"
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
        getusuarios()
    }, [])

    async function getusuarios() {
        try {   
            const response = await Api.post("usuarios/listar", dataFilterTable);
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
                getusuarios();
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
            const axios = await Api.post("usuarios/registrar/", data);
            if (axios.data.status == true) {
                getusuarios();
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
                getusuarios();
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
        getusuarios(dataFilterTable)
    }
    async function getFiltersOrden(filter) {
        dataFilterTable.filter["order"] = filter
        getusuarios();

    }
    async function limitRegisters(data) {
        dataFilterTable.filter["limit"] = data
        getusuarios()

    }
    async function clearInputs() {
        inputsForm["rol"]["visibility"] = true
        inputsForm["cargo"]["visibility"] = true
    }
    async function buscarUsuario(id) {

        const response = await Api.get("usuarios/buscar/" + id);
        if (response.data.status == true) {
            if (response.data.data.rol == "administrador") {
                inputsForm["rol"]["visibility"] = false
                inputsForm["cargo"]["visibility"] = false
            } else {
                inputsForm["rol"]["visibility"] = true
                inputsForm["cargo"]["visibility"] = true
            }
            setUsuarioEdit(response.data.data)
        } else if (response.data.find_error) {

        } else {

        }
    }
    async function updateTable() {
        getusuarios();
    }
    async function editarUsuario(id) {
        buscarUsuario(id)
    }
    function filterSeacth(search) {
        let cloneDataFilterTable = { ...dataFilterTable }
        cloneDataFilterTable.filter["search"] = search
        setDataFilterTable(cloneDataFilterTable)
        getusuarios(dataFilterTable)

    }

    return (
        <>
            <Tablas clearInputs={clearInputs} imgForm={"/img/formularios/registroUsuario.jpg"} changeModalForm={changeModalForm} modalForm={modalForm} filterSeacth={filterSeacth} updateStatus={updateStatus} editarStatus={setUpdateStatus} editar={editarUsuario} elementEdit={usuarioEdit} errors={errors} setErrors={setErrors} inputsForm={inputsForm} funcionregistrar={setUsuario} updateTable={updateTable} limitRegisters={limitRegisters} count={countRegisters} data={usuarios} keys={keys} cambiarEstado={cambiarEstado} updateEntitie={updateUsuario} tittle={"Usuario"} filterEstado={filterEstado} getFilterEstado={getFilterEstado} getFiltersOrden={getFiltersOrden} />
            <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />
        </>
    )
}