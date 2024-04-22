import React, { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas';
import {
    Radar, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, ReferenceDot
} from 'recharts';
import "../../public/css/style.css"
import { Alert } from '../componentes/alert';
import { Slider } from '../componentes/Slider';
import { GlobalModal } from '../componentes/globalModal';
import $, { contains, data } from "jquery"
import Api, { host } from '../componentes/Api';

export const Inicio = () => {
    const [analisis, setanalisis] = useState({});
    const [muestra, setmuestra] = useState({});
    const [formatoFisico, setFormatoFisico] = useState({});
    const [resultadoFisico, setResultadoFisico] = useState({});
    const [formatoSensorial, setFormatoSensorial] = useState({});
    const [resultadoSensorial, setResultadoSensorial] = useState({});
    const [resultadoSensorialPromedio, setResultadoSensorialPromedio] = useState({});
    const [keyModal, setKeyModal] = useState(0);
    const [statusAlert, setStatusAlert] = useState(false);
    const [dataAlert, setdataAlert] = useState({});
    const [imgs, setImgs] = useState({});
    const [modalSliderImg, setModalSliderImg] = useState(false);


    let divRef = useRef(null);
    const [dataAtributos, setDataAtributos] = useState([
        { name: "Fragancia Aroma", x: 0 },
        { name: "Sabor", x: 0 },
        { name: "Retrogusto", x: 0 },
        { name: "Acidez", x: 0 },
        { name: "Cuerpo", x: 0 },
        { name: "Uniformidad", x: 0 },
        { name: "Balance", x: 0 },
        { name: "Taza limpia", x: 0 },
        { name: "Dulzor", x: 0 },
        { name: "Puntaje General", x: 0 },
    ])



    const [modalStatus, setModalStatus] = useState(false);
    const capturarDivComoImagen = async () => {
        if (divRef.current !== null) {

            if (document.getElementById("divimgAtributos")) {

                let tspan = document.getElementsByTagName("tspan")
                for (let x = 0; x < tspan.length; x++) {
                    if (tspan[x].innerHTML == "Fragancia Aroma") {
                        tspan[x].setAttribute("dy", "-40")
                    } else if (tspan[x].innerHTML == "Sabor") {
                        tspan[x].setAttribute("dx", "50")
                    } else if (tspan[x].innerHTML == "Acidez") {
                        tspan[x].setAttribute("dx", "60")
                    } else if (tspan[x].innerHTML == "Retrogusto") {
                        tspan[x].setAttribute("dx", "90")
                    } else if (tspan[x].innerHTML == "Cuerpo") {
                        tspan[x].setAttribute("dx", "70")
                    } else if (tspan[x].innerHTML == "Uniformidad") {
                        tspan[x].setAttribute("dy", "40")
                    } else if (tspan[x].innerHTML == "Balance") {
                        tspan[x].setAttribute("dx", "-80")
                    } else if (tspan[x].innerHTML == "Taza limpia") {
                        tspan[x].setAttribute("dx", "-98")
                    } else if (tspan[x].innerHTML == "Dulzor") {
                        tspan[x].setAttribute("dx", "-60")
                    } else if (tspan[x].innerHTML == "Puntaje General") {
                        tspan[x].setAttribute("dx", "-135")
                    }
                }

                html2canvas(divRef.current).then(canvas => {
                    document.getElementById("imgAtributos").setAttribute("src", canvas.toDataURL("image/png"))
                    if (document.getElementById("loadinfo")) {
                        document.getElementById("loadinfo").remove()
                    }
                    if (document.getElementById("divimgAtributos")) {
                        document.getElementById("divimgAtributos").remove()
                    }
                    resizeModal()
                    getResizeFormatoSca();
                    setElementsTemplateFormatoSca("iframeFormatoSca", resultadoSensorialPromedio)
                });
            }
        }
    };

    useEffect(() => {
        if (Object.keys(resultadoSensorialPromedio).length > 0) {
            capturarDivComoImagen()
        }
    }, [resultadoSensorialPromedio])


    function resizeModal() {
        let modalForm = document.querySelectorAll(".div-modal-form");
        let divContentForm = document.querySelectorAll(".div-content-modal");
        let divFondomodalForm = document.querySelectorAll(".div-fondo-modal ");
        if (divContentForm.length > 0) {
            for (let m = 0; m < modalForm.length; m++) {
                if ((divContentForm[m].scrollHeight + 100) > document.body.clientHeight) {

                    modalForm[m].style.alignItems = "unset"
                    modalForm[m].style.padding = "20px 20px"
                    modalForm[m].style.height = "calc(100% - 40px)"
                    modalForm[m].style.width = "calc(100% - 40px)"
                    modalForm[m].style.flexDirection = "row"
                    if (divFondomodalForm[m]) {
                        divFondomodalForm[m].style.height = divContentForm[m].clientHeight + 40 + "px"
                        divFondomodalForm[m].style.width = modalForm[m].clientWidth + "px"
                    }
                } else {
                    if (divFondomodalForm[m]) {
                        divFondomodalForm[m].style.height = "100vh"
                        divFondomodalForm[m].style.width = "100vw"
                    }
                    modalForm[m].style.alignItems = "center"
                    modalForm[m].style.justifyContent = ""
                    modalForm[m].style.flexDirection = "row"
                    modalForm[m].style.padding = ""
                    modalForm[m].style.height = "100%"
                    modalForm[m].style.width = "100%"
                }

            }
        }

    }
    function getResizeFormatoSca() {
        let contentModal = document.getElementById("contentModal")
        const resizeObserver = new ResizeObserver(entries => {

            entries.forEach(entry => {
                if (entries) {
                    resizeFormatoSca();
                }
            });

        });
        if (contentModal) {
            resizeObserver.observe(contentModal);
            resizeFormatoSca();
        }
        resizeFormatoSca();

        let iframeFormatoSca = document.getElementById("iframeFormatoSca")


    }

    function setElementsTemplateFormatoSca(idElement, data, setInputs) {
        if (data) {
            let iframe = document.getElementById(idElement);
            if (iframe) {
                let keysRange = ["fragancia_aroma", "sabor", "sabor_residual", "acidez", "cuerpo", "balance", "puntaje_catador"]
                let keysIntensidad = ["seco", "espuma", "intensidad", "nivel_cuerpo", "tueste"]
                let keysCuadro = ["uniformidad", "taza_limpia", "dulzor"]
                let keysNormal = ["tazas"]

                let keysResult = Object.keys(data)
                let content = iframe.contentDocument

                let puntajeTotal = content.getElementById("puntajeTotal")
                let defectos = content.getElementById("defectos")
                let resultadoTazasXIntensidad = content.getElementById("resultadoTazasXIntensidad")
                let defectosRechazo = content.getElementById("defectosRechazo");
                let defectosLigero = content.getElementById("defectosLigero");
                let puntajeFinal = content.getElementById("puntajeFinal")
                let notas = content.getElementById("div-notas")
                let textNotas = content.getElementById("notas")
                if (textNotas) {
                    textNotas.innerHTML = data.notas
                }

                let valuePuntajeTotal = (parseFloat((data.fragancia_aroma ? data.fragancia_aroma : 0)) + parseFloat((data.sabor ? data.sabor : 0)) + parseFloat((data.sabor_residual ? data.sabor_residual : 0)) + parseFloat((data.acidez ? data.acidez : 0)) + parseFloat((data.cuerpo ? data.cuerpo : 0)) + parseFloat((data.uniformidad ? data.uniformidad : 0)) + parseFloat((data.taza_limpia ? data.taza_limpia : 0)) + parseFloat((data.balance ? data.balance : 0)) + parseFloat((data.dulzor ? data.dulzor : 0)) + parseFloat((data.puntaje_catador ? data.puntaje_catador : 0)))
                let valueTazasXIntensidad = (parseFloat((data.tazas ? data.tazas : 0)) * parseFloat((data.defectos ? data.defectos : 0)));
                if (puntajeTotal) {
                    puntajeTotal.innerHTML = valuePuntajeTotal;
                }
                if (defectos) {
                    /* intensiadDefectos.innerHTML = (data.intensidad ? data.intensidad : 0) < 10 ? (data.intensidad ? data.intensidad : 0).toFixed(1) : (data.intensidad ? data.intensidad : 0); */
                    defectos.innerHTML = (data.defectos ? data.defectos : 0)
                }

                if (data.defectos == 2) {
                    if (defectosLigero) {
                        defectosLigero.classList.add("defectos-focus")
                    }
                } else if (data.defectos == 4) {
                    if (defectosRechazo) {
                        defectosRechazo.classList.add("defectos-focus")
                    }
                }
                if (resultadoTazasXIntensidad) {
                    resultadoTazasXIntensidad.innerHTML = valueTazasXIntensidad;
                }

                if (puntajeFinal) {
                    puntajeFinal.innerHTML = valuePuntajeTotal - valueTazasXIntensidad;
                }
                if (notas) {
                    notas.innerHTML = (data.notas ? data.notas : "No registra");
                }
                for (let r = 0; r < keysRange.length; r++) {
                    if (keysResult.includes(keysRange[r])) {
                        let divElement = content.getElementById("div-" + keysRange[r])
                        let divElementInput = content.getElementById(keysRange[r])
                        if (divElementInput) {
                            divElementInput.value = data[keysRange[r]]
                        }
                        if (divElement) {
                            let range = divElement.querySelectorAll(".value-range-item")
                            let puntaje = divElement.querySelectorAll(".puntaje-range ")
                            if (data[keysRange[r]]) {

                                if (range.length > 0) {
                                    range[0].style.width = "calc(" + ((data[keysRange[r]] - 6) / 4) * 100 + "% - 2px )";
                                    range[0].style.height = "100%"


                                }
                                if (puntaje.length > 0) {
                                    puntaje[0].innerHTML = data[keysRange[r]]
                                }
                            }
                        }

                    }
                }
                for (let i = 0; i < keysIntensidad.length; i++) {
                    if (keysResult.includes(keysIntensidad[i])) {
                        let divElement = content.getElementById("div-" + keysIntensidad[i])
                        let divValue = content.getElementById("value_" + keysIntensidad[i])
                        let divElementInput = content.getElementById(keysIntensidad[i])
                        if (divValue) {
                            const value = data[keysIntensidad[i]]
                            if (value - Math.floor(value) > 0) {
                                divValue.innerHTML = value.toFixed(2).toString().replace("0", "")
                            } else {
                                divValue.innerHTML = value
                            }

                        }
                        if (divElementInput) {
                            divElementInput.value = data[keysIntensidad[i]]
                        }
                        if (divElement) {
                            let range = divElement.querySelectorAll(".range-color-intensidad")
                            if (range.length > 0) {
                                if (data[keysIntensidad[i]]) {
                                    range[0].style.height = "calc(" + ((data[keysIntensidad[i]] / (keysIntensidad[i] != "tueste" ? 5 : 4)) * 100) + "%)"
                                }
                            }
                        }

                    }
                }
                for (let c = 0; c < keysCuadro.length; c++) {
                    if (keysResult.includes(keysCuadro[c])) {
                        let divElement = content.getElementById("div-" + keysCuadro[c])
                        if (divElement) {
                            let cuadro = divElement.querySelectorAll(".cuadro-select")
                            let puntaje = divElement.querySelectorAll(".puntaje-select")
                            if (data[keysCuadro[c]] != undefined) {

                                if (cuadro.length > 0) {

                                    for (let cs = 0; cs < (5 - (data[keysCuadro[c]] / 2)); cs++) {
                                        cuadro[cs].classList.add("focus-cuadro-select")

                                    }

                                }
                                if (puntaje.length > 0) {
                                    puntaje[0].innerHTML = data[keysCuadro[c]]
                                }
                            }

                        }
                    }
                }
                for (let n = 0; n < keysNormal.length; n++) {
                    if (keysResult.includes(keysNormal[n])) {
                        let divElement = content.getElementById("div-" + keysNormal[n])
                        let divElementInput = content.getElementById(keysNormal[n])
                        if (divElementInput) {
                            divElementInput.value = data[keysNormal[n]]
                        }
                        if (data[keysNormal[n]]) {
                            if (divElement) {
                                divElement.innerHTML = data[keysNormal[n]];
                            }
                        }
                    }
                }
                resizeFormatoSca()
            }
        }

    }
    function resizeFormatoSca() {
        const iframeFormatoSca = document.getElementById("iframeFormatoSca");

        if (iframeFormatoSca) {
            const iframeFormatoScaContentDocument = iframeFormatoSca.contentDocument;
            const formatoSca = iframeFormatoScaContentDocument.getElementById("formatoSca");
            formatoSca.style.width = "100%";
            if (formatoSca) {
                iframeFormatoSca.style.height = "calc(" + (formatoSca.clientWidth / 5) + "px" + " + 27px)"
            }

        }
    }
    const dataFormatoSensorial = [
        {
            "notas": "noaplica",
            "usuario_catador_telefono": "3214571356",
            "usuario_catador_correo": "catador@gmail.com",
            "usuario_catador_documento": "1095218090",
            "usuario_catador_nombre": "catador nuevo",
            "usuario_owner_documento": "1231231232",
            "usuario_owner_nombre": "cliente cliente",
            "an_id": 5,
            "ca_id": 12,
            "nombre": "colombia",
            "estado": 1,
            "usuario_owner": 7,
            "usuario_catador": 8,
            "analisis": 5,
            "fragancia_aroma": 9.25,
            "sabor": 8.75,
            "acidez": 8.25,
            "cuerpo": 7.75,
            "uniformidad": 8,
            "balance": 7.75,
            "seco": 3.5999999046325684,
            "sabor_residual": 6,
            "taza_limpia": 10,
            "dulzor": 4,
            "puntaje_catador": 8.5,
            "tazas": 1,
            "intensidad": 3.5999999046325684,
            "espuma": 3.299999952316284,
            "nivel_cuerpo": 3.299999952316284,
            "tueste": 3,
            "puntaje_total": null
        }
    ]

    useEffect(() => {
        const script = document.createElement('script');
        script.src = '../../public/js/mainMapa.js';
        script.async = true;
        document.body.appendChild(script);
        let iframe = document.getElementById('iframeMapa');



        iframe.addEventListener('load', function () {
            $(iframe.contentDocument).on("click", ".svg-point", async function () {
                try {
                    let id = $(this).attr("data-point")
                    let statusResultadoFisico = false;
                    let statusResultadoSensorial = false;
                    const dataFilter = {
                        "filter": {
                            "where": {
                                "an.id": {
                                    "value": id,
                                    "require": "and"
                                }
                            }
                        }
                    }
                    const response = await Api.post("/geolocalizacion/buscar/analisis", dataFilter);
                    if (response.data.status == true) {
                        if (response.data.data[0].fincas_id) {
                            listarIconos(response.data.data[0].fincas_id)
                        }
                        if (response.data.data[0].estado != 7) {
                            setStatusAlert(true)
                            setdataAlert(
                                {
                                    "status": "false",
                                    "description": "El análisis debe estar aprobado para poder mostrar su información.",
                                    "tittle": "Inténtalo más tarde.",
                                    "buttons": {
                                        "ok": {
                                            "referencia": "ok",
                                            "continue": {
                                                "close": true,
                                                /* "location": "/dashboard/analisis/registros" */
                                            }
                                        }
                                    },
                                }
                            )
                        } else {
                            const filterMuestra = {
                                "filter": {
                                    "where": {
                                        "an.id": {
                                            "require": "and",
                                            "value": response.data.data[0].id
                                        },
                                        "mu.id": {
                                            "value": response.data.data[0]["muestras_id"],
                                            "require": "and"
                                        }
                                    }
                                }
                            }
                            const muestra = await Api.post("geolocalizacion/buscar/muestra", filterMuestra);
                            if (muestra.data.status == true) {
                                setmuestra(muestra.data.data[0])

                                const filterFormatoFisico = {
                                    "filter": {
                                        "where": {
                                            "forma.analisis_id": {
                                                "value": id,
                                                "require": "and",
                                                "group": 2
                                            },
                                            "forma.tipos_analisis_id": {
                                                "value": 1,
                                                "require": "and",
                                                "group": 2
                                            }
                                        }
                                    },
                                }
                                const formatoFisico = await Api.post("geolocalizacion/buscar/formato", filterFormatoFisico);


                                if (formatoFisico.data.status == true) {
                                    const filterResultado = {
                                        "filter": {
                                            "where": {
                                                "an.id": {
                                                    "value": id,
                                                    "require": "and",
                                                },
                                                "forma.tipos_analisis_id": {
                                                    "value": 1,
                                                    "require": "and",
                                                    "group": 1
                                                }
                                            },
                                            "limit": {
                                                "inicio": "4444",
                                                "fin": "4444"
                                            }
                                        }
                                    }
                                    setFormatoFisico(formatoFisico.data.data)
                                    const resultado = await Api.post("geolocalizacion/buscar/resultado", filterResultado);
                                    if (resultado.data.status == true) {
                                        statusResultadoFisico = true;
                                        const promedioResultadoFisico = {};
                                        const keys = ["peso_cps", "humedad", "peso_cisco", "merma_trilla", "peso_total_almendra", "porcentaje_almendra_sana", "peso_defectos_totales", "factor_rendimiento", "peso_almendra_sana", "porcentaje_defectos_totales", "negro_total", "cardenillo", "vinagre", "cristalizado", "veteado", "ambar", "sobresecado", "mordido", "picado_insectos", "averanado", "inmaduro", "aplastado", "flojo", "decolorado", "malla18", "malla15", "malla17", "malla14", "malla16", "mallas_menores"];

                                        for (let x = 0; x < keys.length; x++) {
                                            for (let d = 0; d < resultado.data.data.length; d++) {
                                                if (resultado.data.data[d]) {
                                                    if (resultado.data.data[d][keys[x]]) {
                                                        if (!promedioResultadoFisico[keys[x]]) {
                                                            promedioResultadoFisico[keys[x]] = 0
                                                        }
                                                        promedioResultadoFisico[keys[x]] = parseFloat(promedioResultadoFisico[keys[x]]) + parseFloat(resultado.data.data[d][keys[x]])
                                                    }
                                                }
                                            }
                                            if (promedioResultadoFisico[keys[x]]) {
                                                const value = promedioResultadoFisico[keys[x]] / resultado.data.data.length;
                                                if (value - Math.floor(value) > 0) {
                                                    promedioResultadoFisico[keys[x]] = value.toFixed(2).toString().replace("0", "")
                                                } else {
                                                    promedioResultadoFisico[keys[x]] = value
                                                }
                                                /* promedioResultadoFisico[keys[x]] = promedioResultadoFisico[keys[x]] / parseFloat(resultado.data.data.length) */
                                            }
                                        }
                                        setResultadoFisico(promedioResultadoFisico)
                                    } else {

                                    }
                                }
                                const filterFormatoSensorial = {
                                    "filter": {
                                        "where": {
                                            "forma.analisis_id": {
                                                "value": id,
                                                "require": "and",
                                                "group": 2
                                            },
                                            "forma.tipos_analisis_id": {
                                                "value": 2,
                                                "require": "and",
                                                "group": 1
                                            }
                                        }
                                    },
                                }
                                const formatoSensorial = await Api.post("geolocalizacion/buscar/formato", filterFormatoSensorial);

                                if (formatoSensorial.data.status == true) {

                                    setFormatoSensorial(formatoSensorial.data.data)
                                    const filterResultado = {
                                        "filter": {
                                            "where": {
                                                "an.id": {
                                                    "value": id,
                                                    "require": "and",
                                                },
                                                "forma.tipos_analisis_id": {
                                                    "value": 2,
                                                    "require": "and",
                                                    "group": 1
                                                },
                                                "limit": {
                                                    "inicio": "4444",
                                                    "fin": "4444"
                                                }
                                            }
                                        }
                                    }
                                    const resultado = await Api.post("geolocalizacion/buscar/resultado", filterResultado);

                                    if (resultado.data.status == true) {


                                        statusResultadoSensorial = true
                                        const promedio = {};
                                        const variablesPromedio = ["fragancia_aroma", "sabor", "sabor_residual", "acidez", "cuerpo", "uniformidad", "balance", "taza_limpia", "dulzor", "puntaje_catador", "tazas", "defectos"]
                                        for (let x = 0; x < resultado.data.data.length; x++) {
                                            for (let r = 0; r < variablesPromedio.length; r++) {
                                                const variable = resultado.data.data[x][variablesPromedio[r]]
                                                if (variable) {
                                                    if (!promedio[variablesPromedio[r]]) {
                                                        promedio[variablesPromedio[r]] = 0
                                                    }
                                                    promedio[variablesPromedio[r]] = promedio[variablesPromedio[r]] + variable
                                                } else {
                                                    if (!promedio[variablesPromedio[r]]) {
                                                        promedio[variablesPromedio[r]] = 0
                                                    }
                                                    promedio[variablesPromedio[r]] = promedio[variablesPromedio[r]] + 0
                                                }
                                            }
                                        }
                                        for (let x = 0; x < variablesPromedio.length; x++) {
                                            if (promedio[variablesPromedio[x]]) {
                                                const value = promedio[variablesPromedio[x]] / resultado.data.data.length;
                                                if (value - Math.floor(value) > 0) {
                                                    promedio[variablesPromedio[x]] = value.toFixed(2).toString().replace("0", "")
                                                } else {
                                                    promedio[variablesPromedio[x]] = value
                                                }
                                            }
                                        }
                                        setResultadoSensorialPromedio(promedio)

                                        setDataAtributos([
                                            { name: "Fragancia Aroma", x: promedio["fragancia_aroma"] ? promedio["fragancia_aroma"] : 0 },
                                            { name: "Sabor", x: promedio["sabor"] ? promedio["sabor"] : 0 },
                                            { name: "Retrogusto", x: promedio["sabor_residual"] ? promedio["sabor_residual"] : 0 },
                                            { name: "Acidez", x: promedio["acidez"] ? promedio["acidez"] : 0 },
                                            { name: "Cuerpo", x: promedio["cuerpo"] ? promedio["cuerpo"] : 0 },
                                            { name: "Uniformidad", x: promedio["uniformidad"] ? promedio["uniformidad"] : 0 },
                                            { name: "Balance", x: promedio["balance"] ? promedio["balance"] : 0 },
                                            { name: "Taza limpia", x: promedio["taza_limpia"] ? promedio["taza_limpia"] : 0 },
                                            { name: "Dulzor", x: promedio["dulzor"] ? promedio["dulzor"] : 0 },
                                            { name: "Puntaje General", x: promedio["puntaje_catador"] ? promedio["puntaje_catador"] : 0 },
                                        ]);
                                        setResultadoSensorial(resultado.data.data[0])
                                    } else {

                                    }
                                } else {

                                }
                                if (statusResultadoSensorial == true && statusResultadoFisico == true) {
                                    setanalisis(response.data.data[0])
                                    setModalStatus(true)
                                    window.addEventListener("resize", function () {
                                        resizeModal()
                                    })
                                    resizeModal()
                                }
                            } else if (muestra.data.find_error) {
                                setStatusAlert(true)
                                setdataAlert(
                                    {
                                        status: "false",
                                        description: response.data.find_error,
                                        "tittle": "Inténtalo de nuevo.",
                                    }
                                )
                            } else {
                                setStatusAlert(true)
                                setdataAlert(
                                    {
                                        status: "false",
                                        description: response.data.find_error,
                                        "tittle": "Inténtalo de nuevo.",
                                    }
                                )
                            }

                        }

                    } else if (response.data.find_error) {
                        setStatusAlert(true)
                        setdataAlert(
                            {
                                status: "interrogative",
                                description: response.data.message,
                                "tittle": "¿Qué haces aquí?",
                                continue: {

                                    location: "/dashboard"
                                }
                            }
                        )

                    } else {
                        setStatusAlert(true)
                        setdataAlert(
                            {
                                status: "false",
                                description: response.data.message,
                                "tittle": "Inténtalo de nuevo.",
                            }
                        )
                    }




                    /* console.log(document.querySelectorAll(".direction-menu"))
                    iframe.contentWindow.addEventListener("load", function () {
                        alert("xd")
                    }) */
                } catch (e) {
                    console.log("Error: " + e)
                }
            })
        });
        return () => {
            script.remove()
        }
    }, [modalStatus])

    function cleanInfo() {
        setanalisis({})
        setmuestra({})
        setFormatoFisico({})
        setResultadoFisico({})
        setFormatoSensorial({})
        setResultadoSensorialPromedio({})
    }

    useEffect(() => {
        window.addEventListener("click", function (e) {
            if (document.body.contains(e.target)) {
                let contentModal = document.getElementById("contentModal");
                if (contentModal) {
                    if (e.target !== contentModal && !contentModal.contains(e.target)) {
                        if (e.target !== document.getElementById("contentModal") && modalStatus == false) {
                            divRef = null;
                            setModalStatus(false)
                            cleanInfo()
                        }
                    }
                }
            }
        })
    }, [])


    async function listarIconos(id) {
        try {
            const dataModel = {
                "filter": {
                    "order": {
                        "img.estado": {
                            "value": "asc"
                        }
                    }
                }
            }
            const response = await Api.post("geolocalizacion/buscar/imagenes/fincas/" + id, dataModel);
            if (response.data.status == true) {
                setImgs(response.data.data)
            } else {
                setImgs([])
            }

        } catch (e) {
            console.log("Error: " + e)
        }
    }

    const formatDate = (data) => {
        let date = new Date(data);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minutes = date.getMinutes();
        let orientation = "a.m"
        if (hour >= 12) {
            hour = hour - 12
            orientation = "p.m"
        }
        if (hour == 0) {
            hour = 12
        }
        if (minutes < 10) {
            minutes = "0" + minutes
        }
        return `${day < 10 ? '0' + day : day} / ${month < 10 ? '0' + month : month} / ${year} , ${hour}:${minutes} ${orientation}`
    }

    return (
        <div id='mainInicio'>
            <div className='iframe-mapa' >
                <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />
                <img className='img-fondo' src="/public/img/fondoMapa2.jpg" alt="" />

                <iframe id='iframeMapa' className='iframe' src="src/mapa/MapaV4/index.html" frameBorder={0}></iframe>
            </div>
            {modalStatus ?

                analisis ? Object.keys(analisis).length > 0 ?
                    <div style={{ position: "relative" }}>

                        <div id="contentForm" className="div-modal-form modal-form">
                            <div id="contentModal" className="div-content-modal div-content-form">
                                <div id='loadinfo' style={{ position: "absolute", zIndex: 99, background: "white", top: 0, left: 0, width: "100%", height: "100%", textAlign: "center", display: "flex", justifyContent: "center", /* alignItems : "center", */  fontSize: "2em" }}>
                                    Cargando...
                                </div>
                                <div id="iconQuit" className="icon-quit-svg-form" onClick={() => { divRef = null, setModalStatus(false), cleanInfo() }}>
                                    <svg version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                        <g><g><path d="M150.7,128l90.6-90.7c6.3-6.3,6.3-16.4,0-22.7c-6.3-6.3-16.4-6.3-22.7,0L128,105.3L37.4,14.7c-6.3-6.3-16.4-6.3-22.7,0s-6.3,16.4,0,22.7l90.6,90.6l-90.6,90.6c-6.3,6.3-6.3,16.4,0,22.7c3.1,3.1,7.2,4.7,11.3,4.7c4.1,0,8.2-1.6,11.3-4.7l90.7-90.6l90.6,90.7c3.1,3.1,7.2,4.7,11.3,4.7c4.1,0,8.2-1.6,11.3-4.7c6.3-6.3,6.3-16.4,0-22.7L150.7,128z" /></g></g>
                                    </svg>
                                </div>
                                <img className="img-logo-encc" src="img/logoCompletoENCC.png" alt="" />
                                <img className="img-logo-sena" src="img/logoSena.png" alt="" />

                                <div className="div-info-general">
                                    <div className="div-info-completa-finca">
                                        <div className="div-info-finca">
                                            <h1 className="title-info">Información sobre la Finca Sublime</h1>

                                            <div className="div-img-info-general">
                                                {imgs ? imgs.length > 0 ?
                                                    (() => {
                                                        let imgInsert = false
                                                        return imgs.map((value, index) => {
                                                            if (value.estado == 1) {
                                                                imgInsert = true
                                                                return <img onClick={() => { setModalSliderImg(true) }} key={value.id} src={"http://" + host + ":3000/img/usuarios/" + value.usuarios_id + "/fincas/" + value.fincas_id + "/" + value.nombre} alt="" />
                                                            }
                                                            if (imgInsert == false) {
                                                                if (index == (imgs.length - 1)) {
                                                                    return <img onClick={() => { setModalSliderImg(true) }} key={value.id} src={"http://" + host + ":3000/img/usuarios/" + value.usuarios_id + "/fincas/" + value.fincas_id + "/" + value.nombre} alt="" />
                                                                }
                                                            }
                                                        })
                                                    })()
                                                    :
                                                    <img src="img/imgPredeterminada.png" alt="" /> :
                                                    <img src="img/imgPredeterminada.png" alt="" />
                                                }

                                                {imgs && modalSliderImg ? imgs.length > 0 ?
                                                    <div>
                                                        {(() => {
                                                            const imgsSlider = [];
                                                            imgs.map((value, index) => {
                                                                return imgsSlider.push(<img className='img-slider-info-finca' key={value.id} src={"http://" + host + ":3000/img/usuarios/" + value.usuarios_id + "/fincas/" + value.fincas_id + "/" + value.nombre} alt="" />)
                                                            })
                                                            return <GlobalModal statusModal={setModalSliderImg} class={"modal-carrusel"} content={
                                                                <Slider data={imgsSlider} />
                                                            } />
                                                        })()}
                                                    </div> : "" : ""}

                                            </div>
                                        </div>
                                        <div className="div-info-caficultor">
                                            <div className="head-title-info-caficultor">
                                                <div className="title-info title-info-caficultor">
                                                    <h1>Información Sobre el Caficultor </h1>

                                                </div>

                                                <div className="div-info-content-general">
                                                    <div>
                                                        <h4>Nombre(s)</h4>
                                                        <h4>
                                                            {analisis["nombre"] ? analisis["nombre"] : "No Registra"}
                                                        </h4>
                                                    </div>
                                                    <div>
                                                        <h4>Apellidos(s)</h4>
                                                        <h4>
                                                            {analisis["apellido"] ? analisis["apellido"] : "No Registra"}
                                                        </h4>
                                                    </div>
                                                    <div>
                                                        <h4>Teléfono</h4>
                                                        <h4>
                                                            {analisis["telefono"] ? analisis["telefono"] : "No Registra"}
                                                        </h4>
                                                    </div>
                                                    <div>
                                                        <h4>Correo Electrónico</h4>
                                                        <h4>
                                                            {analisis["correo_electronico"] ? analisis["correo_electronico"] : "No Registra"}
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="head-title-info-caficultor">
                                                <div className="title-info title-info-caficultor">
                                                    <h1>Información Sobre la Muestra </h1>
                                                </div>

                                                <div className="div-info-content-general">
                                                    <div>
                                                        <h4>Código de muestra</h4>
                                                        <h4>
                                                            {muestra["codigo_muestra"] ? muestra["codigo_muestra"] : "No Registra"}
                                                        </h4>
                                                    </div>
                                                    <div>
                                                        <h4>Variedad</h4>
                                                        <h4>
                                                            {muestra["variedad"] ? muestra["variedad"] : "No Registra"}
                                                        </h4>
                                                    </div>
                                                    <div>
                                                        <h4>Código externo</h4>
                                                        <h4>
                                                            {muestra["codigo_externo"] ? muestra["codigo_externo"] : "No Registra"}
                                                        </h4>
                                                    </div>
                                                    {/*     <div>
                                        <h4>Muestra</h4>
                                        <h4>N-1</h4>
                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="info-puntaje">
                                        <div className="div-puntaje">
                                            <div className="tittle-puntaje">
                                                Puntaje
                                            </div>
                                            <div className={"body-puntaje " + (analisis["calidad"] > 9 ? "body-puntaje-extraordinario" : analisis["calidad"] > 8 ? "body-puntaje-excelente" : analisis["calidad"] > 7 ? "body-puntaje-muy-bueno" : "body-puntaje-bueno")}>
                                                {analisis["calidad"] ? analisis["calidad"] : 0}
                                            </div>
                                        </div>
                                        <div className="leyenda-puntaje">
                                            <div>
                                                <h4>Extraordinario</h4>
                                                <div className="cuadro-calidad calidad-extraordinario">
                                                </div>
                                            </div>
                                            <div>
                                                <h4>Excelente</h4>
                                                <div className="cuadro-calidad calidad-excelente">
                                                </div>
                                            </div>
                                            <div>
                                                <h4>Muy bueno</h4>
                                                <div className="cuadro-calidad calidad-muy-bueno">
                                                </div>
                                            </div>
                                            <div>
                                                <h4>Bueno</h4>
                                                <div className="cuadro-calidad calidad-bueno">
                                                </div>
                                            </div>
                                        </div>
                                        <div className="div-ubicacion">
                                            <div>
                                                <h4 className="tittle-ubicacion">Departamento</h4>
                                                <h4 className="value-ubicacion">
                                                    {analisis["departamento"] ? analisis["departamento"] : "No Registra"}
                                                </h4>
                                            </div>
                                            <div>
                                                <h4 className="tittle-ubicacion">Municipio</h4>
                                                <h4 className="value-ubicacion">
                                                    {analisis["municipio"] ? analisis["municipio"] : "No Registra"}
                                                </h4>
                                            </div>
                                            <div>
                                                <h4 className="title-ubicacion">Vereda</h4>
                                                <h4 className="value-ubicacion">
                                                    {analisis["vereda"] ? analisis["vereda"] : "No Registra"}
                                                </h4>
                                            </div>
                                            <div className="div-coordenadas">
                                                <div className="title-coordenadas">
                                                    <h4>Coordenadas Decimales</h4>
                                                </div>
                                                <div className="title-secundario-coordenadas">
                                                    <h4>Fomato Simple</h4>
                                                </div>
                                                <div className="div-ubicacion-valor">
                                                    <div>
                                                        <h4>
                                                            {analisis["longitud_lote"] ? analisis["longitud_lote"] : "No Registra"}
                                                        </h4>
                                                    </div>
                                                    <div>
                                                        <h4>
                                                            {analisis["latitud_lote"] ? analisis["latitud_lote"] : "No Registra"}
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="div-ubicacion">
                                            <div>
                                                <h4 className="tittle-ubicacion">Finca</h4>
                                                <h4 className="value-ubicacion">
                                                    {analisis["finca"] ? analisis["finca"] : "No Registra"}
                                                </h4>
                                            </div>
                                            <div>
                                                <h4 className="tittle-ubicacion">Lote</h4>
                                                <h4 className="value-ubicacion">
                                                    {analisis["lote"] ? analisis["lote"] : "No Registra"}
                                                </h4>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="div-informacion-analisis">
                                        <div className="content-info-analisis">
                                            {console.log(analisis)}
                                            {analisis ?
                                                <div className='div-informacion-general-analisis'>
                                                    <h4 className='title-informacion-general-analisis'>Información sobre el análisis</h4>
                                                    <div className='div-info-asf'>
                                                        <div>
                                                            <h4>
                                                                Fecha de aprobación
                                                            </h4>
                                                            <h3>
                                                                {formatDate(analisis.fecha_finalizacion)}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>
                                                : ""}
                                            <div className="info-analisis info-analisis-fisico">
                                                <div className="div-table-formato-fisico-template">
                                                    <table cellSpacing="0" className="table-formato-fisico-template">
                                                        <thead>
                                                            <tr>
                                                                <th colSpan="999999">
                                                                    <h4 className='h4-title-analisis'>
                                                                        Análisis Físico
                                                                    </h4>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>Peso C.P.S (g)</td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["peso_cps"] ? resultadoFisico["peso_cps"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td>Humedad (%)</td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["humedad"] ? resultadoFisico["humedad"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Peso Cisco (g)</td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["peso_cisco"] ? resultadoFisico["peso_cisco"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td> Merma por trilla (%) </td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["merma_trilla"] ? resultadoFisico["merma_trilla"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Peso total de la almendra (g) </td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["peso_total_almendra"] ? resultadoFisico["peso_total_almendra"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td>Porcentaje de almendra sana (%)</td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["porcentaje_almendra_sana"] ? resultadoFisico["porcentaje_almendra_sana"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Peso defectos totales (g)</td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["peso_defectos_totales"] ? resultadoFisico["peso_defectos_totales"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td>Factor de rendimiento (Kg C.P.S) </td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["factor_rendimiento"] ? resultadoFisico["factor_rendimiento"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Peso de almendra sana (g) </td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["peso_almendra_sana"] ? resultadoFisico["peso_almendra_sana"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td>Porcentaje de defectos totales (%) </td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["porcentaje_defectos_totales"] ? resultadoFisico["porcentaje_defectos_totales"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Negro total o parcial (g)</td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["negro_total"] ? resultadoFisico["negro_total"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td>Cardenillo (g)</td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["cardenillo"] ? resultadoFisico["cardenillo"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Vinagre (g)</td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["vinagre"] ? resultadoFisico["vinagre"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td>Cristalizado (g)</td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["cristalizado"] ? resultadoFisico["cristalizado"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Veteado (g)</td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["veteado"] ? resultadoFisico["veteado"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td>Ámbar o mantequillo (g) </td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["ambar"] ? resultadoFisico["ambar"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Sobresecado (g) </td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["sobresecado"] ? resultadoFisico["sobresecado"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td>Mordido o cortado (g)</td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["mordido"] ? resultadoFisico["mordido"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Picado por insectos (g) </td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["picado_insectos"] ? resultadoFisico["picado_insectos"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td>Averanado o arrugado (g) </td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["averanado"] ? resultadoFisico["averanado"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Inmaduro o paloteado(g) </td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["inmaduro"] ? resultadoFisico["inmaduro"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td>Aplastado (g) </td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["aplastado"] ? resultadoFisico["aplastado"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Flojo (g) </td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["flojo"] ? resultadoFisico["flojo"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td>Decolorado o reposado (g)</td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["decolorado"] ? resultadoFisico["decolorado"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Malla 18 (g) </td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["malla18"] ? resultadoFisico["malla18"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td>Malla 15 (g)</td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["malla15"] ? resultadoFisico["malla15"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Malla 17 (g) </td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["malla17"] ? resultadoFisico["malla17"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td>Malla 14 (g)</td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["malla14"] ? resultadoFisico["malla14"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Malla 16 (g) </td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["malla16"] ? resultadoFisico["malla16"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td> Mallas menores (g) </td>
                                                                <td className="value-table-formato-fisico">{resultadoFisico["mallas_menores"] ? resultadoFisico["mallas_menores"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                        </tbody>

                                                    </table>
                                                </div>
                                            </div>
                                            <div className="info-analisis info-analisis-atributos">
                                                <h4 className='h4-title-analisis title-analisis-normal-atributos'>
                                                    Análisis de Atributos
                                                </h4>
                                                <div className='div-img-atributos'>
                                                    <img id='imgAtributos' src="" alt="" />
                                                </div>
                                            </div>
                                            <div className="info-analisis info-analisis-sensorial">
                                                <h4 className='h4-title-analisis title-analisis-normal'>
                                                    Análisis sensorial
                                                </h4>
                                                <iframe id="iframeFormatoSca" className="iframe-vacio-formato-sca iframe-formato-sca"
                                                    src="/src/formatoSca/formatoScaTemplate.html" frameBorder="0"></iframe>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>



                        {resultadoSensorialPromedio ? Object.keys(resultadoSensorialPromedio).length > 0 ?
                            <div style={{ top: "-9999%", right: "-9999%", zIndex: -9999, position: "absolute", height: "max-content", overflow: "auto", width: "max-content" }} id='divimgAtributos' ref={divRef}>
                                <RadarChart radarBackground={{ fill: 'black' }} height={1000} width={1000}
                                    outerRadius="60%" data={dataAtributos}   >
                                    <PolarGrid stroke='black' />
                                    <PolarAngleAxis dataKey="name" angle={0} textAnchor="middle" tick={{ fill: 'black', fontSize: "40px" }} />
                                    <PolarRadiusAxis angle={90} tickCount={6} domain={[0, 10]} tick={{ fill: 'black', fontSize: "40px" }} />
                                    <Radar isAnimationActive={false} dataKey="x" stroke="green"
                                        fill={parseFloat(analisis.calidad) / 10 <= 7 ? "red" : parseFloat(analisis.calidad) / 10 <= 8 ? "orange" : parseFloat(analisis.calidad) / 10 <= 9 ? "yellow" : parseFloat(analisis.calidad) / 10 <= 10 ? "green" : ""} fillOpacity={0.5} />
                                </RadarChart>
                            </div>
                            : "" : ""}
                    </div>
                    : "" : "" : ""}
        </div>
    )
}