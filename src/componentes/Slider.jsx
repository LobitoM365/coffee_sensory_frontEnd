import React, { useEffect } from "react"
import "../../public/css/slider.css"

export const Slider = (data) => {

    useEffect(() => {
        let count = 0;
        if (data.data) {
            if (data.data.length > 1) {
                let imgSlider = document.querySelectorAll(".div-element-slider");
                let chevronRight = document.getElementById("chevronRight");
                let chevronLeft = document.getElementById("chevronLeft");
                let inicio = -100
                let transitionMargin = "margin 0.5s";
                let statusInterval = true;
                let lessLenght = 1;
                if (data.interval != undefined) {
                    if (data.interval == false) {
                        statusInterval = false
                    }
                }
                if (data.data.length == 2) {
                    inicio = 0;
                    transitionMargin = "unset";
                    lessLenght = 0
                }
                let margin = -200;
                let dataSlider = [];
                for (let x = 0; x < imgSlider.length; x++) {
                    margin = margin + 100;
                    dataSlider[x] = margin;
                    imgSlider[x].style.marginLeft = margin + "%";
                }

                let intervalId;
                chevronRight.addEventListener("click", function () {

                    for (let x = 0; x < imgSlider.length; x++) {
                        dataSlider[x] = dataSlider[x] - 100;
                    }
                    ir(dataSlider);
                    clearInterval(intervalId);
                    if (statusInterval) {
                        interval()
                    }
                })
                chevronLeft.addEventListener("click", function () {

                    for (let x = 0; x < imgSlider.length; x++) {
                        dataSlider[x] = dataSlider[x] + 100;
                    }
                    volver(dataSlider);
                    clearInterval(intervalId);
                    if (statusInterval) {
                        interval()
                    }
                })
                function ir(dataSlider) {
                    for (let x = 0; x < dataSlider.length; x++) {
                        if (dataSlider[x] == (imgSlider.length - lessLenght) * -100) {
                            dataSlider[x] = (inicio * -1);
                            imgSlider[x].style.transition = "margin 0s";
                            imgSlider[x].style.marginLeft = (inicio * -1) + "%";
                        } else {
                            imgSlider[x].style.transition = transitionMargin;
                            imgSlider[x].style.marginLeft = dataSlider[x] + "%";

                        }
                    }
                }
                function volver(dataSlider) {

                    for (let x = 0; x < dataSlider.length; x++) {
                        if (dataSlider[x] == (imgSlider.length - lessLenght) * 100) {
                            dataSlider[x] = inicio;
                            imgSlider[x].style.transition = "margin 0s";
                            imgSlider[x].style.marginLeft = inicio + "%";
                        } else {
                            imgSlider[x].style.transition = transitionMargin;
                            imgSlider[x].style.marginLeft = dataSlider[x] + "%";

                        }
                    }
                }
                function interval() {
                    intervalId = setInterval(() => {
                        for (let x = 0; x < imgSlider.length; x++) {
                            dataSlider[x] = dataSlider[x] - 100;
                        }
                        ir(dataSlider);
                    }, 5000);
                }
                if (statusInterval) {
                    interval();
                }
            }
        }
    }, [data.data])
    return (

        <>
            <div id="mainSlider">

                {data.data ? data.data.length > 1 ?
                    <div id="sliderContent">



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
                                    {data.data ? data.data.length > 0 ?

                                        data.data.map((value, index) => {
                                            return <div key={index} className="div-element-slider">
                                                {value}
                                            </div>
                                        })

                                        : "" : " "}
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
                    :
                    <div className="div-no-slider">
                        {
                            data.data ? data.data.length > 0 ?
                                data.data.map((value, index) => {
                                    return <div>
                                        {value}
                                    </div>
                                })
                                : "" : " "
                        }
                    </div>
                    : ""}
            </div>
        </>

    )
}

