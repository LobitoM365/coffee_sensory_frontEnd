import React, { useEffect, useState } from 'react'
import { Tablas } from "../componentes/tablas.jsx"
import Api from '../componentes/Api.jsx'
import { Alert } from '../componentes/alert.jsx'


export const Lotes = () => {
    let [dataFilterTable, setDataFilterTable] = useState({
        "filter": {
            "where": {

            }
        }
    })
        ;
    const [lotes, setLotes] = useState([])
    const [fincaEdit, setLoteEdit] = useState([])
    const [updateStatus, setUpdateStatus] = useState(false)
    const [municipios, setMunicipios] = useState([])
    const [countRegisters, setCountRegisters] = useState()
    const [errors, setErrors] = useState()
    const [statusAlert, setStatusAlert] = useState(false);
    const [dataAlert, setdataAlert] = useState({});
    const [modalForm, changeModalForm] = useState(false);
    let idLoteCambiarEstado = 0;

    let [inputsForm, setInputsForm] = useState(
        {
            nombre: {
                type: "normal",
                referencia: "Nombre del lote",
                upper_case: true,
            },
            longitud: {
                type: "ubicacion",
                referencia: "Longitud",
            },
            latitud: {
                type: "ubicacion",
                referencia: "Latitud"
            },
            fincas_id: {
                type: "select",
                referencia: "Finca",
                values : ["numero_documento_usuario","nombre_completo_usuario","nombre"],
                upper_case: true,
                key: "id"
            }
        }
    )

    const keys = {
        "lo_id": {
            "referencia": "Id",
        },
        "finca": {
            "referencia": "Finca",
            "upper_case": true
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
            "referencia": "Fecha creación"
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
        getLotes()
        getFincas()
    }, [])

    async function getLotes() {
        try {
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


    async function getFincas() {
        try {
            const response = await Api.post("finca/listar");
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

    return (
        <>
            <Tablas imgForm={"/img/formularios/img-form-state.jpg"} changeModalForm={changeModalForm} modalForm={modalForm} filterSeacth={filterSeacth} updateStatus={updateStatus} editarStatus={setUpdateStatus} editar={editarLote} elementEdit={fincaEdit} errors={errors} setErrors={setErrors} inputsForm={inputsForm} funcionregistrar={setLote} updateTable={updateTable} limitRegisters={limitRegisters} count={countRegisters} data={lotes} keys={keys} cambiarEstado={cambiarEstado} updateEntitie={updateLote} tittle={"Lotes"} filterEstado={filterEstado} getFilterEstado={getFilterEstado} getFiltersOrden={getFiltersOrden} />
            <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />
        </>
    )
}