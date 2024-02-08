import React, { useEffect, useState } from "react";
import { Slider } from "./Slider";


export const TableFormatoSca = () => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", "/src/formatoSca/formatoSca.html")
    iframe.classList.add("iframe")
    iframe.classList.add("iframe-formato-sca")
    iframe.setAttribute("frameBorder", "0")
    iframe.setAttribute("allowtransparency", "true")
    const [dataformatosSca, setdataFormatosSca] = useState([]);

    for (let x = 0; x < 3; x++) {
        let cloneFormatoSca = iframe.cloneNode(true)
        const cloneDataFormatoSca = dataformatosSca
        dataformatosSca.push(cloneFormatoSca);
   
        console.log(cloneDataFormatoSca)
    }
   
    useEffect(() => {
       
        const contenidoComponent = document.getElementById("contenidoComponent");
        const contentFormatoSca = document.getElementById("contentFormatoSca");

       
        
        const iframeFormatoSca = document.querySelectorAll(".iframe-formato-sca");
        console.log(iframeFormatoSca, "Iframeeeeeeeeeee ")
        console.log(iframeFormatoSca, "Iframee")

        for (let i = 0; i < iframeFormatoSca.length; i++) { 
            iframeFormatoSca[i].addEventListener("load", function () {
                resizeFormatoSca()
            })
        } 


        function resizeFormatoSca() {
            const iframeFormatoSca = document.querySelectorAll(".iframe-formato-sca");

            if (iframeFormatoSca) {
                for (let i = 0; i < iframeFormatoSca.length; i++) {
                    
                    const iframeFormatoScaContentDocument = iframeFormatoSca[i].contentDocument;
                    const formatoSca = iframeFormatoScaContentDocument.getElementById("formatoSca");
                    console.log(formatoSca)
                    if (formatoSca) {
                        iframeFormatoSca[i].style.height = "calc(" + formatoSca.clientHeight + "px" + " + 0.5vw)"
                    }
                }
            }

        }


        const resizeObserver = new ResizeObserver(entries => {
            // La función de devolución de llamada se ejecutará cuando haya cambios de tamaño
            entries.forEach(entry => {
                resizeFormatoSca();
            });
        });

        // Inicia la observación del elemento
        resizeObserver.observe(contenidoComponent);



        window.addEventListener("resize", function () {
            resizeFormatoSca();
        })

    }, [])




    return (
        < >
            <div id="contentFormatoSca">
                <Slider data={dataformatosSca}/>

            </div>
        </>
    )
}