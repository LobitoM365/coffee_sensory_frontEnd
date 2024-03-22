import React, { useEffect, useRef, useState } from 'react'
import { Tablas } from "../componentes/tablas.jsx"
import Api, { host } from '../componentes/Api.jsx'
import { Alert } from '../componentes/alert.jsx'
import { FormResultados } from '../componentes/FormResultados.jsx'
import { GlobalModal } from '../componentes/globalModal.jsx'
import { GlobalInputs } from '../componentes/globalInputs.jsx'
import ReactDOM from "react-dom/client";

export const Analisis = (userInfo) => {
    if (userInfo.socket) {
        const socket = userInfo.socket;

        socket.on("message", (io) => {
            console.log(io)
        })
        socket.on("asignAnalisis", (io) => {
            getAnalisis()
        })
    }
    ///Variables para abrir modal de resultados
    const [modalFormResults, changeModalFormResults] = useState(false);
    const [keyAsignarAnalisis, setKeyAsignarAnalisis] = useState(0);
    const [dataModalAnalisis, setDataModalAnalisis] = useState(false);
    const [dataModalResultado, setDataModalResultado] = useState(false);
    const [filterPdfLimit, setFilterPdflimit] = useState({ status: false });
    const [dataModalResultadoAnalisis, setDataModalResultadoAnalisis] = useState(false);
    const [statusModalAsignar, setStatusModalAsignar] = useState(false);
    const [analisisAsignar, setAnalisisAsignar] = useState();
    const [valueGlobalInput, setValueGlobalInput] = useState({});
    const [muestrasAsignar, setMuestraAsignar] = useState([]);
    const [muestraIdAsignar, setMuestraIdAsignar] = useState({});
    const asignarFormatoFisico = useRef(null);
    const asignarFormatoSca = useRef(null);
    const [errorsAsignar, setErrorsAsignar] = useState({})
    const [statusUpdateAsignar, setStatusUpdateAsignar] = useState(false)
    const [errorsInputGlobal, setErrorsInputGlobal] = useState({})

    const [buttonsHeaderTable, setButtonsHeaderTable] = useState({
        "buttons": {
            "add": true,
            "asignar": {
                "normal": true,
                "inputs": {
                    "ver": {
                        "type": "button",
                        "referencia": "Asignar",
                        "function": {
                            "value": getAsignarAnalisis,
                        },
                        "class": "button-asignar-analisis"
                    }
                },
                "class": "div-reporte-pdf",
                "upper_case": true
            },
            "reporte": true,
        }

    });



    ///////
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
    const [errorsFormato, setErrorsFormato] = useState()
    const [statusAlert, setStatusAlert] = useState(false);
    const [dataAlert, setdataAlert] = useState({});
    const [modalForm, changeModalForm] = useState(false);
    const [tipoAnalisis, setTipoAnalisis] = useState(null);
    const [idAnalisisResult, setIdAnalisisResult] = useState(null);

    useEffect(() => {
        if (userInfo.userInfo) {
            if (userInfo.userInfo.rol) {
                const cloneButtonsHeaderTable = { ...buttonsHeaderTable }
                if (userInfo.userInfo.rol == "administrador") {
                    delete cloneButtonsHeaderTable["buttons"]["add"]
                    cloneButtonsHeaderTable["buttons"]["asignar"] = {
                        "normal": true,
                        "inputs": {
                            "ver": {
                                "type": "button",
                                "referencia": "Asignar",
                                "function": {
                                    "value": getAsignarAnalisis,
                                    "execute": {
                                        "type": "table",
                                        "value": "an_id"
                                    }
                                },
                                "class": "button-asignar-analisis"
                            }
                        },
                        "class": "div-reporte-pdf",
                        "upper_case": true
                    }
                } else {
                    delete cloneButtonsHeaderTable["buttons"]["asignar"]
                    cloneButtonsHeaderTable["buttons"]["add"] = true
                }
                setButtonsHeaderTable(cloneButtonsHeaderTable)

            }
        }
    }, [userInfo])


    useEffect(() => {
        const cloneInputsForm = { ...inputsForm };

        if (updateStatus == true) {
            cloneInputsForm["proceso"]["visibility"] = true;
        } else {
            cloneInputsForm["proceso"]["visibility"] = false;
        }

        setInputsForm(cloneInputsForm)
    }, [updateStatus])
    let idAnalisis = 0;

    let [inputsForm, setInputsForm] = useState(
        {
            proceso: {
                type: "select",
                referencia: "Tipo de Proceso",
                values: ["nombre"],
                opciones: [{ nombre: "certificar" }, { nombre: "practica" }],
                upper_case: true,
                key: "nombre",
                visibility: false
            }, muestras_id: {
                type: "select",
                referencia: "Muestra",
                values: ["numero_documento", "nombre_completo", "finca", "lote", "mu_id"],
                upper_case: true,
                key: "id"
            },
            usuario_formato_sca: {
                type: "select",
                referencia: "Catador Formato Sca",
                values: ["numero_documento", "nombre"],
                upper_case: true,
                key: "id",
                rol: ["administrador"]
            },
            usuario_formato_fisico: {
                type: "select",
                referencia: "Catador Formato Físico",
                values: ["numero_documento", "nombre"],
                upper_case: true,
                key: "id",
                rol: ["administrador"]
            },

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
                        opciones: [{ nombre: "activo", value: "1" }, { nombre: "inactivo", value: "0" }, { nombre: "pendiente", value: "2" }],
                        upper_case: true,
                        key: "value"
                    },
                },
                referencia: "Filtrar por estado"
            }
        }
    )
    let [inputsFormatoFisico, setInputsFormatoFisico] = useState(
        {
            peso_cps: {
                type: "number",
                referencia: "Peso C.P.S",
                upper_case: true,
            },
            humedad: {
                type: "number",
                referencia: "Humedad",
                upper_case: true,
            },
            peso_cisco: {
                type: "number",
                referencia: "Peso Cisco",
                upper_case: true,
            },
            merma_trilla: {
                type: "number",
                referencia: "Merma por Trilla",
                upper_case: true,
            },
            peso_total_almendra: {
                type: "number",
                referencia: "Peso total de la almendra",
                upper_case: true,
            },
            porcentaje_almendra_sana: {
                type: "number",
                referencia: "Porcentaje de la almendra sana",
                upper_case: true,
            },
            peso_defectos_totales: {
                type: "number",
                referencia: "Peso Defectos Totales",
                upper_case: true,
            },
            factor_rendimiento: {
                type: "number",
                referencia: "Factor de rendimiento",
                upper_case: true,
            },
            peso_almendra_sana: {
                type: "number",
                referencia: "Peso de la Almendra Sana",
                upper_case: true,
            },
            porcentaje_defectos_totales: {
                type: "number",
                referencia: "Porcentaje de Defectos Totales",
                upper_case: true,
            },
            negro_total: {
                type: "number",
                referencia: "Negro Total o Parcial",
                upper_case: true,
            },
            cardenillo: {
                type: "number",
                referencia: "Cardenillo",
                upper_case: true,
            },
            vinagre: {
                type: "number",
                referencia: "Vinagre",
                upper_case: true,
            },
            cristalizado: {
                type: "number",
                referencia: "Cristalizado",
                upper_case: true,
            },
            veteado: {
                type: "number",
                referencia: "Veteado",
                upper_case: true,
            },
            ambar: {
                type: "number",
                referencia: "Ámbar o Mantequillo",
                upper_case: true,
            },
            sobresecado: {
                type: "number",
                referencia: "Sobresecado",
                upper_case: true,
            },
            mordido: {
                type: "number",
                referencia: "Mordido",
                upper_case: true,
            },
            picado_insectos: {
                type: "number",
                referencia: "Picado Por Insectos",
                upper_case: true,
            },
            averanado: {
                type: "number",
                referencia: "Averanado o Arrugado",
                upper_case: true,
            },
            inmaduro: {
                type: "number",
                referencia: "Inmaduro o Paloteado",
                upper_case: true,
            },
            aplastado: {
                type: "number",
                referencia: "Aplastado",
                upper_case: true,
            },
            flojo: {
                type: "number",
                referencia: "Flojo",
                upper_case: true,
            },
            decolorado: {
                type: "number",
                referencia: "Decolorado",
                upper_case: true,
            },
            malla18: {
                type: "number",
                referencia: "Malla 18",
                upper_case: true,
            },
            malla15: {
                type: "number",
                referencia: "Malla 15",
                upper_case: true,
            },
            malla17: {
                type: "number",
                referencia: "Malla17",
                upper_case: true,
            },
            malla14: {
                type: "number",
                referencia: "Malla 14",
                upper_case: true,
            },
            malla16: {
                type: "number",
                referencia: "Malla16",
                upper_case: true,
            },
            mallas_menores: {
                type: "number",
                referencia: "Mallas Menores",
                upper_case: true,
            }

        }
    )
    let [selectAsignar, setSelectAsignar] = useState(
        {
            usuarios_id: {
                type: "select",
                values: ["numero_documento", "nombre"],
                upper_case: true,
                key: "id"
            }
        }
    )

    const keys = {
        "an_id": {
            "referencia": "Id",
            "priority": 1
        },
        "calidad": {
            "referencia": "Calidad",
        },
        "proceso": {
            "referencia": "Tipo de proceso",
            "upper_case": true
        },
        "muestras_id": {
            "referencia": "Muestra",
            "upper_case": true
        },
        "variedad": {
            "referencia": "Variedad",
            "upper_case": true
        },
        "finca": {
            "referencia": "Finca",
            "upper_case": true,
        },
        "lote": {
            "referencia": "Lote",
            "upper_case": true
        }/* ,
        "permission_formato_sca": {
            "referencia": "Catador Formato Sca",
            "conditions": {
                "true": {
                    "element": {
                        "type": "button",
                        "referencia": "Ver",
                        "function": {
                            "value": xd,
                            "execute": {
                                "type": "table",
                                "value": "an_id"
                            }
                        }
                    }
                },
                "false": {
                    "element": {
                        "type": "text",
                        "referencia": "No disponible",
                        "class": "button-false-procedure"
                    }
                }
            },
            "upper_case": true
        },
        "permission_formato_fisico": {
            "referencia": "Catador Formato Físico",
            "conditions": {
                "true": {
                    "element": {
                        "type": "button",
                        "referencia": "Ver",
                        "function": {
                            "value": xd2,
                            "execute": {
                                "type": "table",
                                "value": "an_id"
                            }
                        }
                    }
                },
                "false": {
                    "element": {
                        "type": "text",
                        "referencia": "No disponible",
                        "class": "button-false-procedure"
                    }
                }
            },
            "upper_case": true
        } */,
        "fecha_creacion": {
            "referencia": "Fecha de creación",
            "format": true
        },
        "encargados": {
            "referencia": "Encargados",
            "normal": true,
            "inputs": {
                "ver": {
                    "type": "button",
                    "referencia": "Ver",
                    "function": {
                        "value": getEncargadosAnalisisUpdate,
                        "execute": {
                            "type": "table",
                            "value": "an_id"
                        }
                    },
                    "class": "icon-ver-encargados",
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
        },
        "reporte": {
            "normal": true,
            "referencia": "Reporte",
            "inputs": {
                /* "reporte": {
                    "type": "button",
                    "referencia": "PDF",
                    "class": "button-table-pdf",
                    "function": {
                        "value": xd,
                        "execute": {
                            "type": "table",
                            "value": "an_id"
                        }
                    }
                }, */
                "pdf": {
                    "type": "free",
                    "element": "icon-pdf",
                    "redirect-value": {
                        "type": "new-window",
                        "value": "/dashboard/generateReporteAnalisis",
                        "execute": {
                            "type": "table",
                            "value": "an_id"
                        }
                    },
                    "class": "div-icon-reporte-pdf",
                }
            },
            "class": "div-reporte-pdf",
            "upper_case": true,
            "priority": 2
        }
    }


    const keysUsuarios = {
        "us_id": {
            "referencia": "Id",
            "priority": 1,
        },
        "nombre": {
            "referencia": "Nombre",
            "upper_case": true,
            "priority": 4,
        },
        "apellido": {
            "referencia": "Apelido",
            "upper_case": true,
            "priority": 5,
        },
        "numero_documento": {
            "referencia": "Numero de documento",
            "upper_case": true,
            "priority": 6,
        },
        "rol": {
            "referencia": "Rol",
            "upper_case": true,
            "priority": 7,
        },
        "cargo": {
            "referencia": "Cargo",
            "upper_case": true,
            "priority": 8,
        },
        "estado": {
            "referencia": "Estado",
            "priority": 9,
        },
        "formato_fisico": {
            "referencia": "Formato Sca",
            "normal": true,
            "inputs": {
                "ver": {
                    "type": "button",
                    "referencia": "Agregar",
                    "function": {
                        "value": agregarFormatoSca,
                        "execute": {
                            "type": "all-table"
                        }
                    },
                    "data-element": {
                        "value": {
                            "type": "table",
                            "value": "us_id"
                        }
                    }
                }
            },
            "upper_case": true,
            "priority": 2
        },
        "formato_sca": {
            "referencia": "Formato Físico",
            "normal": true,
            "inputs": {
                "ver": {
                    "type": "button",
                    "referencia": "Agregar",
                    "function": {
                        "value": agregarFormatoFisico,
                        "execute": {
                            "type": "all-table"
                        }
                    },
                    "data-element": {
                        "value": {
                            "type": "table",
                            "value": "us_id"
                        }
                    }
                }
            },
            "upper_case": true,
            "priority": 1
        }
    }
    const [usuariosAsignar, setUsuariosAsignar] = useState([])
    const [countRegistersAsignar, setCountRegistersAsignar] = useState(0)
    const [usersAddAsignar, setUsersAddAsignar] = useState({});
    const [usersAsignarFormatoFisico, setUsersAsignarFormatoFisico] = useState({});
    const [usersAsignarFormatoSca, setUsersAsignarFormatoSca] = useState({});
    let [deleteAsignarFormatoSca, setDeleteAsignarFormatoSca] = useState({});

    async function agregarFormatoFisico(data, e) {
        if (!usersAsignarFormatoFisico[data.id]) {
            let cloneUsersAsignarFormatoFisico = { ...usersAsignarFormatoFisico }
            cloneUsersAsignarFormatoFisico[data.id] = {
                "cantidad": 1
            }
            setUsersAsignarFormatoFisico(cloneUsersAsignarFormatoFisico)
            if (asignarFormatoFisico.current != null) {
                e.target.innerHTML = "Agregado"
                e.target.classList.add("button-asing-agregado")
                let tr = document.createElement("tr");
                tr.setAttribute("id", "fisico_" + data.id)
                tr.innerHTML = "<td> <div><svg class='svg-icon-quit-table-asing' version='1.0' viewBox='0 0 512.000000 512.000000'><g transform='translate(0.000000,512.000000) scale(0.100000,-0.100000)'  stroke='none'> <path d='M2235 5105 c-471 -62 -895 -241 -1280 -543 -91 -71 -326 -307 -398 -399 -305 -386 -489 -833 -546 -1318 -14 -114 -14 -454 -1 -565 51 -430 185 -795 422 -1150 313 -467 780 -823 1311 -1001 142 -47 240 -72 402 -100 173 -31 541 -38 726 -14 579 72 1085 320 1500 734 420 421 677 954 739 1533 15 144 12 455 -5 598 -73 585 -342 1118 -777 1535 -399 384 -901 621 -1458 691 -141 17 -496 17 -635 -1z m-401 -1547 c35 -10 95 -65 384 -352 l342 -340 343 340 c355 354 368 364 448 364 111 0 219 -108 219 -219 0 -80 -10 -93 -364 -448 l-340 -343 340 -343 c354 -355 364 -368 364 -448 0 -111 -108 -219 -219 -219 -80 0 -93 10 -448 364 l-343 340 -342 -340 c-356 -354 -369 -364 -449 -364 -111 0 -219 108 -219 219 0 80 10 93 364 449 l340 342 -340 343 c-354 355 -364 368 -364 448 0 108 107 217 214 219 16 0 47 -5 70 -12z'/></g></svg></div></td> <td><div> <h4>" + (data.id + ", " + data.numero_documento + ", " + data.nombre_completo).toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) + "</h4> <div> </td> <td><div><input value='1' class='input-cantidad-formatos' type='text' /><div> </td> ";
                asignarFormatoFisico.current.append(tr)
                tr.querySelector("input").addEventListener("input", function (e) {
                    e.target.value = e.target.value.replace(/\D/g, '')
                    if (e.target.value == "") {

                    } else if (e.target.value > 10) {
                        e.target.value = 10
                    } else if (e.target.value < 0) {
                        e.target.value = 1
                    }
                    setUsersAsignarFormatoFisico(prevState => {
                        let cloneUsersAsignarFormatoFisico = { ...prevState }
                        if (cloneUsersAsignarFormatoFisico[data.id]) {
                            cloneUsersAsignarFormatoFisico[data.id]["cantidad"] = e.target.value
                        }
                        return cloneUsersAsignarFormatoFisico;
                    });
                })
                tr.querySelector("svg").addEventListener("click", function () {
                    if (tr.nextSibling) {
                        if (tr.nextSibling.classList.contains("tr-error-table-asignar")) {
                            tr.nextSibling.remove()
                        }
                    }
                    /*  usersAsignarFormatoFisico = usersAsignarFormatoFisico.filter(item => item !== data.id); */
                    setUsersAsignarFormatoFisico(prevState => {
                        let cloneUsersAsignarFormatoFisico = { ...prevState };
                        if (cloneUsersAsignarFormatoFisico[data.id]) {
                            delete cloneUsersAsignarFormatoFisico[data.id];
                        }
                        return cloneUsersAsignarFormatoFisico;
                    });


                    e.target.innerHTML = "Agregar"
                    e.target.classList.remove("button-asing-agregado")
                    tr.remove()
                })
            }
        }

    }
    async function agregarFormatoSca(data, e) {
        if (!usersAsignarFormatoSca[data.id]) {
            /* usersAsignarFormatoSca.push(data.id) */
            let cloneUsersAsignarFormatoSca = { ...usersAsignarFormatoSca }
            cloneUsersAsignarFormatoSca[data.id] = {
                "cantidad": 1
            }
            setUsersAsignarFormatoSca(cloneUsersAsignarFormatoSca)

            if (asignarFormatoSca.current != null) {
                e.target.innerHTML = "Agregado"
                e.target.classList.add("button-asing-agregado")
                let tr = document.createElement("tr");
                tr.setAttribute("id", "sca_" + data.id)
                tr.innerHTML = "<td> <div><svg class='svg-icon-quit-table-asing' version='1.0' viewBox='0 0 512.000000 512.000000'><g transform='translate(0.000000,512.000000) scale(0.100000,-0.100000)'  stroke='none'> <path d='M2235 5105 c-471 -62 -895 -241 -1280 -543 -91 -71 -326 -307 -398 -399 -305 -386 -489 -833 -546 -1318 -14 -114 -14 -454 -1 -565 51 -430 185 -795 422 -1150 313 -467 780 -823 1311 -1001 142 -47 240 -72 402 -100 173 -31 541 -38 726 -14 579 72 1085 320 1500 734 420 421 677 954 739 1533 15 144 12 455 -5 598 -73 585 -342 1118 -777 1535 -399 384 -901 621 -1458 691 -141 17 -496 17 -635 -1z m-401 -1547 c35 -10 95 -65 384 -352 l342 -340 343 340 c355 354 368 364 448 364 111 0 219 -108 219 -219 0 -80 -10 -93 -364 -448 l-340 -343 340 -343 c354 -355 364 -368 364 -448 0 -111 -108 -219 -219 -219 -80 0 -93 10 -448 364 l-343 340 -342 -340 c-356 -354 -369 -364 -449 -364 -111 0 -219 108 -219 219 0 80 10 93 364 449 l340 342 -340 343 c-354 355 -364 368 -364 448 0 108 107 217 214 219 16 0 47 -5 70 -12z'/></g></svg></div></td> <td><div> <h4>" + (data.id + ", " + data.numero_documento + ", " + data.nombre_completo).toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) + "</h4> <div> </td> <td><div><input value='1' class='input-cantidad-formatos' type='text' /><div> </td> ";
                asignarFormatoSca.current.append(tr)
                tr.querySelector("input").addEventListener("input", function (e) {
                    e.target.value = e.target.value.replace(/\D/g, '')
                    if (e.target.value == "") {

                    } else if (e.target.value > 10) {
                        e.target.value = 10
                    } else if (e.target.value < 0) {
                        e.target.value = 1
                    }
                    /*   if (usersAsignarFormatoSca[data.id]) {
                          usersAsignarFormatoSca[data.id]["cantidad"] = e.target.value
                      } */
                    setUsersAsignarFormatoSca(prevState => {
                        let cloneUsersAsignarFormatoSca = { ...prevState }
                        if (cloneUsersAsignarFormatoSca[data.id]) {
                            cloneUsersAsignarFormatoSca[data.id]["cantidad"] = e.target.value
                        }
                        return cloneUsersAsignarFormatoSca;
                    });
                })
                tr.querySelector("svg").addEventListener("click", function () {

                    if (tr.nextSibling) {
                        if (tr.nextSibling.classList.contains("tr-error-table-asignar")) {
                            tr.nextSibling.remove()
                        }
                    }
                    setUsersAsignarFormatoSca(prevState => {
                        let cloneUsersAsignarFormatoSca = { ...prevState }
                        if (cloneUsersAsignarFormatoSca[data.id]) {
                            delete cloneUsersAsignarFormatoSca[data.id]
                        }
                        return cloneUsersAsignarFormatoSca;
                    });
                    e.target.innerHTML = "Agregar"
                    e.target.classList.remove("button-asing-agregado")
                    tr.remove()
                })
            }
        }
    }

    let [dataFilterTableAsignar, setDataFilterTableAsignar] = useState({
        "filter": {
            "where": {
                "us.rol": {
                    "value": "catador",
                    "require": "and"
                },
                "us.cargo": {
                    "value": "instructor",
                    "require": "and"
                },
                "us.estado": {
                    "value": 1,
                    "require": "and"
                }
            }
        }
    })
    async function getusuariosAsignar() {
        try {
            const response = await Api.post("usuarios/listar", dataFilterTableAsignar);
            if (response.data.status == true) {
                setUsuariosAsignar(response.data.data)
                setCountRegistersAsignar(response.data.count)
            } else if (response.data.find_error) {
                setCountRegistersAsignar(0)
                setUsuariosAsignar(response.data)
            } else {
                setUsuariosAsignar(response.data)
            }
        } catch (e) {

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
        getusuariosAsignar()
    }, [])
    useEffect(() => {
        getusuarios()
        getMuestras()
    }, [userInfo])

    async function xd(id) {
        setInfoFormato(id, 2)
    }
    function xd2(id) {
        setInfoFormato(id, 1)
    }


    const [infoAnalisisUpdateAsignar, setInfoAnalisisUpdateAsignar] = useState([])
    const [infoFormatoFisicoUpdateAsignar, setInfoFormatoFisicoUpdateAsignar] = useState([])
    const [infoFormatoScaUpdateAsignar, setInfoFormatoScaUpdateAsignar] = useState([])
    async function getAsignarAnalisis(id) {
        setMuestraIdAsignar({})
        setUsersAsignarFormatoFisico({})
        setErrorsAsignar({})
        setUsersAsignarFormatoSca({})
        setAnalisisAsignar()
        setInfoAnalisisUpdateAsignar([])
        setInfoFormatoFisicoUpdateAsignar([])
        setInfoFormatoScaUpdateAsignar([])
        setStatusUpdateAsignar(false)
        setStatusModalAsignar(true)
    }
    async function getEncargadosAnalisisUpdate(id) {
        setMuestraIdAsignar({})
        setErrorsAsignar({})
        setUsersAsignarFormatoFisico({})
        setUsersAsignarFormatoSca({})
        setInfoAnalisisUpdateAsignar([])
        setInfoFormatoFisicoUpdateAsignar([])
        setInfoFormatoScaUpdateAsignar([])
        setStatusUpdateAsignar(true)
        const response = await Api.post("analisis/buscar/" + id + "");
        if (response.data.status == true) {
            setKeyAsignarAnalisis(keyAsignarAnalisis + 1)

            setInfoAnalisisUpdateAsignar(response.data.data)
            const filterFormato = {
                "filter": {
                    "where": {
                        "an.id": {
                            "value": id,
                            "require": "and",
                        },
                        "forma.tipos_analisis_id": {
                            "value": 1,
                            "require": "and",
                        }
                    }
                }
            }
            const formatoFisico = await Api.post("formatos/listar", filterFormato);
            if (formatoFisico.data.status == true) {
                setInfoFormatoFisicoUpdateAsignar(formatoFisico.data.data)
            }
            filterFormato.filter.where["forma.tipos_analisis_id"].value = 2;
            const formatoSca = await Api.post("formatos/listar", filterFormato);
            if (formatoSca.data.status == true) {
                setInfoFormatoScaUpdateAsignar(formatoSca.data.data)
            }
            setAnalisisAsignar(id)
            setStatusModalAsignar(true)
        } else if (response.data.find_error) {
            setStatusAlert(true)
            setdataAlert(
                {
                    status: "false",
                    description: response.data.find_error,
                    "tittle": "Inténtalo de nuevo",
                }
            )
        } else {
            setStatusAlert(true)
            setdataAlert(
                {
                    status: "false",
                    description: response.data.modal_error,
                    "tittle": "Inténtalo de nuevo",
                }
            )
        }

    }
    async function setInfoFormato(id, tipo) {
        try {
            setTipoAnalisis(tipo)
            setIdAnalisisResult(id)
            let asignar = selectAsignar;
            asignar["usuarios_id"]["referencia"] = "Catador para el Formato " + (tipo == 2 ? "SCA" : "Físico")

            setDataModalAnalisis([])
            setDataModalResultado([])
            setDataModalResultadoAnalisis([])
            const response = await Api.post("analisis/buscar/" + id + "");

            if (response.data.status == true) {
                setDataModalAnalisis(response.data.data)
                const filterFormato = {
                    "filter": {
                        "where": {
                            "forma.analisis_id": {
                                "value": id,
                                "require": "and",
                                "group": 2
                            },
                            "forma.tipos_analisis_id": {
                                "value": tipo,
                                "require": "and",
                                "group": 2
                            }
                        }
                    },
                }
                const formato = await Api.post("formatos/buscar/not", filterFormato);
                if (formato.data.status == true) {
                    setDataModalResultado(formato.data.data)
                    const resultado = await Api.post("resultado/buscar/" + formato.data.data[0].id + "");
                    if (resultado.data.status == true) {
                        setDataModalResultadoAnalisis(resultado.data.data)
                    } else {
                    }
                } else if (formato.data.find_error) {
                } else {
                }
                changeModalFormResults(true)

            } else if (response.data.find_error) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "false",
                        description: response.data.find_error,
                        "tittle": "Inténtalo de nuevo",
                    }
                )
            } else {
            }
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        getMuestrasAsignar()
        setTimeout(() => {
            async function openAsing() {
                if (localStorage.getItem("analisis_id") && localStorage.getItem("tipos_analisis_id")) {
                    await setInfoFormato(localStorage.getItem("analisis_id"), localStorage.getItem("tipos_analisis_id"))
                    localStorage.removeItem("analisis_id")
                    localStorage.removeItem("tipos_analisis_id")
                }
            }
            openAsing()
        }, 200);
    }, [])
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
                    let asignar = selectAsignar;
                    if (!cafes["usuario_formato_sca"]) {
                        cafes["usuario_formato_sca"] = {}
                    }
                    cafes["usuario_formato_sca"]["opciones"] = response.data.data ? response.data.data : [];

                    if (!cafes["usuario_formato_fisico"]) {
                        cafes["usuario_formato_fisico"] = {}
                    }
                    cafes["usuario_formato_fisico"]["opciones"] = response.data.data ? response.data.data : [];

                    asignar["usuarios_id"]["opciones"] = response.data.data ? response.data.data : []
                    setInputsForm(cafes)
                    setSelectAsignar(asignar)

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
            const response = await Api.post("muestra/listar", filter);

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
            const axios = await Api.delete("analisis/eliminar/" + idAnalisis);
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
            } else if (axios.data.find_error) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "false",
                        description: axios.data.find_error,
                        "tittle": '¡Verfiquie antes!'
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
        idAnalisis = id;
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

            const axios = await Api.post("analisis/registrar/", data);
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
            const axios = await Api.put("analisis/actualizar/" + id, data);
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
            cloneDataFilterTable.filter.where["an.estado"] = {
                "value": value,
                "require": "and"
            }

        } else {
            delete cloneDataFilterTable.filter.where["an.estado"]
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
        if (inputsForm["usuario_formato_sca"]) {
            inputsForm["usuario_formato_sca"]["visibility"] = true
            inputsForm["usuario_formato_fisico"]["visibility"] = true
        }

    }
    async function buscarUsuario(id) {
        inputsForm["usuario_formato_sca"]["visibility"] = false
        inputsForm["usuario_formato_fisico"]["visibility"] = false

        const response = await Api.post("analisis/buscar/" + id);
        try {

            if (response.data.status == true) {
                setUsuarioEdit(response.data.data[0])
            } else if (response.data.find_error) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "false",
                        description: response.data.find_error,
                        "tittle": "Inténtalo de nuevo",
                        continue: {

                        }
                    }
                )
            }
        } catch (error) {
            setStatusAlert(true)
            setdataAlert(
                {
                    status: "false",
                    description: 'Error interno del servidor',
                    "tittle": "Ocurrión un error!",
                }
            )
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
    async function setAnalisisFormato(data, id, tipoRegistro, tipoAnalisis, idAnalisis) {
        let route = "";
        let method = "post";
        data["tipos_analisis_id"] = tipoAnalisis ? tipoAnalisis : ""
        data["formatos_id"] = id ? id : ""

        if (tipoRegistro == 1) {
            route = "resultado/registrar/"
            data["xd"] = "xd";
        } else {
            method = "put"
            route = "resultado/actualizar/" + id
        }
        const axios = await Api[method](route, data);
        if (axios.data.status == true) {
            setInfoFormato(idAnalisisResult, tipoAnalisis)
            setStatusAlert(true)
            setdataAlert(
                {
                    status: "true",
                    description: axios.data.message,
                    "tittle": "Excelente",
                }
            )
        } else if (axios.data.errors) {
            setErrorsFormato(axios.data.errors)
        } else if (axios.data.register_error) {
            setStatusAlert(true)
            setdataAlert(
                {
                    status: "false",
                    description: axios.data.register_error,
                    "tittle": "Inténtalo de nuevo",
                    continue: {

                    }
                }
            )
        }
    }

    async function asignarFormato(idAnalisis, tipo, usuario) {
        try {
            const data = {
                "analisis_id": idAnalisis,
                "tipos_analisis_id": tipo,
                "usuarios_id": usuario
            }
            const response = await Api.post("formatos/registrar", data);
            if (response.data.status == true) {
                setInfoFormato(idAnalisis, tipoAnalisis)
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "true",
                        description: response.data.message,
                        "tittle": "Excelente",
                    }
                )
            } else if (response.data.register_error) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "false",
                        description: response.data.register_error,
                        "tittle": "Inténtalo de nuevo",
                        continue: {

                        }
                    }
                )
            } else if (response.data.errors) {
                setErrorsFormato(response.data.errors)
            }
        } catch (e) {
            console.log(e)
        }
    }
    async function actualizarFormato(idAnalisis, idFormato, tipo, usuario) {
        try {
            const data = {
                "tipos_analisis_id": tipo,
                "usuarios_id": usuario
            }
            const response = await Api.put("formatos/actualizar/" + idFormato, data);
            if (response.data.status == true) {
                setInfoFormato(idAnalisis, tipoAnalisis)
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "true",
                        description: response.data.message,
                        "tittle": "Excelente",
                    }
                )
            } else if (response.data.register_error) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "false",
                        description: response.data.register_error,
                        "tittle": "Inténtalo de nuevo",
                        continue: {

                        }
                    }
                )
            } else if (response.data.errors) {
                setErrorsFormato(response.data.errors)
            }
        } catch (e) {
            console.log(e)
        }
    }

    async function getReporte(tipo, filter) {
        try {

            let filterReport = {
                "filter": {
                    "where": {

                    },
                    "date": {
                        "an.fecha_creacion": {
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
                filterReport["filter"]["where"]["an.estado"] = {
                    "value": filter.estado ? filter.estado : "",
                    "operador": "=",
                    "require": "and"
                }
            }
            const response = await Api.post("analisis/listar", filterReport);
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

    /*     async function generatePdf() {
            try {
                const response = await Api.get('generatePdf');
                const pdfContent = response.data;
        
                // Convertir el contenido del PDF en un blob
                const pdfBlob = new Blob([pdfContent], { type: 'application/pdf' });
        
                // Crear una URL de objeto a partir del blob
                const blobUrl = URL.createObjectURL(pdfBlob);
        
                // Abrir el PDF en una nueva pestaña del navegador
                window.open(blobUrl, '_blank');
            } catch (error) {
                console.error('Error:', error);
            }
        } */
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
                    description: "Error interno del servidor: " + error,
                    "tittle": "Inténtalo de nuevo"
                }
            )
        }
    }
    async function getMuestrasAsignar() {
        try {
            const filterMuestra = {
                "filter": {
                    "where": {
                        "us.rol": {
                            "value": "cafetero",
                            "require": "and"
                        },
                        "us.cargo": {
                            "value": "cliente",
                            "require": "and"
                        },
                        "mu.estado": {
                            "value": 1,
                            "require": "and"
                        }
                    }
                }
            }
            const response = await Api.post("muestra/listar", filterMuestra);
            if (response.data.status == true) {
                setMuestraAsignar(response.data.data)
            }
        } catch (e) {
            console.log("Error: " + e)
        }
    }

    function setModalAsignarFalse() {
        setStatusModalAsignar(false)
    }
    async function setAsignarAnalisis() {
        try {

            const trError = document.querySelectorAll(".tr-error-table-asignar")
            for (let x = 0; x < trError.length; x++) {
                if (trError[x].previousSibling) {
                    trError[x].previousSibling.style.background = ""
                }
                trError[x].remove()
            }
            let data = {

                "formato_fisico": usersAsignarFormatoFisico,
                "formato_sca": usersAsignarFormatoSca,
            }
            let route = ""
            if (statusUpdateAsignar) {
                data["analisis_id"] = analisisAsignar
                route = "/nuevo"
            } else {
                data["muestras_id"] = muestraIdAsignar["muestras_id"]
            }
            setErrorsAsignar({})

            const response = await Api.post("analisis/asignar" + route, data)
            console.log(route, "routeeeeeeeee", response)

            if (response.data.status == true) {
                if (statusUpdateAsignar) {
                    getEncargadosAnalisisUpdate(analisisAsignar)
                } else {
                    getAnalisis()
                }
                let widthErrors = []
                if (response.data.width_errors) {
                    let keysWidthErrors = Object.keys(response.data.width_errors)
                    for (let x = 0; x < keysWidthErrors.length; x++) {
                        widthErrors.push(
                            <div className='span-width-errors' key={x}>
                                <h3>
                                    {keysWidthErrors[x]}:
                                </h3>
                                <h4>
                                    {response.data.width_errors[keysWidthErrors[x]]}
                                </h4>
                            </div>
                        );
                    }
                }

                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "true",
                        description: <span > <h4 className='span-message-alerta'>{response.data.message}</h4>  <br /> {widthErrors}</span>,
                        "tittle": "Excelente",
                        continue: {
                            "function": !statusUpdateAsignar ? setModalAsignarFalse : "",
                        }
                    }
                )

            } else if (response.data.register_error) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "false",
                        description: response.data.register_error,
                        "tittle": "Inténtalo de nuevo"
                    }
                )
            } else if (response.data.errors) {
                const keysErrors = Object.keys(response.data.errors)
                for (let x = 0; x < keysErrors.length; x++) {
                    const element = document.getElementById(keysErrors[x])
                    if (element) {
                        element.style.background = "#ff00001f"
                        let trError = document.createElement("tr")
                        trError.classList.add("tr-error-table-asignar")
                        let tdError = document.createElement("td")
                        tdError.innerHTML = "<h4>" + response.data.errors[keysErrors[x]] + " </h4>"
                        tdError.setAttribute("colspan", "9999")
                        trError.appendChild(tdError)
                        element.parentNode.insertBefore(trError, element.nextSibling)
                    }
                }
                setErrorsAsignar(response.data.errors)
            }
            console.log(response, "resssssssss")
        } catch (e) {
            console.log("Error: " + e)
        }
    }
    async function cambiarFormato(id, usuario, name) {
        setErrorsInputGlobal()
        try {

            const data = {
                "usuarios_id": usuario
            }
            const response = await Api.put("formatos/actualizar/" + id, data)
            if (response.data.status == true) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "true",
                        description: response.data.message,
                        "tittle": "Excelente"
                    }
                )
                getEncargadosAnalisisUpdate(analisisAsignar)
            } else if (response.data.errors) {
                const keys = Object.keys(response.data.errors)
                let cloneSetErrrosInputGlobal = { ...errorsInputGlobal }
                cloneSetErrrosInputGlobal[name] = response.data.errors[keys[0]]
                setErrorsInputGlobal(cloneSetErrrosInputGlobal)
            } else if (response.data.update_error) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "false",
                        description: response.data.update_error,
                        "tittle": "Excelente"
                    }
                )
            }
        } catch (e) {
            console.log("Error: " + e)
        }
    }
    async function editarAnalisis(id, muestra) {
        try {
            const data = {
                "muestras_id": muestra
            }
            const response = await Api.put("analisis/actualizar/" + id, data)
            if (response.data.status == true) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "true",
                        description: response.data.message,
                        "tittle": "Excelente"
                    }
                )
                getEncargadosAnalisisUpdate(id)
            } else if (response.data.errors) {
                const keys = Object.keys(response.data.errors)
                setErrorsAsignar(response.data.errors)
            } else if (response.data.update_error) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "false",
                        description: response.data.update_error,
                        "tittle": "Excelente"
                    }
                )
            }
        } catch (e) {
            console.log("Error: " + e)
        }
    }
    async function getNewView() {
        getEncargadosAnalisisUpdate(analisisAsignar)
    }
    async function eliminarFormato(id) {
        try {
            const response = await Api.delete("formatos/eliminar/" + id)
            if (response.data.status == true) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "true",
                        description: response.data.message,
                        "tittle": "Excelente",
                        continue: {
                            "function": statusUpdateAsignar ? getNewView : "",
                        }
                    }
                )
            } else if (response.data.delete_error) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "false",
                        description: response.data.delete_error,
                        "tittle": "Excelente"
                    }
                )
            } else if (response.data.modal_error) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "false",
                        description: response.data.modal_error,
                        "tittle": "Excelente"
                    }
                )
            } else {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "false",
                        description: response.data.message,
                        "tittle": "Excelente"
                    }
                )
            }
            console.log(response)
        } catch (e) {
            console.log("Error: " + e)
        }
    }
    return (
        <>
            <link rel="stylesheet" href="../../public/css/analisis.css" />

            <Tablas buttonsHeaderTable={buttonsHeaderTable} userInfo={userInfo.userInfo} generatePdf={generatePdf} filterPdfLimit={filterPdfLimit} setFilterPdflimit={setFilterPdflimit} getReporte={getReporte} dataDocumento={inputsDocumento} clearInputs={clearInputs} imgForm={"/img/formularios/registroUsuario.jpg"} changeModalForm={changeModalForm} modalForm={modalForm} filterSeacth={filterSeacth} updateStatus={updateStatus} editarStatus={setUpdateStatus} editar={editarUsuario} elementEdit={usuarioEdit} errors={errors} setErrors={setErrors} inputsForm={inputsForm} funcionregistrar={setUsuario} updateTable={updateTable} limitRegisters={limitRegisters} count={countRegisters} data={usuarios} keys={keys} cambiarEstado={cambiarEstado} updateEntitie={updateUsuario} tittle={"Análisis"} filterEstado={filterEstado} getFilterEstado={getFilterEstado} getFiltersOrden={getFiltersOrden} />

            <FormResultados inputsFormatoFisico={inputsFormatoFisico} actualizarFormato={actualizarFormato} setErrorsFormato={setErrorsFormato} errorsFormato={errorsFormato} tipoAnalisis={tipoAnalisis} asignarFormato={asignarFormato} userInfo={userInfo} inputsForm={selectAsignar} setAnalisisFormato={setAnalisisFormato} dataModalResultadoAnalisis={dataModalResultadoAnalisis} dataModalResultado={dataModalResultado} dataModalAnalisis={dataModalAnalisis} changeModalFormResults={changeModalFormResults} modalFormResults={modalFormResults} />
            <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />

            {userInfo.userInfo ?
                userInfo.userInfo.rol ?
                    userInfo.userInfo.rol == "administrador" ?
                        statusModalAsignar ? (
                            <GlobalModal statusModal={setStatusModalAsignar} key={"icons-img"} class="modal-table" content={
                                <div key={keyAsignarAnalisis} className='div-content-asignar'>
                                    <div className='head-asignar-analisis'>
                                        <h2>Asignar análisis</h2>
                                        {
                                            statusUpdateAsignar ?
                                                infoAnalisisUpdateAsignar.length > 0 ?
                                                    infoAnalisisUpdateAsignar[0].permission_update != 'false' ?
                                                        <div>
                                                            <GlobalInputs
                                                                input={setMuestraIdAsignar}
                                                                value={muestraIdAsignar}
                                                                class={"input-global"}
                                                                errors={errorsAsignar}
                                                                elementEdit={infoAnalisisUpdateAsignar.length > 0 ? infoAnalisisUpdateAsignar[0].mu_id : ""}
                                                                data={{
                                                                    muestras_id: {
                                                                        type: "select",
                                                                        referencia: "Muestra",
                                                                        values: ["id", "numero_documento", "nombre_completo", "finca", "lote"],
                                                                        opciones: muestrasAsignar,
                                                                        upper_case: true,
                                                                        key: "id",
                                                                    },
                                                                }} />
                                                            <button onClick={() => { editarAnalisis(analisisAsignar, muestraIdAsignar["muestras_id"]) }} className='button-users-formatos button-users-formatos-cambiar'>Cambiar</button>
                                                        </div>
                                                        :
                                                        <div>
                                                            <div className='div-anaisis-finalizado-asignar-formato'>
                                                                <div>
                                                                    <h4>Muestra:</h4>
                                                                    <h5>{(infoAnalisisUpdateAsignar[0].mu_id + ", " + infoAnalisisUpdateAsignar[0].documento_propietario + ", " + infoAnalisisUpdateAsignar[0].nombre_propietario + ", " + infoAnalisisUpdateAsignar[0].finca + ", " + infoAnalisisUpdateAsignar[0].lote).toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase())}</h5>
                                                                </div>
                                                                <div>
                                                                    <h4>Estado: </h4>
                                                                    {
                                                                        infoAnalisisUpdateAsignar[0].estado == 4 ? <h4 className='h4-estado-formato-asing h4-estado-formato-asing-finalizado'>
                                                                            Finalizado
                                                                        </h4> :
                                                                            <h4 className='h4-estado-formato-asing
                                                                         h4-estado-formato-asing-pendiente'>
                                                                                Pendiente
                                                                            </h4>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div> : ""
                                                : <GlobalInputs
                                                    input={setMuestraIdAsignar}
                                                    value={muestraIdAsignar}
                                                    class={"input-global"}
                                                    errors={errorsAsignar}
                                                    data={{
                                                        muestras_id: {
                                                            type: "select",
                                                            referencia: "Muestra",
                                                            values: ["id", "numero_documento", "nombre_completo", "finca", "lote"],
                                                            opciones: muestrasAsignar,
                                                            upper_case: true,
                                                            key: "id",
                                                        },
                                                    }} />
                                        }
                                    </div>
                                    <h2 className='h2-table-asign-formato'>
                                        Usuarios disponibles
                                    </h2>

                                    <div className='div-asign-elements'>
                                        <div className='fiv-asignar-analisis'>
                                            {
                                                statusUpdateAsignar ?
                                                    <div className='body-asignar-analisis'>
                                                        <h2>Formatos</h2>

                                                        <div className='div-encargados'>
                                                            <div>
                                                                <h3>Formato Físico</h3>
                                                                <div className='div-table-asignados'>
                                                                    <table cellSpacing={0} className='table-add-asignar'>
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Id</th>
                                                                                <th>Instructor</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {infoFormatoFisicoUpdateAsignar ?
                                                                                infoFormatoFisicoUpdateAsignar.length > 0 ?
                                                                                    infoFormatoFisicoUpdateAsignar.map((value, index) => {

                                                                                        return <tr key={value.id}>
                                                                                            <td>
                                                                                                <h4>                                                 {value.id}
                                                                                                </h4>
                                                                                            </td>
                                                                                            <td>
                                                                                                {value.estado != 4 ?
                                                                                                    <div>
                                                                                                        < GlobalInputs
                                                                                                            input={setValueGlobalInput}
                                                                                                            value={valueGlobalInput}
                                                                                                            /* class={"input-global"} */
                                                                                                            errors={errorsInputGlobal}
                                                                                                            elementEdit={value.catador_id}
                                                                                                            data={{
                                                                                                                ["catador_fisico_" + value.catador_id + "" + index]: {
                                                                                                                    type: "select",
                                                                                                                    referencia: false,
                                                                                                                    values: ["id", "numero_documento", "nombre_completo"],
                                                                                                                    opciones: usuariosAsignar,
                                                                                                                    upper_case: true,
                                                                                                                    key: "id",
                                                                                                                },
                                                                                                            }} />

                                                                                                        <div className='div-footer-users-formatos'>
                                                                                                            {value.estado == 2 ?
                                                                                                                <h4 className='h4-estado-formato-asing
                                                                                                                h4-estado-formato-asing-pendiente'>
                                                                                                                    Pendiente
                                                                                                                </h4>
                                                                                                                : value.estado == 3 ?
                                                                                                                    <h4 className='h4-estado-formato-asing h4-estado-formato-asing-asignado'>
                                                                                                                        Asignado
                                                                                                                    </h4>
                                                                                                                    : ""}
                                                                                                            <button onClick={() => { cambiarFormato(value.id, valueGlobalInput["catador_fisico_" + value.catador_id + "" + index], "catador_fisico_" + value.catador_id + "" + index) }} className='button-users-formatos button-users-formatos-cambiar'>Cambiar</button>
                                                                                                            <button
                                                                                                                onClick={() => { eliminarFormato(value.id) }}
                                                                                                                className='button-users-formatos button-users-formatos-eliminar'>Eliminar</button>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    :
                                                                                                    <div className='div-formato-finalizado'>
                                                                                                        <h4 className='catador-no-options-asignar'>
                                                                                                            {(value.catador_id + ", " + value.catador_documento + ", " + value.catador_nombre_completo).toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase())}
                                                                                                        </h4>

                                                                                                        <div>
                                                                                                            {value.estado == 4 ?
                                                                                                                <h4 className='h4-estado-formato-asing
                                                                                                            h4-estado-formato-asing-finalizado'>
                                                                                                                    Finalizado
                                                                                                                </h4>
                                                                                                                : ""}
                                                                                                        </div>

                                                                                                    </div>}

                                                                                            </td>
                                                                                        </tr>
                                                                                    })
                                                                                    : <tr></tr>
                                                                                : <tr></tr>}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h3>Formato Sca</h3>
                                                                <div className='div-table-asignados'>
                                                                    <table cellSpacing={0} className='table-add-asignar'>
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Id</th>
                                                                                <th>Instructor</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {infoFormatoScaUpdateAsignar ?
                                                                                infoFormatoScaUpdateAsignar.length > 0 ?
                                                                                    infoFormatoScaUpdateAsignar.map((value, index) => {

                                                                                        return <tr key={value.id}>
                                                                                            <td>
                                                                                                <h4>                                                 {value.id}
                                                                                                </h4>
                                                                                            </td>
                                                                                            <td>
                                                                                                {value.estado != 4 ?
                                                                                                    <div>
                                                                                                        < GlobalInputs
                                                                                                            input={setValueGlobalInput}
                                                                                                            value={valueGlobalInput}
                                                                                                            /* class={"input-global"} */
                                                                                                            errors={errorsInputGlobal}
                                                                                                            elementEdit={value.catador_id}
                                                                                                            data={{
                                                                                                                ["catador_sca_" + value.catador_id + "" + index]: {
                                                                                                                    type: "select",
                                                                                                                    referencia: false,
                                                                                                                    values: ["id", "numero_documento", "nombre_completo"],
                                                                                                                    opciones: usuariosAsignar,
                                                                                                                    upper_case: true,
                                                                                                                    key: "id",
                                                                                                                },
                                                                                                            }} />

                                                                                                        <div className='div-footer-users-formatos'>
                                                                                                            {value.estado == 2 ?
                                                                                                                <h4 className='h4-estado-formato-asing
                                                                                                            h4-estado-formato-asing-pendiente'>
                                                                                                                    Pendiente
                                                                                                                </h4>
                                                                                                                : value.estado == 3 ?
                                                                                                                    <h4 className='h4-estado-formato-asing h4-estado-formato-asing-asignado'>
                                                                                                                        Asignado
                                                                                                                    </h4>
                                                                                                                    : ""}
                                                                                                            <button onClick={() => { cambiarFormato(value.id, valueGlobalInput["catador_sca_" + value.catador_id + "" + index], "catador_sca_" + value.catador_id + "" + index) }} className='button-users-formatos button-users-formatos-cambiar'>Cambiar</button>
                                                                                                            <button
                                                                                                                onClick={() => { eliminarFormato(value.id) }}
                                                                                                                className='button-users-formatos button-users-formatos-eliminar'>Eliminar</button>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    :
                                                                                                    <div className='div-formato-finalizado'>
                                                                                                        <h4 className='catador-no-options-asignar'>
                                                                                                            {(value.catador_id + ", " + value.catador_documento + ", " + value.catador_nombre_completo).toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase())}
                                                                                                        </h4>

                                                                                                        <div>
                                                                                                            {value.estado == 4 ?
                                                                                                                <h4 className='h4-estado-formato-asing
                                                                                                        h4-estado-formato-asing-finalizado'>
                                                                                                                    Finalizado
                                                                                                                </h4>
                                                                                                                : ""}
                                                                                                        </div>

                                                                                                    </div>}

                                                                                            </td>
                                                                                        </tr>
                                                                                    })
                                                                                    : <tr></tr>
                                                                                : <tr></tr>}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> : ""
                                            }
                                            <div className='body-asignar-analisis'>
                                                <h2>Asignados</h2>

                                                <div className='div-encargados'>
                                                    <div>
                                                        <h3>Formato Físico</h3>
                                                        <div className='div-table-asignados'>
                                                            <table cellSpacing={0} className='table-add-asignar'>
                                                                <thead>
                                                                    <tr>
                                                                        <th></th>
                                                                        <th>Instructor</th>
                                                                        <th>Cantidad</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody ref={asignarFormatoFisico} id='formatoFisico'>

                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3>Formato Sca</h3>
                                                        <div className='div-table-asignados'>
                                                            <table cellSpacing={0} className='table-add-asignar'>
                                                                <thead>
                                                                    <tr>
                                                                        <th></th>
                                                                        <th>Instructor</th>
                                                                        <th>Cantidad</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody ref={asignarFormatoSca} id='formatoSca'>

                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='footer-asignar'>
                                                <button onClick={() => { setAsignarAnalisis() }} className='button-set-asignar-analisis'>Asignar</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='div-table-asing'>
                                        <Tablas class="table-asignar" userInfo={userInfo.userInfo} filterPdfLimit={filterPdfLimit} setFilterPdflimit={setFilterPdflimit} getReporte={getReporte} filterSeacth={filterSeacth} updateTable={updateTable} limitRegisters={limitRegisters} count={countRegistersAsignar} data={usuariosAsignar} keys={keysUsuarios} tittle={"Usuarios"} filterEstado={filterEstado} getFilterEstado={getFilterEstado} getFiltersOrden={getFiltersOrden} />
                                    </div>
                                </div>
                            } />
                        )
                            : ""
                        : ""
                    : ""
                : ""}

        </>
    )
}
