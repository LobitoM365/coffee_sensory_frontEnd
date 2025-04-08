import React, { useEffect, useRef, useState } from 'react';
import { PDFViewer, Document, Page, Text, StyleSheet, View, Image, Font } from '@react-pdf/renderer';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';
import Calibri from '../../src/fonts/calibri-regular.ttf';
import CalibriBold from '../../src/fonts/calibri-bold.ttf';
import html2canvas from 'html2canvas';
import Api from '../componentes/Api';
import { Alert } from '../componentes/alert';

import {
    Radar, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, ReferenceDot
} from 'recharts';

export const GenerateReporteAnalisis = (data) => {
    const { id } = useParams();
    const [analisis, setanalisis] = useState({});
    const [muestra, setmuestra] = useState({});
    const [formatoFisico, setFormatoFisico] = useState({});
    const [resultadoFisico, setResultadoFisico] = useState({});
    const [formatoSensorial, setFormatoSensorial] = useState({});
    const [resultadoSensorial, setResultadoSensorial] = useState({});
    const [resultadoSensorialPromedio, setResultadoSensorialPromedio] = useState({});
    const [statusAlert, setStatusAlert] = useState(false);
    const [dataAlert, setdataAlert] = useState({});
    const [statusReporte, setStatusReporte] = useState(false);
    const [statusPermission, setStatusPermission] = useState(false);
    useEffect(() => {
        if (data.userInfo) {
            if (data.userInfo.rol == "administrador") {
                setStatusPermission(true)
            } else {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "interrogative",
                        description: "Tu rol no está permitido para esta acción.",
                        "tittle": "¿Qué haces aquí?",
                        "buttons": {
                            "ok": {
                                "referencia": "Entiendo",
                                /* "color" : "green", */
                                "continue": {
                                    "location": "/dashboard/analisis/registros"
                                }
                            }
                        },
                    }
                )
            }
        }
    }, [data.userInfo])
    const divRef = useRef(null);
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

    const [imageDataURL, setImageUrl] = useState("");


    useEffect(() => {
        async function getInfo() {

            const response = await Api.post("analisis/buscar/" + id + "");
            if (response.data.status == true) {
                if (response.data.data[0].estado != 7) {
                    setStatusReporte(false)
                    setdataAlert(
                        {
                            "status": "false",
                            "description": "El análisis debe estar finalizado para poder generar el reporte.",
                            "tittle": "Inténtalo más tarde.",
                            "buttons": {
                                "ok": {
                                    "referencia": "ok",
                                    /* "color" : "green", */
                                    "continue": {
                                        "location": "/dashboard/analisis/registros"
                                    }
                                }
                            },
                        }
                    )
                } else if (response.data.data[0].proceso != "certificar") {
                    setStatusReporte(false)
                    setdataAlert(
                        {
                            "status": "false",
                            "description": "El análisis debe ser certificado para poder generar el reporte.",
                            "tittle": "Inténtalo más tarde.",
                            "buttons": {
                                "ok": {
                                    "referencia": "ok",
                                    /* "color" : "green", */
                                    "continue": {
                                        "location": "/dashboard/analisis/registros"
                                    }
                                }
                            },
                        }
                    )
                } else {
                    setStatusReporte(true)
                    const filterMuestra = {
                        "filter": {
                            "where": {
                                "an.id": {
                                    "require": "and",
                                    "value": response.data.data[0].id
                                }
                            }
                        }
                    }
                    const muestra = await Api.post("muestra/buscar/" + response.data.data[0]["muestras_id"] + "", filterMuestra);
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
                            },
                            "limit": {
                                "inicio": false,
                                "fin": false
                            }
                        },
                    }
                    const formatoFisico = await Api.post("formatos/buscar/not", filterFormatoFisico);

                    if (formatoFisico.data.status == true) {
                        const filterResultado = {
                            "filter": {
                                "where": {
                                    "an.id": {
                                        "value": id,
                                        "require": "and",
                                    },
                                    "forma.estado": {
                                        "value": "5",
                                        "operador": "=",
                                        "required": "and",
                                        "group": 4
                                    },
                                    "estado1": {
                                        "value": "4",
                                        "require": "or",
                                        "operador": "=",
                                        "no-key": "forma.estado",
                                        "group": 4
                                    },
                                    "forma.tipos_analisis_id": {
                                        "value": 1,
                                        "require": "and",
                                        "group": 1
                                    }
                                },
                                "limit": {
                                    "inicio": false,
                                    "fin": false
                                }
                            }
                        }
                        setFormatoFisico(formatoFisico.data.data)
                        const resultado = await Api.post("resultado/buscar/not", filterResultado);
                        if (resultado.data.status == true) {
                            const promedioResultadoFisico = {}
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
                                }else{
                                    promedioResultadoFisico[keys[x]] = 0
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
                            },
                            "limit": {
                                "inicio": false,
                                "fin": false
                            }
                        },
                    }
                    const formatoSensorial = await Api.post("formatos/buscar/not", filterFormatoSensorial);

                    if (formatoSensorial.data.status == true) {

                        setFormatoSensorial(formatoSensorial.data.data)
                        const filterResultado = {
                            "filter": {
                                "where": {
                                    "an.id": {
                                        "value": id,
                                        "require": "and",
                                    },
                                    "forma.estado": {
                                        "value": "5",
                                        "operador": "=",
                                        "required": "and",
                                        "group": 4
                                    },
                                    "estado1": {
                                        "value": "4",
                                        "require": "or",
                                        "operador": "=",
                                        "no-key": "forma.estado",
                                        "group": 4
                                    },
                                    "forma.tipos_analisis_id": {
                                        "value": 2,
                                        "require": "and",
                                        "group": 1
                                    }
                                },
                                "limit": {
                                    "inicio": false,
                                    "fin": false
                                }
                            }
                        }
                        const resultado = await Api.post("resultado/buscar/not", filterResultado);
                        if (resultado.data.status == true) {

                            const promedio = {};
                            const variablesPromedio = ["fragancia_aroma", "sabor", "sabor_residual", "acidez", "cuerpo", "uniformidad", "balance", "taza_limpia", "dulzor", "puntaje_catador"]
                            for (let x = 0; x < resultado.data.data.length; x++) {
                                for (let r = 0; r < variablesPromedio.length; r++) {
                                    const variable = resultado.data.data[x][variablesPromedio[r]]
                                    if (variable) {
                                        if (!promedio[variablesPromedio[r]]) {
                                            promedio[variablesPromedio[r]] = 0
                                        }
                                        promedio[variablesPromedio[r]] = promedio[variablesPromedio[r]] + variable
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

                    setanalisis(response.data.data[0])
                }

            } else if (response.data.find_error) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "interrogative",
                        description: response.data.find_error,
                        "tittle": "¿Qué haces aquí?",
                        continue: {

                            location: "/dashboard"
                        }
                    }
                )

            } else {
            }
        }
        if (statusPermission) {
            getInfo()
        }
    }, [statusPermission])



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
                    setImageUrl(canvas.toDataURL("image/png"));
                    if (document.getElementById("divimgAtributos")) {
                        document.getElementById("divimgAtributos").remove()
                    }
                });
            }
        }
    };

    useEffect(() => {

        capturarDivComoImagen()

    }, [analisis])
    const fechaActual = new Date();
    Font.register(
        { family: 'Calibri', src: Calibri },
    );
    Font.register(
        { family: "CalibriBold", src: CalibriBold }
    );

    const formatDate = (data) => {

        let date = new Date(data);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        return `${day < 10 ? '0' + day : day} / ${month < 10 ? '0' + month : month} / ${year} `
    }
    useEffect(() => {


    }, [])
    const estyle = StyleSheet.create({
        sectionFive: {
            marginTop: "130px"
        },
        sectionFour: {
            marginTop: "160px"
        },
        sectionTree: {
            marginTop: "57px"
        },
        contentFirma: {
            height: "40px"
        },
        divMainContentFirmas: {
            display: "flex",
            gap: "30px"
        },
        contenFirmas: {
            flexDirection: "row",
            display: "flex",
            gap: "10px",
        },
        divTextFirma: {
            border: "1px solid black",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            flexDirection: "column",
            width: "100%",
        },

        /*    divTextFirmaFirst: {
               border: "1px solid black",
               width: "100%",
               justifyContent: "center",
               alignItems: "center",
               textAlign: "center",
           }, */
        viweFirmas: {
            /*  flexDirection: "row", */
            width: "100%",
            /*    justifyContent: "center", */
            alignItems: "center",
            textAlign: "center",
            display: "flex",
            gap: "20px",
            /* flexWrap: "wrap" */
        },
        textFirma: {
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            width: "130px",
            fontSize: "9px"
        },
        imgAtributos: {
            width: "65%"
        },
        bodyFormtoSensorialAtributos: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        atributosSensorial: {
            borderWidth: 1,
            borderColor: "black",
            width: "100%"
        },
        headerFormtoSensorialAtributos: {
            borderTopWidth: 0,
        },
        notasFormatoSensorial: {
            textAlign: "justify",
            padding: "0px 7px"
        },
        textBold: {
            fontFamily: "CalibriBold",
        },
        tableCellStyleFormatoSensorial: {
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        },
        tableHeaderFormatoSensorial: {
            width: "60px",
            textAlign: "center",
            margin: 0,
            padding: 0,
            fontFamily: "CalibriBold",
        },
        tableHeaderStyleFormatoSensorial: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textOverflow: "ellipsis",
            padding: 0,
            margin: 0,
            display: "block",
            height: "32.5px",
            fontSize: "2px"
        },
        divTableBodyFormatoSensorial: {
            height: "100%",
            position: "relative",
        },
        colFormatoSensorial: {
            marginTop: 0,
            marginBottom: 0,
            paddingTop: "2px",
            paddingBottom: "2px",

        },
        bodytableColStyleHeightAll: {
            height: "255.3px"
        },
        firstTableHeaderStyle: {
            borderWidth: 1,
            borderColor: "black"
        },
        tableHeaderStyle: {
            borderWidth: 1,
            borderColor: "black",
            borderLeftWidth: 0
        },
        bodyFormtoSensorial: {
            borderColor: "black",
            borderBottomWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            padding: "20px 55px 20px 55px",
            flexDirection: "row",
            position: "relative",
            height: "auto",
        },
        divList: {
            display: "flex",
            flexDirection: "row",
            position: "relative",
            gap: "4px",
            alignItems: "center"
        },
        puntoList: {
            fontSize: 10,
            backgroundColor: "black",
            height: "4px",
            width: "4px",
            borderRadius: "100%"
        },
        page: {
            width: "100%",
            height: "100%",
            padding: "40px 40px",
            fontSize: "15px",
            fontFamily: "Calibri"
        },
        tittleLight: {
            fontFamily: "Calibri"
        },
        container: {
            paddingBottom: "40px"
        },
        header: {
            flexDirection: "row",
            borderStyle: "solid",
            borderColor: "#000",
            borderWidth: 1,
        },
        divHader: {
            display: "table",
            width: "auto"
        },
        itemHeader: {
            width: "18%",
        },
        itemHeaderRight: {
            width: "24%",
        },
        itemHeaderCenter: {
            width: "58%",
        },
        img: {
            width: "47px"
        },
        contentHeader: {
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            padding: 0,
            margin: 0,
            textOverflow: "ellipsis"
        },
        divheader: {
            height: "105px",
        },
        text: {
            textOverflow: "ellipsis",
            fontSize: "13px",
            textAlign: "center"
        },
        contentItemHeaderRight: {
            textAlign: "left",
            height: "100%",
            display: "flex",
            width: "100%",
            alignItems: "center",
            flexDirection: "row",
            gap: "10px"
        },
        numberPagina: {
            fontSize: "10px",
            fontFamily: "CalibriBold",

        },
        contentItemHeaderRightTop: {
            borderBottom: "1px solid black"

        },
        textItemHeaderRight: {
            textAlign: "left",
            left: "10px",
        },
        borderLeftItemHeader: {
            borderStyle: "solid",
            borderBottomWidth: 1
        },
        borderRightItemHeader: {
            borderStyle: "solid",
            borderBottomWidth: 1
        },
        borderCenterTopHeader: {
            borderStyle: "solid",
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderBottomWidth: 1
        },
        borderCenterBottomHeader: {
            borderStyle: "solid",
            borderLeftWidth: 1,
            borderRightWidth: 1
        },
        imgSennova: {
            width: "70%"
        },
        containerBody: {
            margin: "0px 30px 30px 30px",
        },
        footer: {
            position: "absolute",
            bottom: 0,
            right: "0",
            margin: "15px 30px"
        },
        textBody: {
            marginBottom: "160px"
        },
        firstTableColHeaderStyle: {
            borderStyle: "solid",
            borderColor: "#000",
            borderBottomColor: "#000",
            borderWidth: 1,
            backgroundColor: "#bdbdbd"
        },
        tableColHeaderStyle: {
            borderStyle: "solid",
            borderColor: "#000",
            borderBottomColor: "#000",
            borderWidth: 1,
            borderLeftWidth: 0,
            backgroundColor: "#bdbdbd"
        },
        tableCellHeaderStyle: {
            margin: 4,
            fontSize: 12,
            fontWeight: "bold"
        },
        tableRowStyle: {
            flexDirection: "row"
        },
        colTable: {
            width: "100%",
        },
        firstTableColStyle: {
            borderStyle: "solid",
            borderColor: "#000",
            borderWidth: 1,
            borderTopWidth: 0,
            padding: "5px",
            textOverflow: "ellipsis",
        },
        tableColStyle: {
            borderStyle: "solid",
            borderColor: "#000",
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopWidth: 0
        },
        tableBody: {
            fontSize: "10px",
            width: "100%",
            display: "table",
            flexDirection: "row"
        },
        tableCellStyle: {
            margin: 3,
            fontSize: 10,
            textOverflow: "hidden",
            textOverflow: "ellipsis"
        },
        cleanMessage: {
            textAlign: "center"
        },
        tittleItem: {
            fontFamily: "CalibriBold",
            fontWeight: "bold",
            fontSize: "12.5px",
            display: "flex",
            flexDirection: "row",
            gap: "7px"
        },
        body: {
            padding: "0px 20px",
            gap: "25px",
            fontSize: "12.1px"
        },
        itemBody: {
            display: "flex",
            gap: "10px"
        },
        tittleList: {
            fontFamily: "CalibriBold",
            fontWeight: "bold",
        },
        firstTableColStyleTop: {
            borderTopWidth: 1
        },
        tableCellAuto: {
            width: "50%"
        },
        sectionTwo: {
            paddingTop: "20px"
        },
        tableRowAllSize: {
            textAlign: "center"
        },
        tableTittleFisico: {
            backgroundColor: "rgb(198,224,180)"
        },
        headerFormtoSensorial: {
            padding: 3,
            backgroundColor: "rgb(198,224,180)",
            borderWidth: 1,
            borderColor: "black",
            textAlign: "center"
        },
        marginTopSeparate: {
            paddingTop: '80px',
            margin: 0
        },
    });


    return (
        <>{statusReporte && statusPermission ?
            <div style={{ position: "absolute", overflow: "hidden", margin: 0, padding: 0 }}>
                {Object.keys(analisis).length > 0 ?

                    <div style={{ position: "absolute", overflow: "hidden" }}>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "fixed", width: " 100%", height: "100%", zIndex: "999", background: "white" }} id='loadPdf'>
                            Generando PDF
                        </div>
                        <div style={{ height: "max-content", overflow: "auto", width: "max-content" }} id='divimgAtributos' ref={divRef}>
                            <RadarChart radarBackground={{ fill: 'black' }} height={1000} width={1000}
                                outerRadius="60%" data={dataAtributos}   >
                                <PolarGrid stroke='black' />
                                <PolarAngleAxis dataKey="name" angle={0} textAnchor="middle" tick={{ fill: 'black', fontSize: "40px" }} />
                                <PolarRadiusAxis angle={90} tickCount={6} domain={[0, 10]} tick={{ fill: 'black', fontSize: "40px" }} />
                                <Radar isAnimationActive={false} dataKey="x" stroke="green"
                                    fill={parseFloat(analisis.calidad) / 10 <= 7 ? "red" : parseFloat(analisis.calidad) / 10 <= 8 ? "orange" : parseFloat(analisis.calidad) / 10 <= 9 ? "yellow" : parseFloat(analisis.calidad) / 10 <= 10 ? "green" : ""} fillOpacity={0.5} />
                            </RadarChart>
                        </div>

                        {imageDataURL != "" ?
                            <PDFViewer style={{ width: "100%", height: "100%", position: "fixed" }}>
                                <Document onRender={document.getElementById("loadPdf") ? document.getElementById("loadPdf").remove() : ""}>
                                    <Page
                                        style={estyle.page}
                                        size="Letter"
                                    >
                                        <View style={[estyle.container, estyle.encabezado]} fixed>
                                            <View style={estyle.divHader} >
                                                <View style={estyle.header}>
                                                    <View style={[estyle.itemHeader, estyle.divheader]}>
                                                        <View style={[estyle.contentHeader, estyle.borderLeftItemHeader]}>
                                                            <Image style={estyle.img} src={"/public/img/logoSena.png"} />
                                                        </View>
                                                        <View style={estyle.contentHeader}>
                                                            <Image style={estyle.img} src={"/public/img/logoCompletoENCC.png"} />
                                                        </View>
                                                    </View >

                                                    <View style={[estyle.itemHeaderCenter, estyle.divheader]}>
                                                        <View style={[estyle.contentHeader, estyle.borderCenterTopHeader]}>
                                                            <Text style={[estyle.text]}>Centro de Gestión y Desarrollo Sostenible  {'\n'}
                                                                Surcolombiano  {'\n'}
                                                                Escuela Nacional de la Calidad del Café
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.contentHeader, estyle.borderCenterBottomHeader]}>
                                                            <Text style={estyle.text}>INFORME SERVICIO ANALISIS FISICO SENSORIAL</Text>
                                                        </View>
                                                    </View>

                                                    <View style={[estyle.itemHeaderRight, estyle.divheader]}>
                                                        <View style={[estyle.contentHeader, estyle.borderRightItemHeader]}>
                                                            <Image style={estyle.imgSennova} src={"/public/img/sennovaLogo.png"} />
                                                        </View>
                                                        <View style={estyle.contentHeader}>
                                                            <View style={[estyle.contentItemHeaderRight, estyle.contentItemHeaderRightTop]}>
                                                                <Text style={[estyle.text, estyle.textItemHeaderRight]}>Fecha: {((fechaActual.getDate() + 1) < 10 ? ("0" + (fechaActual.getDate())) : (fechaActual.getDate()) + '-' + ((fechaActual.getMonth() + 1) < 10 ? ("0" + (fechaActual.getMonth() + 1)) : (fechaActual.getMonth() + 1)) + "-" + fechaActual.getFullYear())}</Text>
                                                            </View>
                                                            <View style={estyle.contentItemHeaderRight}>
                                                                <Text style={[estyle.text, estyle.textItemHeaderRight]}>Página: </Text>
                                                                <Text style={estyle.numberPagina} render={({ pageNumber, totalPages }) => (
                                                                    `${pageNumber} de ${totalPages}`
                                                                )}></Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={estyle.body}>
                                            <View style={estyle.itemBody}>
                                                <View style={estyle.tittleItem}> <Text>1.</Text> <Text>Objetivo</Text></View>
                                                <Text>El objetivo del siguiente informe es presentar los resultados del análisis físico-sensorial obtenidos para la muestra de café {analisis["codigo_muestra"] ? analisis["codigo_muestra"].toString()/* .replace(/(?:^|\s)\S/g, match => match.toUpperCase()) */ : "No registra"} descrita a continuación.
                                                </Text>
                                            </View>
                                            <View style={estyle.itemBody}>
                                                <View style={estyle.tittleItem}> <Text>2.</Text> <Text>Información General</Text></View>
                                                <View>
                                                    <View style={estyle.divList}>
                                                        <View style={estyle.puntoList}></View>
                                                        <Text style={estyle.tittleList}>
                                                            Productor:
                                                        </Text>
                                                        <Text style={estyle.tittleLight}>
                                                            {analisis["nombre_propietario"] ? analisis["nombre_propietario"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                        </Text>
                                                    </View>
                                                    <View style={estyle.divList}>
                                                        <View style={estyle.puntoList}></View>
                                                        <Text style={estyle.tittleList}>
                                                            Departamento:
                                                        </Text>
                                                        <Text style={estyle.tittleLight}>
                                                            {analisis["departamento"] ? analisis["departamento"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                        </Text>
                                                    </View>
                                                    <View style={estyle.divList}>
                                                        <View style={estyle.puntoList}></View>
                                                        <Text style={estyle.tittleList}>
                                                            Municipio:<Text style={estyle.tittleLight}>
                                                                {analisis["municipio"] ? analisis["municipio"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </Text>
                                                    </View>
                                                    <View style={estyle.divList}>
                                                        <View style={estyle.puntoList}></View>
                                                        <Text style={estyle.tittleList}>
                                                            Vereda:
                                                        </Text>
                                                        <Text style={estyle.tittleLight}>
                                                            {analisis["vereda"] ? analisis["vereda"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                        </Text>
                                                    </View>
                                                    <View style={estyle.divList}>
                                                        <View style={estyle.puntoList}></View>
                                                        <Text style={estyle.tittleList}>
                                                            Finca:
                                                        </Text>
                                                        <Text style={estyle.tittleLight}>
                                                            {analisis["finca"] ? analisis["finca"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                        </Text>
                                                    </View>
                                                    <View style={estyle.divList}>
                                                        <View style={estyle.puntoList}></View>
                                                        <Text style={estyle.tittleList}>
                                                            lote:
                                                        </Text>
                                                        <Text style={estyle.tittleLight}>
                                                            {analisis["lote"] ? analisis["lote"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                        </Text>
                                                        <Text>
                                                            (latitud: {analisis["latitud_lote"] ? analisis["latitud_lote"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : ""}, longitud: {analisis["longitud_lote"] ? analisis["longitud_lote"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : ""})
                                                        </Text>
                                                    </View>
                                                    <View style={estyle.divList}>
                                                        <View style={estyle.puntoList}></View>
                                                        <Text style={estyle.tittleList}>
                                                            Código Externo:
                                                        </Text>
                                                        <Text style={estyle.tittleLight}>
                                                            {analisis["codigo_externo"] ? analisis["codigo_externo"].toString()/* .replace(/(?:^|\s)\S/g, match => match.toUpperCase()) */ : "No registra"}
                                                        </Text>
                                                    </View>

                                                    <View style={estyle.divList}>
                                                        <View style={estyle.puntoList}></View>
                                                        <Text style={estyle.tittleList}>
                                                            Consecutivo Informe:
                                                        </Text>
                                                        <Text style={estyle.tittleLight}>
                                                            {analisis["consecutivo_informe"] ? analisis["consecutivo_informe"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={estyle.itemBody}>
                                                <View style={estyle.tittleItem}> <Text>3.</Text> <Text>Especificaciones del café</Text></View>
                                                <View style={estyle.divTableBody}>
                                                    <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                        <View style={[estyle.firstTableColStyleTop, estyle.firstTableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Variedad De Café
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.firstTableColStyleTop, estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {muestra["variedad"] ? muestra["variedad"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.firstTableColStyleTop, estyle.tableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Método De Muestreo
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.firstTableColStyleTop, estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                No especifica
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                        <View style={[estyle.firstTableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Altura Del Cultivo (m.s.n.m)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                1530
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Método Para La Preparación De
                                                                La Muestra

                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                No especifica
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={estyle.itemBody}>
                                                <View style={estyle.tittleItem}> <Text>4.</Text> <Text>Datos generales del café</Text></View>
                                                <View style={estyle.divTableBody}>
                                                    <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                        <View style={[estyle.firstTableColStyleTop, estyle.firstTableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Código de la Muestra
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.firstTableColStyleTop, estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {muestra["codigo_muestra"] ? muestra["codigo_muestra"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.firstTableColStyleTop, estyle.tableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Presentación
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.firstTableColStyleTop, estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {muestra["presentacion"] ? muestra["presentacion"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                        <View style={[estyle.firstTableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Tipo De Fermentación
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {muestra["tipo_fermentacion"] ? muestra["tipo_fermentacion"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Tiempo De Fermentación
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {muestra["tiempo_fermentacion"] ? muestra["tiempo_fermentacion"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    {/* <View style={[estyle.tableRowStyle, estyle.tableBody]}> */}
                                                    {/* <View style={[estyle.firstTableColStyle, estyle.colTable]}> */}
                                                    {/* <Text style={estyle.tableCellStyle}> */}
                                                    {/* Densidad De Café Verde (g/L) */}
                                                    {/* </Text> */}
                                                    {/* </View> */}
                                                    {/* <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}> */}
                                                    {/* <Text style={[estyle.tableCellStyle]}> */}
                                                    {/* {muestra["densidad_cafe_verde"] ? muestra["densidad_cafe_verde"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"} */}
                                                    {/* </Text> */}
                                                    {/* </View> */}
                                                    {/* <View style={[estyle.tableColStyle, estyle.colTable]}> */}
                                                    {/* <Text style={estyle.tableCellStyle}> */}
                                                    {/* Actividad De Agua (Aw) */}
                                                    {/* </Text> */}
                                                    {/* </View> */}
                                                    {/* <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}> */}
                                                    {/* <Text style={[estyle.tableCellStyle]}> */}
                                                    {/* {muestra["actividad_agua"] ? muestra["actividad_agua"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"} */}
                                                    {/* </Text> */}
                                                    {/* </View> */}
                                                    {/* </View> */}
                                                    <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                        <View style={[estyle.firstTableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Fecha De Procesamiento
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {muestra["fecha_procesamiento"] ? muestra["fecha_procesamiento"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Tiempo De Secado
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {muestra["tiempo_secado"] ? muestra["tiempo_secado"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    {/* <View style={[estyle.tableRowStyle, estyle.tableBody]}> */}
                                                    {/* <View style={[estyle.firstTableColStyle, estyle.colTable]}> */}
                                                    {/* <Text style={estyle.tableCellStyle}> */}
                                                    {/* Tipo De Tostión */}
                                                    {/* </Text> */}
                                                    {/* </View> */}
                                                    {/* <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}> */}
                                                    {/* <Text style={[estyle.tableCellStyle]}> */}
                                                    {/* {muestra["tipo_tostion"] ? muestra["tipo_tostion"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"} */}
                                                    {/* </Text> */}
                                                    {/* </View> */}
                                                    {/* <View style={[estyle.tableColStyle, estyle.colTable]}> */}
                                                    {/* <Text style={estyle.tableCellStyle}> */}
                                                    {/* Tipo De Molienda */}

                                                    {/* </Text> */}
                                                    {/* </View> */}
                                                    {/* <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}> */}
                                                    {/* <Text style={[estyle.tableCellStyle]}> */}
                                                    {/* {muestra["tipo_molienda"] ? muestra["tipo_molienda"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"} */}
                                                    {/* </Text> */}
                                                    {/* </View> */}
                                                    {/* </View> */}
                                                </View>
                                            </View>
                                        </View>

                                        <View style={[estyle.body, estyle.sectionTwo, estyle.marginTopSeparate]}>
                                            <View style={estyle.itemBody}>
                                                <View style={estyle.tittleItem}> <Text>5.</Text> <Text>Análisis Físico</Text></View>
                                                <View style={estyle.divTableBody}>
                                                    <View style={[estyle.tableRowStyle, estyle.tableBody, estyle.tableRowAllSize, estyle.tableTittleFisico]}>
                                                        <View style={[estyle.firstTableColStyleTop, estyle.firstTableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                ANÁLISIS FÍSICO
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                        <View style={[estyle.firstTableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Peso C.P.S (g)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["peso_cps"] != undefined ? resultadoFisico["peso_cps"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Humedad (%)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["humedad"] != undefined ? resultadoFisico["humedad"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                        <View style={[estyle.firstTableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Peso Cisco (g)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["peso_cisco"] != undefined ? resultadoFisico["peso_cisco"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Merma por trilla (%)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["merma_trilla"] != undefined ? resultadoFisico["merma_trilla"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                        <View style={[estyle.firstTableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Peso total de la almendra (g)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["peso_total_almendra"] != undefined ? resultadoFisico["peso_total_almendra"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Porcentaje de almendra sana (%)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["porcentaje_almendra_sana"] != undefined ? resultadoFisico["porcentaje_almendra_sana"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                        <View style={[estyle.firstTableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Peso defectos totales (g)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["peso_defectos_totales"] != undefined ? resultadoFisico["peso_defectos_totales"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Factor de rendimiento (Kg C.P.S)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["factor_rendimiento"] != undefined ? resultadoFisico["factor_rendimiento"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                        <View style={[estyle.firstTableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Peso de almendra sana (g)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["peso_almendra_sana"] != undefined ? resultadoFisico["peso_almendra_sana"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Porcentaje de defectos totales (%)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["porcentaje_defectos_totales"] != undefined ? resultadoFisico["porcentaje_defectos_totales"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                        <View style={[estyle.firstTableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Negro total o parcial (g)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["negro_total"] != undefined ? resultadoFisico["negro_total"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Cardenillo (g)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["cardenillo"] != undefined ? resultadoFisico["cardenillo"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                        <View style={[estyle.firstTableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Vinagre (g)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["vinagre"] != undefined ? resultadoFisico["vinagre"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Cristalizado (g)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["cristalizado"] != undefined ? resultadoFisico["cristalizado"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                        <View style={[estyle.firstTableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Veteado (g)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["veteado"] != undefined ? resultadoFisico["veteado"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Ámbar o mantequillo (g)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["ambar"] != undefined ? resultadoFisico["ambar"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                        <View style={[estyle.firstTableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Sobresecado (g)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["sobresecado"] != undefined ? resultadoFisico["sobresecado"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Mordido o cortado (g)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["mordido"] != undefined ? resultadoFisico["mordido"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                        <View style={[estyle.firstTableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Picado por insectos (g)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["picado_insectos"] != undefined ? resultadoFisico["picado_insectos"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Averanado o arrugado (g)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["averanado"] != undefined ? resultadoFisico["averanado"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                        <View style={[estyle.firstTableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Inmaduro o paloteado(g)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["inmaduro"] != undefined ? resultadoFisico["inmaduro"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Aplastado (g)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["aplastado"] != undefined ? resultadoFisico["aplastado"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                        <View style={[estyle.firstTableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Flojo (g)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["flojo"] != undefined ? resultadoFisico["flojo"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Decolorado o reposado (g)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["decolorado"] != undefined ? resultadoFisico["decolorado"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                        <View style={[estyle.firstTableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Malla 18 (g)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["malla18"] != undefined ? resultadoFisico["malla18"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Malla 15 (g)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["malla15"] != undefined ? resultadoFisico["malla15"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                        <View style={[estyle.firstTableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Malla 17 (g)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["malla17"] != undefined ? resultadoFisico["malla17"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Malla 14 (g)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["malla14"] != undefined ? resultadoFisico["malla14"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                        <View style={[estyle.firstTableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Malla 16 (g)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["malla16"] != undefined ? resultadoFisico["malla16"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable]}>
                                                            <Text style={estyle.tableCellStyle}>
                                                                Mallas menores (g)
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.tableColStyle, estyle.colTable, estyle.tableCellAuto]}>
                                                            <Text style={[estyle.tableCellStyle]}>
                                                                {resultadoFisico["mallas_menores"] != undefined ? resultadoFisico["mallas_menores"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={[estyle.body, estyle.sectionTree]}>
                                            <View style={estyle.tittleItem}> <Text>6.</Text> <Text>Resultados</Text></View>
                                            <View>
                                                <View >
                                                    <View style={[estyle.headerFormtoSensorial]}>
                                                        <Text style={estyle.textBold}>Datos Generales de la Muestra</Text>
                                                    </View>
                                                    <View style={[estyle.bodyFormtoSensorial]}>
                                                        <View>
                                                            <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                                <View style={[estyle.firstTableHeaderStyle, estyle.colTable, estyle.tableHeaderStyleFormatoSensorial]}>
                                                                    <Text style={[estyle.tableCellStyle, estyle.tableHeaderFormatoSensorial]}>
                                                                        ATRIBUTO
                                                                    </Text>
                                                                </View>
                                                                <View style={[estyle.tableHeaderStyle, estyle.colTable, estyle.tableHeaderStyleFormatoSensorial]}>
                                                                    <Text style={[estyle.tableCellStyle, estyle.tableHeaderFormatoSensorial]}>
                                                                        PUNTAJE
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                                <View style={[estyle.firstTableColStyle, estyle.colTable, estyle.colFormatoSensorial]}>
                                                                    <Text style={[estyle.tableCellStyle, estyle.textBold]}>
                                                                        Fragancia aroma
                                                                    </Text>
                                                                </View>
                                                                <View style={[estyle.tableColStyle, estyle.colTable, estyle.colFormatoSensorial, estyle.tableCellStyleFormatoSensorial]}>
                                                                    <Text style={[estyle.tableCellStyle]}>
                                                                        {resultadoSensorialPromedio["fragancia_aroma"] != undefined ? resultadoSensorialPromedio["fragancia_aroma"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                                <View style={[estyle.firstTableColStyle, estyle.colTable, estyle.colFormatoSensorial]}>
                                                                    <Text style={[estyle.tableCellStyle, estyle.textBold]}>
                                                                        Sabor
                                                                    </Text>
                                                                </View>
                                                                <View style={[estyle.tableColStyle, estyle.colTable, estyle.colFormatoSensorial, estyle.tableCellStyleFormatoSensorial]}>
                                                                    <Text style={[estyle.tableCellStyle]}>
                                                                        {resultadoSensorialPromedio["sabor"] != undefined ? resultadoSensorialPromedio["sabor"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                                <View style={[estyle.firstTableColStyle, estyle.colTable, estyle.colFormatoSensorial]}>
                                                                    <Text style={[estyle.tableCellStyle, estyle.textBold]}>
                                                                        Retrogusto
                                                                    </Text>
                                                                </View>
                                                                <View style={[estyle.tableColStyle, estyle.colTable, estyle.colFormatoSensorial, estyle.tableCellStyleFormatoSensorial]}>
                                                                    <Text style={[estyle.tableCellStyle]}>
                                                                        {resultadoSensorialPromedio["sabor_residual"] != undefined ? resultadoSensorialPromedio["sabor_residual"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                                <View style={[estyle.firstTableColStyle, estyle.colTable, estyle.colFormatoSensorial]}>
                                                                    <Text style={[estyle.tableCellStyle, estyle.textBold]}>
                                                                        Acidez
                                                                    </Text>
                                                                </View>
                                                                <View style={[estyle.tableColStyle, estyle.colTable, estyle.colFormatoSensorial, estyle.tableCellStyleFormatoSensorial]}>
                                                                    <Text style={[estyle.tableCellStyle]}>
                                                                        {resultadoSensorialPromedio["acidez"] != undefined ? resultadoSensorialPromedio["acidez"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                                <View style={[estyle.firstTableColStyle, estyle.colTable, estyle.colFormatoSensorial]}>
                                                                    <Text style={[estyle.tableCellStyle, estyle.textBold]}>
                                                                        Cuerpo
                                                                    </Text>
                                                                </View>
                                                                <View style={[estyle.tableColStyle, estyle.colTable, estyle.colFormatoSensorial, estyle.tableCellStyleFormatoSensorial]}>
                                                                    <Text style={[estyle.tableCellStyle]}>
                                                                        {resultadoSensorialPromedio["cuerpo"] != undefined ? resultadoSensorialPromedio["cuerpo"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                                <View style={[estyle.firstTableColStyle, estyle.colTable, estyle.colFormatoSensorial]}>
                                                                    <Text style={[estyle.tableCellStyle, estyle.textBold]}>
                                                                        Uniformidad
                                                                    </Text>
                                                                </View>
                                                                <View style={[estyle.tableColStyle, estyle.colTable, estyle.colFormatoSensorial, estyle.tableCellStyleFormatoSensorial]}>
                                                                    <Text style={[estyle.tableCellStyle]}>
                                                                        {resultadoSensorialPromedio["uniformidad"] != undefined ? resultadoSensorialPromedio["uniformidad"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                                <View style={[estyle.firstTableColStyle, estyle.colTable, estyle.colFormatoSensorial]}>
                                                                    <Text style={[estyle.tableCellStyle, estyle.textBold]}>
                                                                        Balance
                                                                    </Text>
                                                                </View>
                                                                <View style={[estyle.tableColStyle, estyle.colTable, estyle.colFormatoSensorial, estyle.tableCellStyleFormatoSensorial]}>
                                                                    <Text style={[estyle.tableCellStyle]}>
                                                                        {resultadoSensorialPromedio["balance"] != undefined ? resultadoSensorialPromedio["balance"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                                <View style={[estyle.firstTableColStyle, estyle.colTable, estyle.colFormatoSensorial]}>
                                                                    <Text style={[estyle.tableCellStyle, estyle.textBold]}>
                                                                        Taza limpia
                                                                    </Text>
                                                                </View>
                                                                <View style={[estyle.tableColStyle, estyle.colTable, estyle.colFormatoSensorial, estyle.tableCellStyleFormatoSensorial]}>
                                                                    <Text style={[estyle.tableCellStyle]}>
                                                                        {resultadoSensorialPromedio["taza_limpia"] != undefined ? resultadoSensorialPromedio["taza_limpia"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                                <View style={[estyle.firstTableColStyle, estyle.colTable, estyle.colFormatoSensorial]}>
                                                                    <Text style={[estyle.tableCellStyle, estyle.textBold]}>
                                                                        Dulzor
                                                                    </Text>
                                                                </View>
                                                                <View style={[estyle.tableColStyle, estyle.colTable, estyle.colFormatoSensorial, estyle.tableCellStyleFormatoSensorial]}>
                                                                    <Text style={[estyle.tableCellStyle]}>
                                                                        {resultadoSensorialPromedio["dulzor"] != undefined ? resultadoSensorialPromedio["dulzor"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                                <View style={[estyle.firstTableColStyle, estyle.colTable, estyle.colFormatoSensorial]}>
                                                                    <Text style={[estyle.tableCellStyle, estyle.textBold]}>
                                                                        Puntaje general
                                                                    </Text>
                                                                </View>
                                                                <View style={[estyle.tableColStyle, estyle.colTable, estyle.colFormatoSensorial, estyle.tableCellStyleFormatoSensorial]}>
                                                                    <Text style={[estyle.tableCellStyle]}>
                                                                        {resultadoSensorialPromedio["puntaje_catador"] != undefined ? resultadoSensorialPromedio["puntaje_catador"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                                <View style={[estyle.firstTableColStyle, estyle.colTable, estyle.colFormatoSensorial]}>
                                                                    <Text style={[estyle.tableCellStyle, estyle.textBold]}>
                                                                        Puntaje total
                                                                    </Text>
                                                                </View>
                                                                <View style={[estyle.tableColStyle, estyle.colTable, estyle.colFormatoSensorial, estyle.tableCellStyleFormatoSensorial]}>
                                                                    <Text style={[estyle.tableCellStyle]}>
                                                                        {analisis["calidad"] ? analisis["calidad"].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No registra"}
                                                                    </Text>
                                                                </View>
                                                            </View>

                                                        </View>
                                                        <View style={[estyle.divTableBodyFormatoSensorial]}>
                                                            <View style={[estyle.tableRowStyle, estyle.tableBody]}>
                                                                <View style={[estyle.tableHeaderStyle, estyle.colTable, estyle.tableHeaderStyleFormatoSensorial]}>
                                                                    <Text style={[estyle.tableCellStyle, estyle.tableHeaderFormatoSensorial]}>
                                                                        DESCRIPCION SENSORIAL
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            <View style={[estyle.bodytableColStyleHeightAll, estyle.tableRowStyle, estyle.tableBody]}>
                                                                <View style={[estyle.tableColStyleHeightAll, estyle.tableColStyle, estyle.colTable]}>

                                                                    {
                                                                        formatoSensorial ? formatoSensorial.length > 0 ? (
                                                                            (() => {
                                                                                let count = 0;
                                                                                return formatoSensorial.map((value, index) => {
                                                                                    if (value["notas"]) {
                                                                                        count = count + 1
                                                                                        return <Text style={[estyle.tableCellStyle, estyle.notasFormatoSensorial]} key={index}>{count}) {value["notas"]}</Text>;
                                                                                    }
                                                                                });
                                                                            })()
                                                                        ) : "No registra" : "No registra"
                                                                    }
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>

                                            </View>

                                        </View>
                                        <View style={[estyle.body, estyle.sectionFour]}>
                                            <View style={estyle.tittleItem}> <Text>7.</Text> <Text>Análisis de Atributos</Text></View>
                                            <View>
                                                <View style={[estyle.headerFormtoSensorial, estyle.headerFormtoSensorialAtributos]}>
                                                    <Text style={estyle.textBold}>Análisis de atributos</Text>
                                                </View>
                                                <View style={[estyle.bodyFormtoSensorial, estyle.bodyFormtoSensorialAtributos]}>
                                                    <View style={[estyle.atributosSensorial, estyle.bodyFormtoSensorialAtributos]}>
                                                        <Image style={[estyle.imgAtributos]} src={imageDataURL}></Image>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={[estyle.body, estyle.sectionTwo]}>

                                            <View style={estyle.itemBody}>
                                                <View style={estyle.tittleItem}> <Text>8.</Text> <Text>Conclusión y recomendaciones</Text></View>
                                                {/* <Text>Se recomienda hacer un análisis de suelo, para que pueda hacer una regulación de pH y así realizar una
                                                correcta fertilización del café, además se recomienda hacer una buena recolección seleccionando solo
                                                frutos maduros evitando granos inmaduros y sobre maduros.
                                            </Text> */}
                                                {
                                                    formatoFisico ? formatoFisico.length > 0 ? (
                                                        (() => {
                                                            let count = 0;
                                                            return formatoFisico.map((value, index) => {
                                                                if (value["notas"]) {
                                                                    count = count + 1
                                                                    return <Text key={index}>- {value["notas"]}</Text>;
                                                                }
                                                            });
                                                        })()
                                                    ) : "No registra" : "No registra"
                                                }
                                            </View>
                                        </View>
                                    </Page>
                                    <Page
                                        style={estyle.page}
                                        size="Letter"
                                    >
                                        <View style={[estyle.container, estyle.encabezado]} fixed>
                                            <View style={estyle.divHader} >
                                                <View style={estyle.header}>
                                                    <View style={[estyle.itemHeader, estyle.divheader]}>
                                                        <View style={[estyle.contentHeader, estyle.borderLeftItemHeader]}>
                                                            <Image style={estyle.img} src={"/public/img/logoSena.png"} />
                                                        </View>
                                                        <View style={estyle.contentHeader}>
                                                            <Image style={estyle.img} src={"/public/img/logoCompletoENCC.png"} />
                                                        </View>
                                                    </View >

                                                    <View style={[estyle.itemHeaderCenter, estyle.divheader]}>
                                                        <View style={[estyle.contentHeader, estyle.borderCenterTopHeader]}>
                                                            <Text style={[estyle.text]}>Centro de Gestión y Desarrollo Sostenible  {'\n'}
                                                                Surcolombiano  {'\n'}
                                                                Escuela Nacional de la Calidad del Café
                                                            </Text>
                                                        </View>
                                                        <View style={[estyle.contentHeader, estyle.borderCenterBottomHeader]}>
                                                            <Text style={estyle.text}>INFORME SERVICIO ANALISIS FISICO SENSORIAL</Text>
                                                        </View>
                                                    </View>

                                                    <View style={[estyle.itemHeaderRight, estyle.divheader]}>
                                                        <View style={[estyle.contentHeader, estyle.borderRightItemHeader]}>
                                                            <Image style={estyle.imgSennova} src={"/public/img/sennovaLogo.png"} />
                                                        </View>
                                                        <View style={estyle.contentHeader}>
                                                            <View style={[estyle.contentItemHeaderRight, estyle.contentItemHeaderRightTop]}>
                                                                <Text style={[estyle.text, estyle.textItemHeaderRight]}>Fecha: {fechaActual.getFullYear() + "-" + ((fechaActual.getMonth() + 1) < 10 ? ("0" + (fechaActual.getMonth() + 1)) : (fechaActual.getMonth() + 1)) + "-" + ((fechaActual.getDate() + 1) < 10 ? ("0" + (fechaActual.getDate())) : (fechaActual.getDate()))}</Text>
                                                            </View>
                                                            <View style={estyle.contentItemHeaderRight}>
                                                                <Text style={[estyle.text, estyle.textItemHeaderRight]}>Página: </Text>
                                                                <Text style={estyle.numberPagina} render={({ pageNumber, totalPages }) => (
                                                                    `${pageNumber} de ${totalPages}`
                                                                )}></Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={[estyle.divMainContentFirmas]}>
                                            <View>
                                                <View style={estyle.tittleItem}>  <Text>Catadores Formato Físico</Text></View>

                                                <View key={10000} style={[estyle.sectionTwo, estyle.contenFirmas]}>

                                                    {
                                                        formatoFisico ? formatoFisico.length > 0 ? (
                                                            (() => {
                                                                const grupos = {
                                                                    1: [],
                                                                    2: [],
                                                                    3: []
                                                                }
                                                                const catadoresFormatoFisico = []
                                                                let countInsert = 1
                                                                for (let x = 0; x < formatoFisico.length; x++) {
                                                                    if (grupos[countInsert]) {
                                                                        if (!catadoresFormatoFisico.includes(formatoFisico[x].catador_id)) {
                                                                            catadoresFormatoFisico.push(formatoFisico[x].catador_id)
                                                                            grupos[countInsert].push({
                                                                                "index": x,
                                                                                "content": true
                                                                            })
                                                                            countInsert = countInsert + 1
                                                                        }
                                                                        if (countInsert == 4) {
                                                                            countInsert = 1
                                                                        }
                                                                    }
                                                                }
                                                                const keysGroups = Object.keys(grupos)
                                                                let count = 0;

                                                                return keysGroups.map((value, index) => {

                                                                    return <View style={[estyle.viweFirmas]}>
                                                                        {
                                                                            grupos[value].map((valueArray, indexArray) => {
                                                                                if (formatoFisico[valueArray["index"]]) {
                                                                                    count = count + 1

                                                                                    return <View key={indexArray} style={[estyle.divTextFirma]}>
                                                                                        {valueArray["content"] == true ?
                                                                                            <View>
                                                                                                <View style={[estyle.contentFirma]}>

                                                                                                </View>
                                                                                                <View style={[estyle.textFirma]}>
                                                                                                    <Text style={estyle.textBold}>
                                                                                                        {/* {formatoSensorial.nombre_catador ? formatoSensorial.nombre_catador.toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No Registra"} */}
                                                                                                        {formatoFisico[valueArray["index"]].nombre_catador ? formatoFisico[valueArray["index"]].nombre_catador.toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No Registra"}

                                                                                                    </Text>
                                                                                                    <Text style={[estyle.textFirma]}>
                                                                                                        Instructor(a) Análisis Físico - ENCC
                                                                                                        Pitalito
                                                                                                    </Text>
                                                                                                </View>
                                                                                            </View>
                                                                                            : ""}
                                                                                    </View>;
                                                                                }
                                                                            })
                                                                        }
                                                                    </View>
                                                                });
                                                            })()
                                                        ) : "No registra" : "No registra"
                                                    }
                                                </View>
                                            </View>
                                            <View>
                                                <View style={estyle.tittleItem}>  <Text>Catadores Formato Sensorial</Text></View>
                                                <View style={[estyle.sectionTwo, estyle.contenFirmas]}>

                                                    {
                                                        formatoSensorial ? formatoSensorial.length > 0 ? (
                                                            (() => {
                                                                const grupos = {
                                                                    1: [],
                                                                    2: [],
                                                                    3: []
                                                                }
                                                                const catadoresFormatoSensorial = []
                                                                let countInsert = 1
                                                                for (let x = 0; x < formatoSensorial.length; x++) {
                                                                    if (grupos[countInsert]) {
                                                                        if (!catadoresFormatoSensorial.includes(formatoSensorial[x].catador_id)) {
                                                                            catadoresFormatoSensorial.push(formatoSensorial[x].catador_id)
                                                                            grupos[countInsert].push({
                                                                                "index": x,
                                                                                "content": true
                                                                            })
                                                                            countInsert = countInsert + 1
                                                                        }
                                                                        if (countInsert == 4) {
                                                                            countInsert = 1
                                                                        }
                                                                    }
                                                                }
                                                                const keysGroups = Object.keys(grupos)
                                                                let count = 0;

                                                                return keysGroups.map((value, index) => {

                                                                    return <View style={[estyle.viweFirmas]}>
                                                                        {
                                                                            grupos[value].map((valueArray, indexArray) => {
                                                                                if (formatoSensorial[valueArray["index"]]) {
                                                                                    count = count + 1

                                                                                    return <View key={indexArray} style={[estyle.divTextFirma]}>
                                                                                        {valueArray["content"] == true ?
                                                                                            <View>
                                                                                                <View style={[estyle.contentFirma]}>

                                                                                                </View>
                                                                                                <View style={[estyle.textFirma]}>
                                                                                                    <Text style={estyle.textBold}>
                                                                                                        {/* {formatoSensorial.nombre_catador ? formatoSensorial.nombre_catador.toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No Registra"} */}
                                                                                                        {formatoSensorial[valueArray["index"]].nombre_catador ? formatoSensorial[valueArray["index"]].nombre_catador.toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : "No Registra"}

                                                                                                    </Text>
                                                                                                    <Text style={[estyle.textFirma]}>
                                                                                                        Instructor(a) Análisis Sensorial - ENCC
                                                                                                        Pitalito
                                                                                                    </Text>
                                                                                                </View>
                                                                                            </View>
                                                                                            : ""}
                                                                                    </View>;
                                                                                }
                                                                            })
                                                                        }
                                                                    </View>
                                                                });
                                                            })()
                                                        ) : "No registra" : "No registra"
                                                    }
                                                    {/*   </View> */}
                                                </View>
                                            </View>
                                        </View>
                                    </Page>
                                </Document>
                            </PDFViewer>
                            : ""}
                    </div>

                    : ""}


                <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />

            </div >
            : (() => {
                if (typeof dataAlert == "object") {
                    if (Object.keys(dataAlert).length > 0) {
                        return <Alert setStatusAlert={setStatusAlert} statusAlert={true} dataAlert={dataAlert} />
                    }
                }
            })()}
        </>
    );
};

{/* <View>
    <View style={[estyle.headerFormtoSensorial, estyle.headerFormtoSensorialAtributos]}>
        <Text style={estyle.textBold}>Análisis de atributos</Text>
    </View>
    <View style={[estyle.bodyFormtoSensorial]}>
        <View style={[estyle.atributosSensorial]}>

            <Image src={imageDataURL}></Image>
        </View>
    </View>
</View> */}