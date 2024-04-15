import React, { useEffect, useState } from 'react'
import { Tablas } from "../componentes/tablas.jsx"
import Api from '../componentes/Api.jsx'
import { Alert } from '../componentes/alert.jsx'
import { host } from '../componentes/Api.jsx'

export const Variedades = () => {
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
            "avanzado": {
                "status": true,
                "rol": ["administrador"]
            },
            "pdf": {
                "status": true
            }
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
                referencia: "Nombre de la variedad",
                upper_case: true,
            }
        }
    )

    const keys = {
        "vari_id": {
            "referencia": "Id",
        },
        "nombre": {
            "referencia": "Nombre",
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
    }, [])

    async function getVariedades() {
        try {
            const response = await Api.post("variedades/listar", dataFilterTable);
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
            const axios = await Api.post("variedades/registrar/", data);
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
            const axios = await Api.put("variedades/actualizar/" + id, data);
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

        const response = await Api.get("variedades/buscar/" + id);
        if (response.data.status == true) {
            setVariedadEdit(response.data.data[0])
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
            }
        }
    )

    async function getAvanzado(tipo, filter) {

        const cloneDataFilterTable = { ...dataFilterTable }
        if (!dataFilterTable["filter"]) {
            cloneDataFilterTable["filter"] = {}
        }
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
        console.log(cloneDataFilterTable, "cloooooooooooooooooon")
        if (!cloneDataFilterTable["filter"]["date"]["us.fecha_creacion"]) {
            cloneDataFilterTable["filter"]["date"]["us.fecha_creacion"] = {}
        }
        if (filter.desde_registro) {
            console.log("ahhh")
            cloneDataFilterTable["filter"]["date"]["us.fecha_creacion"]["desde"] = filter.desde_registro
        } else {
            if (cloneDataFilterTable["filter"]["date"]["us.fecha_creacion"]) {
                delete cloneDataFilterTable["filter"]["date"]["us.fecha_creacion"]
            }
        }
        if (!cloneDataFilterTable["filter"]["date"]["us.fecha_creacion"]) {
            cloneDataFilterTable["filter"]["date"]["us.fecha_creacion"] = {}
        }
        if (filter.hasta_registro) {
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
        console.log(filter, "aaaaaaaaa", cloneDataFilterTable)

        setDataFilterTable(cloneDataFilterTable)
        getFincas()

    }
    async function generatePdf(e, orientacion, papel, alto, ancho, margen_superior, margen_derecho, margen_inferior, margen_izquierdo, fuente, font_size_content_tabla, font_size_encabezado_tabla, font_size_encabezado, color_fondo, espaciado_superior_contenido, espaciado_derecho_contenido, espaciado_inferior_contenido, espaciado_izquierdo_contenido) {
        let cloneTable = { ...keys }
        delete cloneTable["actualizar"]

        const dataGeneratePdf = {
            "dataTable": fincas,
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
                body: JSON.stringify(dataGeneratePdf)
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
    return (
        <>
            <Tablas getAvanzado={getAvanzado} generatePdf={generatePdf} dataDocumento={inputsDocumento} buttonsHeaderTable={buttonsHeaderTable} imgForm={"/img/formularios/imgFinca.jpg"} changeModalForm={changeModalForm} modalForm={modalForm} filterSeacth={filterSeacth} updateStatus={updateStatus} editarStatus={setUpdateStatus} editar={editarFinca} elementEdit={fincaEdit} errors={errors} setErrors={setErrors} inputsForm={inputsForm} funcionregistrar={setVariedad} updateTable={updateTable} limitRegisters={limitRegisters} count={countRegisters} data={fincas} keys={keys} cambiarEstado={cambiarEstado} updateEntitie={updateFinca} tittle={"Variedad"} filterEstado={filterEstado} getFilterEstado={getFilterEstado} getFiltersOrden={getFiltersOrden} hidden={'status'} />
            <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />
        </>
    )
}