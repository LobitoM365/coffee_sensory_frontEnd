import React, { useEffect, useState } from 'react'
import { Tablas } from "../componentes/tablas.jsx"
import Api from '../componentes/Api.jsx'
import { Alert } from '../componentes/alert.jsx'


export const Cafes = () => {
    let [dataFilterTable, setDataFilterTable] = useState({
        "filter": {
            "where": {

            }
        }
    })
        ;
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

    let [inputsForm, setInputsForm] = useState(
        {
            lotes_id: {
                type: "select",
                referencia: "Lote",
                upper_case: true,
                values : ["numero_documento_usuario","finca","nombre"],
                key : "id"

            },
            variedades_id: {
                type: "select",
                referencia: "Variedad",
                upper_case: true,
                values : ["nombre"],
                key : "id"
            },
        }
    )

    const keys = {
        "ca_id": {
            "referencia": "Id",
        },
        "lote": {
            "referencia": "Lote",
            "upper_case": true
        },
        "variedad": {
            "referencia": "Variedad"
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
        getFincas()
        getLotes()
        getVariedades()
    }, [])
    async function getLotes() {
        try {
            const response = await Api.post("lotes/listar");
            
            if (response.data.status == true) {
                let cafes = inputsForm;
                if (!cafes["lotes_id"]) {
                    cafes["lotes_id"] = {}
                }
                cafes["lotes_id"]["opciones"] = response.data.data
                console.log('LISTA LOTES: ', response.data.data);

                setInputsForm(cafes)
            } else if (response.data.find_error) {

            } else {

            }
        } catch (e) {
        }
    }
    async function getVariedades() {
        try {
            const response = await Api.post("variedades/listar");
            if (response.data.status == true) {
                let cafes = inputsForm;
                if (!cafes["variedades_id"]) {
                    cafes["variedades_id"] = {}
                }
                cafes["variedades_id"]["opciones"] = response.data.data
                console.log('LISTA VATIEDADES: ',cafes);
                setInputsForm(cafes)
            } else if (response.data.find_error) {

            } else {

            }
        } catch (e) {
        }
    }
    async function getFincas() {
        try {
            const response = await Api.post("cafes/listar", dataFilterTable);
            // console.log('FILTER CAFE: ', dataFilterTable);
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
            } else if(axios.data.permission_error){
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
            tittle = "Activarás las café " + id
            descripcion = "Estás apunto de activar la café, ten encuenta que esta accion no activará las dependencias de la café, pero si permitirá el uso de ellas.";
        } else if (estado == 1 || estado == 3 || estado == 4) {
            tittle = "¿Deseas desactivar la café " + id + " ?";
            descripcion = "Estás apunto de desactivar la café, por favor verifica si realmente quieres hacerlo. Esta acción conlleva a desactivar todos los registros de las  dependencias de esta café."
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
            const axios = await Api.post("cafes/registrar", data);
            console.log('DATA REGISTER CAFE: ', data);
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
            }  else if(axios.data.permission_error){
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
            }else {
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
            const axios = await Api.put("cafes/actualizar/" + id, data);

            console.log('DATA UPDATE FINCA: ', data);

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
            cloneDataFilterTable.filter.where["ca.estado"] = {
                "value": value,
                "require": "and"
            }

        } else {
            delete cloneDataFilterTable.filter.where["ca.estado"]
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

        const response = await Api.get("cafes/buscar/" + id);
        if (response.data.status == true) {
            setfincaEdit(response.data.data[0])
        } else if (response.data.find_error) {

        } else {

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
 
    return (
        <>
            <Tablas imgForm={"/img/formularios/imgFinca.jpg"} changeModalForm={changeModalForm} modalForm={modalForm} filterSeacth={filterSeacth} updateStatus={updateStatus} editarStatus={setUpdateStatus} editar={editarFinca} elementEdit={fincaEdit} errors={errors} setErrors={setErrors} inputsForm={inputsForm} funcionregistrar={setFinca} updateTable={updateTable} limitRegisters={limitRegisters} count={countRegisters} data={fincas} keys={keys} cambiarEstado={cambiarEstado} updateEntitie={updateFinca} tittle={"Café"} filterEstado={filterEstado} getFilterEstado={getFilterEstado} getFiltersOrden={getFiltersOrden} />
            <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />
        </>
    )
}