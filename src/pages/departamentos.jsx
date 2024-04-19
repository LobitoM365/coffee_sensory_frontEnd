import React, { useEffect, useState } from 'react'
import { Tablas } from "../componentes/tablas.jsx"
import Api from '../componentes/Api.jsx'
import { Alert } from '../componentes/alert.jsx'
import { host } from '../componentes/Api.jsx'

export const Departamentos = (userInfo) => {
    const [buttonsHeaderTable, setButtonsHeaderTable] = useState({
        "buttons": {
            "reporte": {
                "status": true,
                "rol": ["administrador"]
            },
            "avanzado": {
                "status": true,
            },
            "pdf": {
                "status": true
            }
        }
    });

    let [dataFilterTable, setDataFilterTable] = useState({
        "filter": {
            "where": {

            }
        }
    })
        ;
    const [data, setEntities] = useState([])
    const [fincaEdit, setEntitieEdit] = useState([])
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
        "id": {
            "referencia": "Id",
            "priority" : 2

        },
        "nombre": {
            "referencia": "Nombre",
           "upper_case": true,
            "priority" : 1

        },
        "fecha_creacion": {
            "referencia": "Fecha de creación",
            "format": true
        }

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
            }
        }
    )
    useEffect(() => {
        getEntities()

    }, [])

    async function getEntities() {
        try {
            const response = await Api.post("departamento/listar", dataFilterTable);
            console.log('DEPARTAMENTS: ', dataFilterTable);
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

    async function setEntitie(data) {
        try {
            const axios = await Api.post("departamento/registrar/", data);
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



    async function procedureTrue() {
        changeModalForm(false)
        setUpdateStatus(false)
    }
    async function updateFinca(data, id) {

        try {
            const axios = await Api.put("departamento/actualizar/" + id, data);
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
            cloneDataFilterTable.filter.where["de.estado"] = {
                "value": value,
                "require": "and"
            }

        } else {
            delete cloneDataFilterTable.filter.where["de.estado"]
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
    async function buscarDepartamento(id) {

        const response = await Api.get("departamento/buscar/" + id);
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
        buscarDepartamento(id)
    }
    function filterSeacth(search) {
        let cloneDataFilterTable = { ...dataFilterTable }
        cloneDataFilterTable.filter["search"] = search
        setDataFilterTable(cloneDataFilterTable)
        getEntities(dataFilterTable)

    }
    useEffect(() => {

    }, [])
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
        if (!cloneDataFilterTable["filter"]["date"]["de.fecha_creacion"]) {
            cloneDataFilterTable["filter"]["date"]["de.fecha_creacion"] = {}
        }
        if (filter.desde_registro) {
            console.log("ahhh")
            cloneDataFilterTable["filter"]["date"]["de.fecha_creacion"]["desde"] = filter.desde_registro
        } else {
            if (cloneDataFilterTable["filter"]["date"]["de.fecha_creacion"]) {
                delete cloneDataFilterTable["filter"]["date"]["de.fecha_creacion"]
            }
        }
        if (!cloneDataFilterTable["filter"]["date"]["de.fecha_creacion"]) {
            cloneDataFilterTable["filter"]["date"]["de.fecha_creacion"] = {}
        }
        if (filter.hasta_registro) {
            cloneDataFilterTable["filter"]["date"]["de.fecha_creacion"]["hasta"] = filter.hasta_registro
        } else {
            if (cloneDataFilterTable["filter"]["date"]["de.fecha_creacion"]) {
                cloneDataFilterTable["filter"]["date"]["de.fecha_creacion"]
            }
        }

        const dataWhere = []

        for (let x = 0; x < dataWhere.length; x++) {
            if (filter[dataWhere[x]]) {
                cloneDataFilterTable["filter"]["where"]["de." + [dataWhere[x]]] = {
                    "value": filter[[dataWhere[x]]],
                    "operador": "=",
                    "require": "and"
                }
            } else {
                if (cloneDataFilterTable["filter"]["where"]["de." + [dataWhere[x]]]) {
                    delete cloneDataFilterTable["filter"]["where"]["de." + [dataWhere[x]]]
                }
            }
        }

        console.log(filter, "aaaaaaaaa", cloneDataFilterTable)

        setDataFilterTable(cloneDataFilterTable)
        getEntities()

    }
    async function generatePdf(e, orientacion, papel, alto, ancho, margen_superior, margen_derecho, margen_inferior, margen_izquierdo, fuente, font_size_content_tabla, font_size_encabezado_tabla, font_size_encabezado, color_fondo, espaciado_superior_contenido, espaciado_derecho_contenido, espaciado_inferior_contenido, espaciado_izquierdo_contenido) {
        let cloneTable = { ...keys }
        delete cloneTable["actualizar"]

        const dataGeneratePdf = {
            "dataTable": data,
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
            <Tablas getAvanzado={getAvanzado} dataDocumento={inputsDocumento} generatePdf={generatePdf} userInfo={userInfo.userInfo} buttonsHeaderTable={buttonsHeaderTable} imgForm={"/img/formularios/imgFinca.jpg"} changeModalForm={changeModalForm} modalForm={modalForm} filterSeacth={filterSeacth} updateStatus={updateStatus} editarStatus={setUpdateStatus} editar={editarFinca} elementEdit={fincaEdit} errors={errors} setErrors={setErrors} inputsForm={inputsForm} funcionregistrar={setEntitie} updateTable={updateTable} limitRegisters={limitRegisters} count={countRegisters} data={data} keys={keys} updateEntitie={updateFinca} tittle={"Departamentos"} filterEstado={filterEstado} getFilterEstado={getFilterEstado} getFiltersOrden={getFiltersOrden} />

            <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />
        </>
    )
}