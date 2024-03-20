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
    }
   
    useEffect(() => {
       
        const contenidoComponent = document.getElementById("contenidoComponent");

        const iframeFormatoSca = document.querySelectorAll(".iframe-formato-sca");
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
                    
                    if (formatoSca) {
                        iframeFormatoSca[i].style.height = "calc(" + formatoSca.clientHeight + "px" + " + 0.5vw)"
                    }
                }
            }
        }


        const resizeObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                resizeFormatoSca();
            });
        });
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