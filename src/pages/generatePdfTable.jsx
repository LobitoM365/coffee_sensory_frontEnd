import React, { useEffect, useRef, useState } from 'react';
import { PDFViewer, Document, Page, Text, StyleSheet, View, Image } from '@react-pdf/renderer';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';

export const GeneratePdfTable = () => {
    const [pdf, setPdf] = useState(false)
    const pdfLink = useRef(null)
    const fechaActual = new Date();
    const [dataPdf, setDataPdf] = useState();
    let data = JSON.parse(localStorage.getItem("dataGeneratePdfTable"))
    let keysPrint = Object.keys(data ? data.table ? data.table : [] : [])
    let keysData = Object.keys(data ? data.data[0] ? data.data[0] : [] : [])
    let print = data ? data.table ? data.table : [] : []

    const formatDate = (data) => {

        let date = new Date(data);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        return `${day < 10 ? '0' + day : day} / ${month < 10 ? '0' + month : month} / ${year} `
    }

    useEffect(() => {

        if (data) {
            if (!data.data && !data.table) {
                window.close()
            }
            /*          localStorage.removeItem("dataGeneratePdfTable") */
        } else {
            window.close()
        }
        setDataPdf(data)

    }, [])
    useEffect(() => {
        console.log(dataPdf, "ahhhh")

        keysPrint = Object.keys(dataPdf ? dataPdf.table ? dataPdf.table : [] : [])
        keysData = Object.keys(dataPdf ? dataPdf.data[0] ? dataPdf.data[0] : [] : [])
        print = dataPdf ? dataPdf.table ? dataPdf.table : [] : []
        console.log(dataPdf, "ahhhh", keysPrint, keysData, print)

    }, [dataPdf])

    const estyle = StyleSheet.create({
        page: {
            width: "100%",
            height: "90%",
        },
        container: {
            margin: "40px 30px",
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
            justifyContent: "center",
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
            fontSize: "10px"
        },
        tableCellStyle: {
            margin: 5,
            fontSize: 10,
            textOverflow: "hidden",
            textOverflow: "ellipsis"
        }
    });



    return (
        <div>
            <PDFViewer style={{ position: "fixed", width: "90%", height: "100%", border: "none" }}  >
                <Document style={estyle.document}>
                    <Page
                        wrap
                        style={estyle.page}
                        size="A4"
                        orientation="landscape">
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
                                                <Text style={[estyle.text, estyle.textItemHeaderRight]}>Página:</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={[estyle.containerBody, estyle.body]} >



                            <View style={estyle.tableRowStyle} fixed>
                                {keysPrint.map((keys, index) => {
                                    let styleElement = estyle.tableColHeaderStyle;
                                    if (index == 0) {
                                        styleElement = estyle.firstTableColHeaderStyle;
                                    }
                                    return <View key={keys} style={[styleElement, estyle.colTable]}>
                                        <Text style={estyle.tableCellHeaderStyle}>  {print[keys]["referencia"]} </Text>
                                    </View>
                                })}
                            </View>

                            {data ? data.data.length > 0 ? (
                                data.data.map((keysD, valuesD) => (
                                    <View key={keysD} style={[estyle.tableRowStyle, estyle.tableBody]}>
                                        {


                                            keysPrint.map((keys, index) => {
                                                let styleElement = estyle.tableColStyle;
                                                if (index == 0) {
                                                    styleElement = estyle.firstTableColStyle;
                                                }

                                                if (keysData.includes(keys)) {
                                                    if (keysData.includes(keys)) {
                                                        if (data.data[valuesD][keys] === "" || data.data[valuesD][keys] == null || data.data[valuesD][keys] == undefined) {
                                                            return <View key={keys} style={[styleElement, estyle.colTable]}>
                                                                <Text style={estyle.tableCellStyle}>No registra</Text></View>
                                                        } else {
                                                            if (keys == "estado") {
                                                                if (data.data[valuesD][keys] == 0) {
                                                                    return <View key={keys} style={[styleElement, estyle.colTable]}>
                                                                        <Text style={estyle.tableCellStyle}>Inactivo</Text></View>;
                                                                } else if (data.data[valuesD][keys] == 1) {
                                                                    return <View key={keys} style={[styleElement, estyle.colTable]}>
                                                                        <Text style={estyle.tableCellStyle}>Activo</Text></View>;
                                                                } else if (data.data[valuesD][keys] == 2) {
                                                                    return <View key={keys} style={[styleElement, estyle.colTable]}>
                                                                        <Text style={estyle.tableCellStyle}>Pendiente</Text></View>;
                                                                } else if (data.data[valuesD][keys] == 3 || data.data[valuesD][keys] == 4) {
                                                                    return <View key={keys} style={[styleElement, estyle.colTable]}>
                                                                        <Text style={estyle.tableCellStyle}>Aginado</Text></View>;
                                                                }
                                                            } else {
                                                                if (print[keys]["values"]) {
                                                                    let count = 0;
                                                                    let group = ""
                                                                    print[keys]["values"].map((ketV, indexV) => {
                                                                        if (data.data[valuesD][ketV]) {
                                                                            count = count + 1;
                                                                            if (count == 1) {
                                                                                group = data.data[valuesD][ketV]
                                                                            } else {
                                                                                group += ", " + data.data[valuesD][ketV]
                                                                            }
                                                                        }
                                                                    })
                                                                    if (group != "") {
                                                                        if (print[keys]["upper_case"]) {
                                                                            return <View key={keys} style={[styleElement, estyle.colTable]}>
                                                                                <Text style={estyle.tableCellStyle}>{group.toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase())}</Text></View>;
                                                                        } else if (print[keys]["capital_letter"]) {
                                                                            return <View key={keys} style={[styleElement, estyle.colTable]}>
                                                                                <Text style={estyle.tableCellStyle}>{group.toString().replace(/^[a-z]/, match => match.toUpperCase())}</Text></View>;
                                                                        } else {
                                                                            return <View key={keys} style={[styleElement, estyle.colTable]}>
                                                                                <Text style={estyle.tableCellStyle}>{group}</Text></View>;

                                                                        }
                                                                    } else {
                                                                        return <View key={keys} style={[styleElement, estyle.colTable]}>
                                                                            <Text style={estyle.tableCellStyle}>No registra</Text></View>;
                                                                    }
                                                                } else if (print[keys]["format"]) {

                                                                    return <View key={keys} style={[styleElement, estyle.colTable]}>
                                                                        <Text style={estyle.tableCellStyle}>{formatDate(data.data[valuesD][keys])}</Text></View>;

                                                                } else {
                                                                    if (print[keys]["upper_case"]) {
                                                                        return <View key={keys} style={[styleElement, estyle.colTable]}>
                                                                            <Text style={estyle.tableCellStyle}>{data.data[valuesD][keys].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase())}</Text></View>
                                                                            ;
                                                                    } else if (print[keys]["capital_letter"]) {
                                                                        return <View key={keys} style={[styleElement, estyle.colTable]}>
                                                                            <Text style={estyle.tableCellStyle}>{data.data[valuesD][keys].toString().replace(/^[a-z]/, match => match.toUpperCase())}</Text></View>
                                                                            ;
                                                                    } else {
                                                                        return <View key={keys} style={[styleElement, estyle.colTable]}>
                                                                            <Text style={estyle.tableCellStyle}>{data.data[valuesD][keys]}</Text></View>

                                                                    }

                                                                }
                                                            }
                                                        }
                                                    }
                                                } else {
                                                    return <View key={keys} style={[styleElement, estyle.colTable]}>
                                                        <Text style={estyle.tableCellStyle}>No registra</Text></View>;
                                                }
                                            })
                                        }
                                    </View>
                                ))
                            ) : "" : ""}


                        </View>
                        <View fixed style={estyle.footer}>
                            <Text>Pie de página</Text>
                        </View>
                    </Page>

                </Document>
            </PDFViewer>

        </div >
    );
};