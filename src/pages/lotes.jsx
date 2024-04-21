import React, { useEffect, useState } from 'react'
import { Tablas } from "../componentes/tablas.jsx"
import Api, { host } from '../componentes/Api.jsx'
import { Alert } from '../componentes/alert.jsx'


export const Lotes = (userInfo) => {
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
            },
            "pdf": {
                "status": true
            }
        }
    });
    const [lotes, setLotes] = useState(false)
    const [fincaEdit, setLoteEdit] = useState([])
    const [updateStatus, setUpdateStatus] = useState(false)
    const [municipios, setMunicipios] = useState([])
    const [countRegisters, setCountRegisters] = useState()
    const [errors, setErrors] = useState()
    const [statusAlert, setStatusAlert] = useState(false);
    const [dataAlert, setdataAlert] = useState({});
    const [modalForm, changeModalForm] = useState(false);
    let idLoteCambiarEstado = 0;


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


    let [inputsForm, setInputsForm] = useState(
        {
            nombre: {
                type: "normal",
                referencia: "Nombre del lote",
                upper_case: true,
            },
            longitud: {
                type: "ubicacion",
                referencia: <div className='div-label-input-ubicacion'><h4>Longitud</h4><h6>(-66.9 a -79.03)</h6></div>,
            },
            latitud: {
                type: "ubicacion",
                referencia: <div className='div-label-input-ubicacion'><h4>Latitud</h4><h6>(12.4 a -4.1)</h6></div>
            },
            fincas_id: {
                type: "select",
                referencia: "Finca",
                values: ["numero_documento_usuario", "nombre_completo_usuario", "nombre"],
                upper_case: true,
                key: "id"
            }
        }
    )

    const keys = {
        "lo_id": {
            "referencia": "Id",
            "priority": 1
        },
        "finca": {
            "referencia": "Finca",
            "upper_case": true,
            "priority": 3
        },
        "nombre": {
            "referencia": "Nombre del lote",
            "upper_case": true
        },
        "latitud": {
            "referencia": "Latitud"
        },
        "longitud": {
            "referencia": "Longitud"
        },
        "fecha_creacion": {
            "referencia": "Fecha creación",
            "format": true
        },
        "estado": {
            "referencia": "Estado",
            "filter": false,
            "rol": ["administrador", "catador"],
            "priority": 2


        },
        "actualizar": {
            "referencia": "Actualizar",
            "rol": ["administrador", "catador"]
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
        getLotes()
        getFincas()
    }, [])

    async function getLotes() {
        try {
            if (document.getElementById("contentTable").querySelector("tbody")) {
                document.getElementById("contentTable").style.overflow = "hidden"
            }
            if (!document.getElementById("loadTable")) {
                if (document.getElementById("contentTable")) {
                    document.getElementById("contentTable").insertAdjacentHTML('beforeend', ("<div id='loadTable' class='load-table'>Cargando</div>"))
                }
            }
            const response = await Api.post("lotes/listar", dataFilterTable);
            if (response.data.status == true) {
                setLotes(response.data.data)
                setCountRegisters(response.data.count)
            } else if (response.data.find_error) {
                setCountRegisters(0)
                setLotes(response.data)
            } else {
                setLotes(response.data)
            }

        } catch (e) {

        }
    }

    async function desactivarLote() {
        try {
            const axios = await Api.delete("lotes/eliminar/" + idLoteCambiarEstado);
            if (axios.data.status == true) {
                getLotes();
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

        idLoteCambiarEstado = id;
        let tittle = ""
        let descripcion = ""
        if (estado == 0) {
            tittle = "Activarás el lote " + id
            descripcion = "Estás apunto de activar el lote, ten encuenta que esta accion no activará las dependencias de el lote, pero si permitirá el uso de ellas.";
        } else if (estado == 1 || estado == 3 || estado == 4) {
            tittle = "¿Deseas desactivar el lote " + id + " ?";
            descripcion = "Estás apunto de desactivar el lote, por favor verifica si realmente quieres hacerlo. Esta acción conlleva a desactivar todos los registros de las  dependencias de este lote."
        }
        setStatusAlert(true)
        setdataAlert(
            {
                status: "warning",
                description: descripcion,
                tittle: tittle,
                continue: {
                    "function": desactivarLote
                }
            }
        )

    }
    async function setLote(data) {
        try {
            const axios = await Api.post("lotes/registrar/", data);
            if (axios.data.status == true) {
                getLotes();
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


    async function getFincas() {
        try {
            let filter = {
                "filter": {
                    "where": {
                        "fin.estado": {
                            "operador": "!=",
                            "value": "0",
                            "require": "and"
                        }
                    }
                }
            }
            const response = await Api.post("finca/listar", filter);

            if (response.data.status == true) {
                let municipios = inputsForm;
                if (!municipios["fincas_id"]) {
                    municipios["fincas_id"] = {}
                }
                municipios["fincas_id"]["opciones"] = response.data.data
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
    async function updateLote(data, id) {

        try {
            const axios = await Api.put("lotes/actualizar/" + id, data);
            if (axios.data.status == true) {
                getLotes();
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
            cloneDataFilterTable.filter.where["lo.estado"] = {
                "value": value,
                "require": "and"
            }

        } else {
            delete cloneDataFilterTable.filter.where["lo.estado"]
        }
        setDataFilterTable(cloneDataFilterTable)
        getLotes(dataFilterTable)
    }
    async function getFiltersOrden(filter) {
        dataFilterTable.filter["order"] = filter
        getLotes();

    }
    async function limitRegisters(data) {
        dataFilterTable.filter["limit"] = data
        if (data["valueSearch"] != undefined) {
            dataFilterTable.filter["search"] = data["valueSearch"]
        }
        getLotes()

    }
    async function buscarLote(id) {

        const response = await Api.get("lotes/buscar/" + id);
        if (response.data.status == true) {
            setLoteEdit(response.data.data)
        } else if (response.data.find_error) {

        } else {

        }
    }
    async function updateTable() {
        getLotes();
    }
    async function editarLote(id) {

        buscarLote(id)
    }
    function filterSeacth(search) {

        let cloneDataFilterTable = { ...dataFilterTable }
        cloneDataFilterTable.filter["search"] = search
        setDataFilterTable(cloneDataFilterTable)
        getLotes(dataFilterTable)

    }

    async function getReporte(tipo, filter) {
        try {

            let filterReport = {
                "filter": {
                    "where": {

                    },
                    "date": {
                        "lo.fecha_creacion": {
                            "desde": filter.desde_registro ? filter.desde_registro : "",
                            "hasta": filter.hasta_registro ? filter.hasta_registro : ""
                        }
                    },
                    "limit": {
                        inicio: 0,
                        fin: 100
                    }
                }
            }
            if (filter.estado != "" && filter.estado) {
                filterReport["filter"]["where"]["lo.estado"] = {
                    "value": filter.estado ? filter.estado : "",
                    "operador": "=",
                    "require": "and"
                }
            }
            const response = await Api.post("lotes/listar", filterReport);
            if (response.data.status == true) {
                if (tipo == "pdf") {
                    if (response.data.count > 100) {
                        setFilterPdflimit({ status: true, max: response.data.count })
                    }
                    let dataPdf = {
                        data: response.data.data,
                        table: keys
                    }
                    localStorage.setItem("dataGeneratePdfTable", JSON.stringify(dataPdf));
                    window.open('/dashboard/generatePdfTable', '_blank')
                } else {
                    generatePdf(filterReport, response.data.data, keys)
                }
            } else if (response.data.find_error) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "false",
                        description: response.data.find_error,
                        "tittle": "No se encontró!"
                    }
                )
            }


        } catch (e) {
            console.log(e)
        }
    }

    async function generatePdf(filter, dataTable, table) {
        let cloneTable = { ...table }
        delete cloneTable["permission_formato_fisico"]
        delete cloneTable["permission_formato_sca"]
        delete cloneTable["actualizar"]
        delete cloneTable["reporte"]
        const data = {
            dataTable,
            filter,
            table: { ...cloneTable }
        };
        try {
            const response = await fetch('http://' + host + ':8000/generateReporte.php', {

                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Error al generar el PDF');
            }

            const pdfBlob = await response.blob();

            // Crear una URL de objeto a partir del blob
            const blobUrl = URL.createObjectURL(pdfBlob);

            // Abrir el PDF en una nueva pestaña del navegador
            window.open(blobUrl, '_blank');
        } catch (error) {
            setStatusAlert(true)
            setdataAlert(
                {
                    status: "false",
                    description: "Error interno del servidor: Inténtalo más tarde.",
                    "tittle": "Inténtalo de nuevo"
                }
            )
        }
    }
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
        if (!cloneDataFilterTable["filter"]["date"]["lo.fecha_creacion"]) {
            cloneDataFilterTable["filter"]["date"]["lo.fecha_creacion"] = {}
        }
        if (filter.desde_registro) {
            cloneDataFilterTable["filter"]["date"]["lo.fecha_creacion"]["desde"] = filter.desde_registro
        } else {
            if (cloneDataFilterTable["filter"]["date"]["lo.fecha_creacion"]) {
                delete cloneDataFilterTable["filter"]["date"]["lo.fecha_creacion"]
            }
        }
        if (!cloneDataFilterTable["filter"]["date"]["lo.fecha_creacion"]) {
            cloneDataFilterTable["filter"]["date"]["lo.fecha_creacion"] = {}
        }
        if (filter.hasta_registro) {
            cloneDataFilterTable["filter"]["date"]["lo.fecha_creacion"]["hasta"] = filter.hasta_registro
        } else {
            if (cloneDataFilterTable["filter"]["date"]["lo.fecha_creacion"]) {
                cloneDataFilterTable["filter"]["date"]["lo.fecha_creacion"]
            }
        }

        const dataWhere = ["estado"]

        for (let x = 0; x < dataWhere.length; x++) {
            if (filter[dataWhere[x]]) {
                cloneDataFilterTable["filter"]["where"]["lo." + [dataWhere[x]]] = {
                    "value": filter[[dataWhere[x]]],
                    "operador": "=",
                    "require": "and"
                }
            } else {
                if (cloneDataFilterTable["filter"]["where"]["lo." + [dataWhere[x]]]) {
                    delete cloneDataFilterTable["filter"]["where"]["lo." + [dataWhere[x]]]
                }
            }
        }
        setDataFilterTable(cloneDataFilterTable)
        getLotes()
    }
    async function generatePdf(e, orientacion, papel, alto, ancho, margen_superior, margen_derecho, margen_inferior, margen_izquierdo, fuente, font_size_content_tabla, font_size_encabezado_tabla, font_size_encabezado, color_fondo, espaciado_superior_contenido, espaciado_derecho_contenido, espaciado_inferior_contenido, espaciado_izquierdo_contenido) {
        let cloneTable = { ...keys }
        delete cloneTable["actualizar"]

        const dataGeneratePdf = {
            "dataTable": lotes,
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
                    description: "Error interno del servidor: Inténtalo más tarde.",
                    "tittle": "Inténtalo de nuevo"
                }
            )

        }
    }
    async function clearFilters(data) {
        dataFilterTable = {
            "filter": {
                "where": {

                },
                "limit": {
                    "inicio": 0,
                    "fin": 10
                }
            }
        }
        if (typeof data == "object") {
            if (data.inicio) {
                dataFilterTable.filter["limit"]["inicio"] = data.inicio
            }
            if (data.fin) {
                dataFilterTable.filter["limit"]["fin"] = data.fin
            }
        }
        getusuarios()
    }
    return (
        <>
            <Tablas clearFilters={clearFilters} getAvanzado={getAvanzado} generatePdf={generatePdf} userInfo={userInfo.userInfo} buttonsHeaderTable={buttonsHeaderTable} getReporte={getReporte} dataDocumento={inputsDocumento} imgForm={"/img/formularios/img-form-state.jpg"} changeModalForm={changeModalForm} modalForm={modalForm} filterSeacth={filterSeacth} updateStatus={updateStatus} editarStatus={setUpdateStatus} editar={editarLote} elementEdit={fincaEdit} errors={errors} setErrors={setErrors} inputsForm={inputsForm} funcionregistrar={setLote} updateTable={updateTable} limitRegisters={limitRegisters} count={countRegisters} data={lotes} keys={keys} cambiarEstado={cambiarEstado} updateEntitie={updateLote} tittle={"Lotes"} filterEstado={filterEstado} getFilterEstado={getFilterEstado} getFiltersOrden={getFiltersOrden} />

            <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />
        </>
    )
}