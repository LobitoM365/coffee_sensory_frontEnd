import React, { useEffect, useState } from 'react'
import { Tablas } from "../componentes/tablas.jsx"
import Api, { host } from '../componentes/Api.jsx'
import { Alert } from '../componentes/alert.jsx'


export const Muestras = () => {
    let [dataFilterTable, setDataFilterTable] = useState({
        "filter": {
            "where": {

            }
        }
    })

    const [buttonsHeaderTable, setButtonsHeaderTable] = useState({
        "buttons": {
            "add": true,
            "reporte": true,
        }
    });

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
            tipo_fermentacion: {
                type: "normal",
                referencia: "Tipo de Fermentación",
                upper_case: true,
            },
            tiempo_fermentacion: {
                type: "normal",
                referencia: "Tiempo de Fermentación",
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
        "nombre_completo": {
            "referencia": "Propietario",
            "upper_case": true
        },
        "finca": {
            "referencia": "Finca",
            "upper_case": true
        },
        "lote": {
            "referencia": "lote",
            "upper_case": true
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
            else if (axios.data.find_error) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "false",
                        description: axios.data.find_error,
                        "tittle": "Verfique antes!",
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

        const response = await Api.post("muestra/buscar/" + id);
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

    async function getReporte(tipo, filter) {
        try {

            let filterReport = {
                "filter": {
                    "where": {

                    },
                    "date": {
                        "mu.fecha_creacion": {
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
                filterReport["filter"]["where"]["mu.estado"] = {
                    "value": filter.estado ? filter.estado : "",
                    "operador": "=",
                    "require": "and"
                }
            }
            const response = await Api.post("muestra/listar", filterReport);
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

    return (
        <>
            <Tablas buttonsHeaderTable={buttonsHeaderTable} getReporte={getReporte} dataDocumento={inputsDocumento} imgForm={"/img/formularios/imgFinca.jpg"} changeModalForm={changeModalForm} modalForm={modalForm} filterSeacth={filterSeacth} updateStatus={updateStatus} editarStatus={setUpdateStatus} editar={editarFinca} elementEdit={fincaEdit} errors={errors} setErrors={setErrors} inputsForm={inputsForm} funcionregistrar={setMuestra} updateTable={updateTable} limitRegisters={limitRegisters} count={countRegisters} data={fincas} keys={keys} cambiarEstado={cambiarEstado} updateEntitie={updateMuestra} tittle={"Muestra"} filterEstado={filterEstado} getFilterEstado={getFilterEstado} getFiltersOrden={getFiltersOrden} />

            <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />
        </>
    )
}