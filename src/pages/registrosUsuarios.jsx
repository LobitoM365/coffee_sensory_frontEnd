import React, { useEffect, useState } from 'react'
import { Tablas } from "../componentes/tablas.jsx"
import Api from '../componentes/Api.jsx'
import { Alert } from '../componentes/alert.jsx'
import { host } from '../componentes/Api.jsx'

export const RegistrosUsuarios = () => {
    let [dataFilterTable, setDataFilterTable] = useState({
        "filter": {
            "where": {

            },
            "order": {

            },
            "limit": {

            },
            "date": {

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
    const [buttonsHeaderTable, setButtonsHeaderTable] = useState({
        "buttons": {
            "add": {
                "status": true,
                "rol": ["administrador"]
            },
            "avanzado": {
                "status": true,
                "rol": ["administrador"]
            },
            "pdf": {
                "status": true
            }
        }
    });
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

    let [inputsDocumento, setinputsDocumento] = useState(
        {
            "fecha": {
                inputs: {
                    desde_registro: {
                        type: "date",
                        referencia: "Desde",
                        values: ["nombre"],
                    },
                    hasta_registro: {
                        type: "date",
                        referencia: "Hasta",
                    }
                },
                referencia: "Filtrar por fecha de creación"
            },
            "estado": {
                inputs: {
                    estado: {
                        type: "select",
                        referencia: "Estado",
                        values: ["nombre"],
                        opciones: [{ nombre: "activo", value: "1" }, { nombre: "inactivo", value: "0" }],
                        upper_case: true,
                        key: "value"
                    },
                },
                referencia: "Filtrar por estado"
            },
            "rol": {
                inputs: {
                    rol: {
                        type: "select",
                        referencia: "Rol",
                        values: ["nombre"],
                        opciones: [{ nombre: "administrador", value: "administrador" }, { nombre: "catador", value: "catador" }, { nombre: "cafetero", value: "cafetero" }],
                        upper_case: true,
                        key: "value"
                    },
                },
                referencia: "Filtrar por rol o cargo"
            }
        }
    )

    const keys = {
        "us_id": {
            "referencia": "Id",
            "priority": 1,
        },
        "nombre": {
            "referencia": "Nombre",
            "upper_case": true,
            "priority": 2,
        },
        "apellido": {
            "referencia": "Apellido",
            "upper_case": true,
            "priority": 3,
        },
        "numero_documento": {
            "referencia": "Numero de documento",
            "upper_case": true,
            "priority": 4,
        },
        "telefono": {
            "referencia": "Teléfono",
            "priority": 5,
        },
        "correo_electronico": {
            "referencia": "Correo electrónico",
            "priority": 6,
        },
        "tipo_documento": {
            "referencia": "Tipo de documento",
            "capital_letter": true,
            "priority": 7,
        },
        "rol": {
            "referencia": "Rol",
            "upper_case": true,
            "priority": 8,
        },
        "cargo": {
            "referencia": "Cargo",
            "upper_case": true,
            "priority": 9,
        },
        "fecha_actualizacion": {
            "referencia": "Fecha de Actualización",
            "priority": 10,
            "format": true
        },
        "fecha_creacion": {
            "referencia": "Fecha de Creación",
            "priority": 10,
            "format": true
        },
        "estado": {
            "referencia": "Estado",
            "priority": 10,
        },
        "actualizar": {
            "referencia": "actualizar",
            "priority": 11,
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

    async function generatePdf(e, orientacion, papel, alto, ancho, margen_superior, margen_derecho, margen_inferior, margen_izquierdo, fuente, font_size_content_tabla, font_size_encabezado_tabla, font_size_encabezado, color_fondo, espaciado_superior_contenido, espaciado_derecho_contenido, espaciado_inferior_contenido, espaciado_izquierdo_contenido) {
        let cloneTable = { ...keys }
        delete cloneTable["actualizar"]

        const data = {
            "dataTable": usuarios,
            "filter": dataFilterTable,
            "table": { ...cloneTable },
            "papel": papel,
            "orientacion": orientacion,
            "margen_superior": margen_superior,
            "margen_derecho": margen_derecho,
            "margen_inferior": margen_inferior,
            "margen_izquierdo": margen_izquierdo,
            "fuente": fuente,
            "font_size_content_tabla": font_size_content_tabla,
            "font_size_encabezado_tabla": font_size_encabezado_tabla,
            "font_size_encabezado": font_size_encabezado,
            "color_fondo": color_fondo,
            "espaciado_superior_contenido": espaciado_superior_contenido,
            "espaciado_derecho_contenido": espaciado_derecho_contenido,
            "espaciado_inferior_contenido": espaciado_inferior_contenido,
            "espaciado_izquierdo_contenido": espaciado_izquierdo_contenido,
        };
        if (alto && ancho) {
            data["width"] = alto
            data["height"] = ancho
        }
        let nodeInsert;
        if (e.target.nodeName == "BUTTON") {
            nodeInsert = e.target
        } else if (e.target.closest("button")) {
            nodeInsert = e.target.closest("button")
        }
        try {
            const response = await fetch('http://' + host + ':8000/generateReporte.php', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                if (nodeInsert.querySelector(".loader-div-button")) {
                    nodeInsert.innerHTML = "Intentar de nuevo."
                }
                throw new Error('Error al generar el PDF');
            }
            const pdfBlob = await response.blob();
            const blobUrl = URL.createObjectURL(pdfBlob);
            window.open(blobUrl, '_blank');
            if (nodeInsert.querySelector(".loader-div-button")) {
                nodeInsert.innerHTML = "Generar"
            }


        } catch (error) {
            if (nodeInsert.querySelector(".loader-div-button")) {
                nodeInsert.innerHTML = "Intentar de nuevo."
            }
            setStatusAlert(true)
            setdataAlert(
                {
                    status: "false",
                    description: "Error interno del servidor: " + error,
                    "tittle": "Inténtalo de nuevo"
                }
            )

        }
    }
    function getDataPdf(data) {
        let dataPdf = {
            data: data,
            table: keys
        }
        localStorage.setItem("dataGeneratePdfTable", JSON.stringify(dataPdf));
        window.open('/dashboard/generatePdfTable', '_blank')
    }

    async function getAvanzado(tipo, filter) {
        try {
            const cloneDataFilterTable = { ...dataFilterTable }
            if (!dataFilterTable["filter"]) {
                dataFilterTable["filter"] = {}
                if (!dataFilterTable["filter"]["where"]) {
                    cloneDataFilterTable["filter"]["where"] = {}
                }
                if (!dataFilterTable["filter"]["limit"]) {
                    cloneDataFilterTable["filter"]["limit"] = {}
                }
                if (!dataFilterTable["filter"]["date"]) {
                    cloneDataFilterTable["filter"]["date"] = {}
                }
                if (!dataFilterTable["filter"]["order"]) {
                    cloneDataFilterTable["filter"]["order"] = {}
                }
            }

            
            if (filter.desde_registro) {
                console.log("ahhh")
                if (!cloneDataFilterTable["filter"]["date"]["us.fecha_creacion"]) {
                    cloneDataFilterTable["filter"]["date"]["us.fecha_creacion"] = {}
                }
                cloneDataFilterTable["filter"]["date"]["us.fecha_creacion"]["desde"] = filter.desde_registro
            } else {
                if (cloneDataFilterTable["filter"]["date"]["us.fecha_creacion"]) {
                    delete cloneDataFilterTable["filter"]["date"]["us.fecha_creacion"]
                }
            }
            if (filter.hasta_registro) {
                if (!cloneDataFilterTable["filter"]["date"]["us.fecha_creacion"]) {
                    cloneDataFilterTable["filter"]["date"]["us.fecha_creacion"] = {}
                }
                cloneDataFilterTable["filter"]["date"]["us.fecha_creacion"]["hasta"] = filter.hasta_registro
            } else {
                if (cloneDataFilterTable["filter"]["date"]["us.fecha_creacion"]) {
                    cloneDataFilterTable["filter"]["date"]["us.fecha_creacion"]
                }
            }

            if (filter.estado) {
                cloneDataFilterTable["filter"]["where"]["us.estado"] = {
                    "value": filter.estado,
                    "operador": "=",
                    "require": "and"
                }
            } else {
                if (cloneDataFilterTable["filter"]["where"]["us.estado"]) {
                    delete cloneDataFilterTable["filter"]["where"]["us.estado"]
                }
            }

            setDataFilterTable(cloneDataFilterTable)
            getusuarios()
            // const response = await Api.post("usuarios/listar", filterReport);
            // console.log(response)
            // if (response.data.status == true) {
            //     if (tipo == "pdf") {
            //         if (response.data.count > 100) {
            //             setFilterPdflimit({ status: true, max: response.data.count })
            //         }
            //         let dataPdf = {
            //             data: response.data.data,
            //             table: keys
            //         }
            //         localStorage.setItem("dataGeneratePdfTable", JSON.stringify(dataPdf));
            //         window.open('/dashboard/generatePdfTable', '_blank')
            //     } else {
            //         generatePdf(filterReport, response.data.data, keys)
            //     }
            // } else if (response.data.find_error) {
            //     setStatusAlert(true)
            //     setdataAlert(
            //         {
            //             status: "false",
            //             description: response.data.find_error,
            //             "tittle": "No se encontró!"
            //         }
            //     )
            // }

        } catch (e) {
            console.log(e)
        }
    }


    return (
        <>
            <Tablas getAvanzado={getAvanzado} dataDocumento={inputsDocumento} generatePdf={generatePdf} getDataPdf={getDataPdf} buttonsHeaderTable={buttonsHeaderTable} clearInputs={clearInputs} imgForm={"/img/formularios/registroUsuario.jpg"} changeModalForm={changeModalForm} modalForm={modalForm} filterSeacth={filterSeacth} updateStatus={updateStatus} editarStatus={setUpdateStatus} editar={editarUsuario} elementEdit={usuarioEdit} errors={errors} setErrors={setErrors} inputsForm={inputsForm} funcionregistrar={setUsuario} updateTable={updateTable} limitRegisters={limitRegisters} count={countRegisters} data={usuarios} keys={keys} cambiarEstado={cambiarEstado} updateEntitie={updateUsuario} tittle={"Usuario"} filterEstado={filterEstado} getFilterEstado={getFilterEstado} getFiltersOrden={getFiltersOrden} />


            <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />
        </>
    )
}