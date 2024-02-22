import React, { useState } from 'react';
import { PDFViewer, Document, Page, Text } from '@react-pdf/renderer';
import { PDFDownloadLink } from '@react-pdf/renderer';

export const PruebaPdf = () => {
    const [pdfUrl, setPdfUrl] = useState(null);

    const generatePDF = () => (
        <Document>
            <Page>
                <Text style={{ backgroundColor: "red" }}>Ejemplo de PDF generado con React-PDF</Text>
            </Page>
        </Document>
    );

    const openPdfInNewTab = () => {
        alert("xd")
        const pdfContent = generatePDF();

        console.log(pdfContent,"ahh")
        // Convertir el PDF a Blob
        pdfContent.toBlob((blob) => {
            // Crear una URL para el Blob
            const pdfURL = URL.createObjectURL(blob);

            window.open(pdfURL, '_blank');

            // Actualizar el estado con la URL
            setPdfUrl(pdfURL);
        });
    };

    return (
        <div>
            <PDFDownloadLink document={generatePDF()} fileName="ejemplo.pdf">
                {({ blob, url, loading, error }) =>
                    loading ? 'Cargando...' : 'Generar PDF y Abrir en Nueva Pestaña'
                }
            </PDFDownloadLink>

            {pdfUrl && (
                <div>
                    <button onClick={openPdfInNewTab}>Abrir PDF en Nueva Pestaña</button>
                </div>
            )}
        </div>
    );
};


