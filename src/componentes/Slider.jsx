import React, { useEffect } from "react"


export const Slider = (data) => {
  
    useEffect(() => {
        let count = 0;
        if (data.data.length > 0) {
            const divCarrusel = document.getElementById("divCarrusel");
            for (let s = 0; s < data.data.length; s++) {
                const div = document.createElement("div");
                div.classList.add("div-element-slider");
                div.appendChild(data.data[s])
                divCarrusel.appendChild(div)
              
                count = count + 1;  
            }
      
            if (count >= data.data.length) {
             
                const sliderContent = document.getElementById("sliderContent")
                const script = document.createElement("script");
                script.setAttribute("src", "/js/slider.js")
                sliderContent.appendChild(script)
            }
        } 
      

    },[data.data])
    return (

        <>
            <div id="sliderContent">

                <link rel="stylesheet" href="/css/slider.css" />

                <div className="content-carrusel">
                    <div className="div-slider">
                        <div id="chevronLeft" className="div-chevron-left">
                            <svg className="icon-chevron-left" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512">
                                <path
                                    d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                            </svg>
                        </div>
                        <div id="divCarrusel" className="div-carrusel">

                        </div>
                        <div id="chevronRight" className="div-chevron-right">
                            <svg className="icon-chevron-right" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512">
                                <path
                                    d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                            </svg>
                        </div>

                    </div>
                </div>
            </div>
        </>

    )
}

