import React, { useEffect, useRef, useState } from 'react';
import { PDFViewer, Document, Page, Text, StyleSheet, View, Image } from '@react-pdf/renderer';
import { PDFDownloadLink } from '@react-pdf/renderer';

export const PruebaPdf = () => {
    const [pdf, setPdf] = useState(false)
    const pdfLink = useRef(null)
    const pageStyle = {
        paddingTop: 16,
        paddingHorizontal: 40,
        paddingBottom: 56
      };
      
      const tableStyle = {
        display: "table",
        width: "auto"
      };
      
      const tableRowStyle = {
        flexDirection: "row"
      };
      
      const firstTableColHeaderStyle = {
        width: "20%",
        borderStyle: "solid",
        borderColor: "#000",
        borderBottomColor: "#000",
        borderWidth: 1,
        backgroundColor: "#bdbdbd"
      };
      
      const tableColHeaderStyle = {
        width: "20%",
        borderStyle: "solid",
        borderColor: "#000",
        borderBottomColor: "#000",
        borderWidth: 1,
        borderLeftWidth: 0,
        backgroundColor: "#bdbdbd"
      };
      
      const firstTableColStyle = {
        width: "20%",
        borderStyle: "solid",
        borderColor: "#000",
        borderWidth: 1,
        borderTopWidth: 0
      };
      
      const tableColStyle = {
        width: "20%",
        borderStyle: "solid",
        borderColor: "#000",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0
      };
      
      const tableCellHeaderStyle = {
        textAlign: "center",
        margin: 4,
        fontSize: 12,
        fontWeight: "bold"
      };
      
      const tableCellStyle = {
        textAlign: "center",
        margin: 5,
        fontSize: 10
      };
    const generatePDF = () => (
        <Document>
      <Page
        style={pageStyle}
        size="A4"
        orientation="landscape">

        <View style={tableStyle}>
          {createTableHeader()}
          {createTableRow()}
          {createTableRow()}
          {createTableRow()}
          {createTableRow()}
          {createTableRow()}
          {createTableRow()}
          {createTableRow()}
          {createTableRow()}
          {createTableRow()}
          {createTableRow()}
        </View>

      </Page>
    </Document>
    );
    const createTableHeader = () => {
        return (
          <View style={tableRowStyle} fixed>
    
            <View style={firstTableColHeaderStyle}>
              <Text style={tableCellHeaderStyle}>Column</Text>
            </View>
    
            <View style={tableColHeaderStyle}>
              <Text style={tableCellHeaderStyle}>Column</Text>
            </View>
    
            <View style={tableColHeaderStyle}>
              <Text style={tableCellHeaderStyle}>Column</Text>
            </View>
    
            <View style={tableColHeaderStyle}>
              <Text style={tableCellHeaderStyle}>Column</Text>
            </View>
    
            <View style={tableColHeaderStyle}>
              <Text style={tableCellHeaderStyle}>Column</Text>
            </View>
            <View style={tableColHeaderStyle}>
              <Text style={tableCellHeaderStyle}>Img</Text>
            </View>
          </View>
        );
      };
    
      const createTableRow = () => {
        return (
          <View style={tableRowStyle}>
    
            <View style={firstTableColStyle}>
              <Text style={tableCellStyle}>Element</Text>
            </View>
    
            <View style={tableColStyle}>
              <Text style={tableCellStyle}>Element</Text>
            </View>
    
            <View style={tableColStyle}>
              <Text style={tableCellStyle}>Element</Text>
            </View>
    
            <View style={tableColStyle}>
              <Text style={tableCellStyle}>Element</Text>
            </View>
    
            <View style={tableColStyle}>
              <Text style={tableCellStyle}>Element</Text>
            </View>
            <View style={tableColStyle}>
            <Image src={"data:image/jpeg;base64,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"}></Image>
            </View>
    
          </View>
        );
      };
    function openPdf(blob) {
        if (blob) {
            window.open(blob, "_blank");
        }
    }
    function changeState() {
        setTimeout(() => {
            setPdf(false)
        }, 0);
    }
    return (
        <div>
            <button onClick={() => { setPdf(true) }}> Pdf</button>

            {pdf &&
                <PDFDownloadLink document={generatePDF()} fileName="ejemplo.pdf" id='pdfGeneral'>
                    {({ blob, url, loading, error }) => {
                        openPdf(url);
                        loading ? "cargando" : document.getElementById("pdfGeneral") ? changeState() : ""

                        return null; // No renderizar nada aquí
                    }}
                </PDFDownloadLink>
            }
        </div>
    );
};