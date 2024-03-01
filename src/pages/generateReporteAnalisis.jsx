import React, { useEffect, useRef, useState } from 'react';
import { PDFViewer, Document, Page, Text, StyleSheet, View, Image, Font } from '@react-pdf/renderer';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';
import Calibri from '../../src/fonts/calibri-regular.ttf';
import CalibriBold from '../../src/fonts/calibri-bold.ttf';

export const GenerateReporteAnalisis = () => {
    let { id } = useParams();
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

    const estyle = StyleSheet.create({
        divList: {
            display: "flex",
            fontSize: "12px",
            flexDirection: "row",
            position: "relative",
            gap: "10px",
            alignItems: "center"
        },
        puntoList: {
            fontSize: 10,
            backgroundColor: "black",
            height: "5px",
            width: "5px",
            borderRadius: "100%"
        },
        page: {
            width: "100%",
            height: "90%",
            padding: "40px 40px",
            fontSize: "15px",
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
            width: "50px"
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
            height: "110px",
        },
        text: {
            textOverflow: "ellipsis",
            fontSize: "10px",
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
            width: "100%"
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
        },
        tableCellStyle: {
            margin: 5,
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
            fontSize: "13px"
        }
    });


    return (
        <div style={{ margin: 0, padding: 0 }}>
            <PDFViewer style={{ width: "100%", height: "100%", position: "fixed" }}>
                <Document>
                    <Page style={estyle.page}>
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
                                            <Text style={estyle.text}>INFORME SOBRE REGISTROS GUARDADOS EN </Text>
                                        </View>
                                    </View>

                                    <View style={[estyle.itemHeaderRight, estyle.divheader]}>
                                        <View style={[estyle.contentHeader, estyle.borderRightItemHeader]}>
                                            <Image style={estyle.imgSennova} src={"/public/img/sennovaLogo.png"} />
                                        </View>
                                        <View style={estyle.contentHeader}>
                                            <View style={[estyle.contentItemHeaderRight, estyle.contentItemHeaderRightTop]}>
                                                <Text style={[estyle.text, estyle.textItemHeaderRight]}>Fecha: {fechaActual.getFullYear() + "-" + ((fechaActual.getMonth() + 1) < 10 ? ("0" + (fechaActual.getMonth() + 1)) : (fechaActual.getMonth() + 1)) + "-" + fechaActual.getDate()}</Text>
                                            </View>
                                            <View style={estyle.contentItemHeaderRight}>
                                                <Text style={[estyle.text, estyle.textItemHeaderRight]}>Página: </Text>
                                                <Text style={estyle.numberPagina} render={({ pageNumber, totalPages }) => (
                                                    `${pageNumber} / ${totalPages}`
                                                )}></Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View>
                                <Text style={estyle.tittleItem}> 1. Objetivo</Text>
                                <Text>El objetivo del siguiente informe es presentar los resultados del análisis físico-sensorial obtenidos para la muestra de café AFS-40 descrita a continuación.
                                </Text>
                            </View>
                            <View>
                                <Text>2. Información General</Text>
                                <View style={estyle.divList}>
                                    <View style={estyle.puntoList}></View>
                                    <Text>
                                        Productor:
                                    </Text>
                                </View>
                                <View style={estyle.divList}>
                                    <View style={estyle.puntoList}></View>
                                    <Text>
                                        Departamento:
                                    </Text>
                                </View>
                                <View style={estyle.divList}>
                                    <View style={estyle.puntoList}></View>
                                    <Text>
                                        Municipio:
                                    </Text>
                                </View>
                                <View style={estyle.divList}>
                                    <View style={estyle.puntoList}></View>
                                    <Text>
                                        Vereda:
                                    </Text>
                                </View>
                                <View style={estyle.divList}>
                                    <View style={estyle.puntoList}></View>
                                    <Text>
                                        Finca:
                                    </Text>
                                </View>
                                <View style={estyle.divList}>
                                    <View style={estyle.puntoList}></View>
                                    <Text>
                                        Código Externo:
                                    </Text>
                                </View>

                                <View style={estyle.divList}>
                                    <View style={estyle.puntoList}></View>
                                    <Text>
                                        Consecutivo Informe:
                                    </Text>
                                </View>
                            </View>

                        </View>
                    </Page>
                </Document>
            </PDFViewer>

        </div >
    );
};