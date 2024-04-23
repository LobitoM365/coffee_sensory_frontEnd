import React, { cloneElement, useEffect, useRef, useState } from "react"
import { Link, Outlet, json, useLocation } from "react-router-dom"
import Api from '../componentes/Api.jsx';
import { validateViews } from "../componentes/ValidateViews.jsx";
import { formatDate } from "../componentes/tablas.jsx";
import { host } from "../componentes/Api.jsx";
import "../../public/css/menu.css";
import { GlobalModal } from "../componentes/globalModal.jsx"
import { Alert } from "../componentes/alert.jsx";
import { GlobalInputs } from "../componentes/globalInputs.jsx";
import { fn } from "jquery";
import { Mensajeria } from "../componentes/mensajeria.jsx"
import { Doughnut } from "react-chartjs-2";

export const Menu = (data) => {
    const locationPath = useLocation();
    const [statusAlert, setStatusAlert] = useState(false);
    let divCrearFormula = useRef(null);
    let divEvaluarFormula = useRef(null);
    let refIconHamburguer = useRef(null);
    let divNotificaciones = useRef(null);
    let divLLenarCamporFormulario = useRef(null);
    let refModalConfiguracionFormatoFisico = useRef(null);
    const [dataAlert, setdataAlert] = useState({});
    const [dataVariables, setDataVariables] = useState({});
    const [formulaVariables, setFormulaVariables] = useState("");
    const [globalInputsValue, setGlobalInputsValue] = useState({});
    const [variablesFormatoFisico, setvariablesFormatoFisico] = useState([]);
    const [variableFocus, setVariableFocus] = useState({});
    const [errorsInputGlobal, setErrorsInputGlobal] = useState({})
    const [keyTipoValor, setKeyTipoValor] = useState(0);
    const [statusVariables, setStatusVariables] = useState(false);
    const [movementImgPerfil, setmMovementImgPerfil] = useState(false);
    let [limitNotificaciones, setLimitNoticaciones] = useState(0);
    const [cantidadNotificaciones, setCantidadNotificaciones] = useState(0);
    const [statusLoader, setStatusLoader] = useState({ "div_notificaciones": false })
    const [asignaciones, setAsignaciones] = useState([]);

    const [configCode, setConfigCode] = useState([]);

    // Inputs
    const [globalInputEdit, setGlobalInputEdit] = useState({});


    useEffect(() => {
        // configCodigosMuestra()
        if (data.socket) {
            const perfilChange = (message) => {
                getUser();
            };
            const userBan = (message) => {
                location.reload()
            }

            const ok = (message) => {

            };

            const asignAnalisis = (message) => {
                if (!document.getElementById("audio_notifi")) {
                    const audio = document.createElement("audio")
                    audio.setAttribute("src", "../../public/audio/tonoNotificacion/tonoNotificacion (2).mp3")
                    audio.setAttribute("autoplay", "true")
                    audio.setAttribute("id", "audio_notifi")
                    document.body.appendChild(audio)
                    audio.addEventListener('loadedmetadata', function () {

                        audio.play()
                        setTimeout(() => {
                            audio.remove()
                        }, audio.duration * 1000);
                    });
                }
                setStatusLoader(prevState => {
                    const clonePrevState = { ...prevState };
                    clonePrevState["div_notificaciones"] = false
                    return clonePrevState
                })
                setAsignaciones([])
                setLimitNoticaciones(0)
                setCantidadNotificaciones(0)
                getAsignaciones()
            };

            data.socket.on('perfilChange', perfilChange);
            data.socket.on('ok', ok);
            data.socket.on("asignAnalisis", asignAnalisis);
            data.socket.on("userBan", userBan);

            // Limpiar los suscriptores de eventos cuando el componente se desmonte
            return () => {
                data.socket.off('asignAnalisis', userBan);
                data.socket.off('perfilChange', perfilChange);
                data.socket.off('ok', ok);
                data.socket.off('asignAnalisis', asignAnalisis);
            };
        }
    }, [data.socket]);

    useEffect(() => {
        if (divNotificaciones.current) {
            function scrollNotificaciones(e) {
                if (limitNotificaciones == false) {
                    if (divNotificaciones.current) {
                        divNotificaciones.current.removeEventListener("scroll", scrollNotificaciones)
                    }
                } else {
                    if (statusLoader["div_notificaciones"] == false || statusLoader["div_notificaciones"] == "disconnect") {

                        if ((Math.floor(e.target.scrollHeight) - Math.floor(e.target.clientHeight)) - Math.floor(e.target.scrollTop) <= 30) {
                            getAsignaciones()
                        }
                    }
                }
            }
            divNotificaciones.current.addEventListener("scroll", scrollNotificaciones)
            return () => {
                if (divNotificaciones.current) {
                    divNotificaciones.current.removeEventListener("scroll", scrollNotificaciones)
                }
            }
        }
    }, [divNotificaciones.current, limitNotificaciones])

    const [pageLoad, setPageLoad] = useState({});
    const [queryMenu, setQueryMenu] = useState(document.body.scrollWidth <= 610 ? true : false)
    let responseValidate = validateViews();


    const [hamburguerMode, setHamburguerMode] = useState(0)
    const [user, setUser] = useState({});
    const [modalConfiguracion, setModalConfiguracion] = useState(false);
    const [modalNotificaciones, changeModalNotificaciones] = useState(false);
    const [modalConfiguracionFormatoFisico, setModalConfiguracionFormatoFisico] = useState(false);
    const [modalPerfil, changeModalPerfil] = useState(false);
    const [liSelected, changeSelected] = useState(location.pathname);

    const [modalConfiguracionCodigos, setModalConfiguracionCodigos] = useState(false);


    if (!localStorage.getItem("darkMode")) {
        localStorage.setItem("darkMode", false)
    }

    function selectedLi(location) {
        changeSelected(location)
    }

    async function getAsignaciones() {
        try {
            if (statusLoader["div_notificaciones"] == false) {
                if (statusLoader["div_notificaciones"] != "disconnect") {
                    setStatusLoader(prevState => {
                        const clonePrevState = { ...prevState };
                        clonePrevState["div_notificaciones"] = true
                        return clonePrevState
                    })

                }

                /*     if (divNotificaciones.current) {
                        divNotificaciones.current.scrollTop = divNotificaciones.current.scrollHeight + 100
                    } */

                const filterFormato = {
                    "filter": {
                        "where": {
                            "forma.estado": {
                                "value": 4,
                                "operador": "!=",
                                "require": "and"
                            },
                            "an.proceso": {
                                "value": "certificar",
                                "require": "and"
                            }
                        },
                        "order": {
                            /* "fecha_creacion": {
                                "value": "desc"
                            }, */
                            "fecha_actualizacion": {
                                "value": "desc"
                            },
                            "forma_id": {
                                "value": "desc"
                            }
                        },
                        "limit": {
                            "inicio": limitNotificaciones,
                            "fin": "5",
                        }
                    }
                }
                if (Array.isArray(asignaciones)) {
                    const response = await Api.post("formatos/listarPendientes", filterFormato);
                    if (response.data.status == true) {
                        setCantidadNotificaciones(response.data.count);
                        setAsignaciones(prevElementos => [...prevElementos, ...response.data.data]);
                        setLimitNoticaciones(limitNotificaciones + 5);
                        setStatusLoader(prevState => {
                            const clonePrevState = { ...prevState };
                            clonePrevState["div_notificaciones"] = false
                            return clonePrevState
                        });
                    } else {
                        setLimitNoticaciones(false);
                        setStatusLoader(prevState => {
                            const clonePrevState = { ...prevState };
                            clonePrevState["div_notificaciones"] = false
                            return clonePrevState
                        });
                    }
                }
            }
        } catch (e) {
            setStatusLoader(prevState => {
                const clonePrevState = { ...prevState };
                clonePrevState["div_notificaciones"] = "disconnect"
                return clonePrevState
            });
        }
    }

    useEffect(() => {
        window.addEventListener("resize", function (event) {
            if (document.body.scrollWidth <= 500) {
                if (statusLoader["div_notificaciones"] != true) {
                    setStatusLoader(prevState => {
                        const clonePrevState = { ...prevState };
                        clonePrevState["div_notificaciones"] = false
                        return clonePrevState
                    });
                }
            }
        })
        window.addEventListener("click", function (event) {
            let divSelect = document.querySelectorAll(".div-select")
            let optionsInputs = document.querySelectorAll(".opciones-input-select")
            for (let o = 0; o < divSelect.length; o++) {
                if (event.target !== divSelect[o] && !divSelect[o].contains(event.target)) {
                    if (optionsInputs[o]) {
                        optionsInputs[o].style.display = "none"
                    }
                }
            }
        })
        window.addEventListener("click", function (event) {
            let divSelect = document.querySelectorAll(".father-div-modal")
            let optionsInputs = document.querySelectorAll(".child-div-modal")
            if (event.target.getAttribute("id") != "mainAlert" && !event.target.closest("#mainAlert")) {
                for (let o = 0; o < divSelect.length; o++) {
                    if (event.target !== divSelect[o] && !divSelect[o].contains(event.target)) {
                        if (optionsInputs[o]) {
                            optionsInputs[o].style.display = "none"
                        }
                    }
                }
            }
        })

    }, [])
    async function getUser() {
        try {
            const response = await Api.get("/usuarios/perfil");
            if (response.data.status == true) {
                setUser(response.data.data)
            }

        } catch (e) {

        }
    }


    useEffect(() => {
        if (data.userInfo) {
            if (data.userInfo.rol == "catador" && (data.userInfo.cargo == "instructor" || data.userInfo.cargo == "aprendiz")) {
                getAsignaciones();
            }
        }
    }, [data.userInfo])
    useEffect(() => {
        getUser();
    }, [data.userInfo])


    function darkMode() {
        data.changeDarkMode(!data.valueDarkMode)
        localStorage.setItem("darkMode", !data.valueDarkMode)
    }

    function verNotificaciones() {
        changeModalPerfil(false)
        changeModalNotificaciones(!modalNotificaciones)
    }
    function verOpcionesPerfil() {
        changeModalPerfil(!modalPerfil)
        changeModalNotificaciones(false)
    }

    // Cerrar sesión
    async function LogoutSesion() {
        // alert('?xd')
        // const navigate = useNavigate();
        try {
            const response = await Api.post("/auth/close");
            location.href = '/login'
        } catch (e) {
            location.href = '/login'
        }

    };
    /*    useEffect(() => {
           getVariablesFormatoFisico()
       }, []) */
    useEffect(() => {

        // setGlobalInputsValue({})
        setFormulaVariables("")
        setErrorsInputGlobal("")
        /* divCrearFormula = null */
        /* refModalConfiguracionFormatoFisico = null */

    }, [modalConfiguracionFormatoFisico])
    useEffect(() => {
        if (modalConfiguracionFormatoFisico && divCrearFormula != null && refModalConfiguracionFormatoFisico != null && refModalConfiguracionFormatoFisico != null) {

            if (refModalConfiguracionFormatoFisico.current) {
                refModalConfiguracionFormatoFisico.current.removeEventListener("mousedown", mouseDownFunction);
                refModalConfiguracionFormatoFisico.current.removeEventListener("mouseup", mouseUpFunction);
                refModalConfiguracionFormatoFisico.current.removeEventListener("mousemove", moverOperador);
                refModalConfiguracionFormatoFisico.current.removeEventListener("mousemove", setDivAddMovement);
            }
            let divIconDelete = document.getElementById("divIconDelete");
            let operadorFocus;
            let operadorFocusAdd;
            let divMovementFocus;
            let divOperadorFocusAdd;
            let divAdd;
            let deleteStatus;
            let focusIterador;
            const divCrearFormulaConst = divCrearFormula.current
            let divMovement;
            function moverOperador(event) {
                if (operadorFocus) {
                    const positionX = event.clientX;
                    const positionY = event.clientY;
                    operadorFocus.style.top = (positionY - (operadorFocus.scrollHeight / 2)) + "px"
                    operadorFocus.style.left = positionX - (operadorFocus.scrollWidth / 2) + "px"
                    setItemDivFormular(event)
                }
            }
            function setItemDivFormular(event) {
                let divIconDelete = document.getElementById("divIconDelete");
                const bbox = divCrearFormulaConst.getBoundingClientRect();
                const operadorFocusBbox = operadorFocus.getBoundingClientRect();
                const bboxDelete = divIconDelete.getBoundingClientRect();
                const div = document.createElement("div")

                if ((((((operadorFocusBbox.top <= bboxDelete.top) && ((operadorFocusBbox.top + operadorFocus.scrollHeight + 4) >= bboxDelete.top))) || ((operadorFocusBbox.top + operadorFocus.scrollHeight + 4) >= (bboxDelete.top + divIconDelete.scrollHeight)) && (operadorFocusBbox.top <= (bboxDelete.top + divIconDelete.scrollHeight)))) && (((operadorFocusBbox.left <= bboxDelete.left) && ((operadorFocusBbox.left + operadorFocus.scrollWidth + 4) >= bboxDelete.left)) || (((operadorFocusBbox.left + operadorFocus.scrollWidth + 4) >= (bboxDelete.left + divIconDelete.scrollWidth)) && (operadorFocusBbox.left <= (bboxDelete.left + divIconDelete.scrollWidth)))) || (((operadorFocusBbox.left >= bboxDelete.left) && ((operadorFocusBbox.left + operadorFocus.scrollWidth) <= (bboxDelete.left + divIconDelete.scrollWidth))) && ((operadorFocusBbox.top >= bboxDelete.top) && ((operadorFocusBbox.top + operadorFocus.scrollHeight) <= (bboxDelete.top + divIconDelete.scrollHeight)))) || ((operadorFocusBbox.left >= bboxDelete.left) && ((operadorFocusBbox.left + operadorFocus.scrollWidth) <= (bboxDelete.left + divIconDelete.scrollWidth))) && (((((operadorFocusBbox.top <= bboxDelete.top) && ((operadorFocusBbox.top + operadorFocus.scrollHeight + 4) >= bboxDelete.top))) || ((operadorFocusBbox.top + operadorFocus.scrollHeight + 4) >= (bboxDelete.top + divIconDelete.scrollHeight)) && (operadorFocusBbox.top <= (bboxDelete.top + divIconDelete.scrollHeight))))) {
                    divIconDelete.classList.add("div-icon-delete-focus")
                    deleteStatus = true
                } else {
                    divIconDelete.classList.remove("div-icon-delete-focus")
                    deleteStatus = false
                }



                if ((event.clientY >= bbox.top && event.clientY <= (bbox.top + divCrearFormulaConst.clientHeight)) && (event.clientX >= bbox.left && event.clientX <= (bbox.left + divCrearFormulaConst.clientWidth))) {
                    if (!divAdd) {
                        div.classList.add("div-operador-add")
                        div.classList.add("div-operador-add-movement")
                        divCrearFormulaConst.appendChild(div)
                        divAdd = div
                    } else {
                        let operadores = refModalConfiguracionFormatoFisico.current.querySelectorAll(".div-operador-add")
                        for (let x = 0; x < operadores.length; x++) {
                            if (divAdd != operadores[x]) {
                                const bboxOperador = operadores[x].getBoundingClientRect();
                                if (((event.clientY >= bboxOperador.top) && (event.clientY <= (bboxOperador.top + operadores[x].clientHeight))) && (event.clientX >= bboxOperador.left && event.clientX <= (bboxOperador.left + (operadores[x].clientWidth / 2)))) {
                                    focusIterador = x
                                    divCrearFormulaConst.insertBefore(divAdd, divCrearFormulaConst.children[focusIterador])
                                } else if (((event.clientY >= bboxOperador.top) && (event.clientY <= (bboxOperador.top + operadores[x].clientHeight))) && event.clientX >= (bboxOperador.left + (operadores[x].clientWidth / 2)) && event.clientX <= (bboxOperador.left + (operadores[x].clientWidth))) {
                                    focusIterador = x + 1
                                    divCrearFormulaConst.insertBefore(divAdd, divCrearFormulaConst.children[focusIterador])
                                }
                            }
                        }
                    }
                } else {
                    if (divAdd) {
                        divAdd.remove()
                        divAdd = null
                    }
                }

            }
            function setDivAddMovement(event) {
                if (operadorFocusAdd) {
                    let divIconDelete = document.getElementById("divIconDelete");
                    divOperadorFocusAdd.classList.remove("div-input-operar")
                    operadorFocusAdd.classList.add("operador-focus-movement")
                    divOperadorFocusAdd.classList.add("div-operador-add-movement")
                    const positionX = event.clientX;
                    const positionY = event.clientY;
                    operadorFocusAdd.style.top = (positionY - (operadorFocusAdd.scrollHeight / 2)) + "px"
                    operadorFocusAdd.style.left = positionX - (operadorFocusAdd.scrollWidth / 2) + "px"
                    operadorFocusAdd.style.top = (positionY - (operadorFocusAdd.scrollHeight / 2)) + "px"
                    operadorFocusAdd.style.left = positionX - (operadorFocusAdd.scrollWidth / 2) + "px"
                    let operadores = refModalConfiguracionFormatoFisico.current.querySelectorAll(".div-operador-add")
                    const operadorFocusBbox = operadorFocusAdd.getBoundingClientRect();
                    const bboxDelete = divIconDelete.getBoundingClientRect();

                    if ((((((operadorFocusBbox.top <= bboxDelete.top) && ((operadorFocusBbox.top + operadorFocusAdd.scrollHeight + 4) >= bboxDelete.top))) || ((operadorFocusBbox.top + operadorFocusAdd.scrollHeight + 4) >= (bboxDelete.top + divIconDelete.scrollHeight)) && (operadorFocusBbox.top <= (bboxDelete.top + divIconDelete.scrollHeight)))) && (((operadorFocusBbox.left <= bboxDelete.left) && ((operadorFocusBbox.left + operadorFocusAdd.scrollWidth + 4) >= bboxDelete.left)) || (((operadorFocusBbox.left + operadorFocusAdd.scrollWidth + 4) >= (bboxDelete.left + divIconDelete.scrollWidth)) && (operadorFocusBbox.left <= (bboxDelete.left + divIconDelete.scrollWidth)))) || (((operadorFocusBbox.left >= bboxDelete.left) && ((operadorFocusBbox.left + operadorFocusAdd.scrollWidth) <= (bboxDelete.left + divIconDelete.scrollWidth))) && ((operadorFocusBbox.top >= bboxDelete.top) && ((operadorFocusBbox.top + operadorFocusAdd.scrollHeight) <= (bboxDelete.top + divIconDelete.scrollHeight)))) || ((operadorFocusBbox.left >= bboxDelete.left) && ((operadorFocusBbox.left + operadorFocusAdd.scrollWidth) <= (bboxDelete.left + divIconDelete.scrollWidth))) && (((((operadorFocusBbox.top <= bboxDelete.top) && ((operadorFocusBbox.top + operadorFocusAdd.scrollHeight + 4) >= bboxDelete.top))) || ((operadorFocusBbox.top + operadorFocusAdd.scrollHeight + 4) >= (bboxDelete.top + divIconDelete.scrollHeight)) && (operadorFocusBbox.top <= (bboxDelete.top + divIconDelete.scrollHeight))))) {
                        divIconDelete.classList.add("div-icon-delete-focus")
                        deleteStatus = true
                    } else {
                        divIconDelete.classList.remove("div-icon-delete-focus")
                        deleteStatus = false
                    }
                    for (let x = 0; x < operadores.length; x++) {
                        if (divOperadorFocusAdd != operadores[x]) {
                            const bboxOperador = operadores[x].getBoundingClientRect();

                            if (((event.clientY >= bboxOperador.top) && (event.clientY <= (bboxOperador.top + operadores[x].clientHeight))) && (event.clientX >= bboxOperador.left && event.clientX <= (bboxOperador.left + (operadores[x].clientWidth / 2)))) {
                                focusIterador = x
                                divCrearFormulaConst.insertBefore(divOperadorFocusAdd, divCrearFormulaConst.children[focusIterador])
                            } else if (((event.clientY >= bboxOperador.top) && (event.clientY <= (bboxOperador.top + operadores[x].clientHeight))) && event.clientX >= (bboxOperador.left + (operadores[x].clientWidth / 2)) && event.clientX <= (bboxOperador.left + (operadores[x].clientWidth))) {
                                focusIterador = x + 1
                                divCrearFormulaConst.insertBefore(divOperadorFocusAdd, divCrearFormulaConst.children[focusIterador])
                            }
                        }
                    }
                }
            }
            let operadores = refModalConfiguracionFormatoFisico.current.querySelectorAll(".item-operador-formula")
            refModalConfiguracionFormatoFisico.current.addEventListener("mousedown", mouseDownFunction)
            refModalConfiguracionFormatoFisico.current.addEventListener("mouseup", mouseUpFunction)
            function mouseDownFunction(event) {
                let statusItemOperador = true
                let operadoresAdd = refModalConfiguracionFormatoFisico.current.querySelectorAll(".div-operador-add")
                for (let x = 0; x < operadoresAdd.length; x++) {
                    const itemOperador = operadoresAdd[x].querySelectorAll(".item-operador-formula")
                    if (itemOperador[0]) {
                        if (event.target == itemOperador[0]) {
                            statusItemOperador = false
                            const div = document.createElement("div")
                            div.classList.add("div-movement-focus")
                            refModalConfiguracionFormatoFisico.current.appendChild(div)
                            divMovementFocus = div
                            focusIterador = x
                            operadorFocusAdd = itemOperador[0].parentNode
                            divOperadorFocusAdd = itemOperador[0].parentNode.parentNode

                            refModalConfiguracionFormatoFisico.current.addEventListener("mousemove", setDivAddMovement)
                        }
                    }
                }
                if (statusItemOperador == true) {
                    for (let x = 0; x < operadores.length; x++) {
                        if (event.target == operadores[x]) {
                            document.body.style.cursor = "pointer"
                            const div = document.createElement("div")
                            div.classList.add("div-movement-focus")
                            div.setAttribute("id", "divMovementFocus")
                            const cloneOperador = operadores[x].parentNode.cloneNode(true);
                            refModalConfiguracionFormatoFisico.current.appendChild(div)
                            divMovementFocus = div
                            divCrearFormulaConst.appendChild(cloneOperador)
                            operadorFocus = cloneOperador
                            const positionX = event.clientX;
                            const positionY = event.clientY;
                            operadorFocus.style.top = positionY + "px"
                            operadorFocus.style.left = positionX + "px"
                            operadorFocus.classList.add("operador-focus-movement")
                            refModalConfiguracionFormatoFisico.current.addEventListener("mousemove", moverOperador)
                        }
                    }
                }
            }
            function mouseUpFunction() {
                if (document.getElementById("divMovementFocus")) {
                    document.getElementById("divMovementFocus").remove()
                }
                if (divMovementFocus) {
                    divMovementFocus.remove()
                }
                let divIconDelete = document.getElementById("divIconDelete");

                if (deleteStatus) {
                    let h4Resultado = document.getElementById("resultadoFormula")
                    if (h4Resultado) {
                        h4Resultado.innerHTML = ""
                    }
                    divIconDelete.classList.remove("div-icon-delete-focus")
                    if (divOperadorFocusAdd) {
                        divOperadorFocusAdd.remove()
                        divOperadorFocusAdd = null
                    }
                    if (divAdd) {
                        divAdd.remove()
                        divAdd = null
                    }
                    evaluarFormula()
                }
                if (divOperadorFocusAdd) {
                    if (operadorFocusAdd.querySelector("input") || operadorFocusAdd.querySelector("h4")) {
                        divOperadorFocusAdd.classList.add("div-input-operar")
                    } else {
                        divOperadorFocusAdd.classList.remove("div-input-operar")
                    }
                    divCrearFormulaConst.insertBefore(divOperadorFocusAdd, divCrearFormulaConst.children[focusIterador])
                    operadorFocusAdd.classList.remove("operador-focus-movement")
                    divOperadorFocusAdd.classList.remove("div-operador-add-movement")
                    evaluarFormula()
                }
                if (divAdd && operadorFocus) {
                    divAdd.classList.remove("div-operador-add-movement")
                    operadorFocus.classList.remove("operador-focus-movement")
                    if (operadorFocus.querySelector("svg")) {
                        operadorFocus.querySelector("svg").classList.add("signo-formula")
                        if (operadorFocus.querySelector("svg").getAttribute("data-signo") == "#") {
                            divAdd.classList.add("div-input-operar")
                            operadorFocus.querySelector("svg").remove()
                            let input = document.createElement("input")
                            input.classList.add("input-operar")
                            input.classList.add("signo-formula")
                            operadorFocus.appendChild(input)
                            input.addEventListener("input", function (e) {
                                e.target.value = e.target.value.replace(/[^\d.]/g, '');
                                input.setAttribute("data-signo", e.target.value)
                                evaluarFormula()
                            })
                        }

                    }

                    divAdd.appendChild(operadorFocus)
                    divCrearFormulaConst.insertBefore(divAdd, divCrearFormulaConst.children[focusIterador])
                    evaluarFormula()

                } else {
                    if (operadorFocus) {
                        operadorFocus.remove()
                    }
                }
                document.body.style.cursor = ""

                refModalConfiguracionFormatoFisico.current.removeEventListener("mousemove", moverOperador)
                refModalConfiguracionFormatoFisico.current.removeEventListener("mousemove", setDivAddMovement)
                if (divOperadorFocusAdd) {
                    const input = divOperadorFocusAdd.querySelector("input");
                    if (input) {
                        input.focus()
                        input.focus
                    }
                }
                focusIterador = null
                divOperadorFocusAdd = null;
                operadorFocusAdd = null
                divAdd = null
                operadorFocus = null
                deleteStatus = null;
            }


            return () => {
                if (refModalConfiguracionFormatoFisico) {
                    if (refModalConfiguracionFormatoFisico.current) {
                        refModalConfiguracionFormatoFisico.current.removeEventListener("mousedown", mouseDownFunction)
                        refModalConfiguracionFormatoFisico.current.removeEventListener("mouseup", mouseUpFunction)
                        refModalConfiguracionFormatoFisico.current.removeEventListener("mousemove", moverOperador)
                        refModalConfiguracionFormatoFisico.current.removeEventListener("mousemove", setDivAddMovement)
                    }
                }
                if (divMovementFocus) {
                    divMovementFocus.remove()
                }
            }
        }
    }, [divCrearFormula.current, dataVariables])




    async function getVariablesFormatoFisico() {
        try {
            const dataVariables = {
                "filter": {
                    "where": {
                        "var.tipos_analisis_id": {
                            "value": 1,
                            "require": "and"
                        }
                    }
                }
            }
            const response = await Api.post("/variables/listar", dataVariables)
            if (response.data.status == true) {
                setvariablesFormatoFisico(response.data.data)
                setModalConfiguracionFormatoFisico(true)
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
                        "tittle": "Error interno",
                    }
                )
            }

        } catch (e) {
            console.log("Error: " + e)
        }
    }

    function IserterVariable(variable, index) {
        if (variable) {
            let div = document.createElement("div")
            const clonetGlobalInputsValue = { ...globalInputsValue }
            clonetGlobalInputsValue["variables"] = ""
            setGlobalInputsValue(clonetGlobalInputsValue)
            if (divCrearFormula.current) {
                div.classList.add("div-operador-add")
                div.classList.add("div-input-operar")
                div.innerHTML = '<div class="" style="top: 471.5px; left: 624.5px;"><div class="item-operador-formula"></div><h4 class="h4-variable-formula signo-formula" data-signo="' + variable["nombre"] + '">V_' + (index + 1) + '</h4></div>';
                divCrearFormula.current.appendChild(div)
                /* evaluarFormula() */
            }
        }
    }
    pageLoad[locationPath.pathname] = false

    function evaluarFormula() {
        if (divEvaluarFormula.current != null) {
            if (divLLenarCamporFormulario) {
                if (divLLenarCamporFormulario.current) {
                    divLLenarCamporFormulario.current.innerHTML = ""
                }
            }

            /* setDataVariables(prevState => {
                let cloneDataVariables = { ...prevState }
                cloneDataVariables = {}
                return cloneDataVariables
            }) */
            let itemOperadorFormula = document.querySelectorAll(".signo-formula")
            let formula = "";
            divEvaluarFormula.current.innerHTML = ""
            for (let x = 0; x < itemOperadorFormula.length; x++) {
                if (itemOperadorFormula[x].getAttribute("data-signo")) {
                    if (!isNaN(itemOperadorFormula[x].getAttribute("data-signo")) || itemOperadorFormula[x].getAttribute("data-signo") == ")" || itemOperadorFormula[x].getAttribute("data-signo") == "(" || itemOperadorFormula[x].getAttribute("data-signo") == "+" || itemOperadorFormula[x].getAttribute("data-signo") == "-" || itemOperadorFormula[x].getAttribute("data-signo") == "*" || itemOperadorFormula[x].getAttribute("data-signo") == "=" || itemOperadorFormula[x].getAttribute("data-signo") == "/" || itemOperadorFormula[x].getAttribute("data-signo") == "%") {
                        divEvaluarFormula.current.innerHTML += "<h4 class='h4-variable-" + itemOperadorFormula[x].getAttribute("data-signo") + " '>" + itemOperadorFormula[x].getAttribute("data-signo") + " </h4>"
                        formula += itemOperadorFormula[x].getAttribute("data-signo") + " ";
                    } else {
                        let nameVariable = itemOperadorFormula[x].getAttribute("data-signo")

                        if (variablesFormatoFisico) {
                            if (Array.isArray(variablesFormatoFisico))

                                for (let r = 0; r < variablesFormatoFisico.length; r++) {
                                    if (variablesFormatoFisico[r]["nombre"] == itemOperadorFormula[x].getAttribute("data-signo")) {
                                        nameVariable = variablesFormatoFisico[r]["visual_name"].toString().replace(/\b\w{4,}\b/g, function (match) {
                                            return match.charAt(0).toUpperCase() + match.slice(1);
                                        });
                                        break
                                    }
                                }
                        }
                        let divVariable = document.createElement("div")
                        divVariable.innerHTML = "<span class='label-from-register' >" + nameVariable + "</span>";
                        let input = document.createElement("input")
                        input.setAttribute("id", itemOperadorFormula[x].getAttribute("data-signo"))
                        input.classList.add("input-form")

                        setDataVariables(prevState => {
                            if (typeof prevState == "object") {
                                input.setAttribute("value", prevState[itemOperadorFormula[x].getAttribute("data-signo")] ? prevState[itemOperadorFormula[x].getAttribute("data-signo")] : 0)
                            }
                            return prevState
                        })
                        if (!document.getElementById(itemOperadorFormula[x].getAttribute("data-signo"))) {
                            input.addEventListener("input", function (e) {
                                e.target.value = e.target.value.replace(/[^\d.]/g, '');
                                setDataVariables(prevState => {
                                    const h4Variable = document.querySelectorAll(".h4-variable-" + itemOperadorFormula[x].getAttribute("data-signo"))
                                    for (let x = 0; x < h4Variable.length; x++) {
                                        h4Variable[x].innerHTML = e.target.value
                                    }
                                    const cloneDataVariables = { ...prevState }
                                    cloneDataVariables[itemOperadorFormula[x].getAttribute("data-signo")] = e.target.value
                                    return cloneDataVariables
                                })

                            })
                            divVariable.appendChild(input)
                            if (divLLenarCamporFormulario) {
                                if (divLLenarCamporFormulario.current) {
                                    divLLenarCamporFormulario.current.appendChild(divVariable)
                                }
                            }
                        }
                        formula += "parseFloat(dataVariables." + itemOperadorFormula[x].getAttribute("data-signo") + ") ";

                        let dataH4 = 0;
                        if (dataVariables[itemOperadorFormula[x].getAttribute("data-signo")]) {
                            dataH4 = dataVariables[itemOperadorFormula[x].getAttribute("data-signo")]
                        }
                        divEvaluarFormula.current.innerHTML += "<h4 class='h4-variable-" + itemOperadorFormula[x].getAttribute("data-signo") + " '>" + dataH4 + " </h4>"


                    }

                }
            }
            setFormulaVariables(formula)
        }
    }

    function getResultadoFormula() {
        let h4Resultado = document.getElementById("resultadoFormula")
        let h6ErrorFormulaVariable = document.getElementById("h6ErrorFormulaVariable")
        if (h6ErrorFormulaVariable) {
            h6ErrorFormulaVariable.remove()
        }
        if (divCrearFormula.current) {
            divCrearFormula.current.classList.remove("error-formula-variable")
        }
        if (h4Resultado) {
            try {
                const resultadoEval = eval(formulaVariables);
                if (resultadoEval != undefined && resultadoEval != NaN && resultadoEval != "NaN") {
                    h4Resultado.innerHTML = resultadoEval
                } else {

                }
            } catch (e) {
                if (divCrearFormula.current) {
                    let h6 = document.createElement("h6")
                    h6.classList.add("h6-error-formula-variable")
                    h6.setAttribute("id", "h6ErrorFormulaVariable")
                    h6.innerHTML = "Por favor revisa la fórmula, algo está mal...";
                    divCrearFormula.current.parentNode.appendChild(h6)
                    divCrearFormula.current.classList.add("error-formula-variable")
                }
            }

        }
    }
    /*     useEffect(() => {
            globalInputsValue["tipo_valor"] = variableFocus["tipo_valor"]
        }, [variableFocus]) */

    useEffect(() => {
        if (divCrearFormula) {
            if (divCrearFormula.current) {
                if (variableFocus) {
                    if (typeof variableFocus == "object") {
                        const keys = Object.keys(variableFocus)
                        if (keys.length > 0) {
                            let regexFormula = /(\d*\.?\d+)|([+\-*/%()])|parseFloat\s*\([^)]*\)/g

                            let tokens = [];
                            let match;
                            const formula = (variableFocus["formula"] ? variableFocus["formula"] : "").toString();
                            if (variableFocus["formula"]) {
                                while ((match = regexFormula.exec(formula)) !== null) {
                                    const token = match[0].trim();
                                    tokens.push(token);
                                }
                            }
                            for (let x = 0; x < tokens.length; x++) {
                                setFormulaVariable(tokens[x])
                            }
                            evaluarFormula()
                        }
                    }
                }
            }
        }
        function setFormulaVariable(element) {
            let div = document.createElement("div")
            div.classList.add("div-operador-add")

            if (element == "(" || element == ")" || element == "*" || element == "/" || element == "+" || element == "-" || element == "%") {
                const svgs = document.querySelectorAll('svg[data-signo="' + element + '"]');
                if (svgs[0].parentNode) {
                    if (divCrearFormula) {
                        if (divCrearFormula.current) {
                            const cloneSvg = svgs[0].parentNode.cloneNode(true)
                            div.appendChild(cloneSvg)
                            cloneSvg.querySelector("svg").classList.add("signo-formula")
                            divCrearFormula.current.appendChild(div)
                        }
                    }
                }
            } else if (!isNaN(element)) {
                div.classList.add("div-input-operar")
                const divElement = document.createElement("div")
                divElement.innerHTML = '<div class="item-operador-formula"></div>'
                let input = document.createElement("input")
                input.classList.add("input-operar")
                input.classList.add("signo-formula")
                input.value = element
                input.setAttribute("data-signo", element)
                input.addEventListener("input", function (e) {
                    e.target.value = e.target.value.replace(/[^\d.]/g, '');
                    input.setAttribute("data-signo", e.target.value)
                    /*  evaluarFormula() */
                })
                divElement.appendChild(input)
                div.appendChild(divElement)
                divCrearFormula.current.appendChild(div)
            } else {
                div.classList.add("div-input-operar")

                let match = element.match(/parseFloat\(\w+\.(\w+)/);
                /* let match = element.match(/parseFloat\((.*?)\)/); */
                let contenidoParseFloat = match ? match[1] : null;
                /* let indice = variablesFormatoFisico.indexOf(contenidoParseFloat); */
                let indice = 0;

                for (let x = 0; x < variablesFormatoFisico.length; x++) {
                    if (variablesFormatoFisico[x]["nombre"] == contenidoParseFloat) {
                        indice = x
                        break
                    }
                }
                div.innerHTML = '<div class="" style="top: 471.5px; left: 624.5px;"><div class="item-operador-formula"></div><h4 class="h4-variable-formula signo-formula" data-signo="' + contenidoParseFloat + '">V_' + (indice + 1) + '</h4></div>'
                divCrearFormula.current.appendChild(div)

            }
        }
        return () => {
            if (divCrearFormula) {
                if (divCrearFormula.current) {
                    divCrearFormula.current.innerHTML = ""
                }
            }
        }
    }, [variableFocus, globalInputsValue["tipo_valor"]])
    function getInfoVariable(variable, index) {




        setVariableFocus(variable)
        clearFormula()
        globalInputsValue["variables"] = ""

        /*    if (globalInputsValue["tipo_valor"] != variable["tipo_valor"]) { */
        globalInputsValue["tipo_valor"] = variable["tipo_valor"]
        const clonetGlobalInputsValue = { ...globalInputsValue }
        clonetGlobalInputsValue["tipo_valor"] = variable["tipo_valor"]
        setGlobalInputsValue(clonetGlobalInputsValue)

        /*   } */
        /* divCrearFormula = null
        refModalConfiguracionFormatoFisico = null */
        setKeyTipoValor(keyTipoValor + 1)
    }
    function clearFormula() {
        if (divCrearFormula.current) {
            setDataVariables(prevState => {
                return {}
            })
            divCrearFormula.current.innerHTML = ""
            evaluarFormula()
            let h4Resultado = document.getElementById("resultadoFormula")
            let h6ErrorFormulaVariable = document.getElementById("h6ErrorFormulaVariable")
            if (h6ErrorFormulaVariable) {
                h6ErrorFormulaVariable.remove()
            }
            if (divCrearFormula.current) {
                divCrearFormula.current.classList.remove("error-formula-variable")
            }
            h4Resultado.innerHTML = ""
        }
    }

    async function updateVariable() {
        try {
            setErrorsInputGlobal({})
            const data = {
                "tipo_valor": globalInputsValue["tipo_valor"],
                "formula": formulaVariables
            }
            const response = await Api.put("variables/actualizar/" + variableFocus["id"], data)
            if (response.data.errors) {
                setErrorsInputGlobal(response.data.errors)
            } else if (response.data.status == true) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "true",
                        description: response.data.message,
                        "tittle": "Excelente",
                    }
                )
                getVariablesFormatoFisico()
            } else if (response.data.update_error == true) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "false",
                        description: response.data.update_error,
                        "tittle": "Inténtalo de nuevo.",
                    }
                )
            }
        } catch (e) {
            console.log("Error: " + e)
        }
    }
    function resizeMenu() {
        setHamburguerMode(prevState => {
            let linkMenu = document.querySelectorAll(".change-hamburguer-quit");
            let hamburguerCentered = document.querySelectorAll(".hamburguer-centered");
            let navHorizontal = document.getElementById("navHorizontal");
            let headerNav = document.getElementById("headerNav");

            if (navHorizontal) {
                navHorizontal.style.visibility = "visible"
            }
            if (prevState == 1) {
                if (document.body.scrollWidth <= 610) {
                    if (navHorizontal) {
                        navHorizontal.style.transform = "translateX(-100%)";
                    }
                } else {
                    if (headerNav) {
                        headerNav.style.justifyContent = ""
                        headerNav.style.width = ""
                    }
                    for (let x = 0; x < linkMenu.length; x++) {
                        linkMenu[x].style.transition = "all  0.3s"
                        linkMenu[x].style.opacity = "0"
                        linkMenu[x].style.fontSize = "10px"
                        setTimeout(() => {
                            linkMenu[x].style.display = "none"

                        }, 100)

                    }
                    for (let x = 0; x < hamburguerCentered.length; x++) {
                        setTimeout(() => {
                            hamburguerCentered[x].style.display = "flex"
                            hamburguerCentered[x].style.justifyContent = "center"
                        }, 100)
                    }
                    if (navHorizontal) {
                        navHorizontal.style.width = "75px";
                    }
                }
                return 0
            } else {
                if (document.body.scrollWidth <= 610) {
                    if (navHorizontal) {
                        navHorizontal.style.transform = "translateX(0%)";
                    }
                } else {
                    for (let x = 0; x < linkMenu.length; x++) {
                        navHorizontal.style.width = "";
                        linkMenu[x].style.transition = "all  0.3s"
                        linkMenu[x].style.opacity = "1"
                        linkMenu[x].style.fontSize = ""
                        setTimeout(() => {
                            linkMenu[x].style.display = "block"
                        }, 100)
                    }
                    for (let x = 0; x < hamburguerCentered.length; x++) {
                        setTimeout(() => {
                            hamburguerCentered[x].style.display = ""
                            hamburguerCentered[x].style.justifyContent = ""
                        }, 100)
                    }
                    if (navHorizontal) {
                        navHorizontal.style.width = "240px";
                    }
                }
                return 1
            }
        })
    }
    useEffect(() => {
        if (queryMenu) {
            setHamburguerMode(1)
            resizeMenu()
        }
    }, [location.pathname])
    useEffect(() => {
        let divHeaderNav = document.getElementById("divHeaderNav")
        let navVertical = document.getElementById("navVertical");
        let headerNav = document.getElementById("headerNav");
        let navHorizontal = document.getElementById("navHorizontal");
        let linkMenu = document.querySelectorAll(".change-hamburguer-quit");
        let hamburguerCentered = document.querySelectorAll(".hamburguer-centered");

        if (queryMenu == true) {
            if (navHorizontal) {
                navHorizontal.style.height = "calc(100% - " + (navVertical.clientHeight + "px") + " - " + (document.body.scrollWidth <= 140 ? 10 + "vw" : 50 + "px") + ")"
                navHorizontal.style.width = "100%"
            }
            if (navVertical) {
                /* navVertical.insertBefore(divHeaderNav, navVertical.children[0]) */
                headerNav.style.width = "max-content"
                navHorizontal.style.gridTemplateRows = "1fr auto"
            }
            for (let x = 0; x < linkMenu.length; x++) {
                linkMenu[x].style.transition = "all  0.3s"
                linkMenu[x].style.opacity = "1"
                linkMenu[x].style.fontSize = ""
                setTimeout(() => {
                    linkMenu[x].style.display = "block"
                }, 100)
            }

            setHamburguerMode(1)
            resizeMenu()
            if (navHorizontal) {
                setTimeout(() => {
                    navHorizontal.style.visibility = "visible"
                }, 500)
            }
        } else {
            if (hamburguerMode == 0) {
                for (let x = 0; x < hamburguerCentered.length; x++) {
                    hamburguerCentered[x].style.display = "flex"
                    hamburguerCentered[x].style.justifyContent = "center"
                    hamburguerCentered[x].style.alignItems = "center"
                }
            } else {
                for (let x = 0; x < hamburguerCentered.length; x++) {
                    hamburguerCentered[x].style.display = ""
                    hamburguerCentered[x].style.justifyContent = ""
                    hamburguerCentered[x].style.alignItems = ""
                }
            }
        }
    }, [queryMenu, data.userInfo])

    useEffect(() => {
        if (refIconHamburguer.current) {
            function resizeMenuFunction() {


                let divHeaderNav = document.getElementById("divHeaderNav")
                let navVertical = document.getElementById("navVertical");
                let headerNav = document.getElementById("headerNav");
                let navHorizontal = document.getElementById("navHorizontal");
                let linkMenu = document.querySelectorAll(".change-hamburguer-quit");
                let hamburguerCentered = document.querySelectorAll(".hamburguer-centered");

                if (document.body.scrollWidth <= 610) {

                    if (navHorizontal) {
                        navHorizontal.style.height = "calc(100% - " + (navVertical.clientHeight + "px") + " - " + (document.body.scrollWidth <= 140 ? 10 + "vw" : 50 + "px") + ")"
                    }
                    if (queryMenu == false) {
                        if (divHeaderNav && navVertical) {
                            /* navVertical.insertBefore(divHeaderNav, navVertical.children[0]) */
                            headerNav.style.width = "max-content"
                            navHorizontal.style.gridTemplateRows = "1fr auto"
                            navHorizontal.style.width = "100%"
                        }
                        for (let x = 0; x < linkMenu.length; x++) {
                            linkMenu[x].style.transition = "all  0.3s"
                            linkMenu[x].style.opacity = "1"
                            linkMenu[x].style.fontSize = ""
                            setTimeout(() => {
                                linkMenu[x].style.display = "block"
                            }, 100)
                        }
                        for (let x = 0; x < hamburguerCentered.length; x++) {
                            setTimeout(() => {
                                hamburguerCentered[x].style.display = ""
                                hamburguerCentered[x].style.justifyContent = ""
                            }, 100)
                        }
                        setHamburguerMode(1)
                        resizeMenu()
                        setQueryMenu(true)
                    }
                } else {
                    if (queryMenu == true) {

                        if (navVertical && navHorizontal) {
                            navHorizontal.style.transform = "translateX(0%)";
                            headerNav.style.width = ""
                            if (navHorizontal) {
                                navHorizontal.style.height = ""
                            }
                            navHorizontal.style.gridTemplateRows = ""
                            navHorizontal.style.width = "100%"
                        }
                        setHamburguerMode(1)
                        resizeMenu()
                        setQueryMenu(false)
                    }
                }
            }
            if (refIconHamburguer.current) {
                refIconHamburguer.current.addEventListener("click", resizeMenu)
            }
            window.addEventListener("resize", resizeMenuFunction)

            return () => {
                if (refIconHamburguer.current) {
                    refIconHamburguer.current.removeEventListener("click", resizeMenu)
                }
                window.removeEventListener("resize", resizeMenuFunction)
            }
        }
    }, [refIconHamburguer, hamburguerMode, queryMenu, data.userInfo])


    // Panel de configuración para Codigo Muestra y Codigo Informe
    const configCodigosMuestra = async () => {
        try {
            const filter = {
                "filter": {
                    "where": {
                        "conf.tipo": {
                            "value": 'codigo_muestra',
                            "require": 'and'
                        },
                        "tipo2": {
                            "no-key": 'conf.tipo',
                            "value": 'codigo_informe',
                            "require": 'or'
                        }
                    }
                }
            }
            const response = await Api.post('/configGeneral', filter)
            setConfigCode(response.data.data)

            const cloneGlobalInputEdit = { ...globalInputEdit };
            cloneGlobalInputEdit['codigo_muestra'] = response.data.data[0].valor
            cloneGlobalInputEdit['codigo_informe'] = response.data.data[1].valor
            setGlobalInputEdit(cloneGlobalInputEdit);
            setModalConfiguracionCodigos(true)

        } catch (error) {
            console.log('CONFIG ERROR: ', error);
        }
    }

    const updateCodigosConf = async () => {
        try {
            const cloneConfigData = [...configCode];
            cloneConfigData[0]['valor'] = globalInputsValue.codigo_muestra;
            cloneConfigData[1]['valor'] = globalInputsValue.codigo_informe;
            const response = await Api.put('/configGeneral/update', cloneConfigData)
            if (response.data.errors) {
                setErrorsInputGlobal(response.data.errors)
            } else if (response.data.status == true) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "true",
                        description: response.data.message,
                        "tittle": "Excelente",
                    }
                )
                configCodigosMuestra()
            } else if (response.data.update_error == true) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "false",
                        description: response.data.update_error,
                        "tittle": "Inténtalo de nuevo.",
                    }
                )
            }
        } catch (error) {
            console.log('UPDATE CODES ERORORROR: ', error);
        }
    }
    async function closeModalAvanzado(e) {
        if (e) {
            let divModal;
            if (e.target.closest(".child-div-modal")) {
                divModal = e.target.closest(".child-div-modal");
            } else if (e.target.querySelectorAll(".child-div-modal").length > 0) {
                divModal = e.target.querySelectorAll(".child-div-modal")[0];
            } else if (e.target.parentNode.querySelectorAll(".child-div-modal").length > 0) {
                divModal = e.target.parentNode.querySelectorAll(".child-div-modal")[0];
            } else if (e.target.closest(".father-div-modal")) {
                if (e.target.closest(".father-div-modal").parentNode) {
                    if (e.target.closest(".father-div-modal").parentNode.querySelectorAll(".child-div-modal")) {
                        divModal = e.target.closest(".father-div-modal").parentNode.querySelectorAll(".child-div-modal")[0];
                    }
                }
            }
            if (divModal) {
                divModal.style.display = divModal.style.display == "none" || divModal.style.display == "" ? "block" : "none"
            }
        } else {
            const divAvanzado = document.getElementById("divAvanzado")
            if (divAvanzado) {
                divAvanzado.style.display = divAvanzado.style.display == "none" || divAvanzado.style.display == "" ? "block" : "none"
            }
        }
    }
    useEffect(() => {
        let linkMenu = document.querySelectorAll(".link-memu-horizontal");
        let h4TitleMenuFocus = document.getElementById("h4TitleMenuFocus");
        if (h4TitleMenuFocus) {
            if (hamburguerMode == 0) {
                function removeNameFocus(e) {
                    h4TitleMenuFocus.classList.add("h4-tittle-menu-no-focus");
                    h4TitleMenuFocus.style.display = "none";
                }
                function getNameFocus(e) {
                    let element = e.target;
                    if (!e.target.classList.contains(".link-memu-horizontal")) {
                        if (e.target.closest(".link-memu-horizontal")) {
                            element = e.target.closest(".link-memu-horizontal")
                        }
                    }
                    if (element.querySelector(".change-hamburguer-quit")) {
                        if (h4TitleMenuFocus.innerHTML != element.querySelector(".change-hamburguer-quit").innerHTML) {
                            h4TitleMenuFocus.innerHTML = element.querySelector(".change-hamburguer-quit").innerHTML;
                        }
                        h4TitleMenuFocus.classList.remove("h4-tittle-menu-no-focus");
                        let gbbox = element.getBoundingClientRect()
                        h4TitleMenuFocus.style.display = "block";
                        h4TitleMenuFocus.style.top = (gbbox.top + (gbbox.height / 2) - (h4TitleMenuFocus.scrollHeight / 2)) + "px";
                        h4TitleMenuFocus.style.left = (gbbox.left + gbbox.width + 10) + "px";
                    }
                }
                if (linkMenu.length > 0) {
                    for (let x = 0; x < linkMenu.length; x++) {
                        linkMenu[x].addEventListener("mouseover", getNameFocus)
                        linkMenu[x].addEventListener("mouseleave", removeNameFocus)
                    }
                }
                return () => {
                    if (linkMenu.length > 0) {
                        for (let x = 0; x < linkMenu.length; x++) {
                            linkMenu[x].removeEventListener("mouseover", getNameFocus)
                            linkMenu[x].removeEventListener("mouseleave", removeNameFocus)
                        }
                    }
                }
            } else {
                h4TitleMenuFocus.classList.add("h4-tittle-menu-no-focus")
                h4TitleMenuFocus.innerHTML = ""
                h4TitleMenuFocus.style.display = "none";
            }
        }
    }, [hamburguerMode, data.userInfo])
    return (
        <>
            {data.userInfo ?
                <div className={(!data.valueDarkMode ? "lightMode" : "darkMode")}>
                    <div id="mainMenu">
                        <h4 id="h4TitleMenuFocus" className="h4-title-focus">ahhhh</h4>
                        <div style={{ height: "100%", bottom: "0" }} className={"main-content " + (!data.valueDarkMode ? "lightMode" : "darkMode")}>

                            <nav id="navHorizontal" className="nav-main nav-horizontal">
                                <div className="div-img-nav">
                                    <img className="logo-menu" src="/img/logoENCC.png" alt="" />

                                    <img className="img-nav" src={!data.valueDarkMode ? "/img/fondoMenuVertical2.webp" : "/public/img/imgDarkMenu (8).jpg"} alt="" />

                                </div>
                                {!queryMenu ?
                                    <div id="divHeaderNav" className="div-header-nav">

                                        <div id="headerNav" className="header-nav hamburguer-centered">
                                            <svg ref={refIconHamburguer} id="iconHamburguer" className="icon-hamburguer-li-nav-horizontal icon-li-nav-horizontal" version="1.0" viewBox="0 0 1024.000000 1024.000000" preserveAspectRatio="xMidYMid meet">

                                                <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" stroke="none">
                                                    <path d="M1105 8301 c-222 -64 -392 -238 -449 -458 -21 -80 -21 -246 0 -327 43 -167 168 -325 320 -404 153 -79 -244 -72 4144 -72 4388 0 3991 -7 4144 72 109 57 207 155 263 263 55 107 73 181 73 305 0 124 -18 198 -73 305 -56 108 -154 206 -262 262 -156 80 262 73 -4151 72 -3726 0 -3952 -1 -4009 -18z" />
                                                    <path d="M1105 5741 c-222 -64 -392 -238 -449 -458 -21 -80 -21 -246 0 -327 43 -167 168 -325 320 -404 153 -79 -244 -72 4144 -72 4388 0 3991 -7 4144 72 109 57 207 155 263 263 55 107 73 181 73 305 0 124 -18 198 -73 305 -56 108 -154 206 -262 262 -156 80 262 73 -4151 72 -3726 0 -3952 -1 -4009 -18z" />
                                                    <path d="M1105 3181 c-222 -64 -392 -238 -449 -458 -21 -80 -21 -246 0 -327 43 -167 168 -325 320 -404 153 -79 -244 -72 4144 -72 4388 0 3991 -7 4144 72 109 57 207 155 263 263 55 107 73 181 73 305 0 124 -18 198 -73 305 -56 108 -154 206 -262 262 -156 80 262 73 -4151 72 -3726 0 -3952 -1 -4009 -18z" />
                                                </g>
                                            </svg>
                                            <h2 className="title-header-nav-horizontal change-hamburguer-quit">Dashboard</h2>
                                            <img className="img-logo-nav change-hamburguer-quit" src="../../public/img/logo-coffee-sensory.png" alt="" />
                                        </div>
                                    </div> : ""}
                                <ul id="ulContentLi">
                                    <li className="li-hamburguer-centered  line-nav-li">
                                        <h4 className="title-li change-hamburguer-quit">Principal</h4>
                                        <ul>
                                            <Link to={"/dashboard"} onClick={() => { selectedLi("/dashboard") }} className={`link-memu-horizontal  ${liSelected == "/dashboard" ? "selected-li" : ""}`}>
                                                <li className="hamburguer-centered"><svg className="icon-li-nav-horizontal" version="1.1" x="0px" y="0px" viewBox="0 0 256 256">
                                                    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                                    <g><g><g><path d="M119.8,10.3c-54,3.5-99.2,44.4-108.3,98.1c-2,11.4-2,28,0,39.4C19.2,193,52.6,230,96.7,242c20,5.5,42.7,5.5,62.7,0c39.9-10.9,71.6-42.6,82.5-82.5c5.5-20,5.5-42.7,0-62.7c-12-44.1-49-77.5-94.2-85.2c-4.1-0.7-19.3-2-21-1.7C126.4,9.9,123.3,10.1,119.8,10.3z M131.3,69.4c2,0.7,62.4,52.8,63.5,54.6c1.3,2.3,1,7-0.6,9.2c-1.8,2.6-4,3.3-10.1,3.3h-5.3v22.2c0,24.6,0,24.6-3.4,27.1c-1.6,1.1-2.1,1.2-16,1.3l-14.4,0.2V162v-25.4H128h-16.9V162v25.4l-14.4-0.2c-14-0.2-14.5-0.2-16.1-1.3c-3.4-2.4-3.4-2.5-3.4-27.1v-22.2h-5.3c-8.1,0-11-2-11.5-7.7c-0.4-4.3,0.6-5.6,9.1-12.9l7.7-6.5V96.6c0-10.8,0.2-13.3,0.8-14.7c2.5-5.4,11.1-6,14.6-1.1c1,1.4,1.2,2.5,1.4,7.8l0.3,6.2L109,82.3c8-6.8,15-12.6,15.6-12.8C126,68.8,129.7,68.8,131.3,69.4z" /></g></g></g>
                                                </svg> <h5 className="change-hamburguer-quit ">Inicio</h5>
                                                </li>
                                            </Link>
                                            <Link className="link-memu-horizontal" to={"/"}>
                                                <li className="hamburguer-centered"><img className="icon-li-nav-horizontal" src="/img/iconMapColombia.png" alt="" />
                                                    <h5 className="change-hamburguer-quit ">Mapa</h5>
                                                </li>
                                            </Link>
                                        </ul>
                                    </li>
                                    <li className="li-hamburguer-centered ">
                                        <h4 className="title-li change-hamburguer-quit">Registros</h4>
                                        <ul>

                                            {data.userInfo && data.userInfo.rol == 'administrador' && (
                                                <Link to={"/dashboard/usuarios/registros"} onClick={() => { selectedLi("/dashboard/usuarios/registros") }} className={`link-memu-horizontal  ${liSelected == "/dashboard/usuarios/registros" ? "selected-li" : ""}`}>
                                                    <li className="hamburguer-centered"><svg className="icon-li-nav-horizontal" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 256 256"  >
                                                        <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                                        <g><g><g><path d="M119.1,22c-42.9,3.2-80.9,29.7-98.7,69c-4.6,10.1-7.7,20.7-9.5,32.8c-1.1,7.1-1.1,24.9,0,32.1c4.3,28.4,16.6,51.8,37.6,71.3c3.9,3.6,8.5,7.2,8.8,7c0.1-0.1,0.8-2.9,1.6-6.2c3.6-14.5,6.2-22.3,8.2-24.4c2.3-2.4,14.4-5.9,29.1-8.5c9.5-1.6,9.5-1.6,9.5-2.3c0-0.3,1-1.5,2.2-2.7l2.2-2.1l0-6.1c0-3.3-0.1-7-0.1-8.1l0-2l-3.1-1.4c-4.7-2.2-10.5-6.3-11.8-8.3c-3.2-4.9-6.6-13.4-8.7-22c-0.8-3.1-1.4-6.1-1.4-6.7c0-0.6-0.9-2.1-2.1-3.5c-4.3-5-5.1-12.5-2.2-18.6l1.5-3V95.7c0-9.5,0.2-13.4,0.7-15.6c3.2-13.4,14.9-23.2,34.5-28.7c8.2-2.3,12.7-2.3,20.9,0c18.1,5.1,29.5,14,33.8,26.3c1,2.8,1.1,3.8,1.2,16.8c0.1,13.8,0.1,13.8,1.3,15.5c3.8,5.7,3,15.5-1.8,20.4c-1.3,1.3-1.6,2.3-2.5,6.9c-1.4,6.9-3.8,14.1-6.7,20c-3.2,6.5-5.1,8.3-13.9,12.8l-3.9,2l-0.1,7.9l-0.1,7.8l2.3,2.3c1.3,1.3,2.3,2.5,2.3,2.9c0,0.3,0.7,0.7,1.5,0.8c24.5,4.2,35,7.2,37.8,10.7c1.2,1.5,4.6,11.9,7.1,21.9c1.1,4.4,2.1,8,2.3,8c0.8,0,9.6-7.9,14.4-12.8c36.7-37.9,43.4-96.5,16.3-141.9c-12.6-21.1-31.1-37.6-53.6-47.7C158.9,24.3,137.9,20.6,119.1,22z" /></g></g></g>
                                                    </svg> <h5 className="change-hamburguer-quit ">Usuarios</h5>
                                                    </li>
                                                </Link>
                                            )}

                                            {data.userInfo && data.userInfo.rol == 'administrador' && (
                                                <Link to={"/dashboard/departamentos/registros"} onClick={() => { selectedLi("/dashboard/departamentos/registros") }} className={`link-memu-horizontal  ${liSelected == "/dashboard/departamentos/registros" ? "selected-li" : ""}`}>
                                                    <li className="hamburguer-centered">
                                                        <svg className="icon-li-nav-horizontal" viewBox="0 0 225.000000 225.000000" preserveAspectRatio="xMidYMid meet">

                                                            <g transform="translate(0.000000,225.000000) scale(0.100000,-0.100000)" stroke="none">
                                                                <path d="M190 1164 l0 -1084 -60 0 -60 0 0 -40 0 -40 1055 0 1055 0 0 40 0 40 -60 0 -60 0 0 724 0 724 -345 86 c-190 47 -347 86 -350 86 -3 0 -5 -364 -5 -810 l0 -810 -40 0 -40 0 0 940 c0 517 -2 940 -4 940 -3 0 -743 197 -1053 280 l-33 8 0 -1084z m460 687 c14 -28 13 -184 -2 -199 -16 -16 -200 -16 -216 0 -16 16 -16 190 0 206 8 8 47 12 110 12 86 0 98 -2 108 -19z m390 0 c5 -11 10 -54 10 -96 0 -113 -2 -115 -118 -115 -63 0 -102 4 -110 12 -16 16 -16 190 0 206 8 8 47 12 110 12 86 0 98 -2 108 -19z m-390 -310 c5 -11 10 -58 10 -105 0 -107 -9 -116 -120 -116 -112 0 -120 8 -120 124 0 58 4 96 12 104 8 8 47 12 110 12 86 0 98 -2 108 -19z m390 0 c5 -11 10 -58 10 -105 0 -107 -9 -116 -120 -116 -112 0 -120 8 -120 124 0 58 4 96 12 104 8 8 47 12 110 12 86 0 98 -2 108 -19z m618 -73 c18 -18 16 -192 -2 -207 -9 -8 -48 -11 -112 -9 l-99 3 -3 99 c-1 55 0 106 2 113 7 17 196 19 214 1z m317 -103 l0 -110 -110 0 -110 0 -3 99 c-1 55 0 106 2 113 4 11 30 13 113 11 l108 -3 0 -110z m-1331 -131 c12 -12 16 -37 16 -104 0 -116 -4 -120 -120 -120 -117 0 -120 3 -120 124 0 58 4 96 12 104 19 19 193 16 212 -4z m390 0 c23 -23 23 -180 -1 -206 -22 -25 -183 -27 -207 -2 -20 19 -23 193 -4 212 19 19 193 16 212 -4z m624 -76 c8 -8 12 -47 12 -110 0 -116 -2 -118 -115 -118 -114 0 -115 1 -115 125 0 73 4 105 13 108 26 11 193 7 205 -5z m310 0 c8 -8 12 -47 12 -110 0 -116 -2 -118 -115 -118 -113 0 -115 2 -115 118 0 63 4 102 12 110 8 8 46 12 103 12 57 0 95 -4 103 -12z m-1326 -235 c25 -22 27 -183 2 -207 -19 -20 -193 -23 -212 -4 -19 19 -16 193 4 212 23 23 180 23 206 -1z m390 0 c25 -22 27 -183 2 -207 -19 -20 -193 -23 -212 -4 -19 19 -16 193 4 212 23 23 180 23 206 -1z m626 -75 c8 -8 12 -47 12 -110 0 -86 -2 -98 -19 -108 -28 -14 -184 -13 -199 2 -8 8 -12 47 -12 108 0 61 4 100 12 108 8 8 46 12 103 12 57 0 95 -4 103 -12z m310 0 c8 -8 12 -47 12 -110 0 -116 -2 -118 -115 -118 -113 0 -115 2 -115 118 0 63 4 102 12 110 8 8 46 12 103 12 57 0 95 -4 103 -12z m-894 -320 c13 -19 16 -59 16 -235 l0 -213 -355 0 -355 0 0 219 c0 186 2 222 16 235 13 14 58 16 339 16 323 0 324 0 339 -22z m814 -70 c8 -8 12 -66 12 -195 l0 -183 -195 0 -195 0 0 179 c0 150 3 182 16 195 13 13 44 16 183 16 116 0 171 -4 179 -12z" />
                                                                <path d="M460 315 l0 -155 115 0 115 0 0 155 0 155 -115 0 -115 0 0 -155z" />
                                                                <path d="M777 463 c-4 -3 -7 -73 -7 -155 l0 -148 120 0 120 0 0 155 0 155 -113 0 c-63 0 -117 -3 -120 -7z" />
                                                                <path d="M1590 275 l0 -115 120 0 120 0 0 115 0 115 -120 0 -120 0 0 -115z" />
                                                            </g>
                                                        </svg>
                                                        <h5 className="change-hamburguer-quit ">Departamentos</h5>
                                                    </li>
                                                </Link>
                                            )}
                                            {data.userInfo && data.userInfo.rol == 'administrador' && (
                                                <Link to={"/dashboard/municipios/registros"} onClick={() => { selectedLi("/dashboard/municipios/registros") }} className={`link-memu-horizontal  ${liSelected == "/dashboard/municipios/registros" ? "selected-li" : ""}`}>
                                                    <li className="hamburguer-centered">
                                                        <svg className="icon-li-nav-horizontal" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                                                            <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" stroke="none">
                                                                <path d="M2500 4527 l0 -462 -618 -348 -618 -347 -142 0 -142 0 0 -280 0 -280 -490 0 -490 0 0 -220 0 -220 90 0 90 0 0 -940 0 -940 -90 0 -90 0 0 -180 0 -180 2560 0 2560 0 0 180 0 180 -90 0 -90 0 0 940 0 940 90 0 90 0 0 220 0 220 -490 0 -490 0 0 280 0 280 -142 0 -141 0 -619 348 -618 347 0 193 0 192 100 0 100 0 0 -120 0 -120 300 0 300 0 0 220 0 220 -160 0 -160 0 0 120 0 120 -240 0 -240 0 0 50 0 50 -60 0 -60 0 0 -463z m480 143 l0 -100 -180 0 -180 0 0 100 0 100 180 0 180 0 0 -100z m320 -240 l0 -100 -180 0 -180 0 0 60 0 60 80 0 80 0 0 40 0 40 100 0 100 0 0 -100z m-218 -762 l520 -293 -521 -3 c-286 -1 -755 -1 -1042 0 l-520 3 518 292 c285 161 520 292 522 293 2 0 237 -132 523 -292z m938 -678 l0 -260 -1460 0 -1460 0 0 260 0 260 1460 0 1460 0 0 -260z m-3040 -340 l0 -40 80 0 80 0 0 -60 0 -60 -510 0 -510 0 0 100 0 100 430 0 430 0 0 -40z m4020 -60 l0 -100 -510 0 -510 0 0 60 0 60 80 0 80 0 0 40 0 40 430 0 430 0 0 -100z m-1140 -80 l0 -100 -1300 0 -1300 0 0 100 0 100 1300 0 1300 0 0 -100z m-2720 -180 l0 -40 80 0 80 0 0 -780 0 -780 -400 0 -400 0 0 -120 0 -120 -100 0 -100 0 0 940 0 940 420 0 420 0 0 -40z m3680 -900 l0 -940 -100 0 -100 0 0 120 0 120 -400 0 -400 0 0 780 0 780 80 0 80 0 0 40 0 40 420 0 420 0 0 -940z m-3280 80 l0 -780 -60 0 -60 0 0 780 0 780 60 0 60 0 0 -780z m240 0 l0 -780 -60 0 -60 0 0 780 0 780 60 0 60 0 0 -780z m1440 0 l0 -780 -140 0 -140 0 0 400 0 400 -380 0 -380 0 0 -400 0 -400 -140 0 -140 0 0 780 0 780 660 0 660 0 0 -780z m240 0 l0 -780 -60 0 -60 0 0 780 0 780 60 0 60 0 0 -780z m240 0 l0 -780 -60 0 -60 0 0 780 0 780 60 0 60 0 0 -780z m-1200 -440 l0 -340 -100 0 -100 0 0 340 0 340 100 0 100 0 0 -340z m320 0 l0 -340 -100 0 -100 0 0 340 0 340 100 0 100 0 0 -340z m1680 -520 l0 -60 -1940 0 -1940 0 0 60 0 60 1940 0 1940 0 0 -60z m500 -240 l0 -60 -2440 0 -2440 0 0 60 0 60 2440 0 2440 0 0 -60z" />
                                                                <path d="M420 1510 l0 -660 380 0 380 0 0 660 0 660 -380 0 -380 0 0 -660z m320 400 l0 -140 -100 0 -100 0 0 140 0 140 100 0 100 0 0 -140z m320 0 l0 -140 -100 0 -100 0 0 140 0 140 100 0 100 0 0 -140z m-320 -400 l0 -140 -100 0 -100 0 0 140 0 140 100 0 100 0 0 -140z m320 0 l0 -140 -100 0 -100 0 0 140 0 140 100 0 100 0 0 -140z m-320 -400 l0 -140 -100 0 -100 0 0 140 0 140 100 0 100 0 0 -140z m320 0 l0 -140 -100 0 -100 0 0 140 0 140 100 0 100 0 0 -140z" />
                                                                <path d="M3940 1510 l0 -660 380 0 380 0 0 660 0 660 -380 0 -380 0 0 -660z m320 400 l0 -140 -100 0 -100 0 0 140 0 140 100 0 100 0 0 -140z m320 0 l0 -140 -100 0 -100 0 0 140 0 140 100 0 100 0 0 -140z m-320 -400 l0 -140 -100 0 -100 0 0 140 0 140 100 0 100 0 0 -140z m320 0 l0 -140 -100 0 -100 0 0 140 0 140 100 0 100 0 0 -140z m-320 -400 l0 -140 -100 0 -100 0 0 140 0 140 100 0 100 0 0 -140z m320 0 l0 -140 -100 0 -100 0 0 140 0 140 100 0 100 0 0 -140z" />
                                                                <path d="M2020 1870 l0 -220 540 0 540 0 0 220 0 220 -540 0 -540 0 0 -220z m320 0 l0 -100 -100 0 -100 0 0 100 0 100 100 0 100 0 0 -100z m320 0 l0 -100 -100 0 -100 0 0 100 0 100 100 0 100 0 0 -100z m320 0 l0 -100 -100 0 -100 0 0 100 0 100 100 0 100 0 0 -100z" />
                                                            </g>
                                                        </svg>
                                                        <h5 className="change-hamburguer-quit ">Municipios</h5>
                                                    </li>
                                                </Link>
                                            )}
                                            {data.userInfo && data.userInfo.rol == 'administrador' && (
                                                <Link to={"/dashboard/veredas/registros"} onClick={() => { selectedLi("/dashboard/veredas/registros") }} className={`link-memu-horizontal  ${liSelected == "/dashboard/veredas/registros" ? "selected-li" : ""}`}>
                                                    <li className="hamburguer-centered">
                                                        <svg className="icon-li-nav-horizontal" viewBox="0 0 535.000000 474.000000" preserveAspectRatio="xMidYMid meet">
                                                            <g transform="translate(0.000000,474.000000) scale(0.100000,-0.100000)" stroke="none">
                                                                <path d="M3607 4503 c-9 -2 -14 -9 -11 -15 5 -7 -1 -9 -16 -5 -16 4 -29 -2 -47 -19 -27 -27 -24 -46 3 -23 16 13 17 11 10 -15 -6 -25 -5 -28 7 -18 10 9 18 8 33 -3 19 -14 18 -14 -2 -15 -45 0 -176 -116 -151 -132 19 -12 27 -9 27 10 0 14 2 15 10 2 9 -13 10 -13 11 0 0 10 3 8 9 -5 7 -17 9 -16 10 10 1 26 3 27 10 10 6 -13 9 -15 9 -5 1 13 2 13 11 0 8 -13 10 -13 10 2 0 10 5 15 13 12 8 -3 20 9 29 28 l17 33 0 -51 1 -51 -47 -13 c-74 -18 -120 -40 -145 -68 -13 -14 -17 -22 -10 -18 8 5 12 1 12 -11 1 -17 2 -17 15 1 11 14 15 16 15 5 1 -8 7 -3 16 11 14 23 15 24 11 3 -4 -19 -1 -22 19 -21 13 1 24 6 24 11 0 4 5 5 10 2 6 -3 10 -1 10 5 0 6 4 9 9 5 5 -3 13 0 17 7 5 8 10 6 15 -8 7 -17 8 -17 8 -1 1 26 18 21 23 -7 9 -44 6 -46 -136 -61 -38 -5 -56 -3 -52 3 10 16 -29 24 -81 16 -63 -9 -93 -21 -120 -46 -27 -25 -31 -47 -6 -27 15 12 16 12 10 -6 -7 -19 -6 -19 7 -2 14 18 14 18 19 0 4 -15 5 -15 6 -1 1 11 7 15 21 11 12 -3 20 0 20 7 0 6 6 10 13 7 6 -2 20 2 30 11 10 9 17 11 17 4 0 -6 -20 -25 -44 -42 -50 -34 -61 -56 -47 -91 6 -15 10 -18 10 -8 1 22 31 48 31 28 1 -9 4 -8 11 4 10 18 11 18 25 0 13 -16 14 -17 8 0 -5 13 -2 16 10 11 10 -4 16 -1 17 7 1 8 5 3 9 -11 8 -25 8 -24 9 5 l1 30 21 -25 c21 -25 21 -25 16 -2 -5 19 -3 21 9 11 17 -14 18 -5 3 24 -12 22 -12 22 10 3 14 -13 21 -15 21 -6 0 7 8 10 20 7 10 -3 21 0 24 7 2 6 5 -5 6 -24 l1 -35 24 28 c14 15 25 24 25 20 0 -4 5 -1 10 7 9 13 10 13 10 0 0 -13 1 -13 10 0 7 11 10 7 10 -17 0 -52 -55 -75 -200 -83 -63 -4 -124 -11 -135 -15 -30 -12 -55 -36 -55 -53 0 -12 2 -12 17 -1 15 12 16 12 10 -6 -6 -17 -4 -17 13 4 l20 23 0 -23 c0 -34 -9 -43 -66 -72 -52 -26 -114 -80 -114 -98 0 -6 4 -8 9 -4 5 3 11 0 14 -7 2 -7 3 -5 2 4 -2 9 3 19 11 22 10 4 14 -3 15 -22 l0 -27 10 25 c8 20 12 22 19 10 9 -13 10 -13 11 0 0 10 3 8 9 -5 8 -19 9 -19 9 4 1 16 5 21 16 17 9 -3 15 0 15 9 0 9 6 12 15 9 9 -4 15 0 15 10 0 10 6 13 15 10 9 -4 15 0 15 9 0 14 28 32 37 24 2 -2 -8 -24 -22 -48 -29 -51 -32 -81 -9 -100 15 -12 16 -11 9 11 -7 22 -6 23 9 11 15 -12 16 -12 10 5 -7 18 -6 18 16 -1 20 -17 23 -18 17 -2 -4 9 -2 17 4 17 6 0 8 7 5 17 -6 15 -4 15 14 -2 11 -10 20 -13 20 -7 0 6 -4 14 -10 17 -5 3 -10 13 -10 21 0 10 9 5 25 -13 13 -15 25 -23 25 -16 0 6 -4 15 -10 18 -5 3 -10 14 -10 23 0 13 5 12 21 -8 14 -17 22 -21 26 -12 2 6 9 10 14 6 5 -3 9 3 10 13 0 16 1 16 9 -2 7 -16 9 -17 9 -3 1 16 27 18 51 3 5 -3 12 6 16 20 3 13 10 22 15 19 5 -3 6 1 3 9 -3 8 2 17 10 20 14 5 16 -4 16 -56 l0 -62 -48 -22 c-26 -12 -72 -38 -102 -57 -44 -29 -77 -40 -160 -56 -133 -25 -174 -43 -194 -85 -27 -56 -19 -72 15 -32 l19 22 -6 -32 c-4 -20 -2 -33 4 -33 5 0 13 15 16 33 l7 32 16 -35 16 -35 7 30 c6 28 6 29 14 8 9 -27 26 -31 26 -7 0 14 3 14 15 4 13 -11 15 -8 15 16 1 26 2 27 14 12 14 -19 32 -25 21 -8 -3 6 -2 10 3 10 6 0 12 -6 15 -14 4 -11 -13 -22 -62 -41 -96 -36 -154 -76 -174 -118 -19 -39 -24 -73 -7 -47 7 12 10 8 10 -15 l1 -30 11 25 c10 23 11 23 15 5 8 -35 24 -42 17 -7 -8 39 8 42 23 5 10 -27 11 -26 12 17 2 44 2 45 16 20 l14 -25 1 25 c1 23 2 23 20 -10 l19 -35 1 39 c0 37 1 39 15 20 14 -18 14 -17 9 16 l-5 35 19 -22 c11 -13 22 -23 25 -23 3 0 3 10 -1 23 -5 21 -4 21 14 5 19 -17 20 -16 17 20 -3 35 -3 36 8 12 10 -21 13 -22 16 -7 4 15 7 16 19 6 13 -11 14 -8 8 17 -7 27 -6 28 11 14 17 -14 18 -13 13 8 -4 12 -2 22 3 22 5 0 9 -4 9 -10 0 -5 5 -10 11 -10 5 0 8 4 5 9 -12 18 21 18 45 0 32 -25 42 -24 28 4 -11 21 -11 21 6 7 17 -14 17 -13 10 10 l-8 25 23 -20 c20 -17 22 -18 17 -2 -4 9 -10 25 -14 35 -5 13 0 11 20 -7 15 -14 27 -31 27 -38 0 -21 -79 -102 -142 -144 -78 -53 -315 -169 -346 -169 -62 0 -149 -68 -167 -130 -7 -24 -5 -23 29 9 l36 35 0 -40 0 -39 19 41 c20 43 43 67 35 36 -3 -9 -1 -28 4 -41 8 -21 9 -20 22 18 7 23 16 41 19 41 3 0 7 -23 8 -50 3 -55 12 -48 -92 -70 -105 -23 -159 -62 -180 -130 l-7 -25 25 24 26 23 -5 -23 -5 -24 13 23 c11 18 16 20 27 10 10 -11 15 -10 25 5 17 23 24 22 29 -5 3 -20 5 -19 12 10 9 39 22 41 32 5 l7 -28 6 35 6 35 14 -27 c15 -32 30 -37 30 -10 1 13 4 11 15 -8 l14 -25 1 24 0 24 26 -24 27 -24 -13 25 c-13 25 -13 25 7 7 20 -17 20 -17 15 10 -5 25 -3 26 11 15 13 -11 16 -10 20 5 3 13 5 11 6 -7 l2 -25 12 25 11 25 4 -27 c2 -16 8 -28 14 -28 6 0 8 10 4 25 -8 31 0 32 25 3 17 -22 18 -22 19 -4 0 20 0 20 15 0 14 -18 14 -18 16 6 l1 25 7 -25 c7 -23 8 -23 13 -5 4 11 10 36 14 55 l7 35 18 -40 c16 -34 19 -37 19 -15 1 24 1 24 15 6 15 -20 15 -20 15 0 1 14 6 9 20 -16 l19 -35 1 40 1 40 19 -40 c10 -22 19 -33 20 -25 0 8 7 2 15 -15 l13 -30 1 35 1 35 20 -25 c11 -14 20 -20 20 -15 0 6 4 4 9 -4 7 -11 10 -9 16 8 9 30 24 26 22 -6 -3 -41 -17 -50 -77 -50 -34 0 -72 -8 -100 -21 l-45 -20 42 3 c41 3 42 3 31 -21 -6 -13 -15 -24 -20 -24 -12 0 -10 14 5 30 6 8 0 4 -15 -9 l-26 -23 -64 25 c-126 50 -307 53 -430 7 -87 -32 -204 -112 -192 -131 2 -4 -6 -6 -18 -3 -13 3 -83 8 -156 11 -74 3 -129 9 -122 13 6 4 22 6 36 4 13 -1 26 2 29 6 3 5 12 7 20 3 8 -3 15 0 15 7 0 7 7 10 15 6 8 -3 15 -1 15 4 0 6 15 10 34 10 32 0 63 19 34 21 -7 0 3 8 22 16 30 13 32 16 16 23 -19 6 -19 7 -1 13 10 4 16 10 13 13 -3 2 -42 -9 -87 -26 -46 -17 -102 -30 -127 -30 -38 0 -44 3 -44 21 0 15 5 19 15 15 8 -3 15 -2 15 2 0 4 12 8 27 9 15 0 29 6 31 12 2 5 10 7 17 4 17 -6 49 23 41 36 -3 5 1 12 10 15 39 15 1 16 -60 1 -90 -20 -96 -20 -96 11 0 14 4 23 10 19 6 -3 10 -2 10 4 0 6 16 13 35 17 33 6 49 23 23 25 -7 0 -5 4 5 8 10 4 17 10 15 13 -2 3 6 15 16 27 29 32 15 33 -34 2 -59 -38 -92 -48 -84 -27 3 9 17 19 30 22 13 3 24 10 24 15 0 5 6 9 13 9 6 0 17 11 23 25 l12 24 -40 -20 c-22 -11 -47 -18 -56 -16 -12 3 -6 9 20 21 21 9 44 29 53 46 l15 30 -36 -25 c-47 -32 -76 -34 -49 -5 10 11 20 18 23 15 8 -8 42 15 42 30 0 12 -6 12 -37 -2 -21 -8 -41 -20 -44 -25 -8 -12 -43 5 -77 36 l-24 21 4 -29 c2 -17 15 -42 30 -56 15 -15 25 -30 21 -34 -4 -4 0 -4 9 -1 11 4 18 0 23 -15 12 -38 -6 -36 -40 3 l-33 38 -4 -26 c-3 -14 -1 -28 4 -31 6 -4 5 -10 -3 -15 -11 -7 -8 -11 9 -15 18 -5 20 -9 10 -15 -10 -7 -10 -9 0 -9 18 0 62 -46 62 -65 0 -20 -6 -19 -45 5 -18 11 -38 34 -45 50 -16 39 -30 38 -30 -1 0 -17 -4 -28 -10 -24 -5 3 -10 -1 -10 -10 0 -8 7 -18 15 -21 8 -4 12 -10 9 -15 -3 -5 2 -9 11 -9 10 0 13 -5 9 -12 -5 -8 -2 -9 9 -5 10 3 17 2 17 -3 0 -6 -24 -10 -52 -10 -29 0 -60 -5 -68 -10 -13 -8 -12 -10 4 -10 11 0 17 -3 13 -6 -8 -8 16 -33 26 -27 4 2 7 0 7 -5 0 -5 11 -8 25 -7 14 2 23 -1 19 -6 -8 -14 -31 -11 -74 10 -28 13 -40 15 -40 7 0 -15 54 -68 62 -61 3 3 8 -1 11 -10 8 -19 -15 -20 -79 0 -65 20 -73 19 -67 -5 3 -11 10 -20 17 -20 6 0 4 -5 -4 -10 -8 -5 -10 -10 -4 -10 20 0 56 -38 42 -43 -7 -2 6 -7 30 -11 23 -4 40 -11 37 -16 -8 -12 30 -18 50 -7 12 6 16 6 11 -1 -4 -7 7 -9 29 -8 19 2 35 0 35 -3 -1 -22 -26 -34 -88 -41 -91 -12 -151 -1 -188 34 -41 39 -149 101 -214 122 -43 15 -82 19 -185 18 -127 -1 -157 -7 -252 -45 -30 -12 -34 -11 -59 11 l-27 25 18 -27 c9 -16 13 -28 9 -28 -5 0 -15 10 -22 21 -18 29 -3 43 31 30 41 -16 32 -4 -14 20 -32 16 -55 20 -100 17 -63 -3 -69 2 -68 62 l0 25 15 -28 c16 -29 27 -26 52 18 10 18 11 17 12 -12 0 -18 5 -33 10 -33 6 0 10 12 10 26 0 22 2 25 15 14 12 -10 15 -9 15 7 0 10 7 28 15 39 14 18 15 16 9 -18 -7 -45 0 -48 20 -10 13 23 15 24 16 7 1 -17 3 -16 16 8 19 36 25 34 19 -5 l-5 -33 12 32 c7 18 19 38 27 45 11 11 12 9 6 -11 -5 -16 -4 -21 4 -17 6 4 9 2 6 -7 -3 -7 -1 -24 4 -38 7 -17 10 -19 10 -6 1 9 6 17 11 17 6 0 10 -8 10 -17 0 -15 2 -16 10 -3 8 12 10 12 10 -5 1 -17 4 -16 25 10 l25 30 1 -35 c1 -20 3 -26 6 -15 10 45 16 51 23 25 l8 -25 1 25 c2 23 3 23 12 6 9 -15 13 -16 20 -5 6 10 9 5 9 -15 0 -25 2 -27 17 -15 15 13 15 12 4 -11 -12 -24 -11 -24 13 3 l26 28 0 -28 1 -28 16 30 c15 26 18 27 21 11 4 -18 5 -18 23 5 l19 24 1 -35 1 -35 11 26 c12 27 31 37 33 19 1 -5 2 -18 3 -27 2 -14 5 -12 12 7 10 24 11 24 22 5 15 -26 37 -30 37 -8 1 14 4 12 15 -7 13 -22 14 -23 15 -5 1 19 2 18 22 -5 l21 -25 -7 29 c-18 75 -80 117 -204 138 l-72 12 6 51 c4 27 8 52 10 53 1 2 8 -15 15 -37 13 -45 25 -43 31 4 l4 30 22 -45 22 -45 0 33 c0 40 11 41 44 1 21 -24 26 -27 26 -12 0 57 -82 122 -177 142 -78 16 -331 153 -403 218 -82 75 -87 86 -56 124 26 31 35 24 16 -12 -13 -24 -2 -25 17 -1 13 15 14 14 8 -12 -6 -26 -4 -28 10 -16 13 11 14 10 9 -5 -8 -20 5 -16 40 14 18 15 19 15 12 -3 -5 -16 -4 -17 9 -6 12 10 15 10 15 0 0 -9 4 -9 16 1 15 12 16 11 9 -10 -6 -20 -5 -23 10 -17 14 5 16 2 12 -15 -4 -15 -2 -19 9 -15 8 3 14 -1 14 -10 0 -8 4 -12 10 -9 5 3 10 15 10 26 0 12 4 17 11 13 6 -4 9 -19 5 -38 -5 -29 -5 -30 9 -12 15 19 15 19 15 -5 l1 -24 21 25 21 25 -6 -40 -6 -40 20 25 21 25 -6 -37 c-6 -47 0 -48 19 -5 13 30 14 30 15 7 1 -24 1 -24 15 -6 13 17 14 15 17 -20 l3 -39 17 35 16 35 2 -40 c1 -22 4 -33 7 -25 14 43 16 44 23 15 l8 -30 1 35 c1 27 4 31 11 20 8 -12 10 -11 10 6 0 21 -30 67 -60 92 -25 21 -102 59 -147 72 -41 13 -55 32 -33 45 5 3 10 -2 10 -12 1 -14 4 -13 15 7 l14 25 1 -27 c0 -29 15 -38 23 -15 3 7 9 2 15 -13 l10 -25 7 27 c8 32 25 28 26 -5 1 -19 2 -18 14 8 l13 30 16 -35 15 -35 1 35 0 35 20 -25 c19 -25 20 -25 20 -3 0 69 -52 102 -203 128 -75 14 -110 25 -155 53 -88 55 -144 82 -154 76 -5 -3 -8 20 -6 57 3 71 18 85 37 34 11 -30 15 -34 32 -25 13 8 19 7 19 0 0 -6 5 -8 10 -5 6 3 10 0 10 -7 0 -10 2 -10 9 1 6 9 11 10 15 2 4 -6 12 -9 17 -6 5 4 9 0 9 -7 1 -7 9 -3 20 11 18 21 20 21 20 4 0 -10 -5 -24 -12 -31 -8 -8 -8 -12 -1 -12 6 0 18 12 28 26 9 14 19 23 22 20 3 -3 -2 -18 -12 -33 l-18 -28 23 20 23 20 -8 -24 c-5 -18 -4 -22 6 -16 9 6 11 3 6 -8 -8 -20 4 -22 22 -4 12 10 13 8 7 -8 -6 -20 -6 -20 9 -1 15 19 15 19 15 -2 0 -19 2 -21 14 -10 16 15 8 52 -23 104 -16 26 -17 34 -6 34 7 0 20 -7 28 -15 8 -8 17 -11 21 -8 3 4 6 -2 6 -11 0 -14 5 -17 20 -13 18 4 20 2 14 -16 -6 -19 -5 -20 10 -8 14 12 16 10 17 -15 1 -20 3 -23 6 -10 4 15 7 16 14 5 6 -10 9 -10 9 -1 0 18 18 15 23 -5 3 -11 5 -8 6 9 1 19 5 26 15 22 8 -3 13 -13 11 -22 -1 -9 0 -11 2 -4 4 11 8 11 21 0 13 -11 13 -8 -2 18 -18 30 -86 82 -138 105 -16 7 -28 18 -28 25 0 7 -3 19 -6 28 -9 25 11 19 25 -6 l12 -23 -5 23 c-4 23 -4 23 15 6 21 -19 24 -13 9 17 -20 36 -68 51 -194 59 -98 6 -129 12 -159 30 -31 18 -37 27 -36 53 0 18 3 26 6 19 2 -6 9 -10 14 -6 5 3 9 0 9 -7 0 -7 3 -9 7 -6 3 4 17 -3 30 -15 l23 -21 0 34 c0 25 3 30 10 19 5 -8 12 -11 16 -8 11 11 44 -11 44 -29 0 -14 2 -14 16 3 15 18 15 18 9 -3 -8 -28 11 -31 20 -3 9 30 23 24 18 -7 l-3 -28 11 25 c10 21 13 22 16 7 3 -9 9 -15 14 -12 5 4 9 0 9 -7 0 -9 3 -9 10 2 8 13 11 12 25 -5 9 -11 14 -14 10 -7 -3 6 -1 12 5 12 7 0 14 -9 17 -20 3 -11 10 -20 15 -20 6 0 7 7 4 16 -3 8 -2 12 4 9 14 -8 12 5 -4 34 -7 13 -31 36 -51 50 -21 14 -40 33 -43 41 -3 9 6 5 22 -9 18 -17 26 -20 26 -10 0 10 2 11 8 2 4 -6 14 -13 22 -15 8 -2 21 -10 28 -18 12 -13 13 -13 8 2 -7 23 15 29 39 9 19 -16 19 -15 4 9 -31 48 -63 63 -149 68 -74 4 -80 3 -73 -13 4 -13 3 -16 -5 -11 -7 4 -49 10 -95 14 -76 6 -82 9 -85 30 -2 13 0 31 3 40 6 15 8 15 15 -3 l9 -20 1 20 c1 20 1 20 15 1 9 -11 15 -14 15 -7 0 9 5 8 16 -3 21 -22 68 -22 60 0 -3 8 -2 12 4 9 6 -3 10 -14 10 -23 0 -15 2 -15 11 -2 8 11 12 12 16 3 2 -7 9 -13 14 -13 6 0 7 5 4 10 -3 6 0 10 7 10 22 1 -54 59 -91 70 -123 36 -111 28 -111 82 0 26 2 48 5 48 3 0 11 -16 20 -36 8 -19 19 -33 25 -29 5 3 10 0 10 -7 0 -10 2 -10 9 1 7 11 9 11 14 0 4 -10 6 -10 6 -1 1 6 6 12 12 12 6 0 8 -9 4 -22 -4 -16 -3 -19 3 -9 8 11 10 11 15 0 4 -11 6 -11 6 0 1 11 5 10 16 -5 9 -12 14 -14 15 -6 0 7 5 10 11 6 8 -4 8 -1 1 13 -17 30 -94 97 -129 112 -39 16 -44 35 -8 29 22 -5 24 -3 18 21 -6 23 -5 25 11 12 25 -21 31 -6 6 19 -13 13 -29 20 -41 17 -14 -4 -19 0 -19 16 0 16 -3 18 -9 8 -6 -9 -11 -10 -15 -2 -10 16 -38 14 -63 -4 -25 -17 -21 -47 5 -38 11 5 14 2 9 -10 -5 -15 -3 -16 12 -7 11 5 27 17 36 27 16 15 17 11 10 -63 -4 -43 -8 -80 -9 -81 -1 -1 -19 -4 -41 -6 -67 -8 -201 -71 -234 -111 -12 -14 -12 -16 3 -10 14 5 16 2 10 -20 -8 -34 1 -33 20 2 l15 27 1 -30 0 -30 20 33 c24 39 29 40 22 6 -6 -31 -33 -49 -87 -59 -48 -8 -97 -37 -125 -72 -28 -36 -25 -51 5 -23 l25 24 -5 -35 -6 -34 20 37 c27 48 44 58 36 21 l-6 -28 15 25 15 25 2 -30 1 -30 10 35 11 35 10 -35 c10 -32 11 -33 15 -10 l4 25 12 -30 13 -30 7 38 c8 43 25 50 27 10 1 -21 2 -23 6 -8 7 30 23 43 23 20 1 -15 4 -12 15 10 l13 30 2 -35 c1 -19 4 -28 7 -20 15 41 36 80 44 80 5 0 6 -15 4 -32 -4 -26 -3 -29 4 -13 l10 20 1 -20 c1 -14 7 -8 20 20 l19 40 0 -48 c1 -48 1 -48 -29 -44 -23 4 -31 1 -35 -14 -11 -35 -82 -62 -187 -70 -107 -8 -144 -23 -182 -71 -31 -40 -25 -50 10 -17 l26 24 -7 -35 -7 -35 28 37 c33 43 44 47 37 16 l-5 -23 20 23 c26 29 30 28 24 -5 l-5 -28 21 25 c20 23 21 24 22 5 1 -20 1 -20 15 -1 8 11 16 17 16 13 1 -6 2 -11 8 -34 1 -5 6 2 11 15 11 26 30 29 31 5 0 -11 6 -6 15 14 17 39 34 51 34 24 0 -12 5 -21 10 -21 6 0 10 7 10 16 0 8 4 13 9 9 5 -3 12 4 16 15 3 11 11 20 17 20 5 0 8 -7 4 -15 -3 -8 -1 -15 4 -15 6 0 10 7 10 15 0 8 4 15 9 15 4 0 7 -13 5 -30 -5 -39 2 -38 20 3 l14 32 1 -36 c1 -39 5 -36 -138 -103 -14 -7 -67 -10 -131 -8 -131 3 -173 -10 -230 -76 -46 -51 -55 -80 -11 -33 16 17 33 31 37 31 4 0 -3 -11 -16 -25 -24 -25 -16 -36 9 -12 11 10 12 7 7 -13 -5 -17 0 -13 14 13 23 42 34 48 25 15 -4 -17 -1 -15 11 7 10 17 19 25 22 17 2 -8 10 -5 23 10 l20 23 -7 -25 c-6 -25 -6 -25 11 -5 l17 20 -6 -20 c-5 -17 -3 -16 14 5 12 15 20 19 20 11 0 -11 5 -9 22 5 21 19 21 19 14 0 -7 -19 -6 -19 14 -1 11 10 20 13 20 7 0 -7 -29 -30 -65 -53 -63 -39 -115 -103 -115 -140 0 -12 2 -12 9 0 7 11 10 10 13 -5 4 -16 6 -14 12 9 5 15 12 27 18 27 5 0 7 -4 4 -8 -2 -4 4 -8 15 -8 12 0 19 7 19 21 0 16 2 17 10 5 9 -13 10 -13 10 1 0 8 6 24 14 34 13 18 14 17 30 -11 l17 -29 -5 27 c-6 29 1 58 15 58 4 0 15 -12 24 -27 l15 -28 -1 30 c-2 52 2 61 13 35 11 -25 12 -25 15 -3 3 14 9 20 18 17 9 -4 15 4 18 23 4 25 4 25 6 -7 1 -19 6 -42 12 -50 7 -11 8 -5 3 23 -6 37 10 55 19 20 3 -11 5 -5 6 12 l2 30 14 -30 13 -30 1 39 c1 28 5 37 15 33 8 -3 17 3 22 16 6 18 8 13 11 -22 2 -24 2 -49 -1 -57 -3 -7 -63 -41 -133 -75 -188 -90 -312 -184 -296 -226 6 -15 7 -14 14 3 4 10 8 15 8 9 1 -5 10 4 21 20 l20 30 1 -30 c0 -29 1 -29 10 -7 5 13 13 20 19 17 5 -3 10 0 10 7 1 8 6 6 15 -6 14 -19 15 -18 15 17 0 38 15 51 23 20 3 -11 5 -6 7 12 l2 30 13 -35 13 -35 1 33 c1 20 6 32 15 32 7 0 17 10 21 23 7 21 8 21 15 -8 l8 -30 1 28 c0 15 5 27 10 27 5 0 12 -12 14 -27 4 -27 4 -26 6 4 1 37 21 55 22 21 0 -13 3 -17 6 -10 2 6 9 10 14 6 5 -3 9 4 9 15 0 12 5 21 11 21 6 0 8 -8 5 -17 -3 -10 -1 -25 4 -33 7 -12 10 -8 11 15 0 17 3 24 6 18 7 -18 23 -16 23 2 0 8 4 15 10 15 5 0 6 -7 3 -17 -4 -11 -3 -14 5 -9 8 5 12 -1 12 -17 0 -18 -8 -28 -27 -35 -16 -5 -59 -35 -98 -67 -90 -73 -175 -116 -305 -153 -131 -39 -177 -73 -195 -142 l-6 -25 15 25 15 25 1 -30 1 -30 16 38 c16 40 29 47 36 20 3 -12 5 -10 6 7 1 14 5 32 10 39 6 10 8 1 4 -26 -3 -25 -1 -43 6 -47 7 -5 11 2 11 16 0 13 5 30 10 38 8 12 10 10 11 -10 0 -14 3 -19 6 -10 14 44 16 45 23 20 l8 -25 1 28 c1 32 21 37 21 5 1 -21 2 -20 17 7 15 26 18 27 21 11 4 -18 5 -18 18 5 l13 24 1 -32 c0 -25 4 -31 15 -27 10 4 15 0 15 -12 1 -18 1 -18 11 0 9 15 13 16 20 5 6 -10 9 -3 10 21 l1 35 13 -30 14 -30 1 30 c1 17 5 39 10 50 8 18 9 17 9 -7 1 -40 21 -46 21 -6 0 25 3 29 10 18 8 -13 10 -12 10 3 0 10 5 15 10 12 6 -4 10 6 10 24 0 52 18 44 25 -11 11 -81 24 -93 26 -23 1 33 3 51 6 40 7 -27 23 -43 24 -25 0 10 4 7 9 -5 6 -15 9 -8 9 28 1 52 20 66 22 15 1 -30 2 -29 8 9 10 57 21 66 21 17 l1 -39 12 29 c12 26 12 21 9 -45 -2 -41 -6 -76 -7 -77 -2 -2 -61 -17 -132 -32 -208 -47 -263 -72 -313 -145 -24 -34 -41 -47 -82 -60 -29 -10 -67 -24 -83 -31 -33 -15 -65 -61 -65 -91 1 -14 4 -12 15 8 8 15 21 29 29 32 12 5 12 -1 4 -30 -12 -44 -5 -53 12 -13 16 38 30 39 30 1 0 -17 4 -33 10 -36 6 -3 10 5 10 18 0 14 9 35 20 48 l19 24 -6 -37 c-7 -45 8 -50 24 -8 14 38 31 39 27 3 -4 -27 -4 -27 11 4 23 49 35 50 36 1 l1 -43 9 40 c15 63 29 66 29 6 l0 -53 20 23 c17 21 19 21 13 4 -6 -18 -5 -18 10 -6 14 11 17 11 18 0 0 -8 4 -5 9 6 8 19 9 19 9 -2 1 -12 4 -28 7 -36 4 -12 -21 -15 -158 -20 -212 -6 -297 -32 -353 -105 l-19 -26 32 22 c35 26 36 25 22 -12 -13 -36 -7 -32 24 14 31 46 54 54 31 10 -23 -45 -18 -47 20 -4 21 23 32 31 28 19 -6 -18 -5 -18 10 -6 21 16 21 9 3 -27 -7 -15 -17 -38 -21 -52 -7 -24 -7 -25 9 -5 17 20 17 19 10 -5 l-7 -25 21 25 20 25 -4 -30 -5 -30 15 30 c8 17 15 23 15 15 1 -13 2 -13 11 0 7 12 10 8 11 -15 0 -26 2 -27 9 -10 6 13 9 15 9 5 1 -10 10 -5 26 15 l26 30 -7 -35 -7 -35 21 25 c19 23 21 24 28 7 5 -15 9 -16 15 -5 6 9 9 3 9 -17 l1 -30 15 35 c11 25 17 31 23 21 7 -11 10 -9 16 8 3 11 10 21 15 21 5 0 7 -8 4 -17 -4 -12 1 -10 16 7 14 16 20 19 16 8 -3 -10 -1 -20 4 -23 6 -4 10 -2 10 2 0 5 7 18 16 29 14 18 15 18 8 -6 l-7 -25 22 25 22 25 -16 -32 c-22 -47 -19 -47 26 0 38 39 41 37 21 -12 -3 -9 -1 -12 6 -7 8 4 12 0 13 -11 0 -15 2 -14 11 5 6 12 14 22 18 22 12 0 -1 -48 -19 -67 -9 -10 -18 -22 -19 -28 -5 -23 -24 -75 -28 -75 -2 0 -31 7 -64 17 -56 15 -67 15 -187 -2 -153 -21 -241 -46 -283 -82 -17 -14 -29 -28 -26 -31 3 -3 13 1 23 9 15 12 16 12 9 -5 -7 -20 -7 -20 15 0 l22 19 -7 -25 -7 -25 21 25 22 25 -7 -30 -6 -30 26 35 27 35 -7 -35 -7 -35 31 35 c16 19 30 29 31 22 0 -8 -25 -40 -57 -73 -31 -32 -54 -61 -51 -64 3 -3 13 4 23 15 10 11 22 20 26 20 10 0 -11 -50 -20 -50 -168 -7 -328 -66 -363 -135 -8 -14 -1 -11 22 10 l33 30 -7 -34 -6 -35 25 24 25 24 -6 -35 -6 -34 27 40 c21 32 25 35 21 15 l-5 -25 20 25 20 25 -6 -40 -7 -40 32 54 c22 37 35 50 40 41 6 -9 10 -8 19 6 10 18 10 18 11 -1 0 -17 3 -16 18 8 9 15 20 27 25 27 4 0 5 -4 2 -10 -9 -14 8 -12 24 3 11 10 12 7 6 -13 l-7 -25 27 25 c26 23 27 23 16 3 -6 -12 -32 -38 -57 -59 -44 -36 -74 -79 -74 -106 0 -7 9 2 20 19 23 38 34 43 25 11 -5 -21 -5 -21 9 2 l15 25 1 -25 c0 -23 0 -23 15 -5 8 11 24 31 35 45 l20 25 -10 -28 c-15 -42 -12 -46 9 -12 10 17 28 39 41 50 l23 20 -12 -22 c-19 -38 -11 -39 20 -3 28 32 30 33 25 10 l-5 -25 19 25 c18 23 20 23 20 5 0 -18 2 -18 21 5 l21 25 -5 -27 c-5 -35 -2 -35 18 0 15 26 16 26 9 2 l-6 -25 27 25 c21 18 26 20 22 8 -4 -10 -10 -26 -14 -35 -3 -11 10 -3 32 17 l37 35 -16 -33 c-10 -18 -16 -38 -14 -44 2 -6 10 3 17 20 14 33 34 45 25 15 -3 -10 2 -7 10 7 l15 25 1 -30 1 -30 19 35 c18 33 19 33 20 10 1 -24 1 -24 14 5 7 17 20 36 29 44 20 16 21 9 6 -22 -10 -22 -10 -22 10 1 10 12 21 22 24 22 3 0 3 -10 0 -22 -5 -23 -5 -23 11 -3 17 19 17 19 11 -9 l-6 -30 20 25 c23 27 26 22 10 -15 -14 -29 -118 -74 -254 -107 -83 -21 -323 -117 -353 -142 -17 -14 -38 -52 -24 -43 6 3 13 -2 15 -11 4 -16 5 -16 6 -1 1 10 9 16 20 15 12 -1 17 -7 14 -17 -3 -8 4 -3 13 13 22 33 34 35 26 5 -5 -21 -3 -20 22 7 15 17 25 23 23 13 -3 -9 15 4 39 29 25 25 48 42 52 39 3 -4 0 -12 -6 -18 -24 -24 -11 -31 15 -7 24 22 26 22 20 4 -6 -18 -5 -18 12 3 l20 22 3 -22 c3 -22 4 -22 20 7 l17 30 1 -35 0 -35 16 31 c9 18 27 42 40 55 l25 23 -16 -37 c-25 -60 -17 -66 15 -9 32 55 45 66 35 30 -5 -19 -3 -18 10 5 18 31 42 39 25 8 -23 -43 -9 -50 25 -13 l35 37 -6 -35 -6 -35 22 30 21 30 -6 -40 -6 -40 25 46 c13 25 32 51 40 58 14 12 15 10 10 -20 l-5 -34 16 28 c20 35 29 35 21 0 l-7 -28 21 25 c11 14 20 28 20 33 0 4 4 7 10 7 5 0 7 -8 4 -17 -3 -10 2 -7 10 7 l15 25 1 -25 1 -25 15 28 c20 36 28 34 20 -5 l-6 -32 30 29 30 29 0 -45 0 -44 -63 -23 c-35 -12 -108 -30 -163 -38 -54 -9 -108 -17 -119 -19 -11 -2 -25 -4 -32 -4 -7 -1 -22 -11 -35 -24 -13 -12 -19 -19 -14 -14 17 12 28 8 22 -8 -8 -21 4 -19 32 8 21 19 24 19 19 4 -4 -10 -7 -25 -7 -33 0 -12 -8 -13 -37 -8 -21 4 -44 11 -51 17 -24 19 -171 13 -271 -11 -132 -33 -192 -65 -221 -122 l-13 -25 27 25 27 25 -10 -28 c-14 -37 -5 -34 16 6 13 25 18 28 21 14 3 -15 6 -15 24 5 l20 23 -5 -23 c-3 -12 -1 -22 4 -22 5 0 9 6 9 14 0 7 7 19 15 26 12 10 15 9 15 -6 1 -16 4 -15 20 8 14 18 28 25 45 23 15 -1 25 3 25 10 0 7 7 18 15 25 12 10 15 9 15 -5 0 -14 3 -13 20 6 14 17 19 20 20 9 0 -22 -28 -60 -45 -60 -17 0 -85 -79 -85 -99 0 -9 9 -2 22 16 28 39 41 43 28 7 -16 -40 -11 -41 19 -4 l29 34 -4 -29 -5 -30 15 31 c20 43 39 54 30 17 l-7 -28 27 30 c27 30 28 30 22 5 l-5 -25 22 28 c26 31 43 36 27 8 -17 -33 -12 -46 12 -25 21 19 21 19 14 0 -6 -19 -6 -19 12 -3 27 24 33 21 21 -10 l-10 -27 22 19 c21 18 22 19 16 2 -6 -16 -4 -16 23 3 16 11 32 25 35 30 13 21 25 9 14 -12 l-12 -21 36 20 35 21 -6 -22 -5 -21 25 23 c30 28 41 28 33 1 -7 -20 -5 -20 31 5 51 35 57 33 33 -9 -26 -43 -17 -45 18 -5 28 33 46 39 36 13 -5 -15 -3 -16 8 -5 20 19 29 14 20 -10 -11 -29 -62 -46 -141 -47 -186 -2 -318 -39 -429 -119 -36 -27 -92 -65 -124 -85 -32 -21 -62 -48 -67 -63 -17 -45 -10 -50 12 -9 19 35 22 38 29 20 6 -17 8 -17 8 -2 1 9 6 17 12 17 5 0 7 -4 4 -10 -3 -5 -2 -10 3 -10 5 0 13 10 17 23 4 13 8 17 12 9 3 -8 11 -5 24 10 l18 23 1 -25 c1 -25 1 -25 17 5 14 24 18 26 21 12 3 -15 6 -15 22 5 l19 23 1 -24 c0 -24 0 -24 15 -5 8 11 15 14 15 7 0 -23 15 -13 30 20 l14 32 4 -54 3 -55 28 50 c16 27 38 57 49 67 20 18 20 18 12 -19 -11 -48 -7 -54 10 -15 6 16 21 38 32 48 20 18 21 18 14 -7 l-7 -25 20 25 21 25 0 -35 0 -34 30 34 31 35 -6 -32 c-4 -18 -4 -33 -1 -33 3 0 13 15 23 33 l17 32 6 -30 6 -30 21 45 c19 41 21 42 22 18 1 -28 21 -41 21 -14 0 8 5 18 12 22 8 5 9 0 5 -17 -6 -23 -5 -23 8 -5 8 11 15 25 16 30 0 6 4 2 8 -9 7 -18 9 -17 25 10 14 24 16 25 13 8 -7 -32 5 -28 28 10 l20 32 3 -45 4 -45 13 30 c11 24 14 26 15 10 1 -17 5 -15 30 15 l30 34 0 -26 c0 -24 -12 -32 -117 -84 -65 -31 -152 -76 -193 -99 -88 -49 -150 -72 -159 -58 -3 6 -20 10 -38 10 -29 0 -31 -2 -21 -20 7 -14 7 -17 -1 -13 -6 4 -11 1 -11 -6 0 -8 -17 -22 -39 -31 -44 -20 -93 -65 -85 -78 3 -5 -6 -13 -19 -18 -24 -9 -73 -68 -65 -77 3 -2 17 5 31 17 l27 20 0 -28 0 -28 20 25 20 25 0 -30 c0 -16 -4 -35 -8 -41 -9 -14 -99 -34 -153 -34 -45 0 -94 -21 -103 -45 -4 -13 -2 -14 14 -5 25 13 43 13 34 -1 -4 -8 1 -9 16 -4 19 6 22 4 17 -9 -18 -42 -18 -51 -1 -29 20 28 39 30 24 3 -13 -24 2 -27 21 -4 12 14 81 54 94 54 3 0 -1 -10 -9 -22 -27 -37 -18 -57 9 -23 22 26 25 27 25 10 1 -18 2 -17 15 5 l14 25 1 -30 c0 -28 20 -74 20 -49 0 18 35 23 55 8 17 -12 16 -14 -11 -24 -16 -6 -42 -14 -57 -17 -27 -6 -27 -6 -7 -20 12 -8 27 -12 35 -9 8 3 15 2 15 -3 0 -4 -20 -14 -45 -22 -42 -13 -45 -16 -32 -32 12 -18 15 -18 52 -3 21 9 40 14 43 11 7 -6 -77 -43 -116 -51 -29 -6 -29 -7 -12 -24 12 -12 27 -17 42 -13 18 4 12 -5 -25 -37 -51 -45 -53 -65 -4 -55 l32 6 -24 -19 c-31 -25 -14 -36 42 -27 l42 7 -35 -26 c-19 -15 -45 -29 -57 -33 -13 -3 -23 -8 -23 -12 0 -8 73 -6 88 3 7 4 12 3 12 -2 0 -6 -19 -21 -43 -35 -23 -14 -51 -35 -62 -47 l-20 -23 60 7 c42 4 65 12 76 26 9 10 19 16 23 13 3 -3 8 2 12 11 3 9 10 13 15 10 5 -3 9 0 9 5 0 6 7 11 15 11 12 0 15 -13 15 -60 l0 -59 -172 -88 -173 -88 1253 -3 c690 -1 1815 -1 2500 0 l1247 3 -195 91 -195 91 -3 51 c-3 58 4 63 38 27 13 -14 38 -29 57 -34 34 -10 76 -4 68 9 -3 4 10 11 28 15 33 7 32 9 -15 19 -37 8 -35 18 4 35 l33 15 -33 8 c-18 5 -30 13 -27 18 3 4 -1 11 -7 13 -7 3 -2 6 12 7 14 1 20 4 13 6 -7 3 -2 15 14 32 l25 27 -33 3 c-53 4 -79 11 -79 22 0 6 5 10 11 10 6 0 17 7 25 15 14 13 12 15 -15 15 -16 0 -33 5 -36 10 -4 6 7 8 29 5 29 -3 42 1 68 25 l32 30 -29 1 c-17 1 -22 3 -12 6 21 6 23 23 1 23 -8 0 -25 5 -37 12 -22 11 -22 12 7 24 l30 12 -32 7 c-41 9 -51 25 -15 25 15 1 39 7 52 14 24 13 24 13 -13 20 -32 6 -52 26 -26 26 6 0 10 5 10 10 0 6 -7 10 -15 10 -25 0 -17 14 18 30 l32 15 -30 3 c-49 5 -64 13 -40 22 17 7 17 9 3 9 -27 1 -21 25 12 49 37 28 38 41 3 35 -24 -4 -21 -1 18 25 60 39 70 54 27 41 -18 -5 -55 -9 -82 -9 l-48 0 23 21 24 21 -25 -6 c-69 -17 -80 -18 -80 -7 0 6 6 11 13 11 7 0 22 7 33 16 18 15 17 15 -13 10 -35 -6 -55 9 -25 18 16 5 52 54 52 70 0 3 -15 6 -32 6 -25 0 -29 3 -18 10 8 5 26 10 40 10 l25 1 -24 13 c-23 13 -22 14 30 20 66 8 101 26 52 26 -85 0 -193 38 -193 67 0 14 4 13 23 -5 13 -12 31 -22 40 -22 15 0 16 3 6 22 -10 18 -9 20 6 14 36 -13 66 -18 81 -12 14 5 13 9 -7 26 l-24 19 32 1 c17 0 44 5 60 11 27 11 24 13 -67 41 -91 29 -131 48 -100 48 13 0 13 2 0 10 -22 14 -6 22 24 11 28 -11 34 -3 14 18 -11 11 -9 12 10 6 23 -7 62 1 62 13 0 4 -30 15 -67 25 -75 20 -164 64 -171 86 -4 11 1 10 19 -2 30 -22 40 -21 32 1 -6 16 -5 16 14 0 11 -10 28 -18 38 -18 17 0 17 1 -1 21 -19 21 -19 21 1 19 54 -6 55 2 5 28 -29 16 -54 36 -56 45 -3 20 0 21 27 5 15 -9 23 -10 26 -2 2 6 16 9 31 8 15 -2 21 -1 15 2 -22 10 -14 24 15 24 52 0 56 16 7 30 -25 7 -50 21 -55 31 -15 27 -12 31 11 19 24 -13 41 -4 19 10 -11 7 -2 10 30 10 42 1 44 2 26 15 -19 14 -18 15 10 15 17 0 39 7 50 15 18 13 16 14 -25 15 -118 1 -285 47 -294 81 -5 20 3 25 18 10 6 -5 21 -12 34 -16 20 -6 23 -4 17 10 -5 14 -2 16 15 12 15 -4 19 -2 15 9 -4 11 -1 14 13 9 25 -7 37 11 13 20 -14 5 -12 9 13 20 30 13 29 13 -26 14 -41 1 -58 5 -63 16 -4 11 2 15 25 15 18 0 28 4 24 10 -4 6 6 10 22 11 15 0 22 3 16 6 -18 7 -16 23 2 23 8 0 15 3 15 8 0 4 -55 8 -121 10 -117 2 -189 18 -189 40 0 13 33 10 42 -3 4 -6 8 -2 8 9 0 14 3 16 13 7 8 -6 17 -8 20 -4 4 3 13 0 22 -7 12 -10 15 -10 15 0 0 10 3 10 15 0 12 -10 15 -9 15 5 0 14 3 15 15 5 12 -10 15 -10 15 1 0 10 3 10 12 1 17 -17 29 -15 22 3 -7 18 0 19 27 5 11 -7 19 -7 19 -1 0 5 -6 12 -12 14 -7 3 1 6 19 6 17 1 34 5 37 10 9 14 -110 31 -212 31 -51 0 -92 4 -92 8 0 5 16 8 35 7 19 -2 35 2 35 7 0 5 9 6 20 3 11 -4 20 -2 20 4 0 6 7 8 15 5 8 -4 15 -1 15 5 0 6 13 11 29 11 31 0 50 15 29 23 -7 2 2 7 20 11 31 7 45 26 20 26 -9 0 -8 4 2 11 22 15 -21 6 -92 -20 -32 -12 -78 -21 -103 -21 -38 0 -45 3 -45 20 0 13 5 18 15 14 8 -4 15 -1 15 6 0 6 5 8 10 5 6 -3 10 -3 10 2 0 4 16 9 35 10 38 2 67 24 72 55 3 20 0 19 -87 -3 -62 -16 -80 -12 -78 16 2 16 7 24 15 21 7 -3 13 -1 13 4 0 4 13 11 30 15 31 7 51 24 28 26 -7 0 -5 4 5 8 10 4 18 11 18 16 0 6 8 18 16 28 28 30 10 27 -47 -9 -30 -19 -60 -34 -67 -34 -27 0 -11 21 35 44 26 14 43 25 38 26 -5 0 -1 10 10 21 l19 22 -42 -22 c-46 -23 -73 -27 -73 -11 0 6 7 10 15 10 22 0 66 30 59 41 -3 5 0 9 5 9 6 0 11 4 11 9 0 5 -20 -2 -45 -16 -35 -19 -45 -21 -45 -10 0 14 19 27 48 33 8 1 17 5 20 9 7 6 12 35 6 35 -10 0 -80 -36 -86 -45 -4 -6 -18 -1 -35 11 -51 37 -55 38 -51 13 3 -21 26 -49 76 -89 6 -6 12 -18 12 -28 0 -12 -5 -9 -17 10 -22 34 -111 82 -181 97 -29 6 -118 11 -199 11 -128 0 -144 2 -139 16 3 9 6 25 6 37 0 17 3 19 9 8 5 -7 14 -10 20 -7 6 4 11 1 12 -6 0 -7 4 -4 9 7 8 19 8 19 18 -5 9 -21 11 -17 11 33 1 63 16 70 27 12 3 -19 11 -35 16 -35 6 0 8 14 4 35 -9 47 1 44 24 -7 l18 -42 4 35 3 34 22 -45 23 -45 0 45 c0 51 13 45 35 -16 l14 -39 1 32 c0 43 16 50 35 16 l16 -28 -6 38 c-7 45 6 43 36 -7 21 -34 25 -23 8 21 -18 47 -50 72 -119 93 -59 18 -73 27 -118 79 -44 51 -62 62 -124 85 -40 14 -124 37 -186 51 -62 13 -117 27 -123 30 -5 4 -9 39 -8 78 1 51 3 65 9 47 8 -24 8 -23 9 8 1 45 21 31 21 -16 0 -37 14 -35 23 3 3 11 5 0 6 -24 1 -42 2 -43 16 -25 11 15 15 16 16 4 1 -8 5 -1 9 15 6 24 8 17 9 -35 2 -69 6 -67 34 25 l16 50 0 -38 c1 -23 5 -36 11 -32 6 3 10 -2 10 -12 0 -14 2 -15 9 -4 6 10 11 6 19 -15 l10 -29 1 30 c1 42 19 19 23 -30 l4 -40 11 35 11 35 1 -40 c2 -37 3 -39 16 -21 15 19 15 19 15 -5 l1 -24 14 25 c9 16 15 20 16 10 1 -8 5 1 9 20 l7 35 11 -25 11 -25 1 25 1 25 16 -29 c15 -28 16 -29 29 -11 13 18 14 18 14 1 0 -15 3 -16 15 -6 13 10 15 9 16 -11 1 -17 3 -19 6 -6 6 24 23 11 23 -19 0 -39 20 -27 21 14 1 22 3 28 6 15 3 -14 9 -20 19 -16 9 3 19 -6 29 -28 13 -31 14 -32 15 -9 1 25 1 25 16 5 16 -19 16 -19 9 5 -20 70 -58 97 -193 135 -119 33 -229 89 -307 155 -32 27 -73 56 -92 65 -21 10 -33 23 -33 36 0 11 5 17 10 14 6 -3 10 4 10 17 l1 23 14 -25 c9 -15 15 -19 15 -10 0 9 6 5 15 -10 l14 -25 2 35 c1 21 3 27 6 16 3 -11 11 -26 19 -34 12 -11 14 -10 14 7 0 37 19 23 22 -16 l4 -38 11 35 11 35 1 -30 2 -30 14 25 c11 19 14 21 15 8 0 -10 7 -18 15 -18 15 0 19 -10 15 -44 -1 -11 3 -15 9 -12 6 4 11 17 12 29 1 19 2 18 14 -8 11 -23 14 -26 15 -10 0 16 2 17 10 5 5 -8 7 -26 4 -40 -5 -25 -5 -25 8 -3 11 17 16 19 29 10 9 -7 18 -19 22 -27 3 -10 6 -7 6 9 1 20 3 21 16 11 8 -7 15 -19 15 -28 0 -8 3 -12 7 -9 3 4 12 2 20 -4 10 -9 13 -8 13 4 0 43 -133 140 -306 223 -65 31 -122 62 -126 68 -11 17 -9 96 2 96 6 0 10 -10 10 -21 0 -17 3 -19 14 -10 19 16 30 -2 22 -35 -8 -30 2 -32 14 -1 8 21 9 20 10 -8 l1 -30 14 25 14 25 2 -35 1 -35 8 29 c5 16 6 34 3 39 -3 6 -1 7 5 3 7 -4 12 -14 12 -22 0 -8 7 -14 15 -14 9 0 15 -10 16 -22 1 -22 1 -22 8 2 9 33 25 9 17 -26 -4 -14 -2 -24 4 -24 5 0 10 5 10 11 0 6 6 17 14 24 12 12 15 12 20 -1 3 -9 6 -28 7 -42 0 -26 1 -26 9 -4 16 39 39 21 41 -31 0 -21 1 -21 9 -2 8 18 9 19 9 1 1 -12 6 -16 16 -12 8 3 15 0 15 -7 0 -8 3 -8 9 2 6 10 11 6 19 -15 7 -19 11 -23 11 -11 1 10 6 15 11 12 14 -9 12 12 -4 43 -19 36 -60 73 -118 107 -27 15 -48 31 -48 36 0 13 14 11 29 -3 11 -10 13 -10 7 0 -9 15 6 16 22 0 9 -9 12 -9 12 3 0 9 8 5 21 -11 11 -14 18 -20 15 -14 -3 7 1 15 10 18 17 6 58 -17 75 -43 9 -14 10 -14 5 2 -8 27 2 20 25 -15 12 -18 19 -25 15 -15 -6 20 4 22 24 5 8 -8 7 -1 -4 17 l-17 30 30 -33 c17 -18 31 -28 31 -24 0 23 -50 79 -94 107 -49 30 -51 30 -168 27 l-119 -3 -74 37 c-73 36 -86 52 -84 99 0 13 7 7 19 -20 l19 -40 1 40 2 40 11 -30 11 -30 7 25 7 25 7 -22 c4 -13 11 -20 16 -18 4 3 12 -3 18 -12 9 -16 10 -16 11 5 0 33 23 23 36 -17 10 -32 11 -32 21 -9 l10 23 16 -30 16 -30 1 30 1 30 14 -25 c11 -19 14 -21 15 -7 0 9 4 17 10 17 5 0 14 -8 19 -17 9 -16 10 -15 11 7 l1 25 25 -29 25 -28 -6 28 -6 29 32 -35 31 -35 -6 35 -6 34 31 -29 32 -30 -19 33 c-31 55 -74 74 -184 83 -106 8 -185 37 -194 72 -4 15 -10 18 -29 13 -27 -6 -37 13 -36 69 l1 30 19 -40 c10 -22 19 -33 19 -25 0 13 1 13 10 0 7 -12 10 -8 10 15 l0 30 20 -25 c11 -14 20 -36 21 -50 1 -20 3 -18 9 10 7 32 8 33 15 13 8 -25 21 -30 28 -10 3 6 6 -1 7 -18 l2 -30 12 34 c10 28 14 31 19 17 4 -10 7 -29 7 -42 0 -34 20 -20 21 14 l0 27 12 -25 11 -25 4 30 4 30 19 -35 19 -35 -6 30 -6 30 22 -25 c21 -24 22 -20 3 28 -12 31 23 -5 37 -38 15 -36 34 -41 20 -5 -12 31 -4 32 28 3 24 -22 24 -22 14 -2 -24 46 -89 92 -146 104 -62 13 -86 30 -86 63 1 20 2 20 18 -5 20 -34 36 -37 27 -5 -6 21 -6 21 15 -3 l22 -25 -7 29 c-6 27 -5 28 11 15 16 -13 16 -12 6 7 -6 12 -26 30 -44 41 -45 27 -167 72 -203 76 -30 4 -30 4 -35 78 -3 41 -5 76 -3 78 2 2 11 -4 20 -15 21 -22 43 -29 43 -13 0 6 7 9 14 6 11 -4 13 -1 9 10 -5 12 -3 14 8 9 8 -4 3 2 -11 13 -24 20 -46 24 -83 14z m92 -1583 c1 12 3 13 10 1 7 -11 10 -11 17 0 10 16 21 -16 24 -71 1 -19 4 -27 7 -17 2 9 9 17 14 17 5 0 9 7 9 15 0 8 5 15 10 15 6 0 10 8 10 18 0 27 19 -7 21 -38 1 -21 2 -22 6 -5 3 11 9 24 14 30 5 5 9 18 10 30 0 14 6 8 20 -20 16 -35 19 -37 19 -15 1 23 2 23 10 5 5 -11 9 -15 9 -10 1 6 6 3 11 -5 8 -12 10 -12 10 5 0 17 2 17 10 5 8 -12 10 -12 10 5 1 35 20 -5 20 -41 0 -30 -2 -32 -42 -36 -54 -6 -170 -37 -183 -49 -5 -5 -22 -9 -37 -9 l-28 0 1 98 c0 63 3 90 9 77 6 -13 9 -15 9 -5z m-2558 -105 l8 20 1 -20 1 -20 9 20 c6 13 9 -12 9 -74 l1 -93 -32 5 c-18 3 -58 13 -88 22 -30 9 -81 22 -112 28 -53 10 -58 13 -58 36 0 33 20 67 20 36 0 -17 2 -17 10 -5 8 13 10 12 10 -4 0 -17 2 -17 20 4 18 21 20 21 20 4 1 -13 6 -9 20 16 18 33 19 33 20 10 0 -20 2 -22 10 -10 7 11 10 6 11 -20 l1 -35 9 33 c9 29 12 31 24 18 8 -8 15 -22 15 -32 0 -10 3 -14 7 -10 4 3 12 -6 18 -20 10 -25 11 -22 12 29 2 60 14 97 22 62 l4 -20 8 20z m3289 -112 c0 -7 5 -13 11 -13 6 0 9 -6 6 -13 -3 -8 3 -20 13 -27 11 -8 17 -17 14 -22 -3 -4 2 -8 11 -8 9 0 13 -4 10 -10 -3 -5 1 -10 9 -10 9 0 16 -9 16 -20 0 -11 -3 -20 -7 -20 -21 0 -74 43 -89 71 -12 25 -18 29 -25 18 -5 -8 -6 -22 -3 -31 4 -13 0 -18 -13 -18 -16 -1 -16 -3 4 -19 12 -10 19 -21 16 -25 -4 -3 1 -6 11 -6 9 0 15 -4 12 -9 -4 -5 0 -12 6 -14 7 -3 -5 -6 -27 -6 -56 -2 -90 -12 -74 -22 27 -17 0 -18 -96 -4 -122 17 -195 19 -232 4 -15 -6 -44 -13 -63 -14 -19 -2 -29 -1 -22 2 19 7 14 38 -14 88 -29 53 -30 100 0 50 9 -16 15 -21 11 -11 -3 11 0 23 7 27 11 7 11 12 0 29 -19 32 -3 24 35 -17 l35 -38 -16 33 c-18 34 -12 43 10 15 13 -17 13 -17 14 2 1 17 3 16 16 -7 17 -33 29 -37 21 -8 -7 27 7 25 22 -2 l12 -23 -5 23 c-6 30 1 28 25 -10 18 -29 20 -30 14 -8 -6 24 -5 24 9 6 9 -11 16 -26 16 -33 0 -7 5 -13 11 -13 6 0 8 7 5 16 -4 11 -2 15 8 11 10 -4 16 2 18 16 3 21 5 20 21 -8 l18 -30 -4 33 c-4 36 7 42 23 12 6 -11 15 -18 20 -15 4 3 11 -1 13 -7 3 -7 6 -3 6 9 1 24 27 26 42 2 7 -11 9 -10 9 6 1 20 1 20 15 1 8 -11 15 -14 15 -7 0 7 5 9 11 5 13 -8 4 25 -17 68 -19 38 -17 44 6 23 20 -18 21 -18 14 1 -9 23 -4 20 35 -30 36 -46 39 -41 10 17 l-22 42 22 -19 c11 -11 21 -25 21 -33z m-1402 -175 l10 -43 2 45 2 45 15 -37 c18 -43 32 -49 34 -15 1 20 2 20 12 -5 16 -40 29 -34 22 10 l-5 37 18 -39 c21 -45 37 -35 28 17 -5 27 -3 25 13 -13 11 -25 20 -37 20 -27 1 21 21 23 21 2 0 -8 5 -15 11 -15 6 0 8 -9 4 -20 -8 -26 3 -25 32 2 22 20 23 21 23 2 1 -17 4 -16 25 9 28 32 32 33 38 10 3 -11 5 -5 6 12 2 30 2 30 26 -15 24 -44 24 -45 25 -15 l2 30 11 -33 12 -32 24 22 23 23 -12 -23 c-16 -33 -8 -36 25 -10 l27 21 -6 -21 c-9 -26 2 -28 21 -4 13 16 14 15 8 -5 -10 -35 4 -46 25 -21 21 25 26 18 9 -13 -19 -36 -3 -43 19 -8 l22 34 0 -47 0 -47 -43 19 c-23 11 -85 24 -137 30 -52 6 -136 18 -186 25 -158 26 -246 16 -286 -33 -12 -14 -10 -14 10 -3 21 11 33 -1 12 -14 -5 -3 -10 -11 -10 -17 0 -6 11 -1 25 12 31 29 44 20 21 -15 -11 -17 -25 -25 -46 -25 -90 0 -209 -47 -254 -101 l-27 -32 -47 19 c-29 12 -48 27 -51 39 -2 15 0 17 10 9 8 -6 24 -14 37 -17 18 -4 22 -2 18 9 -4 9 1 14 15 14 13 0 18 4 13 12 -5 8 0 9 14 6 27 -7 39 7 14 17 -14 6 -12 10 13 21 30 14 29 14 -25 13 -93 -2 -110 0 -110 16 0 18 5 18 31 5 13 -7 19 -7 19 0 0 5 12 10 26 10 14 0 23 4 19 10 -4 6 6 10 22 11 15 0 22 3 16 6 -18 7 -16 23 1 23 8 0 17 4 21 9 3 6 -8 8 -27 5 -49 -8 -242 12 -267 27 -24 16 -29 34 -6 25 8 -3 15 0 15 7 0 8 3 8 9 -2 6 -10 10 -10 16 -1 6 9 10 9 16 -1 8 -12 10 -12 18 -1 6 11 10 10 15 -4 6 -16 8 -16 17 -4 8 13 10 13 19 0 8 -13 10 -12 10 5 0 15 3 16 12 7 15 -15 32 -16 23 -2 -3 6 -1 10 4 10 6 0 11 -4 11 -10 0 -5 5 -10 11 -10 6 0 9 7 5 15 -6 18 -2 19 26 4 18 -10 20 -9 15 5 -5 12 0 16 19 16 14 0 37 9 51 20 34 27 43 25 43 -7 1 -27 1 -27 15 -9 14 19 15 17 15 -18 0 -42 20 -41 21 2 l1 27 13 -30 c13 -27 14 -28 15 -7 0 15 4 21 11 16 9 -5 10 1 5 20 -8 34 -1 33 18 -1 l15 -28 2 35 c1 31 2 32 8 10 l7 -24 18 24 18 25 -7 -34 c-5 -23 -4 -31 4 -27 6 4 11 20 11 37 0 43 17 35 28 -13z m-1337 -90 c-13 -58 1 -65 24 -13 l22 50 -4 -50 c-4 -50 -4 -50 11 -20 13 27 14 28 15 8 1 -13 5 -23 9 -23 10 0 31 43 34 68 0 9 4 -3 8 -28 l6 -45 9 43 c8 44 25 58 25 20 0 -13 5 -30 11 -38 8 -11 9 -8 4 15 -6 29 -6 29 14 11 21 -19 21 -19 22 0 0 13 4 10 11 -10 l11 -29 13 29 14 29 -5 -28 c-4 -17 -2 -26 4 -23 5 4 12 -4 14 -16 l4 -23 8 24 8 23 13 -28 12 -29 2 35 c1 33 1 34 15 16 14 -19 15 -18 15 12 0 38 2 38 43 10 48 -32 79 -67 71 -80 -5 -7 0 -9 14 -6 15 4 22 2 22 -9 0 -10 6 -12 20 -8 11 4 20 2 20 -4 0 -6 7 -8 15 -5 8 4 15 1 15 -6 0 -9 3 -10 13 -1 8 6 16 8 19 5 3 -3 23 2 43 11 21 8 40 14 42 12 6 -7 -158 -109 -224 -139 l-62 -29 -63 17 c-35 9 -91 22 -126 28 -42 7 -68 18 -78 30 -23 32 -16 39 16 16 29 -21 42 -16 18 8 -15 15 -3 15 25 0 21 -10 21 -10 7 7 -24 29 -91 55 -142 55 -25 0 -79 -6 -120 -14 -40 -8 -104 -17 -143 -20 -108 -10 -198 -27 -220 -42 -30 -21 -35 -17 -35 29 l1 42 24 -30 c26 -32 31 -24 15 22 l-10 28 19 -22 c25 -30 34 -29 29 2 -6 29 0 32 18 8 12 -17 13 -16 14 5 0 22 1 22 26 5 27 -17 27 -17 19 7 l-7 25 26 -24 26 -24 1 39 c1 23 4 30 6 17 6 -32 18 -29 33 7 18 43 31 47 25 8 -5 -31 -5 -32 5 -8 l11 25 14 -26 c19 -36 49 -48 39 -16 -6 20 -4 20 22 -7 l29 -28 6 32 c9 43 29 63 30 30 l0 -25 11 25 c6 14 14 35 19 48 13 32 18 27 10 -10z m2372 -57 c4 10 8 6 13 -11 l8 -25 6 30 6 30 27 -50 c22 -42 26 -46 27 -25 1 24 2 23 21 -10 l20 -35 -5 33 c-7 42 -1 41 24 -5 l21 -38 -6 35 c-6 33 -5 34 10 16 8 -11 15 -27 16 -35 1 -9 4 -5 8 8 7 25 7 24 24 -10 10 -20 17 -27 17 -16 0 21 26 23 34 2 3 -8 12 -12 21 -9 8 3 15 1 15 -5 0 -6 -3 -10 -7 -9 -7 2 -43 -2 -207 -18 -26 -3 -126 0 -222 6 -115 7 -185 8 -208 1 l-36 -9 1 76 c1 42 4 68 6 57 2 -11 16 -29 30 -39 26 -19 26 -19 21 2 -8 28 -4 28 27 -5 l26 -28 -11 29 c-14 38 -9 41 25 14 23 -18 28 -19 22 -5 -9 24 0 21 41 -10 l35 -26 -7 27 c-7 30 0 29 38 -3 17 -14 17 -11 -3 22 -26 42 -21 46 20 16 31 -22 35 -20 18 14 -7 15 -2 13 15 -8 27 -31 34 -28 15 7 -17 31 -2 33 16 1 l16 -28 -6 35 c-6 34 -5 34 8 11 11 -18 16 -20 20 -10z m-3247 -106 c-8 -33 -1 -32 19 3 9 15 14 20 12 12 -2 -8 -7 -26 -11 -40 l-7 -25 20 25 c11 14 21 29 21 34 0 5 3 7 6 4 3 -4 1 -16 -6 -27 -14 -26 -5 -27 27 -1 35 27 38 20 12 -26 l-23 -39 25 21 c40 35 53 40 40 16 -17 -32 -13 -35 17 -14 50 34 56 37 49 19 -6 -16 -4 -16 23 -2 35 18 48 19 32 3 -7 -7 -12 -19 -12 -27 0 -11 5 -9 16 7 17 25 39 30 30 7 -8 -21 4 -19 31 7 l23 21 0 -59 0 -59 -97 3 c-54 1 -164 -1 -246 -5 -81 -4 -147 -5 -147 0 0 4 -36 7 -80 7 -89 0 -96 6 -55 55 l25 30 -6 -35 -5 -35 16 29 c12 21 19 25 25 16 6 -9 12 -5 24 16 l15 29 1 -35 1 -35 14 33 c17 38 28 42 19 7 -3 -14 -3 -25 0 -25 4 0 11 11 16 25 5 14 14 25 19 25 6 0 7 -7 4 -17 -4 -11 -3 -14 5 -9 7 4 12 13 12 20 0 8 9 24 20 37 l19 24 1 -30 1 -30 14 30 c11 24 14 26 15 10 1 -19 2 -18 10 3 13 30 24 28 16 -3z m2133 -74 c-9 -24 -9 -35 0 -44 8 -8 11 -6 11 10 0 11 9 31 20 44 l19 24 -5 -40 -5 -40 16 28 c21 36 25 34 19 -10 l-5 -38 26 30 26 30 -7 -30 -7 -30 20 24 20 25 -4 -35 -5 -34 22 30 c20 28 21 29 15 5 l-6 -25 20 25 21 25 0 -35 1 -35 19 37 c26 49 40 56 40 19 0 -57 29 -88 31 -33 2 24 2 24 6 4 4 -18 8 -21 18 -12 10 9 15 6 20 -9 6 -19 27 -31 24 -13 -3 20 2 40 17 58 15 18 15 18 10 -6 -3 -14 -1 -32 4 -40 5 -8 10 -10 10 -4 0 5 7 19 16 30 15 19 15 19 11 -2 -7 -31 9 -53 18 -25 8 28 23 27 27 -1 4 -22 5 -22 18 5 18 36 30 34 31 -5 l1 -33 13 30 13 30 12 -30 13 -30 10 35 11 35 4 -32 c2 -18 7 -33 11 -33 5 0 11 15 15 33 5 25 9 29 16 17 5 -8 10 -27 10 -42 0 -26 -1 -26 -67 -27 -232 -3 -461 -21 -523 -40 -82 -26 -147 -67 -189 -119 -38 -49 -35 -51 19 -17 42 27 62 33 42 13 -7 -7 -12 -30 -12 -53 l1 -40 18 35 c11 19 29 44 42 55 22 20 22 20 15 0 -11 -30 -19 -85 -13 -85 4 0 15 17 26 38 11 21 27 45 36 52 15 13 16 10 10 -23 -9 -47 0 -47 22 1 15 34 17 35 21 13 4 -23 4 -23 34 10 16 19 27 26 24 17 -3 -10 -1 -28 4 -40 8 -21 9 -21 16 12 7 33 8 33 14 10 6 -24 6 -24 29 13 26 42 37 44 22 3 -6 -14 -7 -26 -2 -26 5 0 12 12 16 28 l7 27 13 -30 c9 -21 14 -24 14 -12 1 27 31 87 43 87 6 0 7 -7 4 -16 -8 -20 2 -54 15 -54 5 0 9 9 9 19 0 53 29 70 31 19 l1 -33 11 28 c11 29 27 36 27 13 0 -7 6 -19 14 -25 11 -9 15 -6 21 16 l7 28 9 -24 c17 -44 -5 -56 -191 -101 -156 -38 -187 -59 -226 -155 l-16 -40 30 35 30 35 -6 -30 c-3 -16 -17 -39 -31 -50 -44 -34 -81 -73 -81 -86 0 -7 16 2 35 21 l34 33 -20 -53 c-14 -37 -19 -71 -17 -114 l3 -61 17 38 c15 33 30 50 27 30 -1 -5 0 -19 1 -33 2 -21 4 -18 12 13 l10 39 24 -39 24 -38 -7 48 c-7 53 3 62 19 17 5 -17 19 -35 30 -41 17 -9 18 -8 9 10 -6 11 -11 32 -10 48 0 25 1 26 12 9 7 -10 20 -28 29 -40 17 -20 17 -20 7 17 -14 51 -6 69 14 31 9 -17 23 -36 31 -43 13 -11 14 -9 7 16 -14 48 1 62 20 18 13 -31 18 -36 23 -22 18 51 19 52 26 14 9 -51 20 -58 20 -14 0 20 5 39 10 42 6 3 10 -3 10 -14 0 -25 20 -71 32 -71 5 0 6 11 2 25 -4 15 -2 25 5 25 6 0 11 -6 11 -14 0 -8 9 -24 20 -37 l21 -24 -6 45 c-5 40 -4 43 8 28 19 -24 25 -22 20 6 -3 13 0 27 6 30 6 4 11 2 11 -5 0 -14 29 -49 41 -49 5 0 4 12 -1 26 -6 14 -10 33 -10 42 0 13 5 11 20 -8 23 -31 32 -23 21 18 -6 20 -6 32 0 32 5 0 9 -6 9 -14 0 -7 9 -25 20 -39 11 -14 20 -40 20 -60 0 -34 -1 -35 -67 -55 -38 -12 -131 -30 -208 -42 -209 -32 -284 -49 -350 -82 -50 -26 -67 -30 -110 -25 -80 8 -133 28 -151 55 -16 24 -16 25 9 18 29 -7 87 3 87 15 0 4 -10 9 -22 11 -19 4 -16 7 20 22 23 10 42 22 42 26 0 4 -34 10 -75 12 -74 5 -105 18 -105 44 0 12 3 12 23 0 12 -8 32 -17 44 -21 18 -5 22 -3 17 9 -5 14 -3 14 22 1 16 -8 42 -15 58 -15 28 0 29 1 11 14 -17 12 -15 14 31 20 77 11 83 22 15 29 -62 7 -141 33 -153 51 -16 23 -7 26 18 7 34 -27 57 -28 49 -2 -5 18 -3 19 25 11 17 -5 41 -5 53 -1 21 8 21 8 -3 22 -24 13 -24 13 24 20 81 13 74 24 -36 59 -57 18 -97 35 -90 37 10 4 10 8 2 18 -10 12 -5 13 27 8 36 -5 37 -5 18 11 -14 12 -16 16 -5 15 33 -3 70 1 70 9 0 4 -40 20 -88 35 -88 28 -152 61 -152 79 0 5 10 2 22 -6 12 -9 29 -16 36 -16 12 0 12 3 1 17 -13 17 -13 17 13 0 32 -20 59 -24 40 -5 -20 20 -14 28 21 29 30 0 31 1 8 10 -43 17 -81 50 -81 70 0 19 1 19 16 5 17 -17 34 -21 34 -8 0 5 15 7 33 4 31 -4 31 -3 12 12 -19 15 -19 15 10 16 17 0 36 4 44 9 11 7 4 12 -27 20 -41 11 -72 34 -72 52 0 6 7 6 19 -1 28 -15 49 -14 33 2 -18 18 -15 27 8 21 27 -7 59 5 41 16 -9 6 -2 11 23 15 37 7 60 26 31 26 -22 0 -11 38 17 63 27 23 31 18 17 -22z m1053 -40 c13 -26 17 -29 20 -14 3 14 7 11 21 -14 21 -40 26 -41 20 -5 -4 26 -4 26 11 8 12 -14 16 -16 16 -5 0 8 10 1 21 -16 21 -30 22 -18 4 30 -6 16 -1 14 23 -9 33 -31 40 -29 22 5 -13 24 -3 25 23 2 20 -17 20 -17 14 2 -6 17 -3 16 14 -5 l22 -25 -7 25 -7 25 20 -22 c19 -23 38 -32 26 -13 -3 6 -2 10 3 10 6 0 13 -8 16 -17 5 -12 9 -14 18 -5 9 9 16 8 30 -5 11 -10 18 -12 18 -4 0 7 10 3 22 -9 21 -20 21 -20 2 -35 -10 -7 -39 -25 -64 -39 l-45 -24 -108 28 c-162 43 -246 78 -263 111 -20 40 -17 48 6 19 l21 -25 -7 30 -6 30 22 -25 21 -25 -6 25 -6 25 20 -24 c23 -26 27 -21 10 11 -9 16 -8 19 3 16 7 -2 20 -19 30 -37z m-2075 -43 c6 -7 15 -26 21 -43 l10 -30 1 38 c1 46 16 41 41 -15 13 -31 19 -35 24 -22 4 9 4 26 1 38 -5 20 -5 20 7 3 34 -50 39 -53 28 -24 -15 42 -13 43 20 12 35 -34 38 -45 10 -45 -29 0 -25 -18 5 -26 22 -5 24 -9 13 -22 -11 -13 -10 -15 7 -10 11 3 29 9 40 14 18 7 18 6 6 -9 -12 -15 -11 -17 2 -17 9 0 19 5 22 10 3 6 15 10 25 10 10 0 24 8 30 18 10 15 11 14 7 -5 -4 -18 -1 -23 14 -23 22 0 24 -11 7 -29 -11 -10 -10 -11 5 -6 10 5 17 2 17 -5 0 -9 8 -6 21 6 16 14 21 15 17 4 -7 -23 -155 -80 -225 -87 -65 -6 -74 -17 -22 -28 28 -6 29 -8 12 -22 -17 -13 -16 -14 11 -8 23 5 27 3 22 -10 -4 -13 -2 -14 14 -5 16 9 18 8 13 -6 -7 -19 7 -14 40 14 15 14 17 13 17 -3 0 -17 3 -16 25 5 20 18 25 20 25 8 0 -28 -216 -106 -266 -96 -11 2 -18 14 -18 33 -1 17 -6 41 -10 55 l-9 24 34 -25 c51 -38 64 -45 54 -28 -28 48 -80 98 -126 121 -96 48 -157 58 -424 69 -137 6 -251 12 -253 14 -7 6 10 75 18 70 4 -2 11 -19 15 -37 l8 -33 7 40 7 40 8 -32 c9 -40 22 -42 31 -7 l7 27 12 -29 12 -29 8 34 7 33 19 -28 c18 -27 19 -28 19 -6 0 27 16 29 25 2 9 -29 25 -24 26 8 0 27 1 27 11 5 17 -35 31 -28 25 12 -3 19 -4 35 -2 35 11 0 36 -64 31 -78 -3 -10 5 -4 18 12 22 26 24 27 29 10 3 -13 5 -9 7 11 l2 30 12 -28 c15 -34 26 -25 26 20 0 42 12 42 35 -1 21 -39 40 -37 31 3 l-7 26 21 -25 21 -25 -6 25 c-6 25 -6 25 12 -2 23 -37 34 -35 23 2 -11 39 -5 38 21 -2 l20 -33 -7 35 -7 35 22 -25 22 -25 -5 38 c-6 44 -2 46 19 10 l16 -28 -4 33 c-5 45 10 40 33 -10 17 -40 19 -41 19 -15 1 16 -4 37 -9 48 -8 15 -7 19 3 19 8 0 19 -6 24 -12z m1850 -96 c10 -15 11 -13 7 8 -5 23 -4 24 9 7 11 -13 16 -15 19 -5 3 8 13 -1 26 -22 l22 -35 1 30 1 30 14 -32 c16 -38 29 -44 19 -10 -4 12 -9 30 -12 41 -9 32 15 8 48 -47 30 -51 31 -51 25 -17 l-6 35 22 -25 21 -25 -5 28 c-7 37 5 34 41 -10 l31 -37 -10 34 c-13 47 -12 49 10 22 16 -19 19 -20 22 -6 2 11 13 -4 31 -37 29 -56 38 -44 12 18 -14 32 -14 34 1 23 8 -8 27 -34 42 -59 19 -32 28 -41 30 -28 4 20 18 23 25 5 3 -8 6 -5 6 6 1 16 3 17 17 5 9 -7 26 -13 37 -14 11 0 22 -5 24 -11 5 -15 -69 -54 -103 -54 -16 0 -41 -6 -56 -14 -15 -8 -42 -16 -59 -18 -28 -3 -34 1 -40 25 -8 30 2 35 21 12 15 -18 35 -20 24 -3 -5 8 0 9 14 6 12 -4 19 -2 16 3 -9 15 -64 40 -73 34 -5 -3 -21 -1 -34 4 -14 6 -63 15 -109 21 -45 6 -111 21 -144 32 -60 21 -62 23 -67 62 -7 53 -1 57 31 21 l25 -30 -6 40 c-5 33 -4 37 6 22 7 -10 17 -26 24 -35z m-2344 -182 c4 -25 4 -24 18 8 16 39 26 41 36 5 l6 -28 12 29 c12 29 13 29 24 8 6 -11 11 -28 11 -37 0 -9 5 -13 10 -10 6 3 10 21 10 38 l1 32 19 -24 c11 -13 20 -34 20 -48 0 -30 20 -20 20 10 1 19 4 16 21 -13 20 -34 20 -32 4 19 -11 35 11 18 35 -27 l19 -37 2 40 1 40 8 -38 c10 -51 17 -55 28 -16 l9 34 21 -35 c22 -34 22 -35 29 -11 6 23 6 23 25 -10 l19 -34 -4 33 c-5 46 8 40 44 -20 l31 -53 -5 40 c-3 22 -8 49 -13 60 -14 39 43 -24 65 -71 14 -29 29 -46 46 -50 31 -8 32 -17 3 -33 -21 -10 -20 -11 11 -6 33 5 33 5 18 -19 -15 -23 -15 -24 4 -19 10 3 22 9 25 14 3 5 10 9 15 9 6 0 7 -4 4 -10 -3 -5 -1 -10 4 -10 6 0 16 9 23 20 16 25 30 26 21 3 -4 -11 9 -4 32 17 29 26 36 30 31 15 -5 -18 -4 -18 13 3 23 26 35 29 27 5 -3 -10 5 -4 19 12 24 28 25 29 25 8 0 -18 -16 -31 -82 -64 -95 -48 -198 -85 -264 -95 -46 -6 -49 -23 -5 -27 24 -1 26 -8 9 -26 -11 -11 -9 -11 10 -1 27 13 42 6 24 -12 -21 -21 -13 -32 9 -12 21 19 22 19 15 -3 -10 -33 8 -28 40 10 l27 32 -7 -30 -8 -30 26 24 c25 23 26 23 26 5 0 -14 -22 -36 -69 -68 -85 -57 -158 -121 -173 -150 l-11 -21 23 20 c22 19 23 19 16 1 -6 -17 -5 -17 11 -5 15 12 16 12 10 -3 -7 -20 9 -25 16 -5 3 6 6 3 6 -7 1 -18 3 -18 26 4 17 16 25 19 25 9 1 -9 7 -7 19 9 22 25 36 29 27 7 -9 -24 10 -17 22 8 10 21 11 21 11 -6 1 -25 -6 -31 -66 -60 -65 -30 -67 -32 -38 -37 18 -3 25 -8 18 -13 -6 -4 -39 8 -75 27 -70 38 -142 59 -263 76 -180 24 -273 42 -327 63 -52 19 -58 25 -58 50 0 28 48 122 57 113 3 -3 0 -19 -6 -37 -15 -42 -8 -46 19 -12 l23 28 -7 -49 c-5 -44 -4 -47 10 -35 9 7 21 25 27 39 10 24 11 24 17 -15 4 -22 8 -32 9 -23 0 9 6 20 13 24 8 5 9 -5 5 -34 -6 -52 9 -54 30 -4 l17 37 6 -30 c6 -29 6 -30 18 -8 7 12 12 33 12 48 0 15 4 24 10 20 6 -3 10 -22 10 -41 0 -21 4 -33 10 -29 6 3 10 19 10 36 0 37 16 38 25 2 6 -27 7 -27 21 -9 8 11 14 29 14 40 0 15 3 17 12 8 9 -9 9 -21 1 -47 -10 -32 -10 -35 3 -24 9 7 24 29 35 48 l20 36 -5 -50 -4 -49 25 39 25 40 -5 -47 c-5 -53 3 -54 35 -4 l19 31 -3 -43 c-4 -44 -4 -44 14 -22 10 12 18 30 18 39 0 30 20 -11 21 -44 1 -29 1 -29 13 9 l12 38 14 -42 c13 -39 14 -41 23 -18 12 31 0 113 -24 168 l-20 45 35 -34 c20 -19 36 -30 36 -24 0 13 -9 23 -63 70 -20 17 -39 44 -42 60 l-6 28 25 -30 c31 -37 33 -28 5 28 -43 86 -62 97 -245 141 -146 36 -174 52 -166 92 5 29 18 21 25 -16z m2306 -2 c8 -30 9 -31 11 -8 2 25 2 25 15 -5 l14 -30 1 35 2 35 13 -35 13 -35 1 35 1 35 21 -32 c26 -41 33 -42 26 -3 -8 39 -2 38 23 -2 19 -32 20 -32 20 -8 1 24 1 24 15 6 11 -14 15 -16 15 -5 1 10 5 9 15 -5 15 -20 15 -20 16 0 0 18 1 18 9 -1 7 -17 9 -16 10 10 l1 30 16 -30 c14 -27 17 -28 23 -11 5 15 9 16 15 7 11 -18 -8 -28 -80 -40 -78 -14 -152 -14 -160 -1 -4 6 -12 10 -18 9 -41 -5 -77 2 -77 16 0 14 20 65 26 65 2 0 8 -15 13 -32z m210 -163 l24 -20 -6 23 c-7 28 3 28 38 0 l28 -21 -12 21 c-13 25 -4 28 23 7 25 -19 37 -19 30 0 -9 23 1 18 51 -25 25 -22 56 -40 68 -40 20 -1 20 -2 4 -11 -9 -5 -21 -7 -27 -4 -5 3 -72 9 -148 14 -154 10 -195 22 -200 61 -3 25 -2 25 14 5 16 -20 16 -20 11 4 -5 21 -2 20 34 -15 40 -39 49 -37 24 6 -28 49 -18 48 44 -5z m-218 -122 c20 -32 23 -34 30 -17 6 17 8 17 17 -6 10 -24 11 -23 11 13 1 20 6 37 11 37 6 0 10 -3 10 -7 0 -5 10 -19 21 -33 20 -24 20 -24 14 -2 -9 32 9 27 22 -5 l11 -28 1 25 c2 24 3 23 21 -10 18 -33 19 -33 20 -10 l1 25 13 -25 14 -25 4 30 c3 30 3 30 25 -15 l21 -45 1 35 2 35 25 -40 26 -40 -5 38 c-7 43 5 41 34 -7 10 -17 19 -25 19 -18 0 6 7 12 15 12 22 0 18 -15 -7 -29 -21 -10 -20 -11 11 -6 l33 5 -16 -26 -17 -25 32 16 c29 15 31 15 26 1 -9 -23 -1 -20 28 11 20 22 25 24 25 11 0 -11 5 -15 15 -12 8 4 15 1 15 -5 0 -14 -40 -34 -111 -56 l-56 -18 -114 60 c-63 33 -129 65 -146 71 -18 6 -33 16 -33 21 0 6 -8 11 -17 12 -35 1 -78 35 -81 62 -4 36 2 34 29 -10z m60 -301 c13 -54 29 -53 29 3 l0 30 20 -30 c11 -16 22 -43 26 -59 10 -45 25 -10 19 44 l-5 45 20 -40 c11 -22 20 -48 20 -58 0 -38 20 -4 21 36 l1 42 16 -35 c15 -34 16 -34 21 -10 4 20 7 16 16 -25 l11 -49 19 59 20 60 4 -60 3 -60 13 35 13 35 1 -31 c1 -19 -7 -38 -18 -49 -18 -15 -28 -16 -98 -6 -96 13 -139 25 -180 51 -29 17 -33 25 -33 62 0 24 3 54 7 67 7 29 15 16 34 -57z m-683 -77 c11 -19 11 -18 12 7 0 42 13 39 36 -8 l21 -44 -43 -25 c-23 -14 -66 -47 -96 -74 l-54 -49 -77 22 c-81 24 -112 40 -62 34 26 -3 30 0 30 22 0 15 6 25 15 25 8 0 17 -11 21 -25 7 -24 7 -24 9 5 5 60 7 76 14 82 3 3 6 -4 6 -16 0 -12 8 -36 18 -54 l17 -32 5 65 5 65 19 -38 c27 -54 34 -53 29 6 l-5 52 20 -31 c25 -38 49 -57 37 -28 -14 35 -17 63 -10 91 l8 28 7 -30 c4 -17 12 -40 18 -50z m-2004 -9 c9 -59 -3 -79 -63 -105 -45 -19 -217 -50 -280 -51 -24 0 -24 0 -5 15 18 14 17 14 -15 15 -34 0 -34 0 -15 19 17 17 20 18 32 3 10 -14 12 -12 13 14 l1 29 13 -30 c14 -30 14 -29 15 28 0 31 5 57 10 57 6 0 10 -7 10 -16 0 -27 23 -94 32 -94 4 0 9 21 9 48 1 26 4 37 6 25 6 -31 19 -29 28 5 7 25 9 24 19 -23 l11 -50 13 53 c19 72 32 74 32 5 l0 -58 24 58 c14 33 27 61 30 64 2 3 8 -17 12 -43 l7 -48 20 67 c11 36 23 64 27 62 4 -3 11 -25 14 -49z m673 -93 c-6 -59 5 -62 29 -9 l14 31 -2 -52 c-3 -57 4 -59 31 -6 l18 36 6 -46 c4 -26 4 -53 1 -62 -5 -12 0 -14 25 -9 22 5 31 3 31 -7 0 -10 3 -10 12 -1 19 19 36 14 41 -10 4 -20 4 -19 6 5 2 42 34 31 46 -16 8 -29 25 -28 25 3 0 22 29 36 32 15 0 -8 1 -19 2 -25 1 -9 -184 -135 -188 -128 -1 2 -10 22 -20 44 -22 50 -81 109 -159 158 l-58 37 21 26 c11 14 20 32 20 39 0 8 5 14 10 14 6 0 10 -15 10 -32 l1 -33 14 25 c8 14 14 35 15 48 0 15 4 21 11 16 8 -4 10 -26 6 -61z m1518 -63 c3 0 4 4 1 9 -4 5 -3 17 0 26 5 12 11 6 25 -24 19 -43 31 -54 22 -22 -3 11 0 27 5 37 9 16 12 13 27 -21 18 -42 20 -41 30 18 7 41 20 49 28 15 2 -13 7 -30 11 -38 4 -10 -8 -24 -39 -43 -65 -41 -130 -118 -143 -169 -14 -53 -8 -61 9 -14 16 43 29 46 30 9 1 -22 3 -18 11 15 9 41 28 50 28 13 0 -9 7 -26 15 -37 13 -18 14 -16 15 24 0 23 5 42 10 42 6 0 10 -6 10 -14 0 -7 6 -19 14 -25 12 -10 13 -7 4 23 -15 48 -5 55 27 20 20 -22 25 -24 20 -9 -18 52 -17 61 5 33 33 -43 52 -36 29 9 -10 21 -19 46 -19 58 1 18 2 18 15 -5 l14 -25 1 30 0 30 15 -28 c14 -28 39 -57 49 -57 2 0 -1 12 -9 28 -7 15 -16 38 -20 52 -6 24 -6 24 19 -5 l26 -30 -6 50 c-5 42 -4 48 7 37 11 -10 15 -58 17 -199 l3 -186 -48 7 c-269 38 -408 48 -730 53 l-343 6 0 62 c0 34 -2 84 -5 111 -2 27 -2 41 1 32 6 -19 24 -25 24 -8 0 6 5 10 10 10 6 0 10 -13 10 -30 0 -31 19 -43 21 -12 0 9 10 -3 22 -28 19 -40 22 -42 25 -21 3 21 6 19 25 -20 l21 -44 4 33 c3 33 22 36 22 3 0 -10 11 -26 25 -35 32 -21 38 -20 25 4 -14 27 -2 25 29 -4 15 -14 40 -28 56 -32 l30 -7 -20 23 -20 23 24 -13 c15 -8 39 -10 69 -5 l47 7 -35 15 -35 16 45 8 c25 5 61 16 81 25 31 13 36 21 37 51 2 45 11 73 23 73 5 0 9 -10 9 -22 0 -13 5 -30 10 -38 7 -11 10 -4 10 28 0 52 15 55 24 5 3 -21 15 -51 27 -68 12 -17 18 -21 14 -10 -4 11 -9 43 -12 70 l-4 50 19 -35 c23 -45 54 -91 58 -88 1 2 -4 28 -12 58 -20 76 -18 91 7 58 24 -32 45 -38 29 -9 -5 11 -10 35 -10 53 l0 33 25 -38 c14 -20 27 -37 30 -37 2 0 11 -3 20 -6 12 -5 10 3 -9 31 -25 37 -33 74 -19 88 4 4 12 -6 19 -23 7 -16 16 -30 19 -30z m650 6 c3 -8 7 -7 11 2 9 18 22 15 29 -9 7 -20 7 -20 22 -2 11 13 16 15 20 5 4 -10 8 -10 19 -1 11 9 14 9 14 -1 0 -10 3 -10 15 0 9 7 18 11 20 8 12 -12 -9 -37 -38 -49 l-32 -13 28 -3 c23 -4 26 -7 16 -19 -9 -11 -7 -14 10 -14 12 0 19 -4 16 -10 -8 -13 1 -13 26 0 13 8 19 7 19 0 0 -6 5 -8 10 -5 6 3 10 1 10 -6 0 -8 6 -6 18 4 10 10 22 14 25 11 4 -4 9 1 13 10 9 24 24 19 24 -9 0 -19 -13 -32 -68 -65 -38 -22 -73 -40 -78 -40 -6 0 -22 18 -36 39 -18 28 -21 38 -10 34 25 -10 4 16 -32 39 -17 11 -22 17 -12 14 38 -13 -4 22 -50 41 -40 16 -44 21 -44 53 1 33 2 34 15 16 8 -10 17 -24 20 -30z m-222 -79 c-4 -6 -1 -8 8 -5 11 4 14 -5 12 -46 -3 -51 -2 -51 11 -21 16 35 28 36 37 3 6 -22 7 -22 19 7 l13 30 11 -43 c12 -48 26 -46 26 2 0 41 19 14 21 -29 0 -29 1 -29 11 -7 16 32 28 27 29 -10 0 -27 2 -30 9 -13 8 21 13 15 23 -30 3 -11 6 -2 7 20 l2 40 13 -30 14 -30 1 30 c1 29 1 29 15 11 20 -26 19 -44 -2 -49 -14 -4 -13 -5 4 -6 12 0 25 -6 29 -12 4 -8 8 -8 13 0 4 5 22 12 41 15 19 2 44 8 55 12 19 8 20 7 2 -19 -20 -31 -16 -33 18 -11 20 13 25 14 25 3 1 -8 12 0 25 16 22 26 25 27 25 10 1 -16 4 -14 17 10 10 18 18 25 21 17 8 -26 -10 -44 -125 -118 -65 -42 -130 -87 -144 -101 l-26 -24 -126 27 -126 28 -5 50 c-10 101 -14 331 -5 308 5 -13 6 -29 2 -35z m-2273 -26 c0 -28 2 -31 14 -22 8 7 17 24 21 38 7 31 22 20 27 -22 4 -30 4 -29 17 12 14 44 30 48 32 10 1 -20 2 -19 12 6 14 34 27 35 27 2 0 -31 -24 -81 -42 -88 -7 -2 -10 -7 -7 -11 9 -9 58 33 80 68 19 30 19 30 19 6 -1 -14 -7 -43 -15 -65 l-14 -40 30 33 c28 31 29 31 29 9 0 -13 -6 -46 -14 -73 l-15 -49 30 35 c16 19 34 49 38 65 8 28 9 26 10 -18 1 -27 -4 -58 -10 -70 -9 -19 -7 -18 10 3 11 14 25 45 32 70 l13 45 6 -45 6 -45 12 28 c7 16 12 33 12 39 0 25 13 -5 25 -54 l12 -53 7 43 c8 41 9 43 22 23 11 -16 12 -26 4 -41 -6 -12 -7 -20 -1 -20 5 0 12 6 14 13 3 6 6 1 7 -13 1 -24 1 -24 15 -6 13 17 15 18 15 3 0 -25 16 -21 25 6 l8 22 4 -25 5 -24 14 24 c12 22 13 23 14 5 1 -19 2 -18 22 5 l21 25 -6 -30 -5 -30 18 23 c22 27 30 28 31 5 0 -12 5 -8 14 12 13 27 14 27 15 8 0 -32 16 -29 26 5 l7 27 7 -30 7 -30 15 34 c10 22 17 29 21 20 4 -12 6 -11 11 1 3 8 11 29 17 45 l12 30 7 -30 7 -30 11 28 c6 15 15 27 20 27 4 0 13 12 19 28 l11 27 1 -28 c1 -34 21 -26 21 8 0 17 4 23 14 19 8 -3 16 4 20 18 7 22 7 22 16 3 5 -11 9 -14 9 -7 1 6 6 12 11 12 6 0 10 -47 10 -120 0 -108 -2 -120 -18 -120 -9 0 -95 -9 -191 -20 -300 -34 -573 -86 -828 -158 -85 -24 -103 -26 -108 -15 -9 25 -4 397 6 418 7 14 8 4 5 -35 l-5 -55 25 30 c25 29 25 29 19 5 -4 -14 -13 -35 -21 -47 -8 -13 -11 -23 -7 -23 12 0 53 43 53 57 0 7 5 13 11 13 6 0 8 -9 4 -22 -6 -22 -6 -22 9 -4 16 20 16 20 16 0 0 -10 -9 -36 -20 -57 -11 -20 -16 -37 -12 -37 12 0 38 23 51 45 10 17 11 14 6 -20 l-6 -40 25 30 25 30 1 -28 c0 -16 -5 -38 -11 -50 -9 -19 -8 -20 3 -5 7 9 18 25 25 35 10 15 12 10 12 -32 1 -45 2 -48 15 -30 7 11 18 34 23 50 l10 30 8 -40 c10 -61 12 -63 22 -25 l10 35 13 -43 c18 -56 26 -45 10 13 -15 54 -73 122 -139 166 l-49 31 16 39 c17 45 32 36 32 -20z m-320 -326 c-7 -49 -20 -106 -30 -126 -17 -32 -29 -39 -134 -77 -96 -36 -120 -41 -137 -31 -21 11 -20 12 17 28 l39 17 -33 7 c-18 4 -31 11 -28 16 4 5 0 12 -6 14 -7 3 -2 6 12 6 19 1 22 3 10 11 -12 8 -12 10 3 16 9 3 17 12 17 19 0 7 6 16 13 18 6 3 -7 6 -30 6 -23 1 -48 4 -57 7 -18 7 -22 24 -5 24 6 0 17 7 25 15 14 13 13 15 -8 15 -13 0 -30 5 -38 10 -11 7 -5 9 20 6 19 -3 46 2 60 9 25 14 25 14 -12 15 -20 0 -40 5 -43 10 -4 6 -3 10 2 9 23 -4 53 2 49 10 -3 5 2 11 13 14 10 2 21 18 26 38 6 26 9 29 12 14 8 -35 23 -41 24 -9 0 25 2 26 9 9 8 -18 9 -18 9 6 1 36 13 44 27 17 12 -22 13 -21 20 22 l7 45 12 -40 11 -40 8 38 c8 44 21 47 34 10 8 -22 11 -24 11 -8 1 11 6 27 11 35 7 12 12 7 24 -20 14 -33 15 -33 17 -10 1 14 1 36 0 48 -1 15 2 21 8 17 7 -4 12 8 13 32 1 21 4 -11 6 -72 2 -60 -2 -150 -8 -200z m3351 127 c0 -14 2 -13 9 3 7 19 8 18 15 -6 7 -30 3 -284 -5 -293 -3 -3 -51 10 -105 28 -55 18 -131 41 -170 51 -83 22 -77 18 -69 39 8 21 24 21 24 -1 1 -12 6 -7 15 12 l13 30 2 -30 1 -30 18 35 19 35 4 -30 4 -30 14 33 c9 24 15 30 21 21 6 -10 11 -6 18 14 6 16 11 35 11 43 0 27 20 14 21 -13 l0 -28 12 25 c6 14 17 29 24 33 7 4 13 17 13 27 0 30 18 24 23 -7 4 -28 4 -28 12 5 5 23 10 29 16 21 5 -9 10 -5 14 14 8 28 25 28 26 -1z m114 -20 c10 24 25 13 25 -18 0 -28 17 -33 22 -6 3 10 10 1 18 -27 9 -27 22 -47 37 -54 30 -13 29 -17 -12 -50 -53 -42 -35 -56 42 -31 10 3 3 -4 -15 -17 -29 -19 -32 -23 -17 -32 9 -5 33 -6 53 -3 35 6 36 6 17 -10 -11 -9 -37 -24 -58 -34 l-38 -17 37 -6 c20 -4 45 -2 55 4 34 18 20 0 -20 -27 -37 -24 -42 -25 -81 -13 -23 7 -48 22 -56 34 -11 18 -36 241 -33 310 l0 20 9 -20 c7 -18 8 -19 15 -3z" />
                                                                <path d="M2505 4326 c17 -14 24 -25 17 -26 -8 0 -34 -14 -58 -32 l-45 -32 33 -25 c17 -15 47 -33 67 -42 32 -15 33 -17 13 -23 -44 -14 -11 -53 54 -65 46 -9 50 -8 69 15 21 26 149 79 166 69 5 -4 9 1 9 10 0 12 8 16 28 15 53 -4 73 0 66 12 -5 8 0 9 14 6 12 -4 22 -2 22 3 0 5 -4 9 -10 9 -19 0 -10 17 15 28 14 6 25 20 25 29 0 16 -2 16 -18 -3 -13 -16 -36 -24 -102 -33 -127 -17 -169 -14 -217 13 -23 14 -53 28 -65 32 -13 4 -36 17 -53 29 -46 33 -64 40 -30 11z" />
                                                                <path d="M2936 3803 c-13 -13 -16 -14 -11 -3 4 8 -7 1 -26 -16 -76 -68 -146 -113 -168 -107 -17 4 -24 0 -28 -16 -6 -22 -17 -26 -158 -56 -44 -10 -91 -21 -105 -25 -21 -7 -22 -9 -5 -10 16 -1 14 -4 -10 -16 -16 -8 -22 -12 -12 -9 11 3 17 -1 17 -11 0 -8 -4 -13 -8 -10 -5 3 -9 -1 -9 -9 0 -18 9 -19 26 -2 10 10 11 8 5 -8 -7 -19 -7 -19 12 -3 15 13 23 15 32 6 14 -14 156 7 189 28 31 19 33 18 33 -16 0 -25 4 -30 23 -30 13 0 36 14 53 31 27 28 28 31 12 43 -21 15 -23 26 -6 26 21 0 118 80 118 98 0 9 13 23 30 30 17 8 28 18 24 23 -3 5 0 9 7 9 7 0 9 3 6 7 -4 3 -2 12 4 19 9 10 7 15 -5 20 -9 3 -13 10 -10 15 9 16 -11 10 -30 -8z" />
                                                            </g>
                                                        </svg>
                                                        <h5 className="change-hamburguer-quit ">Veredas</h5>
                                                    </li>
                                                </Link>
                                            )}
                                            {/* <li className="hamburguer-centered">
                                <svg className="icon-li-nav-horizontal" version="1.1" x="0px" y="0px" viewBox="0 0 256 256"  >
                                    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                    <g><g><path d="M235,24.8H21.1C15,24.8,10,29.7,10,35.8v184.4c0,6.1,5,11.1,11.1,11.1h213.9c6.1,0,11.1-5,11.1-11.1V35.8C246,29.7,241.1,24.8,235,24.8z M98.5,35.8c6.1,0,11.1,5,11.1,11.1c0,6.1-5,11.1-11.1,11.1c-6.1,0-11.1-5-11.1-11.1C87.5,40.8,92.4,35.8,98.5,35.8z M65.3,35.8c6.1,0,11.1,5,11.1,11.1c0,6.1-5,11.1-11.1,11.1c-6.1,0-11.1-5-11.1-11.1C54.3,40.8,59.2,35.8,65.3,35.8z M32.1,35.8c6.1,0,11.1,5,11.1,11.1c0,6.1-5,11.1-11.1,11.1c-6.1,0-11.1-5-11.1-11.1C21.1,40.8,26,35.8,32.1,35.8z M235,220.2H21.1V69h11.1h191.8h11.1L235,220.2L235,220.2z" /><path d="M43.7,103h16.9v16.9H43.7V103L43.7,103z" /><path d="M77.5,103h134.5v16.9H77.5V103L77.5,103z" /><path d="M43.7,136.8h16.9v16.9H43.7V136.8L43.7,136.8z" /><path d="M77.5,136.8h134.5v16.9H77.5V136.8L77.5,136.8z" /><path d="M43.7,169.9h16.9v16.9H43.7V169.9L43.7,169.9z" /><path d="M77.5,169.9h134.5v16.9H77.5V169.9L77.5,169.9z" /></g></g>
                                </svg>
                                <Link onClick={() => { selectedLi("formatoSca") }} className={`link-memu-horizontal change-hamburguer-quit change-hamburguer-quit ${liSelected == "formatoSca" ? "selected-li" : ""}`}> Formato SCA</Link>
                            </li> */}
                                            {/* <Link to={"/dashboard/muestras/verRegistros"} onClick={() => { selectedLi("/dashboard/muestras/verRegistros") }} className={`link-memu-horizontal  ${liSelected == "/dashboard/muestras/verRegistros" ? "selected-li" : ""}`}>
                                <li className="hamburguer-centered">
                                    <svg className="icon-li-nav-horizontal" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                        <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                        <g><g><g><path fill="#ffffff" data-title="Layer 0" xs="0" d="M27.1,10.4c-8.5,1.2-15.5,8.5-16.7,17.4c-0.3,1.9-0.4,35.9-0.3,85.5l0.1,82.3l1,2.6c2.5,6,6.6,10.1,12.3,12.1l3.1,1.1h37.1h37.1v-9.9v-9.9H65.3H29.8v-20.3v-20.3h35.5h35.5V141V131H65.3H29.8v-20.3V90.4h80.9h80.9v5.2v5.2h9.9h9.9V63.9c0-35.6,0-37-0.9-39.9c-2.2-7.1-8.4-12.3-16.1-13.5C190.8,9.8,31.1,9.8,27.1,10.4z M191.6,50.1v20.3h-80.9H29.8V50.1V29.8h80.9h80.9V50.1z" /><path fill="#ffffff" data-title="Layer 1" xs="1" d="M40.2,50.1v9.9h25.1h25.1v-9.9v-9.9H65.3H40.2V50.1z" /><path fill="#ffffff" data-title="Layer 2" xs="2" d="M138.2,40.9c-7.3,2.3-9.2,12-3.4,16.9c6.2,5.2,16.1,0.7,16.1-7.3C150.9,43.7,144.6,38.9,138.2,40.9z" /><path fill="#ffffff" data-title="Layer 3" xs="3" d="M168.7,40.9c-7.5,2-9.6,12-3.7,17c6.2,5.2,16.1,0.7,16.1-7.3C181.2,43.7,175.3,39.1,168.7,40.9z" /><path fill="#ffffff" data-title="Layer 4" xs="4" d="M40.2,110.7v9.9h25.1h25.1v-9.9v-9.9H65.3H40.2V110.7z" /><path fill="#ffffff" data-title="Layer 5" xs="5" d="M164.4,121.6c-11.1,1.8-20.7,6.6-28.5,14.4c-27.1,27.1-15.1,73,21.7,83.7c12,3.5,24.4,2.3,36-3.5l5.7-2.8l16.3,16.3L232,246l7-7l7-7l-16.3-16.3l-16.3-16.3l2.8-5.7c3.1-6.3,4.5-11,5.2-17.7c2.5-24.2-13.8-47.3-37.7-53.3C178.4,121.4,169.2,120.9,164.4,121.6z M178.5,141.9c6,1.5,9.5,3.5,14.1,8c3.4,3.3,4.4,4.7,6,8c2.5,5.3,3.2,8.2,3.1,13.7c0,8.3-2.8,15-8.9,21.1c-7.3,7.3-16.7,10.4-26.6,8.6c-14-2.5-24.2-14.1-25-28.2C140,152.7,158.9,136.9,178.5,141.9z" /><path fill="#ffffff" data-title="Layer 6" xs="6" d="M40.2,171.3v9.9h25.1h25.1v-9.9v-9.9H65.3H40.2V171.3z" /></g></g></g>
                                    </svg>
                                    <h5 className="change-hamburguer-quit ">Ver Registros</h5>
                                </li>
                            </Link> */}

                                            <Link to={"/dashboard/fincas/registros"} onClick={() => { selectedLi("/dashboard/fincas/registros") }} className={`link-memu-horizontal  ${liSelected == "/dashboard/fincas/registros" ? "selected-li" : ""}`}>
                                                <li className="hamburguer-centered">
                                                    <svg className="icon-li-nav-horizontal" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enableBackground="new 0 0 256 256" >
                                                        <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                                        <g><g><path d="M240.3,123.1c-0.9-0.4-1.8-0.6-2.7-0.6c-0.8-1.2-2-2-3.4-2.1c-2.3-0.3-4.4,1.3-5.3,3.7c-0.3-0.2-0.6-0.4-0.9-0.6c-2.7-1.4-5.6-0.5-7.3,1.9c-0.3-0.3-0.7-0.5-1.1-0.7c-1.4-0.7-2.8-0.7-4.1-0.2c-0.2-1.2-0.9-2.3-2-2.8c-1.6-0.8-3.4,0-3.9,2c-0.1,0.3-0.1,0.7-0.2,1.1c-1.3-0.3-2.6,0.1-3.6,0.9c-0.6-1.2-1.8-1.9-3.1-1.9c-2,0-3.6,1.8-3.6,4c0,0.4,0.1,0.9,0.2,1.3c15.9,1.6,31.3,3.8,46,6.6l0,0C247.1,130.4,244.8,124.9,240.3,123.1z M53.5,124.1c-0.6,0.3-1.1,0.7-1.6,1.3c-1-0.9-2.3-1.3-3.6-1.1c0-0.4,0-0.7-0.1-1.1c-0.6-2-2.3-3-3.9-2.1c-1,0.5-1.8,1.6-2,2.9c-1.3-0.6-2.7-0.6-4.1,0.1c-0.4,0.2-0.8,0.4-1.1,0.7c-1.7-2.5-4.6-3.5-7.4-2.2c-1.1,0.5-1.5,0.9-1.8,1.1c-2.6-3.6-7.1-5.1-11.2-3.4c-5.2,2.1-7.9,8.5-6,14.3l0,0c15.5-2.7,31.7-4.9,48.5-6.5c0-0.2-0.1-0.9-0.4-1.7C57.8,124.2,55.6,123.1,53.5,124.1z" /><path d="M171.7,160.9c16.3,1.2,34.1,3,53.4,6c1.7-1.7,3.4-3.6,5.2-5.7c-11.6-1.9-22.7-3.3-33.2-4.3L171.7,160.9z M199.3,150.6c11.3,1.3,23.1,2.9,35.5,5c1.1-1.5,2.2-3.2,3.3-4.9c-13.6-2.4-26.6-4.1-38.8-5.3V150.6z M199.3,139.1c13.2,1.4,27.3,3.4,42,6c0.7-1.3,1.3-2.7,1.9-4c-15.5-2.8-30.2-4.8-43.9-6.2V139.1z M55.7,161v-2.1c-19.4,2.5-27.8,4.6-27.8,4.6S36.4,162.3,55.7,161z M55.7,148.7v-2.1c-25.5,3.1-36.4,5.8-36.4,5.8S30.4,150.7,55.7,148.7z M54.5,136c-28.6,3.3-40.8,6.4-40.8,6.4s11.8-2.1,39.1-4.5L54.5,136z" /><path d="M98.5,81.5c-1.4,0-2.6,1.2-2.6,2.7v7.1l5.1,0.2v-7.1C101.1,82.9,99.9,81.6,98.5,81.5z M138.5,119.4c0-1.9-1.4-3.5-3.1-3.6c-1.7-0.1-3.1,1.4-3.1,3.3v8.6l6.2,0.3L138.5,119.4L138.5,119.4z M123.3,118.8c0-1.9-1.4-3.5-3.1-3.6c-1.7-0.1-3.1,1.4-3.1,3.3v8.6l6.2,0.2L123.3,118.8L123.3,118.8z M153.8,120c0-1.9-1.4-3.5-3.1-3.6c-1.7-0.1-3.1,1.4-3.1,3.3v8.6l6.2,0.3L153.8,120L153.8,120z M71.3,133.2v4l5.1,0.2v-4c0-1.6-1.2-2.9-2.6-3C72.5,130.3,71.3,131.6,71.3,133.2z M73.9,143.4c-1.4-0.1-2.6,1.2-2.6,2.7v5.6l5.1,0.2v-5.6C76.5,144.8,75.3,143.5,73.9,143.4z M179.5,91.8l-56.5-2.3l-0.6,0.7V76.1l2.7-0.4l-20.4-23.8L85.3,77.5l2.7,0.1v23.4c-0.2-1.8-0.3-3.6-0.6-5.3c-0.4-2-1-3.9-1.5-5.9c-0.4-1.8-0.2-3.6-1-5.3c-0.4-0.8-0.8-3.3-2.4-3.2C82,81.6,81,82,80.8,82.6c-0.1,0.2,0.1,0.4,0,0.6c-0.9,1.5-1.4,3.5-1.7,5.2c-0.3,1.6-0.3,3.2-0.6,4.8c-0.3,1.7-0.8,3.3-1.2,5c-0.6,2.3-0.9,4.5-1.1,6.8c-0.1,0.8-0.1,1.6-0.2,2.5c-0.1,0.8-0.5,1.6-0.7,2.4c-0.4,1.3,0,2.6-0.2,3.9c-0.2,1.5-0.7,3-0.9,4.6c-0.1,0.7-0.1,1.4-0.1,2.2l-0.7,0.1l-18,19.1l3.4,0.1v21.4l29.2,1.2l33.2-5.2l42.2,1.7l33.2-5.2v-45.3l4.1-0.7L179.5,91.8z M178.1,115.4l1.9-0.3v9.7l-1.9,0.3V115.4z M168.4,94.4l-16.4,15.7c-1.7-0.1-3.6-0.1-5.6-0.2l12.9-15.8C162.7,94.2,165.8,94.3,168.4,94.4z M159.2,94l-16.4,15.7c-1.8-0.1-3.7-0.1-5.6-0.2l12.9-15.8C153.2,93.8,156.3,93.9,159.2,94z M149.9,93.6l-16.4,15.7c-1.9-0.1-3.8-0.1-5.6-0.2l13-15.8C143.8,93.4,146.9,93.5,149.9,93.6z M140.7,93.3l-16.4,15.7c-2-0.1-3.9-0.1-5.6-0.2l13-15.8C134.2,93,137.3,93.1,140.7,93.3z M111.8,84.3c0-1.5,1.1-2.9,2.5-3.2s2.5,0.8,2.5,2.4v6.9l-5,0.8V84.3z M124.1,92.6c0.5,0,3.3,0.1,7.3,0.3L115,108.6c-2.2-0.1-4.1-0.2-5.5-0.2C114.8,102.7,122.9,93.9,124.1,92.6z M103.8,57.8l2.4,17.5c-2.5-0.1-11.2-0.5-15.2-0.6C93.8,71.1,101,61.5,103.8,57.8z M90.7,77.7l15.5,0.7v29.2l-3.3,3.6l3.3,0.1v4.1l-15.5,2.4V77.7z M78.4,108.9c0.3-6.5,3.9-21.7,3.7-21.8c0.2-0.1,1.2,16.1,0,21.9c-0.3,1.4,0.7,5.7,0.6,10.1l-5.4,0.8C77.8,115.7,78.2,111.5,78.4,108.9z M86.4,159.2c-2.5-0.1-22.7-0.9-24.9-1v-20.9c4.4-4.7,10.8-11.4,12.5-13.2l12.5,14.3L86.4,159.2L86.4,159.2z M82.1,122.3l14.7,14.2l-2.7,0.4L82.1,122.3z M100.4,151.1l-5,0.8V145c0-1.5,1.1-2.9,2.5-3.2c1.4-0.2,2.5,0.8,2.5,2.4V151.1z M102.9,135.5l-12-14.6l14.7,14.2L102.9,135.5z M112,149.3l-5,0.8v-6.8c0-1.5,1.1-2.9,2.5-3.2c1.4-0.2,2.5,0.8,2.5,2.4V149.3z M111.6,134.2l-12-14.6l14.7,14.2L111.6,134.2z M161.7,155.8c-0.5,0-2.9-0.1-6.3-0.3v-11.1c0-2.9-2.1-5.4-4.8-5.5c-2.6-0.1-4.8,2.2-4.8,5.1v11.1c-8-0.3-17.5-0.7-24.8-1v-18.3l2.7-0.4l-14.7-16.8v-7.1l52.7,2.2L161.7,155.8L161.7,155.8z M175.3,125.5l-1.9,0.3v-9.7l1.9-0.3V125.5z M161.2,110.5c-0.4,0-2.5-0.1-5.5-0.2l12.9-15.8c3.4,0.1,5.9,0.2,7.1,0.3C173.4,97.3,162.6,109,161.2,110.5z M181.6,146l-5,0.8v-6.9c0-1.5,1.1-2.9,2.5-3.2c1.4-0.2,2.5,0.8,2.5,2.4V146z M184.7,124l-1.9,0.3v-9.7l1.9-0.3V124z" /><path d="M59,187.3c0.7-0.2,1.3-0.7,1.9-1.2c1.3,1.3,3,1.9,4.6,1.4c2.3-0.7,3.7-3.6,3.3-6.6c1.1,1.4,2.6,2,4.1,1.5c1-0.3,1.8-1.1,2.3-2.1c0.8,0.5,1.6,0.7,2.5,0.4c1.8-0.6,2.9-3,2.3-5.4c0-0.2-0.1-0.4-0.2-0.6c0.8-1.1,1.2-2.7,0.8-4.3c-0.6-2.4-2.6-3.9-4.4-3.3c-0.6,0.2-1.1,0.6-1.5,1.1c-1.1-1-2.4-1.5-3.7-1.1c-0.4,0.1-0.7,0.3-1.1,0.6c-0.8-1.1-2-1.6-3.2-1.2c-1.3,0.4-2.2,1.9-2.2,3.5c-0.6-0.1-1.1,0-1.7,0.2c-0.6,0.2-1.1,0.5-1.5,0.9c-1.4-1.6-3.4-2.4-5.2-1.8c-1.6,0.5-2.8,1.9-3.3,3.8c-1-0.3-2-0.4-3,0c-0.8,0.3-1.5,0.7-2,1.3c-0.8-1-2-1.6-3.3-1.6c-1.7,0-3.1,1-3.9,2.5C46.1,179.7,52.3,183.8,59,187.3C59,187.3,59,187.3,59,187.3z M126.1,190.5c0.7,0,1.4-0.1,2.1-0.4c0.7-0.3,1.3-0.7,1.8-1.3c1.2,1.7,3,2.5,4.6,1.8c1.4-0.6,2.3-2.1,2.5-3.9c0.5,0,1-0.1,1.5-0.3c1.6-0.7,2.7-2.3,3.2-4.2c0.8,0.2,1.6,0.2,2.3-0.1c2.3-0.9,3.4-4.1,2.5-7.1c-0.3-1-0.8-1.8-1.4-2.5c0.6-1.4,0.7-3.1,0.2-4.8c-0.9-3-3.6-4.7-6-3.8c-1.1,0.4-1.9,1.3-2.4,2.5c-1.2-0.7-2.6-0.8-3.9-0.3c-1.9,0.8-3.1,2.8-3.3,5.1c-1.7-3.4-5.1-5.2-8.1-3.9c-2.1,0.9-3.4,3-3.8,5.4c-0.9-0.1-1.9,0-2.8,0.4c-1,0.4-1.8,1.1-2.4,2c-2.1-1.9-4.8-2.5-7.2-1.4c-1.9,0.9-3.3,2.6-3.9,4.8c-1.2-1.7-3.2-2.5-4.8-1.7c-2.1,1-2.9,3.9-1.9,6.6c0.2,0.6,0.5,1.1,0.9,1.5c-2.3-2-5.3-2.7-7.9-1.4c-1.2,0.6-2.2,1.5-2.9,2.6c-2.3-2-5.3-2.6-7.9-1.3c-2.9,1.5-4.5,4.9-4.3,8.7c10.6,4.2,21.9,7.2,33.6,8.9c0.7-1.2,1.1-2.7,1.1-4.4c1.8,1.1,3.9,1.3,5.8,0.5c1.3-0.6,2.2-1.5,3-2.8c1.8,1.3,4,1.8,5.9,0.9C124.4,195.8,125.8,193.3,126.1,190.5z M205.1,179.4c0.7-1.7,0.9-3.9,0.1-6c-1.2-3.5-4.3-5.4-6.8-4.3c-0.8,0.4-1.5,1-2,1.9c-1.7-1.4-3.7-1.9-5.5-1c-0.5,0.2-1,0.6-1.4,1c-1.3-1.4-3.2-2-4.8-1.3c-1.8,0.8-2.7,3.2-2.4,5.6c-0.8,0-1.6,0.2-2.3,0.5c-0.8,0.4-1.4,0.9-2,1.5c-2.3-2.2-5.2-2.9-7.7-1.7c-2.1,1.1-3.5,3.4-3.9,6.2c-1.4-0.3-2.9-0.2-4.3,0.6c-2.1,1.1-3.4,3.2-3.9,5.8c-2-2.3-4.9-3.1-7.2-1.9c-1.4,0.7-2.3,2.1-2.8,3.8c-2.2-1.1-4.6-1.1-6.7,0c-2.8,1.5-4.3,4.9-4.2,8.7c-1.4-0.1-2.8,0.1-4,0.8c-0.7,0.4-1.3,0.9-1.8,1.5c-1.9-2-4.5-2.6-6.5-1.4c-1.5,0.9-2.3,2.5-2.6,4.4c1.9,0.1,3.7,0.1,5.6,0.1c22.2,0,43.7-4.8,62.5-13.5c0-0.4-0.1-0.8-0.2-1.2c0.3,0.3,0.6,0.6,0.9,0.8c5-2.4,9.8-5,14.3-7.9c0-0.9-0.2-1.8-0.5-2.8C205.2,179.6,205.1,179.5,205.1,179.4z" /></g></g>
                                                    </svg>
                                                    <h5 className="change-hamburguer-quit ">Fincas</h5>
                                                </li>
                                            </Link>
                                            <Link to={"/dashboard/lotes/registros"} onClick={() => { selectedLi("/dashboard/lotes/registros") }} className={`link-memu-horizontal  ${liSelected == "/dashboard/lotes/registros" ? "selected-li" : ""}`}>
                                                <li className="hamburguer-centered">
                                                    <svg className="icon-li-nav-horizontal" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 256 256"  >
                                                        <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                                        <g><g><g><path d="M118.3,39.3V49h9.7h9.7v-9.7v-9.7H128h-9.7V39.3z" /><path d="M79.4,49.8l-6.8,6.8l6.8,6.8l6.8,6.8l6.8-6.8l6.8-6.8L93,49.8L86.2,43L79.4,49.8z" /><path d="M163,49.8l-6.8,6.8l6.8,6.8l6.8,6.8l6.8-6.8l6.8-6.8l-6.8-6.8l-6.8-6.8L163,49.8z" /><path d="M123.3,59.6c-9,1.1-17.6,5.5-23.9,12.4c-9.2,9.9-12.6,23.5-9.2,36.4c1.2,4.6,2.6,6.7,5.4,8.4l2.2,1.3H128h30.3l2.1-1.2c4.4-2.5,6.7-8.7,6.7-18.5c0-8.8-2.2-15.7-7.3-22.9C151.6,64.2,137.2,57.9,123.3,59.6z M134.7,79.9c7,2.4,12.3,9.2,13.1,16.5l0.3,2.4h-20h-19.9v-1.3c0-1.8,1.2-6.3,2.4-8.5c1.4-2.7,5.7-6.9,8.5-8.2C124,78.4,129.6,78.1,134.7,79.9z" /><path d="M59.2,98.4v9.7h9.7h9.7v-9.7v-9.7h-9.7h-9.7V98.4z" /><path d="M177.5,98.4v9.7h9.7h9.7v-9.7v-9.7h-9.7h-9.7V98.4z" /><path d="M54.6,129.4c-1.1,0.6-2.5,1.7-3.1,2.4c-0.6,0.8-10.2,19.7-21.4,42C11,212.4,10,214.5,10,216.8c0.1,4.1,2.3,7.4,5.8,8.9c1.5,0.6,13.5,0.7,112.2,0.7c98.7,0,110.7-0.1,112.2-0.7c3.6-1.5,5.8-4.9,5.8-9c0-2.4-1-4.5-20.7-43.9c-19.9-39.7-20.8-41.4-22.7-42.7l-2-1.4l-71.9-0.1l-72-0.1L54.6,129.4z M84.1,148.2c0,0.2-4.9,13.5-11,29.6l-11,29.3H48.9c-7.3,0-13.3-0.1-13.3-0.2c0-0.1,6.6-13.4,14.6-29.6l14.7-29.3h9.6C79.8,147.9,84.1,148,84.1,148.2z M118.3,177.4V207h-17.6c-9.7,0-17.6-0.1-17.6-0.4c0-0.2,4.9-13.5,11-29.6l11-29.2h6.6h6.6V177.4z M161.9,177.1c6.1,16.1,11,29.4,11,29.6c0,0.2-7.9,0.4-17.6,0.4h-17.6v-29.6v-29.6h6.6h6.6L161.9,177.1z M205.8,177.2c8,16.1,14.6,29.4,14.6,29.6c0,0.1-6,0.2-13.3,0.2h-13.3l-11-29.3c-6.1-16-11-29.3-11-29.6c0-0.2,4.3-0.3,9.6-0.3h9.6L205.8,177.2z" /></g></g></g>
                                                    </svg>
                                                    <h5 className="change-hamburguer-quit ">Lotes</h5>
                                                </li>
                                            </Link>

                                            {data.userInfo && data.userInfo.rol == 'administrador' && (
                                                <Link to={"/dashboard/variedades/registros"} onClick={() => { selectedLi("/dashboard/variedades/registros") }} className={`link-memu-horizontal  ${liSelected == "/dashboard/variedades/registros" ? "selected-li" : ""}`}>
                                                    <li className="hamburguer-centered"><svg className="icon-li-nav-horizontal" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 256 256"  >
                                                        <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                                        <g><g><path d="M99.6,10.4H29.1C18.6,10.4,10,18.4,10,29v69c0,10.5,8.6,20.2,19.1,20.2h70.6c10.5,0,19.1-9.7,19.1-20.2V29C118.7,18.4,110.1,10.4,99.6,10.4z M99.6,99.1H29.1V29h70.6V99.1z M99.6,137.8H29.1c-10.5,0-19.1,8.6-19.1,19.1v69.6c0,10.5,8.6,19.1,19.1,19.1h70.6c10.5,0,19.1-8.6,19.1-19.1v-69.6C118.7,146.5,110.1,137.8,99.6,137.8z M99.6,226.5H29.1v-70.1h70.6V226.5z M226.9,10.4h-70c-10.5,0-19.6,8.1-19.6,18.6v70.1c0,10.5,9.1,19.1,19.6,19.1h70c10.5,0,19.1-8.6,19.1-19.1V29C246,18.4,237.4,10.4,226.9,10.4z M226.9,99.1h-70V29h70V99.1L226.9,99.1z M224.8,137.8h-68.4c-10.5,0-19.1,8.6-19.1,19.1v69.6c0,10.5,8.6,19.1,19.1,19.1h70.6c10.5,0,19.1-8.6,19.1-19.1v-69.6C246,146.5,235.3,137.8,224.8,137.8z M226.9,226.5h-70V157h70V226.5L226.9,226.5z" /></g></g>
                                                    </svg> <h5 className="change-hamburguer-quit ">Variedades</h5>
                                                    </li>
                                                </Link>
                                            )}
                                            <Link to={"/dashboard/cafes/registros"} onClick={() => { selectedLi("/dashboard/cafes/registros") }} className={`link-memu-horizontal  ${liSelected == "/dashboard/cafes/registros" ? "selected-li" : ""}`}>
                                                <li className="hamburguer-centered">

                                                    <svg className="icon-li-nav-horizontal" version="1.0" width="256.000000pt" viewBox="0 0 256.000000 256.000000" preserveAspectRatio="xMidYMid meet">
                                                        <g transform="translate(0.000000,256.000000) scale(0.100000,-0.100000)" fill="#FFFFFF" stroke="none">
                                                            <path d="M1665 2535 c-29 -28 -31 -59 -10 -160 30 -142 114 -299 203 -375 l47 -40 -154 -154 c-138 -138 -157 -154 -175 -144 -29 16 -115 13 -158 -5 l-37 -16 -24 43 c-22 39 -23 51 -19 157 6 162 -27 273 -118 397 -25 35 -36 43 -58 40 -41 -5 -39 -33 7 -98 74 -105 117 -269 97 -372 -6 -34 -8 -35 -43 -29 -33 6 -38 10 -55 61 -42 125 -141 283 -247 398 -53 56 -62 60 -85 36 -23 -22 -21 -28 31 -86 104 -118 183 -241 227 -359 l25 -66 -33 -32 -33 -32 -74 78 c-86 90 -155 196 -198 303 -32 81 -61 207 -61 265 l0 35 63 0 c76 0 166 -22 226 -56 71 -39 117 -6 62 44 -55 52 -197 92 -324 92 -48 0 -62 -4 -82 -25 -30 -29 -31 -57 -10 -176 38 -218 147 -422 306 -574 l62 -59 -2 -63 c-5 -142 104 -254 220 -225 34 9 39 7 67 -23 l31 -32 -187 -186 c-152 -152 -192 -187 -215 -187 -23 0 -27 4 -27 28 0 22 24 52 120 147 98 97 120 125 118 145 -6 52 -36 36 -149 -76 l-109 -108 -27 26 c-41 38 -66 48 -120 48 l-48 0 3 93 c6 178 -49 319 -173 442 -83 84 -163 126 -284 150 -112 23 -197 17 -224 -16 -17 -21 -18 -33 -13 -94 16 -177 97 -384 207 -528 43 -57 56 -68 78 -65 44 5 38 38 -24 119 -100 133 -167 301 -182 452 l-6 67 64 0 c83 -1 139 -14 217 -52 168 -83 282 -290 269 -488 -5 -73 -27 -150 -44 -150 -4 0 -25 54 -46 120 -52 160 -133 295 -261 433 -24 26 -48 47 -54 47 -13 0 -42 -28 -42 -40 0 -4 32 -45 71 -91 112 -133 200 -288 223 -396 7 -29 6 -30 -34 -36 -57 -7 -108 -50 -137 -115 -22 -46 -25 -65 -21 -121 3 -36 12 -80 21 -97 20 -40 76 -93 104 -100 18 -5 21 -11 16 -42 -5 -32 -34 -66 -209 -242 -172 -173 -205 -211 -210 -241 -12 -73 52 -137 125 -125 30 5 68 38 241 210 175 174 210 205 242 210 27 5 38 3 38 -5 0 -21 43 -77 67 -88 17 -8 26 -7 38 5 21 21 19 31 -10 66 -32 38 -32 54 5 84 16 14 37 39 47 54 47 80 217 20 217 -75 0 -49 -43 -90 -114 -108 -61 -16 -81 -36 -61 -61 20 -23 78 -20 140 9 l53 25 60 -55 c155 -144 357 -238 568 -267 102 -13 134 -5 150 38 25 65 -2 238 -53 344 -42 87 -148 194 -242 242 -102 53 -179 70 -296 66 l-99 -3 0 48 c0 54 -10 79 -48 120 l-26 28 139 139 c77 77 143 140 146 140 4 0 9 -10 13 -23 8 -33 65 -87 114 -109 30 -14 62 -19 105 -17 l63 2 59 -62 c161 -169 383 -282 615 -313 102 -13 134 -5 150 38 25 65 -1 235 -53 343 -63 133 -220 255 -375 296 -66 17 -191 22 -252 10 -28 -5 -45 -1 -82 20 l-47 26 16 37 c18 43 21 129 5 158 -10 18 6 37 144 175 l154 154 40 -47 c95 -111 328 -217 478 -218 49 0 82 37 82 94 0 168 -91 315 -228 366 -45 18 -71 21 -127 17 -38 -2 -79 -8 -89 -13 -16 -6 -18 -4 -12 12 5 10 11 51 13 89 14 196 -153 354 -375 355 -43 0 -57 -5 -77 -25z m204 -74 c69 -26 114 -63 146 -122 34 -63 38 -150 10 -218 l-18 -44 -19 79 c-17 73 -60 166 -96 207 -19 22 -61 22 -69 0 -3 -9 1 -28 10 -42 43 -69 68 -126 82 -183 25 -106 21 -110 -40 -45 -80 85 -155 257 -155 356 0 31 1 31 50 31 27 0 72 -8 99 -19z m474 -448 c81 -44 137 -144 137 -243 0 -48 -1 -50 -27 -50 -51 0 -157 31 -230 66 -81 39 -203 143 -168 143 64 1 175 -39 266 -96 14 -9 33 -13 42 -10 22 8 22 50 0 69 -41 36 -134 79 -208 96 l-79 19 44 16 c25 9 54 18 65 21 38 9 110 -6 158 -31z m-1072 -339 c14 -14 30 -40 36 -58 9 -28 7 -39 -13 -71 -12 -21 -26 -57 -30 -79 -8 -47 -17 -56 -62 -56 -96 0 -145 167 -74 251 46 55 94 59 143 13z m300 -103 c45 -45 37 -115 -19 -174 -86 -91 -212 -72 -212 33 0 125 153 218 231 141z m106 -303 c57 -60 19 -144 -77 -169 -89 -23 -190 32 -190 103 0 45 9 54 56 62 22 4 58 18 79 30 32 20 43 22 71 13 18 -6 46 -23 61 -39z m308 -12 c85 -21 141 -47 207 -97 117 -89 176 -202 186 -351 l5 -88 -37 0 c-58 0 -182 29 -262 60 -112 45 -209 107 -301 194 l-84 79 32 33 32 33 62 -23 c77 -30 135 -59 201 -103 59 -39 97 -41 102 -6 2 16 -9 31 -45 57 -58 43 -168 99 -243 125 -50 18 -56 22 -61 55 -4 27 -2 36 10 39 36 10 140 6 196 -7z m-1195 -221 c17 -9 33 -28 40 -50 12 -38 6 -105 -10 -105 -5 0 -24 -13 -43 -29 -31 -28 -35 -29 -80 -19 -46 9 -47 10 -47 47 0 21 -5 52 -11 70 -13 37 1 58 54 85 40 20 61 20 97 1z m-259 -52 c32 -29 54 -99 45 -140 -4 -17 -19 -36 -36 -46 -15 -10 -40 -31 -54 -47 -31 -37 -50 -38 -86 -2 -56 57 -62 164 -12 223 46 55 94 59 143 12z m458 -154 c65 -23 76 -99 25 -166 -22 -30 -30 -33 -53 -27 -14 4 -48 10 -76 13 -47 6 -50 8 -53 36 -2 17 -8 42 -14 58 -13 34 0 53 57 78 47 22 70 23 114 8z m-258 -98 c77 -78 -16 -231 -141 -231 -105 0 -124 126 -33 212 59 56 129 64 174 19z m669 -131 c207 -70 339 -247 340 -457 l0 -63 -35 0 c-166 0 -425 117 -573 259 -51 49 -52 52 -46 93 4 24 8 45 10 47 2 2 38 -8 80 -22 127 -44 205 -93 408 -260 24 -19 51 -15 60 10 9 22 -2 35 -74 99 -136 119 -296 207 -452 249 -71 19 -81 28 -49 45 67 36 226 36 331 0z m-1083 -338 c-150 -151 -186 -182 -207 -180 -18 2 -26 10 -28 27 -3 20 29 57 179 207 l182 182 28 -26 27 -27 -181 -183z" />
                                                            <path d="M2181 916 c-15 -18 -2 -46 35 -75 32 -25 38 -26 58 -5 22 22 20 31 -13 65 -32 32 -62 37 -80 15z" />
                                                        </g>
                                                    </svg>

                                                    <h5 className="change-hamburguer-quit ">Cafés</h5>
                                                </li>
                                            </Link>

                                            <Link to={"/dashboard/muestras/registros"} onClick={() => { selectedLi("/dashboard/muestras/registros") }} className={`link-memu-horizontal  ${liSelected == "/dashboard/muestras/registros" ? "selected-li" : ""}`}>
                                                <li className="hamburguer-centered">
                                                    <svg className="icon-li-nav-horizontal" version="1.1" id="Layer_1" x="0px" y="0px" width="100%" viewBox="0 0 608 608">
                                                        <path fill="#FFFFFF" stroke="none" d=" M383.043396,73.979492   C400.429901,63.049480 418.505249,54.666756 438.739380,52.259125   C466.540680,48.951080 491.495636,56.090355 513.338501,73.799629   C515.893250,75.870934 515.063171,77.596565 513.596558,79.747307   C507.423798,88.799408 498.679169,94.845673 489.545288,100.408936   C479.716187,106.395645 469.401123,111.469810 458.759827,115.823135   C437.308624,124.598770 423.080353,140.796280 412.094208,160.492188   C404.877441,173.430405 398.551086,186.828018 391.261200,199.738266   C378.693115,221.995972 360.340729,237.315720 336.952667,247.006592   C332.801788,248.726471 328.649445,250.464462 324.613159,252.430832   C322.277283,253.568802 320.704376,253.523514 319.163391,251.177841   C310.309235,237.700165 305.128296,222.950226 303.664337,206.909912   C300.660919,174.003067 314.157471,146.581955 332.659943,120.975037   C346.268250,102.141510 363.232971,86.763710 383.043396,73.979492  z" />
                                                        <path fill="#FFFFFF" stroke="none" d=" M260.443665,413.510010   C231.639297,430.023712 201.897110,432.235382 171.839233,419.455017   C121.515121,398.057617 86.387375,361.447998 68.876228,309.538910   C57.869053,276.909851 64.078522,246.145981 85.180412,218.611023   C87.647491,215.391876 89.578674,215.013657 92.947060,217.445618   C104.281235,225.628815 111.083176,237.261719 117.536819,249.131073   C121.110504,255.703690 124.532051,262.428955 127.238960,269.389954   C135.701187,291.151093 151.336548,306.135132 171.184433,317.419495   C185.524216,325.572327 200.538971,332.436981 214.771881,340.814209   C235.894974,353.246887 250.168884,371.264862 259.471924,393.599121   C260.880463,396.980682 261.908997,400.599365 263.809143,403.679016   C266.722961,408.401642 265.593323,411.313141 260.443665,413.510010  z" />
                                                        <path fill="#FFFFFF" stroke="none" d=" M305.532104,489.224640   C299.746918,463.556641 304.933685,439.944611 316.529144,417.423401   C336.709076,378.228912 367.017639,349.385437 407.242432,331.604645   C442.755951,315.906342 477.205414,318.192749 509.436554,341.093140   C509.708069,341.286011 509.977478,341.482147 510.242096,341.684326   C516.247559,346.272614 516.421875,346.722351 511.774658,352.605988   C503.742035,362.775818 492.842041,369.267578 481.661041,375.259796   C475.360443,378.636444 468.971313,381.983521 462.310211,384.527252   C439.308014,393.311249 423.518127,409.722443 412.141510,430.949310   C406.244415,441.952393 400.438263,453.005402 394.703461,464.093994   C382.057983,488.545074 363.426514,506.510620 337.810760,517.011047   C333.346313,518.841064 328.905579,520.753906 324.574249,522.874329   C321.957092,524.155579 320.465668,523.667175 318.854248,521.218323   C312.459656,511.500519 308.187134,500.935974 305.532104,489.224640  z" />
                                                        <path fill="#FFFFFF" stroke="none" d=" M544.098145,145.869736   C542.530823,178.575500 528.258972,205.499634 508.504181,229.893082   C487.313385,256.059784 461.368439,276.150696 429.141724,286.761383   C392.084106,298.962677 358.898346,291.362396 330.186279,264.805511   C328.857941,263.576874 327.479767,262.328064 327.032776,260.486450   C327.338196,259.452087 328.093903,259.240875 328.979340,259.244476   C367.285400,259.400024 393.950989,239.955414 413.810699,208.958405   C423.169556,194.351135 430.337799,178.518509 439.387756,163.730835   C446.717865,151.753433 456.342957,142.485199 468.787079,135.966965   C481.824432,129.137985 494.012634,121.028725 504.673309,110.779732   C512.450989,103.302391 518.544495,94.713745 521.979370,82.725906   C537.416565,101.847672 543.781982,122.532539 544.098145,145.869736  z" />
                                                        <path fill="#FFFFFF" stroke="none" d=" M502.816772,382.800537   C511.683319,374.746338 518.400574,365.644897 521.885071,353.586853   C526.602783,358.167664 529.473755,362.984894 532.076965,367.903351   C548.501099,398.934387 547.624207,430.419220 532.849487,461.470642   C511.820892,505.665649 479.051117,538.330994 432.964111,555.737488   C395.494934,569.889221 361.002319,563.201782 331.044708,535.955261   C329.697876,534.730286 328.544708,533.284424 327.371033,531.883118   C327.098114,531.557312 327.110779,530.992310 326.897156,530.173706   C331.880554,529.049866 336.859009,529.689575 341.734955,529.045776   C369.526886,525.376282 390.630402,510.952423 407.158325,489.038696   C416.926941,476.086792 424.109711,461.584473 431.745087,447.354034   C436.786133,437.958862 442.236237,428.824554 449.418610,420.815399   C456.363098,413.071533 465.388824,408.408295 474.199921,403.360046   C484.334534,397.553497 494.028168,391.103912 502.816772,382.800537  z" />
                                                        <path fill="#FFFFFF" stroke="none" d=" M291.889374,283.245300   C300.850372,301.356140 305.809509,319.943024 304.351898,339.977783   C302.584137,364.275452 293.066284,384.936523 275.674316,401.976013   C274.865875,402.768097 274.054962,403.698364 272.259460,403.390900   C270.841614,397.922150 271.833557,392.109344 270.919037,386.428253   C266.682861,360.113678 253.006851,339.859863 232.115189,324.001556   C217.835449,313.162140 201.767044,305.332764 186.079269,296.897644   C169.083771,287.759369 155.339340,275.834778 146.462021,258.110382   C138.441757,242.097168 127.630539,227.862610 113.025688,216.922928   C108.029839,213.180786 102.239166,211.128464 96.481682,208.889709   C97.160027,205.938339 99.548859,205.110794 101.383087,203.884857   C131.127304,184.004349 162.944885,181.314789 195.667236,194.481689   C238.636673,211.771835 270.345917,241.872299 291.889374,283.245300  z" />
                                                    </svg> <h5 className="change-hamburguer-quit ">Muestras</h5>
                                                </li>
                                            </Link>

                                            <Link to={"/dashboard/analisis/registros"} onClick={() => { selectedLi("/dashboard/analisis/registros") }} className={`link-memu-horizontal  ${liSelected == "/dashboard/analisis/registros" ? "selected-li" : ""}`}>
                                                <li className="hamburguer-centered"><svg className="icon-li-nav-horizontal" xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 335.000000 291.000000" preserveAspectRatio="xMidYMid meet">
                                                    <metadata>
                                                        Created by potrace 1.16, written by Peter Selinger 2001-2019
                                                    </metadata>
                                                    <g transform="translate(0.000000,291.000000) scale(0.100000,-0.100000)" stroke="none">
                                                        <path d="M95 2838 c10 -46 41 -94 81 -124 115 -88 287 -21 319 124 6 30 5 32 -22 32 -24 -1 -32 -9 -53 -53 -21 -44 -32 -55 -72 -71 -42 -17 -52 -18 -90 -7 -49 15 -93 58 -101 101 -6 26 -11 30 -38 30 -29 0 -30 -1 -24 -32z" />
                                                        <path d="M1570 2853 c1 -64 80 -154 151 -173 98 -27 218 38 244 130 3 14 9 33 12 43 4 15 0 18 -27 15 -27 -2 -34 -9 -45 -40 -15 -45 -34 -64 -81 -84 -74 -31 -172 18 -189 95 -5 26 -11 31 -36 31 -21 0 -29 -5 -29 -17z" />
                                                        <path d="M1180 2430 c0 -330 -2 -345 -59 -393 -39 -33 -115 -37 -162 -10 -27 16 -69 84 -69 111 0 7 -13 12 -29 12 -20 0 -30 -6 -34 -20 -3 -11 -17 -25 -31 -31 -20 -10 -30 -9 -51 5 -14 9 -25 23 -25 31 0 10 -10 15 -30 15 -24 0 -30 -4 -30 -22 0 -13 14 -37 30 -55 38 -40 87 -51 131 -29 39 19 39 19 39 3 0 -17 47 -60 87 -81 78 -39 202 -9 246 60 12 19 27 32 32 30 60 -26 83 -28 119 -11 36 17 66 58 66 90 0 24 -56 20 -63 -5 -3 -11 -17 -25 -31 -31 -20 -10 -30 -9 -51 5 l-25 16 0 305 0 305 -30 0 -30 0 0 -300z" />
                                                        <path d="M280 1603 c0 -85 20 -226 46 -332 45 -181 124 -342 230 -467 30 -35 54 -65 54 -68 0 -2 -91 -3 -202 -2 l-201 2 33 -25 c19 -14 76 -59 127 -98 l94 -73 573 0 574 0 121 93 c66 50 121 94 121 97 0 3 -89 5 -198 5 l-198 0 52 62 c29 34 61 74 70 90 10 15 19 30 20 32 2 2 24 -7 51 -20 83 -40 225 -22 272 34 10 13 30 17 74 17 60 0 60 0 42 -20 -20 -22 -32 -111 -21 -154 3 -14 20 -42 38 -61 l31 -36 -25 -27 c-39 -41 -48 -66 -48 -125 0 -42 6 -63 26 -93 15 -21 32 -42 38 -46 7 -5 2 -17 -15 -35 -15 -15 -32 -38 -38 -50 -14 -28 -14 -113 0 -150 12 -33 73 -91 104 -99 11 -3 178 -4 371 -2 l349 3 67 27 c242 97 393 301 413 559 16 201 -70 399 -229 527 -98 79 -202 124 -323 142 -56 8 -84 18 -120 43 -56 39 -110 63 -173 77 -59 13 -201 13 -276 0 -65 -12 -254 -68 -268 -80 -4 -5 -31 3 -60 16 -28 13 -64 24 -80 24 -26 0 -28 2 -23 33 3 17 9 76 13 130 l6 97 -756 0 -756 0 0 -47z m1446 -55 c-3 -24 -8 -68 -11 -98 -3 -30 -8 -70 -12 -89 -6 -34 -6 -34 27 -28 18 4 51 2 74 -4 l40 -11 -34 -15 c-19 -8 -56 -21 -81 -29 l-46 -14 -31 -88 c-30 -85 -30 -88 -13 -117 11 -20 34 -36 66 -49 28 -10 70 -27 95 -36 l44 -18 -41 -11 c-57 -15 -127 1 -177 41 -37 30 -40 31 -50 14 -43 -74 -94 -140 -149 -194 l-64 -63 -284 -4 c-364 -5 -365 -5 -426 54 -176 169 -279 412 -308 729 l-7 72 697 0 696 0 -5 -42z m803 -195 c30 -11 56 -24 58 -29 2 -5 -107 -8 -274 -6 -296 4 -306 7 -143 43 110 24 279 21 359 -8z m331 -121 c287 -96 453 -376 396 -663 -24 -115 -66 -196 -149 -285 -54 -58 -86 -83 -151 -114 -124 -62 -200 -72 -534 -68 -309 3 -311 4 -342 71 -23 50 -12 99 29 141 30 30 34 31 136 34 l105 4 0 29 0 29 -104 0 c-97 0 -107 2 -134 25 -33 27 -51 68 -46 101 14 89 55 114 187 114 l97 0 0 30 0 30 -99 0 c-86 0 -102 3 -132 23 -64 43 -69 136 -9 190 29 26 35 27 135 27 l105 0 0 30 0 30 -245 0 c-268 0 -293 4 -334 56 -19 24 -22 38 -18 77 2 27 12 56 23 68 43 49 48 49 549 46 453 -3 472 -4 535 -25z m-1180 -557 c0 -1 -20 -19 -45 -39 l-44 -37 -556 1 -557 0 -43 34 c-25 18 -42 36 -39 39 6 5 1284 8 1284 2z" />
                                                        <path d="M1060 1196 c0 -130 4 -236 9 -236 40 0 106 110 117 196 12 100 -32 220 -97 258 l-29 17 0 -235z" />
                                                        <path d="M958 1400 c-33 -25 -68 -109 -75 -177 -9 -79 20 -175 67 -224 20 -21 42 -39 48 -39 9 0 12 63 12 230 0 249 -1 251 -52 210z" />
                                                    </g>
                                                </svg> <h5 className="change-hamburguer-quit ">Análisis</h5>
                                                </li>
                                            </Link>
                                            <Link to={"/dashboard/formatos/registros"} onClick={() => { selectedLi("/dashboard/formatos/registros") }} className={`link-memu-horizontal  ${liSelected == "/dashboard/formatos/registros" ? "selected-li" : ""}`}>
                                                <li className="hamburguer-centered">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon-li-nav-horizontal" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enableBackground="new 0 0 256 256" >
                                                        <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                                        <g><g><g><path fill="#ffffff" d="M70.1,34.8c-50.4,21-59.9,25.1-60.1,26c-0.1,0.6,8.5,21.8,19.1,47.3c10.6,25.4,26.2,63,34.6,83.5c10,24,15.8,37.5,16.5,37.9c0.9,0.6,2.9-0.2,16.8-5.8c8.7-3.6,15.9-6.5,16-6.5c0.1,0,0.2,6.3,0.2,14c0,10.2,0.2,14.1,0.6,14.6c1,1,130.9,0.9,131.7-0.1c0.4-0.5,0.6-25.6,0.6-91.9c0-50.2-0.1-91.5-0.3-91.7c-0.2-0.3-18.4-0.5-46-0.5H154l-6.7-16.3C143.7,36.3,139,25,137,20.1c-2-4.9-3.9-9.3-4.2-9.7c-0.4-0.4-1.1-0.8-1.7-0.7C130.5,9.7,103,21,70.1,34.8z M139.1,37c5,12.2,9.3,22.7,9.5,23.1c0.3,0.9-0.7,0.9-16.3,0.9c-9.6,0-17.2,0.2-17.9,0.5c-1.1,0.4-1.3,0.8-1.3,2.2c0,1-0.3,1.9-0.6,2.2c-0.4,0.2-6.2,2.7-13,5.5C88.3,76,87.2,76.6,87,77.8c-0.2,1.4,14,36.1,15.4,37.7c1,1.2,1.1,1.2,5.7-0.9c2.2-1,4.2-1.8,4.4-1.8c0.2,0,0.4,3,0.4,6.6l-0.1,6.7l-5,0.3c-9.9,0.6-16.2,3.3-22.7,9.8c-10.9,10.8-13.4,27.1-6.4,40.7c2.5,4.9,9.2,11.5,14,14c5.1,2.7,8.4,3.5,14.6,3.9l5.5,0.3v8.6v8.5l-15.1,6.2c-8.3,3.4-15.2,6-15.5,5.8c-0.2-0.2-13.6-32.1-29.7-70.9c-16.1-38.8-31.2-75-33.5-80.5c-2.3-5.5-4-10.2-3.9-10.4c0.2-0.2,19.4-8.2,42.6-17.8c23.3-9.7,48.9-20.3,56.9-23.7c8.1-3.4,14.7-6.1,14.9-6.2C129.9,14.7,134.1,24.7,139.1,37z M241.5,153.9v87.8h-61.9h-61.9l-0.1-87.8V66h61.9h61.9L241.5,153.9L241.5,153.9z M112.6,75.4v4.4l-8.6,3.4c-4.7,1.9-8.7,3.3-9,3.2c-0.6-0.3-3.3-6.8-3-7.1c0.4-0.4,19.3-8.2,19.9-8.2C112.4,71.1,112.6,72.3,112.6,75.4z M112.6,96.5v11.3l-3.4,1.5c-1.9,0.9-3.6,1.5-3.9,1.3c-0.7-0.3-8.5-18.9-8.1-19.3c0.4-0.4,14-6,14.8-6.1C112.4,85.2,112.6,87.7,112.6,96.5z M111.8,130.8c0.6,0.2,0.8,1,0.8,2.8v2.5h-3.4c-14,0.1-24.8,11-24.8,25.2c0,7.1,2,12.1,6.8,16.9c4.9,4.9,11.8,7.6,18.5,7.2l2.8-0.2v2.6c0,3-0.3,3.2-4.2,3.2c-7.1-0.1-14.2-3-19.6-8c-12.6-11.9-13.1-31.2-1.2-43.1c3.8-3.8,6.9-5.7,11.5-7.3C103.7,130.9,110,130.1,111.8,130.8z M112.6,143.2v2.7h-3.1c-8.6,0-15.5,7.6-14.9,16.3c0.5,7.6,6.3,12.9,14.6,13.5l3.4,0.3l-0.2,2.3l-0.2,2.3h-5c-4.7,0-5.2-0.1-8.2-1.7c-5.1-2.8-8.4-7.1-10-13.1c-3.3-12.7,6.4-25.1,19.6-25.2h3.9L112.6,143.2L112.6,143.2z M111.8,150.4c0.7,0.3,0.8,1.7,0.8,10.5v10.2l-1.6,0.4c-3.5,0.7-6.9-0.7-9.7-3.8c-3.6-4.2-3.5-9.6,0.1-13.6C104.3,150.8,108.8,149.3,111.8,150.4z" /><path fill="#ffffff" d="M77.9,52.4c-26.3,11-42.1,17.8-42.4,18.4c-0.7,1.3,0.3,3.3,1.7,3.3c0.6,0,19.9-7.9,43.1-17.5c44.9-18.6,44.4-18.4,42.2-20.8c-0.5-0.6-1.3-1-1.7-1C120.2,34.9,101,42.8,77.9,52.4z" /><path fill="#ffffff" d="M83.1,64.2c-22.8,9.5-41.7,17.5-42.2,17.9c-1.2,1-1,2.4,0.4,3.3c1.1,0.8,3,0,43.1-16.7c23.1-9.6,42.4-17.8,42.9-18.3c1.4-1.4,0.4-3.5-1.6-3.5C125,46.9,105.8,54.7,83.1,64.2z" /><path fill="#ffffff" d="M61.3,87.1c-8.5,3.5-15.6,6.8-15.9,7.2c-0.7,1.2,0.4,3.4,1.7,3.4c0.6,0,7.9-2.9,16.4-6.4c13.1-5.4,15.5-6.6,15.7-7.6c0.3-1.2-1-3.2-2.1-3.1C76.9,80.7,69.7,83.6,61.3,87.1z" /><path fill="#ffffff" d="M59.9,101.4c-4.7,2-9,3.9-9.5,4.3c-1.2,1-1,2.4,0.4,3.3c1.1,0.7,1.7,0.6,10.4-3c9.1-3.7,11.1-4.8,11.1-6.1c0-1-1.5-2.2-2.7-2.2C69.1,97.8,64.7,99.5,59.9,101.4z" /><path fill="#ffffff" d="M61.8,114.9c-6.6,2.9-7.3,3.4-6.8,5.1c0.6,2.3,1.9,2.2,9.1-0.9c7-3,7.9-3.7,6.8-5.8C70,111.8,68.2,112.1,61.8,114.9z" /><path fill="#ffffff" d="M83.4,119.7c-1,0.4-6.6,2.8-12.5,5.3c-9.1,3.8-10.7,4.7-11,5.7c-0.4,1.5,0.6,2.7,2.1,2.7c1.4,0,25-10,25.5-10.8c0.7-1.1,0.4-2.8-0.6-3.3C85.8,118.8,85.6,118.8,83.4,119.7z" /><path fill="#ffffff" d="M133.2,81.1c-1.2,1.2-1.2,1.5-0.2,2.9l0.8,1.1h46h46l0.8-1.1c1-1.5,1-1.7-0.2-2.9c-1-1-1.7-1-46.6-1S134.2,80.1,133.2,81.1z" /><path fill="#ffffff" d="M132.7,94.8c-0.5,0.8-0.4,1.3,0.3,2.3l0.8,1.2h14c14.7,0,15.2-0.1,15.2-2.3c0-2.2-0.5-2.3-15.5-2.3C133.6,93.7,133.2,93.8,132.7,94.8z" /><path fill="#ffffff" d="M171.5,94.7c-0.7,1.4-0.7,1.9,0.3,2.8c0.7,0.7,3.3,0.8,21,0.8c21.3,0,21.4,0,21.4-2.3s-0.2-2.3-21.7-2.3C172.8,93.7,172,93.8,171.5,94.7z" /><path fill="#ffffff" d="M133.3,106.9c-0.5,0.5-0.6,5.8-0.6,21.1c0,19.7,0.1,20.5,1,21c1.6,0.8,91.2,0.7,92.3-0.2c0.8-0.6,0.9-2.4,0.9-21c0-18.9-0.1-20.4-0.9-21C224.8,106,134.2,106,133.3,106.9z M154.9,127.9v17.1L146,145l-9-0.2l-0.2-16.4c-0.1-9,0-16.6,0.2-17c0.2-0.5,2.4-0.7,9.1-0.7h8.8V127.9L154.9,127.9z M177.5,114.9v4h-8.8h-8.8v-4v-4h8.8h8.8V114.9z M222.3,114.9v4h-20.1h-20.1v-4v-4h20.1h20.1V114.9z M177.5,127.9v4h-8.8h-8.8v-4v-4h8.8h8.8V127.9z M199.7,134.5v10.6h-8.8h-8.8v-10.6v-10.6h8.8h8.8V134.5z M222.3,127.9v4h-8.8h-8.8v-4v-4h8.8h8.8V127.9z M177.4,140.9l0.2,4.2h-8.9h-8.8v-4.3v-4.3l8.7,0.1l8.7,0.2L177.4,140.9z M222.3,140.8v4.3h-8.8h-8.8v-3.9c0-2.2,0.2-4.1,0.4-4.3c0.2-0.2,4.1-0.4,8.8-0.4h8.5V140.8z" /><path fill="#ffffff" d="M133,158.9c-0.7,1-0.7,1.5-0.3,2.3c0.5,1,0.9,1.1,14.7,1.1c15,0,15.5,0,15.5-2.3s-0.5-2.3-15.2-2.3h-14L133,158.9z" /><path fill="#ffffff" d="M171.8,158.8c-0.7,1-0.8,3.7-0.8,19.4v18.3h-4.3h-4.3v-5.7c0-3.8-0.2-5.9-0.6-6.3c-0.9-0.9-15.1-0.9-15.9,0c-0.5,0.5-0.6,4-0.6,12.8v12.2h-5.7c-3.8,0-5.9,0.2-6.3,0.6c-0.9,0.9-0.9,15.2,0.1,16c1,0.9,91.9,0.8,92.8-0.1c0.9-0.9,1-40.4,0.1-41.4c-0.5-0.6-2.3-0.7-8.1-0.7c-6.8,0-7.5,0.1-8,1c-0.3,0.6-0.5,3.4-0.5,6.3v5.3h-4.3h-4.3v-12c0-14.6,0.5-13.6-7.4-13.6h-5.2v-5.4c0-7.9,0.3-7.7-8.8-7.7C172.9,157.6,172.5,157.7,171.8,158.8z M183.9,170.6c-0.2,4.6-0.4,18.1-0.4,30v21.5h-4h-4v-30v-30h4.4h4.3L183.9,170.6z M196.7,198.7v23.4h-4h-4v-23.4v-23.4h4h4V198.7z M157.9,205.2v16.9h-4h-4v-16.9v-16.9h4h4V205.2z M222.3,205.2v16.9h-4h-4v-16.9v-16.9h4h4L222.3,205.2L222.3,205.2z M171,211.5v10.6h-4.3h-4.3v-10.6v-10.6h4.3h4.3V211.5z M209.2,211.5v10.6h-4h-4v-10.6v-10.6h4h4V211.5z M145.3,218.1v4H141h-4.3v-3.7c0-2.1,0.2-3.9,0.4-4c0.2-0.2,2.1-0.4,4.3-0.4h3.9L145.3,218.1L145.3,218.1z" /><path fill="#ffffff" d="M133,171.8c-1,1.5-1,1.7,0.2,2.9c0.9,0.9,1.7,1,7.7,1c7.1,0,8.9-0.5,8.9-2.5c0-2.2-1.2-2.5-8.8-2.5C134.1,170.7,133.7,170.8,133,171.8z" /></g></g></g>
                                                    </svg>
                                                    <h5 className="change-hamburguer-quit ">Formatos</h5>
                                                </li>
                                            </Link>
                                            {/* <li className="hamburguer-centered">
                                <svg className="icon-li-nav-horizontal" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                    <g><g><g><path d="M93.5,10.7c-11.9,2.6-20.9,10.7-24.9,22.4l-1.3,3.8l-0.1,74L67.1,185H38.5H10v4c0,15.2,8.8,27.6,23.1,32.5l3.8,1.3l62,0.1l62,0.1l1.7,2.5c2.7,4,10.4,11.3,14.6,13.7c13.9,8.1,29,8.7,42.8,1.8c5-2.5,7.4-4.1,11.5-8c17.9-17,19.2-43.6,3.1-62.5c-3.1-3.7-8.6-8.1-12.4-10.2l-2.8-1.5v-19.3v-19.2h3.8h3.8v-3.8v-3.8h-19h-19V80.4V48.1h28.6H246l-0.3-5.6c-0.4-9.5-3.3-16.3-9.7-22.6c-3.9-3.9-7.9-6.5-13.3-8.3l-3.8-1.3l-61.3-0.1C108,10.1,95.8,10.2,93.5,10.7z M190.2,20.4c-3.3,3.6-5.8,7.8-7.5,12.7l-1.3,3.8l-0.1,37.9l-0.1,37.9h-3.8h-3.8v3.8v3.8h3.8h3.8v19.3v19.3L179,160c-1.3,0.7-3,1.7-3.8,2.2l-1.6,1v-2.4v-2.4h-45.7H82.3v3.8v3.8H126h43.7l-3.2,3.8c-8.9,10.4-13.1,22.9-11.7,35.1c0.3,2.6,1,6,1.5,7.6l0.9,2.9h-2c-8.5,0-17.3-5.7-21-13.4c-2-4.2-2.6-7.2-2.6-12.8V185h-28.5H74.7v-72.9c0-62.5,0.1-73.3,0.7-75.8c2.1-8.9,8.9-15.8,17.7-17.9c2.2-0.6,11.6-0.7,51.2-0.7l48.5,0L190.2,20.4z M218.8,18.1c9.8,1.9,17.6,10.1,19.2,20.3l0.3,2h-24.8c-28.1,0-25.3,0.5-24.1-4.4c2.3-8.7,8.8-15.4,17.5-17.7C210,17.6,215.3,17.4,218.8,18.1z M211.6,142.1v21.8l3.3,1.3c4,1.6,8.4,4.4,11.6,7.4c2.4,2.2,6.6,7.4,6.6,8.2c0,0.2-14,0.4-32.8,0.4c-18.8,0-32.8-0.2-32.8-0.4c0-0.8,4.1-6,6.6-8.2c3.2-3,7.5-5.8,11.6-7.4l3.3-1.3v-21.8v-21.7h11.4h11.4V142.1L211.6,142.1z M193.5,190.8c3.2,10.7,14.7,18.4,25,16.7c7.1-1.2,13.9-6.2,17.1-12.6c1.6-3.2,1.7-3.2,2-1.9c0.7,2.6,0.4,13.9-0.5,17.3c-3.5,13-13.9,23.4-26.9,26.9c-4.3,1.2-15.6,1.2-20,0c-13-3.5-23.4-13.9-26.9-26.9c-1.1-3.9-1.2-15.2-0.3-18.9l0.7-2.5h14.6h14.6L193.5,190.8z M230.2,189.3c0,1.2-2.2,5.1-3.8,6.7c-3.5,3.5-9.9,5.1-15.1,3.9c-4.7-1.2-9.4-5.6-10.4-9.7l-0.3-1.3h14.8C225,188.8,230.2,189,230.2,189.3z M124.1,192.9c0,1.7,1.9,8.3,3,10.9c1.7,3.6,5.2,8.5,7.5,10.5l1.5,1.2H87.7c-41,0-48.9-0.1-51.4-0.7c-9.7-2.3-16.9-10.1-18.4-20.1l-0.3-2h53.3C100.2,192.6,124.1,192.7,124.1,192.9z" /><path d="M158.8,41.1c-0.9,0.3-2.9,1.7-4.3,3.2c-4.4,4.4-5,9.1-1.6,13.6l1.1,1.5l-3.6,6l-3.6,6l-2.2-0.3c-2.6-0.3-5.2,0.4-7.5,2l-1.5,1.1l-4-2l-4.1-2l0.3-1.8c0.5-3.1-0.7-6-3.6-8.9c-5.1-5.1-10.2-5.1-15.3,0c-3.8,3.8-4.7,7.8-2.7,11.8c0.7,1.4,0.6,1.5-4,8.5c-4.5,6.8-4.8,7.1-5.9,6.7c-3.2-1.2-6.8,0-10.1,3.4c-5.1,5-5.1,10.2,0,15.2c5,5.1,10.2,5.1,15.3,0c3.8-3.8,4.7-7.8,2.7-11.9c-0.7-1.3-0.6-1.5,4-8.5l4.7-7.1l1.5,0.5c1.8,0.6,4.5,0.3,6.8-0.9l1.8-0.8l4.5,2.2c3.9,2,4.5,2.4,4.5,3.5c0,5.4,6.1,11.6,11.4,11.6c2.6,0,5-1.2,7.7-3.8c3.9-3.9,4.7-7.6,2.6-12l-0.8-1.6l3.9-6.5c3.6-6,4-6.5,5.3-6.5c5.6,0,11.7-6,11.7-11.4c0-2.6-1.2-5-3.8-7.6C166.3,40.7,163,39.8,158.8,41.1z M165,49c0.6,0.6,1,1.6,1,2.9c0,1.3-0.3,2.2-1,2.9c-0.6,0.6-1.6,1-2.9,1c-1.3,0-2.2-0.3-2.9-1c-0.6-0.6-1-1.6-1-2.9c0-1.3,0.3-2.2,1-2.9c0.6-0.6,1.6-1,2.9-1C163.5,48.1,164.4,48.4,165,49z M119.4,64.2c0.6,0.6,1,1.6,1,2.9c0,2.5-1.3,3.8-3.8,3.8s-3.8-1.3-3.8-3.8c0-1.3,0.3-2.2,1-2.9c0.6-0.6,1.6-1,2.9-1C117.8,63.3,118.8,63.6,119.4,64.2z M146,79.5c0.6,0.6,1,1.6,1,2.9c0,1.3-0.3,2.2-1,2.9c-0.6,0.6-1.6,1-2.9,1c-1.3,0-2.2-0.3-2.9-1c-0.6-0.6-1-1.6-1-2.9c0-1.3,0.3-2.2,1-2.9c0.6-0.6,1.6-1,2.9-1C144.4,78.5,145.4,78.8,146,79.5z M96.5,94.7c0.6,0.6,1,1.6,1,2.9c0,2.5-1.3,3.8-3.8,3.8c-2.5,0-3.8-1.3-3.8-3.8c0-1.3,0.3-2.2,1-2.9c0.6-0.6,1.6-1,2.9-1C95,93.7,95.9,94.1,96.5,94.7z" /><path d="M82.3,124.2v3.8h45.6h45.6v-3.8v-3.8h-45.6H82.3V124.2z" /><path d="M82.3,143.2v3.8h45.6h45.6v-3.8v-3.8h-45.6H82.3V143.2z" /><path d="M185.7,208.5c-4.5,1.7-8.3,6.6-8.3,10.7c0,5.3,6.1,11.5,11.4,11.5c5.2,0,11.4-6.2,11.4-11.4c0-2.6-1.2-5-3.8-7.6C192.9,208.1,189.4,207.1,185.7,208.5z M191.6,216.4c0.6,0.6,1,1.6,1,2.9c0,2.5-1.3,3.8-3.8,3.8s-3.8-1.3-3.8-3.8s1.3-3.8,3.8-3.8C190.1,215.5,191,215.8,191.6,216.4z" /></g></g></g>
                                </svg>
                                <Link className="link-memu-horizontal change-hamburguer-quit">  Resultados análisis </Link>
                            </li> */}
                                        </ul>
                                    </li>
                                </ul>
                                <div id="footerNav" className="footer-nav">
                                    <ul>

                                        <li onClick={darkMode} className=" hamburguer-centered">
                                            <div className="content-1-footer-nav-horizontal">
                                                <svg className="icon-li-dark-mode-nav-horizontal icon-moon-li-dark-mode-nav-horizontal" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 256 256"  >
                                                    {data.valueDarkMode ? (<g><g><g><path d="M149.1,10.2c-8.3,0.8-20,3.3-27.8,5.8c-40,13-69.8,46.5-79.1,88.8c-2.1,9.8-2.1,36,0,46c8,37.7,31,67.3,65.7,84.2c15.3,7.4,31.9,11,50.8,11c18.5-0.1,33.6-3.4,50-11.1l6.6-3.1l-5.8-1.9c-8.1-2.7-22.3-10.2-29.4-15.4c-40.7-30.2-54.7-85.2-33.5-131.6c6.9-15.1,21.3-32.5,34.8-42c7.5-5.3,20-11.7,28.1-14.4l5.8-1.9l-6.6-3.2c-8.1-3.9-20.2-7.7-29.6-9.4C172,10.5,155,9.6,149.1,10.2z" /></g></g></g>
                                                    ) : (<g><g><g><path d="M117.4,29.7v19.7H128h10.6V29.7V10H128h-10.6V29.7z" /><path d="M68.8,25.6c-4.9,2.8-8.8,5.3-8.8,5.7c0,0.3,4.4,8.2,9.7,17.3c9.1,15.6,9.8,16.5,11.9,15.4c1.3-0.7,5.5-3.2,9.5-5.4l7.1-4.3L94.9,49c-1.7-3.1-6.1-10.6-9.7-17c-3.6-6.3-6.9-11.4-7.2-11.4C77.7,20.6,73.6,22.9,68.8,25.6z" /><path d="M170.7,32c-3.6,6.4-8,13.9-9.8,17l-3.2,5.5l9.3,5.3c5.1,3,9.6,5,10,4.6c1.1-1.2,19-32.5,19-33.2c0-0.6-17.2-10.6-18.2-10.6C177.5,20.6,174.3,25.7,170.7,32z" /><path d="M25.5,69c-2.9,5-5,9.3-4.8,9.5c0.8,0.7,32.2,18.8,33.1,19c1.3,0.3,11.5-17.8,10.6-18.6C63.4,77.8,32.1,60,31.4,60C31,60,28.4,64,25.5,69z" /><path d="M207.2,69.6c-9.3,5.4-15.8,10-15.6,10.7c0.2,0.7,2.6,5.1,5.2,9.7l4.8,8.2l3.4-2c1.8-1.2,9.2-5.5,16.6-9.7s13.5-7.8,13.7-8.1c0.7-0.6-10-18.5-11.1-18.4C223.7,60.1,216,64.4,207.2,69.6z" /><path d="M112.2,67.9C91,73.9,73.5,91.6,68,112.7c-1,3.6-1.7,10.6-1.7,15.5c0,26.1,15.8,48.7,40.9,58.3c7.9,3,24.7,4,33.8,2.1c17.1-3.5,33.9-16.7,42-32.7c5.5-11.2,7-18.2,6.4-31.6c-0.6-11.9-3-19.6-9.1-29.2c-7.1-11.5-18.3-20.4-31.6-25.5C140.4,66.3,120.9,65.5,112.2,67.9z" /><path d="M10,128v10.6h19.7h19.7V128v-10.6H29.7H10V128z" /><path d="M206.7,128v10.6h19.7H246V128v-10.6h-19.7h-19.7L206.7,128L206.7,128z" /><path d="M38.7,166.9c-8.5,5-16.1,9.5-16.9,10c-1.3,0.6-0.6,2.6,3.5,9.7c2.9,4.9,5.3,9.1,5.5,9.4c0.4,0.4,32-17.3,33.6-18.9c0.7-0.6-7.4-16.1-9.7-18.4C54.4,158.3,47.2,162,38.7,166.9z" /><path d="M196.1,167c-3,5.1-5,9.6-4.6,10c1.6,1.6,33.2,19.3,33.6,18.9c1.3-1.5,10.4-18.2,10.1-18.5c-0.2-0.2-6.4-3.8-13.7-8s-14.8-8.5-16.7-9.7l-3.3-2L196.1,167z" /><path d="M74.7,198.4c-2.4,4.3-6.8,11.8-9.6,16.6c-2.9,4.9-5.2,9.3-5.2,9.6c0,0.9,18.1,11.3,18.5,10.7c0.2-0.2,3.8-6.4,8.1-13.7c4.1-7.3,8.6-14.8,9.7-16.6l2-3.4l-7.1-4.1C78.1,189.8,79.8,189.7,74.7,198.4z" /><path d="M167.3,195.9c-5,2.9-8.9,5.6-8.8,6.2c0.2,0.8,18.2,32.3,19,33.2c0.2,0.3,16.9-8.8,18.4-10.1c0.4-0.4-17.3-32-18.9-33.6C176.7,191.1,172.2,193.2,167.3,195.9z" /><path d="M117.4,226.3V246H128h10.6v-19.7v-19.7H128h-10.6V226.3z" /></g></g></g>)}

                                                </svg>

                                            </div>
                                            <h4 className="change-hamburguer-quit">{data.valueDarkMode ? "Dark Mode" : "Light Mode"}</h4>
                                            <div className="change-hamburguer-quit toogle-footer-nav-horizontal">
                                                <div style={{ marginLeft: !data.valueDarkMode ? "0%" : "calc(100% - 20px)" }} className="circle-footer-nav-horizontal"></div>
                                            </div>
                                        </li>

                                    </ul>
                                </div>
                            </nav >
                            <nav id="navVertical" className="nav-main nav-vertical" >
                                {queryMenu ?
                                    <div className="divHeaderNav">
                                        <div id="headerNav" className="header-nav hamburguer-centered">

                                            <svg ref={refIconHamburguer} id="iconHamburguer" className="icon-hamburguer-li-nav-horizontal icon-li-nav-horizontal" version="1.0" viewBox="0 0 1024.000000 1024.000000" preserveAspectRatio="xMidYMid meet">

                                                <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" stroke="none">
                                                    <path d="M1105 8301 c-222 -64 -392 -238 -449 -458 -21 -80 -21 -246 0 -327 43 -167 168 -325 320 -404 153 -79 -244 -72 4144 -72 4388 0 3991 -7 4144 72 109 57 207 155 263 263 55 107 73 181 73 305 0 124 -18 198 -73 305 -56 108 -154 206 -262 262 -156 80 262 73 -4151 72 -3726 0 -3952 -1 -4009 -18z" />
                                                    <path d="M1105 5741 c-222 -64 -392 -238 -449 -458 -21 -80 -21 -246 0 -327 43 -167 168 -325 320 -404 153 -79 -244 -72 4144 -72 4388 0 3991 -7 4144 72 109 57 207 155 263 263 55 107 73 181 73 305 0 124 -18 198 -73 305 -56 108 -154 206 -262 262 -156 80 262 73 -4151 72 -3726 0 -3952 -1 -4009 -18z" />
                                                    <path d="M1105 3181 c-222 -64 -392 -238 -449 -458 -21 -80 -21 -246 0 -327 43 -167 168 -325 320 -404 153 -79 -244 -72 4144 -72 4388 0 3991 -7 4144 72 109 57 207 155 263 263 55 107 73 181 73 305 0 124 -18 198 -73 305 -56 108 -154 206 -262 262 -156 80 262 73 -4151 72 -3726 0 -3952 -1 -4009 -18z" />
                                                </g>
                                            </svg>
                                        </div>
                                    </div> : ""}
                                <div className="seccion-usuario-notificaciones">

                                    {Object.keys(user).length > 0 ? (
                                        <div className="div-info-usuario">
                                            <div id="divImgPerfilNav" className="div-img-perfil-nav" onClick={(e) => {
                                                const parent = document.getElementById("divImgPerfilFocus")
                                                const divImgPerfilNav = document.getElementById("divImgPerfilNav")
                                                let widthParent = 0;
                                                if (parent && divImgPerfilNav) {
                                                    const img = divImgPerfilNav.querySelectorAll(".img-icono")
                                                    if (img[0]) {
                                                        if (e.target == img[0]) {
                                                            const contentImgFocus = document.getElementById("contentImgFocus")

                                                            if (movementImgPerfil == false) {
                                                                setmMovementImgPerfil(null)
                                                                const bbox = divImgPerfilNav.getBoundingClientRect()
                                                                parent.style.top = (bbox.top + (divImgPerfilNav.scrollHeight / 2) - (parent.scrollHeight / 2)) + "px"
                                                                parent.style.left = (bbox.left + (divImgPerfilNav.scrollWidth / 2) - (parent.scrollWidth / 2)) + "px"
                                                                widthParent = parent.scrollHeight
                                                                const img = divImgPerfilNav.querySelectorAll(".img-icono")

                                                                img[0].style.zIndex = "9999"
                                                                /*  const cloneImg = img[0].cloneNode(true)
                                                                 const div = document.createElement("div")
                                                                 div.setAttribute("id", "contentImgFocus")
                                                                 div.appendChild(cloneImg)
                                                                 parent.appendChild(div) */
                                                                parent.style.zIndex = "99"
                                                                parent.style.padding = "30px"
                                                                parent.style.opacity = "1"
                                                                setTimeout(() => {
                                                                    parent.style.top = "100%"
                                                                    parent.style.left = "0%"
                                                                    setTimeout(() => {
                                                                        parent.style.top = "0%"
                                                                        parent.style.left = "0%"
                                                                        parent.style.width = "calc(100% - 60px)"
                                                                        parent.style.height = "calc(100% - 60px)"
                                                                        setTimeout(() => {
                                                                            parent.style.top = "0%"
                                                                            parent.style.left = "0%"
                                                                            setmMovementImgPerfil(true)
                                                                        }, 800);
                                                                    }, 100);
                                                                }, 50);
                                                            } else if (movementImgPerfil == true) {
                                                                setmMovementImgPerfil(null)
                                                                const parent = document.getElementById("divImgPerfilFocus")
                                                                parent.style.width = "10px"
                                                                parent.style.height = "10px"
                                                                const divImgPerfilNav = document.getElementById("divImgPerfilNav")
                                                                const bbox = divImgPerfilNav.getBoundingClientRect()
                                                                parent.style.top = (bbox.top + (divImgPerfilNav.scrollHeight / 2) - (20 / 2)) + "px"
                                                                parent.style.left = (bbox.left) + "px"
                                                                parent.style.opacity = "0"
                                                                setTimeout(() => {
                                                                    parent.style.zIndex = "2"
                                                                    /* parent.style.top = ""
                                                                    parent.style.left = "" */
                                                                    parent.style.padding = "5px"
                                                                    setmMovementImgPerfil(false)
                                                                }, 900);
                                                            }

                                                        }
                                                    }
                                                }
                                            }
                                            }>
                                                {Object.keys(user).length > 0 ? user.img ? <img className='img-icono' src={"http://" + host + ":3000/img/usuarios/" + (user.id ? user.id : "") + "/iconos/" + (user.img ? user.img : "")} /> : user.cargo == "administrador" ? <img className='img-perfil-usuario' src="/img/analisisPrueba.jpg" alt="" /> : user.cargo == "instructor" ? <img className='img-perfil-usuario' src="/img/img_instructor.jpg" alt="" /> : user.cargo == "aprendiz" ? <img className='img-perfil-usuario' src="/img/img_aprendiz.jpg" alt="" /> : user.cargo == "cliente" ? <img className='img-perfil-usuario' src="/img/img_client.jpg" alt="" /> : <img className='img-perfil-usuario' src="/img/analisisPrueba.jpg" alt="" />

                                                    :
                                                    <img className='img-perfil-usuario' src="/img/analisisPrueba.jpg" alt="" />}
                                                <div className="div-img-perfil-focus" id="divImgPerfilFocus">
                                                    <div id="contentImgFocus">
                                                        {Object.keys(user).length > 0 ? user.img ? <img className='img-icono' src={"http://" + host + ":3000/img/usuarios/" + (user.id ? user.id : "") + "/iconos/" + (user.img ? user.img : "")} /> : user.cargo == "administrador" ? <img className='img-perfil-usuario' src="/img/analisisPrueba.jpg" alt="" /> : user.cargo == "instructor" ? <img className='img-perfil-usuario' src="/img/img_instructor.jpg" alt="" /> : user.cargo == "aprendiz" ? <img className='img-perfil-usuario' src="/img/img_aprendiz.jpg" alt="" /> : user.cargo == "cliente" ? <img className='img-perfil-usuario' src="/img/img_client.jpg" alt="" /> : <img className='img-perfil-usuario' src="/img/analisisPrueba.jpg" alt="" />
                                                            :
                                                            <img className='img-perfil-usuario' src="/img/analisisPrueba.jpg" alt="" />}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="info-usuario">
                                                <h4 className="nombre-usuario">{Object.keys(user).length > 0 ? (user.nombre.replace(/(?:^|\s)\S/g, match => match.toUpperCase())) : ""}</h4>
                                                {Object.keys(user).length > 0 ?
                                                    <div>
                                                        <h4 className="rol-usuario"> {(user.rol.replace(/(?:^|\s)\S/g, match => match.toUpperCase()))},
                                                            {user.rol == "catador" ?
                                                                (" " + user.cargo.replace(/(?:^|\s)\S/g, match => match.toUpperCase())) : " "
                                                            }
                                                        </h4>

                                                    </div>

                                                    : ""}

                                            </div>
                                            <div className="div-opciones-usuario">
                                                <div className="section-opciones-usuario">
                                                    <svg onClick={(e) => {
                                                        closeModalAvanzado(e)
                                                    }} className="father-div-modal icon-opciones-usuario" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 256 256"  >
                                                        <g><g><path d="M240.2,64.9c-7.8-7.8-20.3-7.8-28.1,0L128,149.1L43.9,64.9c-7.8-7.8-20.3-7.8-28.1,0c-7.7,7.8-7.7,20.3,0,28.1l98.2,98.2c3.9,3.9,9,5.8,14,5.8c5.1,0,10.2-1.9,14-5.8L240.2,93C247.9,85.2,247.9,72.7,240.2,64.9z" /></g></g>
                                                    </svg>
                                                    <div style={{ display: "none" }} className="child-div-modal">
                                                        <GlobalModal execute={"normal"} statusModal={closeModalAvanzado} active={{ "width": 300 }}
                                                            content={
                                                                <div>
                                                                    {/* <div className="esquina-opciones-usuario"></div> */}
                                                                    <div className="contenido-opciones-usuario">

                                                                        <div className="opciones-usuario">
                                                                            <Link to={"/dashboard/profile"} onClick={() => { selectedLi("/dashboard/profile") }} className={`link-memu-horizontal li-opciones-usuario  ${liSelected == "/dashboard/profile" ? "selected-li-perfil" : ""}`}>
                                                                                <li className="li-content-usuarios">
                                                                                    <svg className="icon-li-opciones-usuario" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                                                                        <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                                                                        <g><g><g><path d="M39.6,10.3c-4.7,1.2-9.1,4.7-11.3,9.3l-1.3,2.6v105.8v105.8l1.3,2.6c1.6,3.4,4.8,6.5,8.2,8.2l2.6,1.3H128h88.9l2.6-1.3c3.4-1.6,6.5-4.8,8.2-8.2l1.3-2.6V128.1V22.2l-1.3-2.6c-1.6-3.4-4.8-6.5-8.2-8.2l-2.6-1.3L129.1,10C80.7,10,40.5,10.1,39.6,10.3z M212.4,128.1v101.3H128H43.6V128.1V26.7H128h84.4V128.1z" /><path d="M88.1,44.4c-5.5,1.5-10.5,5.1-13.9,10c-3.7,5.5-5,13.8-3,20.4c2.1,7,8.6,13.6,15.5,15.7c14.5,4.4,28.9-4.4,31.4-19.3c1.5-9.3-3.8-20.1-12.1-24.6C100.7,43.7,93.7,42.9,88.1,44.4z" /><path d="M149.9,61.2c-3.5,1.5-5.5,5.6-4.8,9.6c0.5,2.5,3.1,5.4,5.5,6.1c1.3,0.4,8.4,0.5,20.8,0.4c18-0.2,18.9-0.2,20.3-1.3c2.8-2.1,3.6-3.7,3.6-7.1c0-3.3-0.8-5-3.6-7.1c-1.4-1.1-2.2-1.1-20.8-1.2C155.5,60.6,151.2,60.7,149.9,61.2z" /><path d="M74.2,93.2c-7.1,5.7-12,13.1-15,22.7c-1.5,4.6-1.5,6.2,0,9.1c1.6,3.1,0.9,3.1,35,3.1c34.1,0,33.5,0.1,35-3.1c1.5-2.9,1.5-4.5,0-9.1c-2.7-8.5-6.4-14.6-12.5-20.4c-5.9-5.5-5.6-5.5-8.4-1.6C99,107,89.5,107,80.1,93.9c-1.3-1.8-2.4-3.3-2.5-3.3C77.5,90.6,76,91.7,74.2,93.2z" /><path d="M149.9,95c-3.5,1.5-5.5,5.6-4.8,9.6c0.5,2.5,3.1,5.4,5.5,6.1c1.3,0.4,8.4,0.5,20.8,0.4c18-0.2,18.9-0.2,20.3-1.3c2.8-2.1,3.6-3.7,3.6-7.1c0-3.3-0.8-5-3.6-7.1c-1.4-1.1-2.2-1.1-20.8-1.2C155.5,94.3,151.2,94.4,149.9,95z" /><path d="M65.5,145.7c-3.5,1.5-5.5,5.6-4.8,9.6c0.5,2.5,3.1,5.4,5.5,6.1c1.3,0.4,21.2,0.5,63,0.4c60.7-0.2,61.1-0.2,62.5-1.3c2.8-2.1,3.6-3.7,3.6-7.1c0-3.3-0.8-5-3.6-7.1c-1.4-1.1-1.7-1.1-63-1.2C78.2,145,66.7,145.1,65.5,145.7z" /><path d="M65.5,179.5c-3.5,1.5-5.5,5.6-4.8,9.6c0.5,2.5,3.1,5.4,5.5,6.1c1.3,0.4,21.2,0.5,63,0.4c60.7-0.2,61.1-0.2,62.5-1.3c2.8-2.1,3.6-3.7,3.6-7.1s-0.8-5-3.6-7.1c-1.4-1.1-1.7-1.1-63-1.2C78.2,178.8,66.7,178.9,65.5,179.5z" /></g></g></g>
                                                                                    </svg>
                                                                                    <h5 className="link-opciones-usuarios">Perfil</h5>
                                                                                </li>
                                                                            </Link>

                                                                            {Object.keys(user).length > 0 ?
                                                                                user.rol == "administrador" && user.cargo == "administrador" ?

                                                                                    <li onClick={() => { setModalConfiguracion(true) }} className="li-opciones-usuario">
                                                                                        <svg className="icon-li-opciones-usuario" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                                                                            <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                                                                            <g><g><path d="M207.1,163.3c5.9-12.6,23.5-6.9,34.7-16.5c5.8-4.9,5.5-25.1,0-30.3c-10.6-10-28.1-6.5-32.8-19.5c-4.7-13.1,11.7-21.5,12.8-36.2c0.6-7.5-13.8-21.7-21.4-21.4c-14.6,0.5-24.5,15.3-37,9.4c-12.6-5.9-7-23.5-16.5-34.6c-4.9-5.8-25.1-5.5-30.2,0c-10,10.6-6.5,28.1-19.5,32.8C84,51.8,75.3,37,60.9,34.3c-7.4-1.4-21.7,13.8-21.4,21.4c0.5,14.6,15.3,24.5,9.4,37c-5.9,12.6-23.5,6.9-34.7,16.5c-5.8,4.9-5.6,25.1,0,30.3c10.6,10,28.1,6.5,32.9,19.5c4.7,13.1-11.7,21.5-12.9,36.1c-0.6,7.6,13.8,21.7,21.4,21.4c14.6-0.5,24.5-15.3,37-9.4c12.6,5.9,6.9,23.5,16.5,34.7c4.9,5.8,25.1,5.5,30.3,0c10-10.7,6.5-28.2,19.5-32.9c13.1-4.7,21.5,11.7,36.1,12.9c7.6,0.6,21.7-13.8,21.4-21.4C216.1,185.7,201.3,175.9,207.1,163.3L207.1,163.3z M128,181.5c-29.6,0-53.5-24-53.5-53.5c0-29.6,24-53.6,53.5-53.6s53.5,24,53.5,53.5C181.5,157.6,157.6,181.5,128,181.5z" /></g></g>
                                                                                        </svg>
                                                                                        <Link className="link-opciones-usuarios ">Configuracion</Link>
                                                                                    </li>
                                                                                    : ""
                                                                                : ""}
                                                                            <li onClick={() => LogoutSesion()} className="li-opciones-usuario btn-cerrar-sesion">
                                                                                <svg className="icon-li-opciones-usuario" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 256 256">
                                                                                    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                                                                    <g><g><path d="M175.3,64V24.2c0-6.4-5.2-11.5-11.5-11.5H21.5c-6.3,0-11.5,5.2-11.5,11.5v163c0,4.2,2.5,8.3,6.1,10.2l87.7,45.4c3.9,1.9,8.5-0.8,8.5-5.2v-44.2h51.5c6.4,0,11.5-5.2,11.5-11.5v-63h-23.1v45.8c0,3.3-2.5,5.8-5.8,5.8h-34V72.4c0-4.2-2.5-8.3-6.2-10.2L54.6,35.7h91.9c3.3,0,5.8,2.5,5.8,5.8v22.7h23.1V64L175.3,64z" /><path d="M204.9,45.1l37.5,37.5c4.8,4.8,4.8,11.9,0,16.7l-37.5,37.5c-4.8,4.8-12.1,5-16.9,0.2c-4.6-4.6-4-12.3,0.4-16.9l16.9-16.7h-65.5c-3.3,0-6.5-1.3-8.6-3.9c-5.4-5.8-4-16,2.9-19.8c1.7-1,3.9-1.5,5.8-1.5h65.5c0,0-16.7-16.7-16.9-16.7c-4.4-4.4-5-12.3-0.4-16.7C192.6,40.1,200.1,40.3,204.9,45.1" /></g></g>
                                                                                </svg>
                                                                                <div className="link-opciones-usuarios">  Cerrar sesión</div>
                                                                            </li>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    )
                                        : ""}
                                    {Object.keys(user).length > 0 ? user.rol == "catador" && (user.cargo == "instructor" || user.cargo == "aprendiz") ?
                                        <div className="notificaciones">
                                            {asignaciones.length > 0 && asignaciones ? <div className="cantidad-notificaciones"> {cantidadNotificaciones > 9 ? "9+" : cantidadNotificaciones} </div> : ""
                                            }
                                            <div className="secccion-notificaciones">
                                                <svg onClick={(e) => {
                                                    closeModalAvanzado(e)
                                                }} className="father-div-modal h-6 w-6 icono-notificaciones" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"></path>
                                                </svg>

                                                <div style={{ display: "none" }}/* style={{ display: !modalNotificaciones ? "none" : "" }} */ className="child-div-modal">
                                                    {/* <div className="esquina-notificaciones"></div> */}
                                                    <GlobalModal execute={"normal"} statusModal={closeModalAvanzado} active={{ "width": 500 }} content={
                                                        <div className="contenido-notificaciones">
                                                            <div className="header-notificaciones">
                                                                <h4 className="titulo-notififcaciones">Lista de análisis por registrar</h4>
                                                                <div onClick={verNotificaciones} className="quit-notificaciones">
                                                                    X
                                                                </div>
                                                            </div>
                                                            <div className="contenido-analisis">
                                                                <div ref={divNotificaciones} className="asignaciones-notificaciones">

                                                                    {asignaciones.length > 0 ? (

                                                                        asignaciones.map((asignacion, value) => {
                                                                            let procedureNormal = true
                                                                            if (asignacion.proceso && asignacion.estado) {
                                                                                if (asignacion.proceso == "practica" && asignacion.estado == 5) {
                                                                                    procedureNormal = false
                                                                                }
                                                                            }
                                                                            if (procedureNormal == true) {
                                                                                return <div key={asignacion.id} className="notificacion-analisis">
                                                                                    <div className="informacion-analisis">
                                                                                        <div>
                                                                                            <div className="container-data">
                                                                                                <div className="div-info-notificaciones-text">
                                                                                                    <h4 className="title-info-notificaciones-text">Formato:</h4>
                                                                                                    <h4 className="value-info-notificaciones-text">{asignacion.id ? asignacion.id : ""}</h4>
                                                                                                </div>
                                                                                                <div className="div-info-notificaciones-text">
                                                                                                    <h4 className="title-info-notificaciones-text">Análisis:</h4>
                                                                                                    <h4 className="value-info-notificaciones-text"> {asignacion.tipos_analisis_id == 1 ? 'Fisico' : 'Sensorial'}</h4>
                                                                                                </div>
                                                                                                <div className="div-info-notificaciones-text">
                                                                                                    <h4 className="title-info-notificaciones-text">Asignado:</h4>
                                                                                                    <h4 className="value-info-notificaciones-text">{formatDate(asignacion.fecha_creacion)}</h4>
                                                                                                </div>
                                                                                                <div className="div-info-notificaciones-text">
                                                                                                    <h4 className="h4-informacion-notificacion-analisis title-info-notificaciones-text">
                                                                                                        Estado: </h4>
                                                                                                    <h4><span className={`${asignacion.estado == 2 ? "pendiente" : asignacion.estado == 3 ? "asignado" : asignacion.estado == 5 ? "registrado" : asignacion.estado == 6 ? "rechazado" : ""}`}>{asignacion.estado == 2 ? "Pendiente" : asignacion.estado == 3 ? "Asignado" : asignacion.estado == 5 ? "Registrado" : asignacion.estado == 6 ? "Rechazado" : ""}</span></h4>
                                                                                                </div>
                                                                                                <div className="div-info-notificaciones-text">
                                                                                                    <h4 className="title-info-notificaciones-text">Cd. Muestra:</h4>
                                                                                                    <h4 className="value-info-notificaciones-text">{asignacion.codigo_externo}</h4>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="div-img-analisis">
                                                                                                {asignacion.tipos_analisis_id == 2 ?
                                                                                                    <img className="img-analisis" src="../../public/img/iconoAnalisisSeonsorial.png" alt="" />
                                                                                                    :
                                                                                                    <img className="img-analisis" src="../../public/img/iconoAnalisisFisico.png" alt="" />
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                        <button onClick={() => { localStorage.setItem("formatos_id", asignacion.id); localStorage.setItem("tipos_analisis_id", asignacion.tipos_analisis_id), location.href = "/dashboard/formatos/registros" }} className="input-proceder-analisis">Proceder</button>
                                                                                    </div>
                                                                                </div>
                                                                            }
                                                                        })

                                                                    ) : <h4 className="h4-notificaciones-vacias">No hay análisis pendientes por realizar</h4>}
                                                                    {statusLoader ? statusLoader["div_notificaciones"] ?
                                                                        <div className="notificaicones div-loader-notificaciones">
                                                                            <div className="loader-div">
                                                                            </div>
                                                                        </div>
                                                                        : "" : ""
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                    />
                                                </div>
                                            </div>

                                        </div> : "" : ""}
                                </div>
                            </nav >
                            <div id="contenidoComponent" className="contenido">
                                <div className="component">
                                    <Outlet></Outlet>

                                </div>

                            </div>

                        </div >
                    </div >
                    {
                        modalConfiguracion ?
                            <GlobalModal class={"div-modal-configuraciones" + (!data.valueDarkMode ? " lightMode" : " darkMode")} statusModal={setModalConfiguracion} content={
                                < div id="mainModalConfifuraciones" >
                                    <div className="div-content-configuraciones">
                                        <div className="div-title-configuraciones">
                                            <div>
                                                <h3 className="title-configuraciones">Configuraciones</h3>
                                                <div className="div-title-color">
                                                    <div className="div-color-configuraciones-title color-cofiguraciones-1"></div>
                                                    <div className="div-color-configuraciones-title color-cofiguraciones-2"></div>
                                                    <div className="div-color-configuraciones-title color-cofiguraciones-3"></div>
                                                    <div className="div-color-configuraciones-title color-cofiguraciones-4"></div>
                                                    <div className="div-color-configuraciones-title color-cofiguraciones-5"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="div-items-configuraciones">
                                            <div>
                                                <div onClick={() => { getVariablesFormatoFisico() }} className="item-configuracion-activa div-item-cofiguracion">
                                                    <img src="../../public/img/iconosConfiguraciones/iconConfiguracion (2).png" alt="" />
                                                    <h4 className="h4-title-configuracion">Formato Físico</h4></div>

                                                <div onClick={() => { configCodigosMuestra() }} className="item-configuracion-activa div-item-cofiguracion"><img src="../../public/img/iconosConfiguraciones/iconConfiguracion (1).png" alt="" />
                                                    <h4 className="h4-title-configuracion">Codigos</h4></div>
                                                {/* <div className="div-item-cofiguracion"><img src="../../public/img/iconosConfiguraciones/iconConfiguracion (1).png" alt="" /></div> */}
                                                <div className="div-item-cofiguracion"><img src="../../public/img/iconosConfiguraciones/iconConfiguracion (15).png" alt="" /></div>
                                                <div className="div-item-cofiguracion"><img src="../../public/img/iconosConfiguraciones/iconConfiguracion (3).png" alt="" /></div>
                                                <div className="div-item-cofiguracion"><img src="../../public/img/iconosConfiguraciones/iconConfiguracion (4).png" alt="" /></div>
                                                <div className="div-item-cofiguracion"><img src="../../public/img/iconosConfiguraciones/iconConfiguracion (5).png" alt="" /></div>
                                                <div className="div-item-cofiguracion"><img src="../../public/img/iconosConfiguraciones/iconConfiguracion (6).png" alt="" /></div>
                                                <div className="div-item-cofiguracion"><img src="../../public/img/iconosConfiguraciones/iconConfiguracion (7).png" alt="" /></div>
                                                <div className="div-item-cofiguracion"><img src="../../public/img/iconosConfiguraciones/iconConfiguracion (8).png" alt="" /></div>
                                                <div className="div-item-cofiguracion"><img src="../../public/img/iconosConfiguraciones/iconConfiguracion (9).png" alt="" /></div>
                                                <div className="div-item-cofiguracion"><img src="../../public/img/iconosConfiguraciones/iconConfiguracion (10).png" alt="" /></div>
                                                <div className="div-item-cofiguracion"><img src="../../public/img/iconosConfiguraciones/iconConfiguracion (11).png" alt="" /></div>
                                                <div className="div-item-cofiguracion"><img src="../../public/img/iconosConfiguraciones/iconConfiguracion (12).png" alt="" /></div>
                                                <div className="div-item-cofiguracion"><img src="../../public/img/iconosConfiguraciones/iconConfiguracion (13).png" alt="" /></div>
                                                <div className="div-item-cofiguracion"><img src="../../public/img/iconosConfiguraciones/iconConfiguracion (14).png" alt="" /></div>

                                                <div className="div-item-cofiguracion"><img src="../../public/img/iconosConfiguraciones/iconConfiguracion (16).png" alt="" /></div>
                                                <div className="div-item-cofiguracion"><img src="../../public/img/iconosConfiguraciones/iconConfiguracion (17).png" alt="" /></div>
                                                <div className="div-item-cofiguracion"><img src="../../public/img/iconosConfiguraciones/iconConfiguracion (18).png" alt="" /></div>
                                                <div className="div-item-cofiguracion"><img src="../../public/img/iconosConfiguraciones/iconConfiguracion (19).png" alt="" /></div>
                                                <div className="div-item-cofiguracion"><img src="../../public/img/iconosConfiguraciones/iconConfiguracion (20).png" alt="" /></div>
                                                <div className="div-item-cofiguracion"><img src="../../public/img/iconosConfiguraciones/iconConfiguracion (21).png" alt="" /></div>
                                                <div className="div-item-cofiguracion"><img src="../../public/img/iconosConfiguraciones/iconConfiguracion (22).png" alt="" /></div>
                                                <div className="div-item-cofiguracion"><img src="../../public/img/iconosConfiguraciones/iconConfiguracion (23).png" alt="" /></div>
                                                <div className="div-item-cofiguracion"><img src="../../public/img/iconosConfiguraciones/iconConfiguracion (24).png" alt="" /></div>
                                                <div className="div-item-cofiguracion"><img src="../../public/img/iconosConfiguraciones/iconConfiguracion (25).png" alt="" /></div>
                                                <div className="div-color-configuraciones color-cofiguraciones-1"></div>
                                                <div className="div-color-configuraciones color-cofiguraciones-2"></div>
                                                <div className="div-color-configuraciones color-cofiguraciones-3"></div>
                                                <div className="div-color-configuraciones color-cofiguraciones-4"></div>
                                                <div className="div-color-configuraciones color-cofiguraciones-5"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            } /> : ""}

                    {
                        modalConfiguracionFormatoFisico ?
                            <GlobalModal class={"div-modal-configuracion-variables-fisicas" + (!data.valueDarkMode ? " lightMode" : " darkMode")} statusModal={setModalConfiguracionFormatoFisico} content={
                                <div ref={refModalConfiguracionFormatoFisico} id="modalConfiguracionVariablesFisico">
                                    <h2>Crear Fórmula</h2>
                                    <div className="div-crear-formula-main">

                                        <div>
                                            <GlobalInputs

                                                input={setGlobalInputsValue}
                                                value={globalInputsValue}
                                                class={"input-global"}
                                                /*  errors={errorsAsignar}
                                                 elementEdit={infoAnalisisUpdateAsignar.length > 0 ? infoAnalisisUpdateAsignar[0].mu_id : ""} */
                                                data={{
                                                    variable_focus: {
                                                        function: {
                                                            "value": getInfoVariable,
                                                            "execute": {
                                                                "type": "own",
                                                                "value": "all"
                                                            }
                                                        },
                                                        index: true,
                                                        type: "select",
                                                        referencia: "Elegir Campo",
                                                        values: ["visual_name"],
                                                        opciones: variablesFormatoFisico,
                                                        upper_case: true,
                                                        key: "id",
                                                    },
                                                }} />
                                        </div>


                                        {globalInputsValue ? globalInputsValue["variable_focus"] ?

                                            <div key={keyTipoValor} className={"div-main-content-formula" + (globalInputsValue["tipo_valor"] ? globalInputsValue["tipo_valor"] != "calculado" ? " div-main-coontent-formula-normal" : "" : "")}>
                                                <div >
                                                    <GlobalInputs
                                                        input={setGlobalInputsValue}
                                                        value={globalInputsValue}
                                                        class={"input-global"}
                                                        errors={errorsInputGlobal}
                                                        elementEdit={variableFocus ? variableFocus["tipo_valor"] ? variableFocus["tipo_valor"] : "" : ""}
                                                        data={{
                                                            tipo_valor: {
                                                                /* function: {
                                                                    "value": setTipoValor,
                                                                    "execute": {
                                                                        "type": "own",
                                                                        "value": "all"
                                                                    }
                                                                }, */
                                                                index: true,
                                                                type: "select",
                                                                referencia: "Tipo de valor",
                                                                values: ["nombre"],
                                                                opciones: [
                                                                    { "nombre": "Normal", "id": "normal" },
                                                                    { "nombre": "Calculado", "id": "calculado" }
                                                                ],
                                                                upper_case: true,
                                                                key: "id",
                                                            },
                                                        }} />
                                                </div>
                                                <div >
                                                    {globalInputsValue["tipo_valor"] ? globalInputsValue["tipo_valor"] === "calculado" ?
                                                        <div>
                                                            <div>
                                                                <h3>Elegir operador</h3>
                                                                <div className="div-operadores-opciones-variables-fisico">
                                                                    <div>
                                                                        <div className="item-operador-formula">

                                                                        </div>
                                                                        <svg data-signo="/" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enableBackground="new 0 0 256 256" >
                                                                            <g><g><g><path d="M178.5,17.2L51.6,222.8c-4.4,7.2-2.2,16.5,5,21c2.5,1.5,5.3,2.3,8,2.3c5.1,0,10.1-2.6,13-7.2L204.4,33.2c4.4-7.2,2.2-16.5-5-21C192.3,7.9,182.9,10.1,178.5,17.2z" /></g></g></g>
                                                                        </svg>
                                                                    </div>
                                                                    {/* <div>
                                <div className="item-operador-formula">

                                </div>
                                <svg data-signo="=" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enableBackground="new 0 0 256 256" >
                                    <g><g><g><path d="M31.9,55.9c-10.3,2.3-18.3,10.2-21,20.9c-1.6,6.3-0.9,12.8,2.2,19c2.2,4.5,7.8,10.2,12.1,12.3c6.8,3.4-1.8,3.1,103.3,3.1h94.3l3.7-1.2c14.1-4.8,22.3-19.4,18.7-33.2c-2.4-9.5-9-16.8-18-20.1l-3.5-1.2l-94.5-0.1C51.8,55.3,34.1,55.4,31.9,55.9z" /><path d="M34.4,145.1c-6.5,0.8-12.3,3.9-17.1,9.1C3.8,169,9.9,192.5,29,199.5l3.3,1.2H128h95.7l3.3-1.2c9.2-3.4,15.7-10.7,18.2-20.2c3.6-13.8-4.7-28.4-18.7-33.2l-3.7-1.2l-92.7,0C79.1,144.8,36.1,144.9,34.4,145.1z" /></g></g></g>
                                </svg>
                            </div> */}
                                                                    <div>
                                                                        <div className="item-operador-formula">

                                                                        </div>
                                                                        <svg data-signo="%" version="1.0" xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 600.000000 615.000000"
                                                                            preserveAspectRatio="xMidYMid meet">

                                                                            <g transform="translate(0.000000,615.000000) scale(0.100000,-0.100000)"
                                                                                stroke="none">
                                                                                <path d="M1621 5685 c-333 -75 -604 -303 -732 -616 -58 -142 -73 -226 -73
-409 1 -138 4 -179 23 -250 126 -480 508 -790 971 -790 124 0 203 13 322 54
144 49 244 113 368 236 185 183 279 379 311 648 23 194 -12 386 -106 577 -127
262 -367 463 -640 536 -104 28 -347 36 -444 14z m321 -752 c92 -52 139 -143
139 -268 0 -174 -89 -291 -238 -311 -177 -23 -317 135 -301 340 18 219 221
340 400 239z"/>
                                                                                <path d="M3954 5688 c-56 -19 -128 -81 -194 -170 -36 -48 -218 -355 -406 -685
-188 -329 -606 -1061 -929 -1628 -710 -1245 -808 -1417 -896 -1566 -38 -63
-85 -151 -106 -195 -37 -77 -38 -82 -38 -194 0 -105 2 -119 27 -166 35 -67
108 -138 176 -171 72 -35 195 -44 271 -18 61 20 141 90 204 178 24 34 172 287
329 562 157 275 469 822 693 1215 224 393 572 1003 773 1355 201 352 392 685
425 740 157 261 187 400 116 550 -30 64 -104 135 -175 170 -49 24 -74 29 -149
31 -49 2 -104 -2 -121 -8z"/>
                                                                                <path d="M3895 2959 c-410 -44 -760 -354 -865 -765 -65 -253 -41 -505 71 -744
57 -122 118 -207 218 -303 135 -130 284 -209 471 -249 137 -29 347 -22 473 16
324 97 577 349 687 685 72 220 64 488 -19 699 -132 335 -418 585 -736 646
-109 20 -205 25 -300 15z m228 -767 c128 -72 183 -261 118 -407 -51 -115 -126
-167 -240 -167 -111 -1 -185 45 -239 147 -24 45 -27 61 -27 155 0 95 3 110 27
156 74 140 230 190 361 116z"/>
                                                                            </g>
                                                                        </svg>

                                                                    </div>
                                                                    <div>
                                                                        <div className="item-operador-formula">

                                                                        </div>
                                                                        <svg data-signo="(" version="1.0" viewBox="0 0 121.000000 419.000000"
                                                                            preserveAspectRatio="xMidYMid meet">
                                                                            <g transform="translate(0.000000,419.000000) scale(0.100000,-0.100000)"
                                                                                stroke="none">
                                                                                <path d="M1005 4180 c-109 -25 -357 -235 -503 -427 -314 -413 -482 -981 -482
-1628 0 -684 188 -1293 530 -1719 135 -168 382 -376 464 -391 78 -15 164 38
187 115 23 77 -10 149 -93 203 -292 191 -560 613 -672 1062 -63 254 -80 415
-80 735 0 414 47 685 171 995 127 316 356 612 573 739 75 44 100 83 100 156 0
43 -6 65 -23 90 -37 57 -108 85 -172 70z"/>
                                                                            </g>
                                                                        </svg>

                                                                    </div>
                                                                    <div>
                                                                        <div className="item-operador-formula">

                                                                        </div>
                                                                        <svg data-signo=")" version="1.0" viewBox="0 0 120.000000 417.000000"
                                                                            preserveAspectRatio="xMidYMid meet">

                                                                            <g transform="translate(0.000000,417.000000) scale(0.100000,-0.100000)"
                                                                                stroke="none">
                                                                                <path d="M133 4160 c-78 -18 -123 -75 -123 -158 0 -74 20 -106 98 -156 292
-187 523 -529 648 -956 125 -428 136 -1004 28 -1470 -110 -473 -379 -909 -682
-1107 -69 -45 -92 -83 -92 -153 0 -101 60 -160 162 -160 51 0 63 5 134 52 154
103 347 309 478 509 342 527 481 1315 366 2073 -94 613 -374 1132 -769 1425
-128 95 -181 116 -248 101z"/>
                                                                            </g>
                                                                        </svg>
                                                                    </div>
                                                                    <div>
                                                                        <div className="item-operador-formula">

                                                                        </div>
                                                                        <svg data-signo="-" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enableBackground="new 0 0 256 256" >
                                                                            <g><g><path d="M246,144.1c0,4.5-1.6,8.3-4.7,11.4c-3.1,3.1-6.9,4.7-11.4,4.7H26.1c-4.5,0-8.3-1.6-11.4-4.7c-3.1-3.1-4.7-6.9-4.7-11.4v-32.2c0-4.5,1.6-8.3,4.7-11.4c3.1-3.1,6.9-4.7,11.4-4.7h203.8c4.5,0,8.3,1.6,11.4,4.7c3.1,3.1,4.7,6.9,4.7,11.4V144.1L246,144.1z" /></g></g>
                                                                        </svg>
                                                                    </div>
                                                                    <div>
                                                                        <div className="item-operador-formula">

                                                                        </div>
                                                                        <svg data-signo="+" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enableBackground="new 0 0 256 256">
                                                                            <g><g><g><path d="M109,10.5c-1.8,0.8-3.4,2.6-4.1,4.4c-0.4,0.9-0.5,15.4-0.5,45.4v44.1l-44.8,0.1c-44.4,0.1-44.8,0.1-46.2,1.2c-0.7,0.5-1.8,1.6-2.4,2.4c-1,1.3-1,1.9-1,20c0,18.1,0,18.7,1,20c0.5,0.7,1.6,1.8,2.4,2.4c1.3,1,1.8,1,46.2,1.2l44.8,0.1l0.1,44.8c0.1,44.4,0.1,44.8,1.2,46.2c0.5,0.7,1.6,1.8,2.4,2.4c1.3,1,1.9,1,20,1c18.1,0,18.7,0,20-1c0.7-0.5,1.8-1.6,2.4-2.4c1-1.3,1-1.8,1.2-46.2l0.1-44.8l44.8-0.1c44.4-0.1,44.8-0.1,46.2-1.2c0.7-0.5,1.8-1.6,2.4-2.4c1-1.3,1-1.9,1-20c0-18.1,0-18.7-1-20c-0.5-0.7-1.6-1.8-2.4-2.4c-1.3-1-1.8-1-46.2-1.2l-44.8-0.1l-0.1-44.8c-0.1-44.4-0.1-44.8-1.2-46.2c-0.5-0.7-1.6-1.8-2.4-2.4c-1.3-1-2-1-19.4-1.1C114.3,9.9,110.2,10,109,10.5z" /></g></g></g>
                                                                        </svg>
                                                                    </div>
                                                                    <div>
                                                                        <div className="item-operador-formula">

                                                                        </div>
                                                                        <svg data-signo="#" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 122.88 113.29" style={{ fillRule: "evenodd" }} ><g><path d="M72.17,60.87l38-6.11c3.37-0.54,6.58,1.78,7.12,5.15l5.51,34.24c0.54,3.37-1.78,6.58-5.15,7.12l-38,6.11 c-3.37,0.54-6.58-1.78-7.12-5.15l-5.51-34.24C66.48,64.62,68.8,61.41,72.17,60.87L72.17,60.87z M91.64,76.94l-7.35-0.08 c0.22-2.37,1.06-4.3,2.55-5.8c1.48-1.49,3.77-2.5,6.85-3.01c3.55-0.59,6.21-0.36,8.02,0.7c1.8,1.06,2.87,2.59,3.2,4.59 c0.2,1.17,0.05,2.29-0.43,3.35s-1.3,2.05-2.48,2.98c1.09,0.08,1.95,0.25,2.56,0.51c1,0.41,1.82,1.02,2.47,1.85 c0.65,0.83,1.09,1.87,1.3,3.13c0.26,1.58,0.11,3.17-0.48,4.77c-0.59,1.59-1.59,2.91-3.02,3.95c-1.43,1.04-3.41,1.78-5.95,2.2 c-2.47,0.41-4.47,0.45-5.99,0.1c-1.53-0.34-2.84-1-3.95-1.96c-1.1-0.97-2.05-2.26-2.83-3.88l7.39-2.27 c0.55,1.48,1.19,2.46,1.91,2.95c0.72,0.49,1.56,0.65,2.53,0.49c1.01-0.17,1.79-0.68,2.34-1.54c0.55-0.85,0.72-1.9,0.51-3.14 c-0.21-1.26-0.7-2.18-1.46-2.77c-0.76-0.58-1.7-0.78-2.81-0.6c-0.59,0.1-1.38,0.38-2.36,0.85l-0.51-5.47 c0.42-0.01,0.75-0.03,0.98-0.07c0.98-0.16,1.74-0.62,2.29-1.35c0.55-0.74,0.75-1.53,0.61-2.39c-0.14-0.83-0.5-1.45-1.06-1.85 c-0.58-0.41-1.29-0.55-2.15-0.4c-0.89,0.15-1.56,0.53-2.03,1.16C91.83,74.57,91.61,75.57,91.64,76.94L91.64,76.94z M62.77,11.41 l4.62,27.72l-7.65,1.28l-3.02-18.13c-1.08,1.15-2.15,2.1-3.22,2.87c-1.06,0.77-2.43,1.57-4.08,2.39l-1.03-6.17 c2.44-1.27,4.27-2.6,5.5-4.01c1.23-1.41,2.11-3.04,2.63-4.9L62.77,11.41L62.77,11.41z M17.77,56.97l36.92,10.88 c3.28,0.97,5.17,4.44,4.2,7.72l-9.8,33.26c-0.97,3.28-4.44,5.17-7.72,4.2L4.46,102.16c-3.28-0.97-5.17-4.44-4.2-7.72l9.8-33.26 C11.02,57.9,14.49,56.01,17.77,56.97L17.77,56.97z M44.48,86l-5.06-0.72c-0.28,0.32-0.59,0.63-0.93,0.92 c-1.28,1.1-3.32,2.13-6.12,3.08c-1.66,0.54-2.77,0.94-3.35,1.18c-0.58,0.25-1.27,0.58-2.08,1.01l10.68,3.16l-1.65,5.56l-20.51-6.06 c0.83-1.95,2.11-3.65,3.83-5.07c1.72-1.43,4.57-2.88,8.57-4.34c0.76-0.28,1.43-0.54,2.03-0.79l0,0c1.34-0.56,2.28-1.04,2.83-1.46 c0.79-0.61,1.29-1.26,1.49-1.95c0.22-0.75,0.14-1.47-0.26-2.17c-0.4-0.7-1.02-1.17-1.86-1.42c-0.87-0.26-1.67-0.19-2.38,0.19 c-0.72,0.39-1.38,1.25-1.98,2.59l-6.67-2.58c0.84-1.85,1.78-3.2,2.81-4.07c1.04-0.87,2.29-1.4,3.76-1.59 c1.48-0.19,3.36,0.05,5.67,0.74c2.4,0.71,4.19,1.54,5.37,2.48c1.17,0.94,1.98,2.09,2.4,3.45c0.43,1.37,0.44,2.75,0.02,4.16 c-0.33,1.1-0.88,2.09-1.66,2.99L44.48,86L44.48,86z M36.49,6.19l38-6.11c3.37-0.54,6.58,1.78,7.12,5.15l5.51,34.24 c0.54,3.37-1.78,6.58-5.15,7.12l-38,6.11c-3.37,0.54-6.58-1.78-7.12-5.15l-5.51-34.24C30.8,9.94,33.12,6.73,36.49,6.19L36.49,6.19z" /></g></svg>
                                                                    </div>
                                                                    <div>
                                                                        <div className="item-operador-formula">

                                                                        </div>
                                                                        <svg data-signo="*" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enableBackground="new 0 0 256 256" >

                                                                            <g><g><path d="M83.5,138.5c0,0,0-0.6,0-1.1c0-0.5-0.6-0.6-0.6-0.6s-0.9,0-1.3,0s-0.6,0.6-0.6,0.6v1.1h-0.6c0,0,0,1.8,0,2.2s0.6,0.6,0.6,0.6s2,0,2.4,0c0.5,0,0.6-0.6,0.6-0.6v-2.2H83.5z M82.7,139.6l-0.3,0.3v0.6h-0.3v-0.6l-0.3-0.3v-0.3l0.3-0.3h0.3l0.3,0.3V139.6z M83,138.5h-1.3v-0.8c0,0,0.2-0.3,0.6-0.3h0.3c0.4,0,0.6,0.3,0.6,0.3L83,138.5L83,138.5z" /><path d="M199.1,241.8L128,170.7l-71.1,71.1c-17.7,17.7-60.3-25-42.7-42.7L85.3,128L14.2,56.9c-17.7-17.7,25-60.3,42.6-42.7L128,85.3l71.1-71.1c17.7-17.7,60.3,25,42.7,42.7L170.7,128l71.1,71.1C259.4,216.8,216.8,259.4,199.1,241.8z" /></g></g>
                                                                        </svg>
                                                                    </div>
                                                                    <div className="div-input-elegir-variable">
                                                                        <GlobalInputs
                                                                            input={setGlobalInputsValue}
                                                                            value={globalInputsValue}
                                                                            class={"input-global"}
                                                                            /*  errors={errorsAsignar}
                                                                             elementEdit={infoAnalisisUpdateAsignar.length > 0 ? infoAnalisisUpdateAsignar[0].mu_id : ""} */
                                                                            data={{
                                                                                variables: {
                                                                                    function: {
                                                                                        "value": IserterVariable,
                                                                                        "execute": {
                                                                                            "type": "own",
                                                                                            "value": "all"
                                                                                        }
                                                                                    },
                                                                                    index: true,
                                                                                    type: "select",
                                                                                    values: ["visual_name"],
                                                                                    opciones: variablesFormatoFisico,
                                                                                    upper_case: true,
                                                                                    key: "nombre",
                                                                                },
                                                                            }} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="div-formulas">
                                                                <h3>Fórmula</h3>
                                                                <div>
                                                                    <div className="div-content-formula">

                                                                        <div>
                                                                            <div className="div-crear-formula" ref={divCrearFormula}>

                                                                            </div>
                                                                        </div>

                                                                        <div className="div-delete-formula">
                                                                            <div id="divIconDelete" className="div-icon-delete">
                                                                                <svg version="1.0" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                                                                                    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" stroke="none">
                                                                                        <path d="M1785 5111 c-31 -13 -64 -54 -75 -92 -6 -19 -10 -116 -10 -216 l0 -183 860 0 860 0 0 183 c0 100 -5 198 -10 218 -5 19 -24 48 -41 65 l-30 29 -767 2 c-422 1 -776 -2 -787 -6z" />
                                                                                        <path d="M730 4323 c-99 -34 -177 -115 -206 -211 -10 -32 -14 -105 -14 -244 l0 -198 2051 0 2050 0 -3 218 c-3 207 -4 219 -27 267 -32 63 -92 124 -156 155 l-50 25 -1800 2 c-1617 2 -1805 1 -1845 -14z" />
                                                                                        <path d="M840 3373 c0 -10 49 -737 110 -1615 119 -1748 108 -1635 177 -1699 68 -64 -42 -59 1437 -57 l1344 3 44 30 c49 35 85 92 93 150 3 22 55 722 115 1555 60 833 112 1545 116 1583 l6 67 -1721 0 c-1632 0 -1721 -1 -1721 -17z m1259 -468 c16 -8 40 -28 55 -46 l26 -31 -2 -1063 -3 -1063 -25 -27 c-54 -58 -108 -69 -170 -34 -75 43 -70 -45 -70 1129 0 1172 -5 1086 69 1129 43 24 81 27 120 6z m1039 -5 c18 -11 41 -34 52 -52 20 -32 20 -53 20 -1076 0 -1136 3 -1075 -56 -1121 -62 -49 -154 -31 -197 38 l-22 36 0 1045 0 1045 23 36 c40 65 118 87 180 49z" />
                                                                                    </g>
                                                                                </svg>
                                                                            </div>
                                                                            <div onClick={() => { clearFormula() }} className="div-icon-reload">
                                                                                <svg version="1.0" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                                                                                    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" stroke="none">
                                                                                        <path d="M2414 4419 c-373 -27 -767 -189 -1063 -439 l-74 -62 -161 159 c-88 88 -172 168 -186 177 -56 37 -166 8 -212 -56 l-23 -33 0 -590 c0 -656 -3 -621 68 -679 l39 -31 591 0 c579 0 593 0 627 21 69 40 103 155 64 214 -9 14 -94 103 -188 197 l-171 173 35 30 c52 45 187 134 255 168 341 170 756 167 1098 -7 349 -177 578 -481 663 -876 23 -109 23 -331 0 -448 -48 -249 -165 -468 -345 -648 -180 -180 -400 -297 -648 -345 -107 -21 -318 -23 -423 -5 -293 51 -554 205 -762 449 -32 37 -41 42 -80 42 -43 0 -44 -1 -225 -187 -222 -226 -220 -219 -120 -334 191 -222 490 -417 792 -518 555 -185 1149 -104 1640 224 208 138 362 292 500 500 376 563 426 1250 135 1853 -179 372 -443 647 -802 837 -321 169 -662 240 -1024 214z" />
                                                                                    </g>
                                                                                </svg>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <h4 className="label-error-submit-form" htmlFor="">{errorsInputGlobal ? errorsInputGlobal["formula"] ? errorsInputGlobal["formula"] : "" : ""}</h4>

                                                                </div>
                                                                <h3>Evaluar</h3>
                                                                <div className="div-content-formula">
                                                                    <div className="div-content-ejecutar-formula">
                                                                        <div ref={divEvaluarFormula} className="div-crear-formula" >

                                                                        </div>
                                                                        <button className="button-ejecutar-formula" onClick={() => { getResultadoFormula() }}>Ejecutar</button>
                                                                    </div>
                                                                    <div className="resultado-formula">
                                                                        <svg version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enableBackground="new 0 0 256 256"><g><g><g><path d="M31.9,55.9c-10.3,2.3-18.3,10.2-21,20.9c-1.6,6.3-0.9,12.8,2.2,19c2.2,4.5,7.8,10.2,12.1,12.3c6.8,3.4-1.8,3.1,103.3,3.1h94.3l3.7-1.2c14.1-4.8,22.3-19.4,18.7-33.2c-2.4-9.5-9-16.8-18-20.1l-3.5-1.2l-94.5-0.1C51.8,55.3,34.1,55.4,31.9,55.9z"></path><path d="M34.4,145.1c-6.5,0.8-12.3,3.9-17.1,9.1C3.8,169,9.9,192.5,29,199.5l3.3,1.2H128h95.7l3.3-1.2c9.2-3.4,15.7-10.7,18.2-20.2c3.6-13.8-4.7-28.4-18.7-33.2l-3.7-1.2l-92.7,0C79.1,144.8,36.1,144.9,34.4,145.1z"></path></g></g></g></svg>
                                                                        <h4 id="resultadoFormula"></h4>
                                                                    </div>

                                                                </div>
                                                                <h3>Llenar</h3>
                                                                <div className="div-content-input-variables div-content-formula">
                                                                    <div ref={divLLenarCamporFormulario} >
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        : "" : ""}
                                                </div>

                                            </div>
                                            :
                                            <div className="div-no-campo-select">
                                                <h4>Por favor seleccione un campo</h4>
                                            </div> :
                                            <div className="div-no-campo-select">
                                                <h4>Por favor seleccione un campo</h4>
                                            </div>}

                                        <div className="div-leyenda">
                                            <h3>Leyenda</h3>
                                            <div className="div-content-leyenda">
                                                {variablesFormatoFisico ? variablesFormatoFisico.length > 0 ?
                                                    variablesFormatoFisico.map((value, index) => {
                                                        return <div key={value.id}>
                                                            <span>V_{(index + 1) + ") "}</span><h4>{value["visual_name"].toString().replace(/\b\w{4,}\b/g, function (match) {
                                                                return match.charAt(0).toUpperCase() + match.slice(1);
                                                            })}</h4>
                                                        </div>
                                                    })
                                                    : "No hay nada para mostrar." : "No hay nada para mostrar."}
                                            </div>
                                        </div>
                                    </div>
                                    {variableFocus ? Object.keys(variableFocus).length > 0 ? <div className="div-footer">
                                        <button onClick={() => { updateVariable() }} className="input-register">Guardar</button>
                                    </div> : "" : ""}
                                </div>
                            } />
                            : ""
                    }

                    {modalConfiguracionCodigos ?
                        <GlobalModal class={"div-modal-configuracion-variables-fisicas" + (!data.valueDarkMode ? " lightMode" : " darkMode")} statusModal={setModalConfiguracionCodigos} content={
                            <div className="div-codigos-muestra">
                                <h2>Codigos para Muestra - Informe</h2>

                                <GlobalInputs
                                    input={setGlobalInputsValue}
                                    value={globalInputsValue}
                                    errors={errorsInputGlobal}
                                    elementEdit={globalInputEdit}
                                    data={{
                                        codigo_muestra: {
                                            type: "normal",
                                            referencia: "Codigo de la Muestra"
                                        },
                                    }} />
                                <GlobalInputs
                                    input={setGlobalInputsValue}
                                    value={globalInputsValue}
                                    errors={errorsInputGlobal}
                                    elementEdit={globalInputEdit}
                                    data={{
                                        codigo_informe: {
                                            type: "normal",
                                            referencia: "Codigo de Informe"
                                        },
                                    }} />
                                <div className="div-footer">
                                    <button onClick={() => { updateCodigosConf() }} className="input-register">Actualizar</button>
                                </div>
                            </div>

                        } />
                        : ""}

                    <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />
                    {/* {<Mensajeria socket={data.socket} user={user} />} */}
                </div >
                :
                <div>
                    {/* <Alert statusAlert={true} dataAlert={
                        {
                            status: "interrogative",
                            description: "Inténtalo más tarde.",
                            "tittle": "¿Qué haces aquí?",
                            continue: {
                                "close": true
                            }
                        }
                    } /> */}
                </div>
            }
        </>
    )
}
