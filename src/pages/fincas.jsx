import React, { useEffect, useState } from 'react'
import { Tablas } from "../componentes/tablas.jsx"
import Api, { host } from '../componentes/Api.jsx'
import { Alert } from '../componentes/alert.jsx'
import { GlobalModal } from '../componentes/globalModal.jsx'

export const Fincas = (userInfo) => {
    let [dataFilterTable, setDataFilterTable] = useState({
        "filter": {
            "where": {

            }
        }
    });
    const [fincas, setFincas] = useState([])
    const [fincaEdit, setfincaEdit] = useState([])
    const [updateStatus, setUpdateStatus] = useState(false)
    const [municipios, setMunicipios] = useState([])
    const [countRegisters, setCountRegisters] = useState()
    const [errors, setErrors] = useState()
    const [statusAlert, setStatusAlert] = useState(false);
    const [dataAlert, setdataAlert] = useState({});
    const [modalForm, changeModalForm] = useState(false);
    let idFincaCambiarEstado = 0;

    const [modalImg, setModaImgs] = useState(false)
    const [modalImgChange, setModalImgChange] = useState(false)
    const [focusImgChange, setFocusImgChange] = useState({})
    const [focusFinca, setFocusFinca] = useState(0)
    const [imgs, setImgs] = useState([])

    const [buttonsHeaderTable, setButtonsHeaderTable] = useState({
        "buttons": {
            "add": true,
            "reporte": true,
        }
    });

    async function listarIconos() {
        try {
            console.log("listaaaaaaaaaaaa")
            const response = await Api.post("/img/finca/listar");
            if (response.data.status == true) {
                setImgs(response.data.data)
            } else {
                setImgs([])
            }

        } catch (e) {
            console.log("Error: " + e)
        }
    }

    async function loadImg(e, tipo) {
        try {
            const father = e.target;
            const input = document.createElement("input")
            input.setAttribute("type", "file")
            input.style.display = "none"
            document.body.append(input)
            input.click()
            input.addEventListener("cancel", function () {
                input.remove()
            })
            input.addEventListener("change", async function () {
                let file = ""
                if (input) {
                    if (input.files[0]) {
                        file = input.files[0]
                        const formData = new FormData();
                        formData.append("img", file)
                        formData.append("fincas_id", focusFinca)
                        formData.forEach((input, key) => {
                            console.log(`${key}: ${input}`);
                        });
                        let route = "cargar"
                        let method = "post"
                        if (tipo == "editar") {
                            route = "actualizar/" + focusImgChange.id
                            method = "put"
                        }
                        const response = await Api[method]("/img/finca/" + route, formData);
                        if (response.data.status == true) {
                            fetchUser()
                            listarIconos();
                            setModalImgChange();
                        } else if (response.data.register_error) {
                            setStatusAlert(true);
                            setdataAlert({
                                status: "false",
                                description: response.data.register_error,
                                "tittle": "Error de validación.",
                            });
                        }
                        console.log(response, "ressssssss")
                    }
                }
                input.remove()
            })
        } catch (e) {
            console.log("Error:" + e)
        }
    }
    /* 
        async function predeterminarImg(id) {
            try {
                const response = await Api.post("/img/icono/predeterminar/" + id)
                if (response.data.status == true) {
                    fetchUser()
                    listarIconos()
                    setModalImgChange()
                }
                console.log(response, "siuuuuuuu")
            } catch (e) {
                console.log("Error: " + e)
            }
        } */
    async function eliminarImg(id) {
        try {
            const response = await Api.delete("/img/finca/eliminar/" + id)
            if (response.data.status == true) {
                fetchUser()
                listarIconos()
                setModalImgChange()
            }
            console.log(response, "siuuuuuuu")
        } catch (e) {
            console.log("Error: " + e)
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
                type: "text",
                referencia: "Nombre",
                upper_case: true,
            },
            // longitud: {
            //     type: "ubicacion",
            //     referencia: "Longitud",
            // },
            // latitud: {
            //     type: "ubicacion",
            //     referencia: "Latitud"
            // },
            usuarios_id: {
                type: "select",
                referencia: "Usuario",
                values: ["numero_documento", "nombre"],
                upper_case: true,
                key: "id",
                rol: ["administrador"]

            },
            departamentos_id: {
                type: "select",
                referencia: "Departamentos",
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
                function: {
                    value: getVeredas,
                    execute: {
                        type: "own",
                        value: "key"
                    }
                },
                search: {
                    clean: ["veredas_id"]
                }
            },
            veredas_id: {
                type: "select",
                referencia: "Vereda",
                values: ["nombre"],
                key: "id",
                upper_case: true,

            }
        }
    )

    const keys = {
        "fin_id": {
            "referencia": "Id",
        },
        "nombre": {
            "referencia": "Nombre",
            "upper_case": true
        },
        "numero_documento_usuario": {
            "values": [
                "numero_documento_usuario",
                "nombre_completo_usuario"
            ],
            "referencia": "Propietario",
            "upper_case": true
        },
        /* "latitud": {
            "referencia": "Latitud"
        },
        "longitud": {
            "referencia": "Longitud"
        }, */
        "nombre_municipio": {
            "referencia": "Municipio",
            "upper_case": true
        },
        "nombre_vereda": {
            "referencia": "Vereda",
            "upper_case": true
        },
        "cantidad_lotes": {
            "referencia": "Cantidad de lotes",
            "upper_case": true
        },
        "fecha_creacion": {
            "referencia": "Fecha creación",
            "format": true
        },
        "imagenes": {
            "referencia": "Imágenes",
            "normal": true,
            "inputs": {
                "ver": {
                    "type": "button",
                    "referencia": "Ver",
                    "function": {
                        "value": viewIcons,
                        "execute": {
                            "type": "table",
                            "value": "fin_id"
                        }
                    },
                    "class": "icon-ver-imgs",
                }
            },
            "class": "div-reporte-pdf",
            "upper_case": true
        },
        "estado": {
            "referencia": "Estado"
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
        getFincas()
        listarIconos()
        getDepartamentos();
    }, [])
    getUsers()

    async function viewIcons(id) {
        setFocusFinca(id)
        setModaImgs(true)
    }
    async function getFincas() {
        try {
            const response = await Api.post("finca/listar", dataFilterTable);
            if (response.data.status == true) {
                setFincas(response.data.data)
                setCountRegisters(response.data.count)
            } else if (response.data.find_error) {
                setCountRegisters(0)
                setFincas(response.data)
            } else {
                setFincas(response.data)
            }
        } catch (e) {

        }
    }

    async function desactivarFinca() {
        try {
            const axios = await Api.delete("finca/eliminar/" + idFincaCambiarEstado);
            console.log('FINCA ABLE: ', axios)
            if (axios.data.status == true) {
                getFincas();
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
    async function setFinca(data) {
        try {
            const axios = await Api.post("finca/registrar/", data);
            console.log(axios, "ahhh")
            if (axios.data.status == true) {
                getFincas();
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

    async function getUsers() {
        try {
            let filter = {
                "filter": {
                    "where": {
                        "us.estado": {
                            "operador": "!=",
                            "value": "0",
                            "require": "and"
                        },
                        "us.nombre": {
                            "operador": "!=",
                            "value": "Administrador",
                            "require": "and"
                        }
                    }
                }
            }
            const response = await Api.post("usuarios/listar", filter);
            if (response.data.status == true) {
                let users = inputsForm;
                if (!users["usuarios_id"]) {
                    users["usuarios_id"] = {}
                }
                users["usuarios_id"]["opciones"] = response.data.data
                setInputsForm(users)
            } else if (response.data.find_error) {

            } else {

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
        console.log(data, "dataaaaaaaa")
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

    async function procedureTrue() {
        changeModalForm(false)
        setUpdateStatus(false)
    }
    async function updateFinca(data, id) {

        try {
            const axios = await Api.put("finca/actualizar/" + id, data);
            if (axios.data.status == true) {
                getFincas();
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
        getFincas(dataFilterTable)
    }
    async function getFiltersOrden(filter) {
        dataFilterTable.filter["order"] = filter
        getFincas();

    }
    async function limitRegisters(data) {
        dataFilterTable.filter["limit"] = data
        getFincas()

    }
    async function buscarFinca(id) {
        const response = await Api.get("finca/buscar/" + id);
        try {
            if (response.data.status == true) {
                getMunicipios(response.data.data[0].departamentos_id)
                getVeredas(response.data.data[0].municipios_id)
                setfincaEdit(response.data.data[0])
            } else if (response.data.find_error) {
                setErrors({})
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "false",
                        description: response.data.update_error,
                        "tittle": "Inténtalo de nuevo"
                    }
                )
            }
        } catch (error) {
            setStatusAlert(true)
            setdataAlert(
                {
                    status: "warning",
                    description: "Error interno del servidor: " + e,
                    "tittle": "Inténtalo de nuevo"
                }
            )
            console.error('ERROR GET FINCA: ', e);
        }
    }
    async function updateTable() {
        getFincas();
    }
    async function editarFinca(id) {
        buscarFinca(id)
    }
    function filterSeacth(search) {
        let cloneDataFilterTable = { ...dataFilterTable }
        cloneDataFilterTable.filter["search"] = search
        setDataFilterTable(cloneDataFilterTable)
        getFincas(dataFilterTable)

    }

    async function getReporte(tipo, filter) {
        try {

            let filterReport = {
                "filter": {
                    "where": {

                    },
                    "date": {
                        "fin.fecha_creacion": {
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
                filterReport["filter"]["where"]["fin.estado"] = {
                    "value": filter.estado ? filter.estado : "",
                    "operador": "=",
                    "require": "and"
                }
            }
            const response = await Api.post("finca/listar", filterReport);
            console.log(response)
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
        console.log(cloneTable, "hahsd")
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
                    description: "Error interno del servidor: " + error,
                    "tittle": "Inténtalo de nuevo"
                }
            )
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        getUsers()
    }, [])
    return (
        <>
            <link rel="stylesheet" href="../../public/css/fincas.css" />
            <Tablas buttonsHeaderTable={buttonsHeaderTable} getReporte={getReporte} dataDocumento={inputsDocumento} imgForm={"/img/formularios/imgFinca.jpg"} userInfo={userInfo.userInfo} changeModalForm={changeModalForm} modalForm={modalForm} filterSeacth={filterSeacth} updateStatus={updateStatus} editarStatus={setUpdateStatus} editar={editarFinca} elementEdit={fincaEdit} errors={errors} setErrors={setErrors} inputsForm={inputsForm} funcionregistrar={setFinca} updateTable={updateTable} limitRegisters={limitRegisters} count={countRegisters} data={fincas} keys={keys} cambiarEstado={cambiarEstado} updateEntitie={updateFinca} tittle={"Fincas"} filterEstado={filterEstado} getFilterEstado={getFilterEstado} getFiltersOrden={getFiltersOrden} />
            <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />

            {modalImg ? <GlobalModal statusModal={setModaImgs} key={"icons-img"} class="modal-img" content={
                <div className='div-icons-img' key={"div-icons-img"} >
                    {imgs.length >= 5 ? "" :
                        <div className='load-icono' onClick={(e) => { loadImg(e, "cargar") }}>
                            <svg viewBox="0 0 182.000000 164.000000" preserveAspectRatio="xMidYMid meet">

                                <g transform="translate(0.000000,164.000000) scale(0.100000,-0.100000)" stroke="none">
                                    <path d="M87 1619 c-10 -6 -26 -9 -36 -6 -41 10 -41 4 -41 -651 0 -475 3 -631 12 -640 9 -9 131 -12 488 -12 l476 0 29 -62 c37 -77 113 -154 190 -192 250 -122 546 28 596 302 21 110 -10 238 -76 321 l-35 44 0 441 c0 331 -3 445 -12 454 -16 16 -1564 17 -1591 1z m1423 -479 l0 -309 -32 7 c-18 4 -65 7 -105 6 -79 -1 -144 -21 -211 -65 -24 -16 -45 -29 -47 -29 -2 0 -33 36 -69 80 -37 44 -71 80 -76 80 -6 0 -20 -11 -32 -25 -12 -14 -25 -25 -28 -25 -4 0 -64 65 -134 145 -69 80 -130 145 -135 145 -14 0 -36 -29 -230 -315 l-191 -280 383 -3 384 -2 -5 -30 -4 -30 -392 2 -391 3 -3 478 -2 477 660 0 660 0 0 -310z m32 -384 c73 -35 139 -100 175 -174 25 -50 28 -68 28 -152 0 -84 -3 -102 -28 -152 -35 -71 -104 -140 -176 -176 -49 -24 -68 -27 -151 -27 -83 0 -102 3 -150 27 -293 144 -272 556 33 669 76 28 192 22 269 -15z" />
                                    <path d="M1220 1317 c-13 -7 -35 -28 -48 -47 -57 -83 21 -195 122 -176 36 7 79 48 91 87 29 89 -80 179 -165 136z" />
                                    <path d="M1372 598 c-7 -7 -12 -39 -12 -75 l0 -63 -64 0 c-71 0 -99 -17 -76 -45 9 -10 32 -15 76 -15 l64 0 0 -64 c0 -44 5 -67 15 -76 28 -23 45 5 45 76 l0 64 64 0 c44 0 67 5 76 15 23 28 -5 45 -76 45 l-64 0 0 63 c0 56 -11 87 -30 87 -3 0 -11 -5 -18 -12z" />
                                </g>
                            </svg>
                        </div>}

                    {
                        imgs.length > 0 ?
                            <div className='div-imgs-iconos'>

                                {
                                    imgs.map((value, key) => {
                                        return <div key={key} className='div-imgs-iconos-add'>
                                            <img className='img-icono' src={"http://" + host + ":3000/img/usuarios/" + (value.usuarios_id ? value.usuarios_id : "") + "/iconos/" + (value.nombre ? value.nombre : "")} />
                                            <div onClick={(e) => { setFocusImgChange({ id: value.id, src: "http://" + host + ":3000/img/usuarios/" + (value.usuarios_id ? value.usuarios_id : "") + "/iconos/" + (value.nombre ? value.nombre : ""), estado: value.estado }); setModalImgChange(true) }} className='div-ver-iconos'>
                                                <h4>Ver</h4>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                            : ""
                    }
                </div>
            } /> : ""}
            {modalImgChange ?
                <GlobalModal statusModal={setModalImgChange} key={"div-img-focus"} class="modal-img" content={
                    <div >
                        <div className='div-img-focus'>
                            <img className='img-focus' src={focusImgChange.src} alt="" />
                            <div onClick={(e) => { loadImg(e, "editar") }} className='div-ver-iconos'>
                                <h4>Cambiar</h4>
                            </div>
                        </div>
                        <div className='div-buttons-img-focus'>
                            {/* <button className='button-cambiar-img-focus'>Cambiar</button> */}
                            {/*  <button onClick={() => { predeterminarImg(focusImgChange.id) }} className='button-predeterminar-img-focus'>{focusImgChange.estado == 0 ? "Predeterminar" : "Quitar"}</button> */}
                            <button onClick={() => { eliminarImg(focusImgChange.id) }} className='button-eliminar-img-focus'>Eliminar</button>
                        </div>
                    </div>
                } />
                : ""}
        </>
    )
}