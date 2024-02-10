import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";


export const Loader = () => {
    const location = useLocation();
    let [cloneDivLoader, setCloneDivLoader] = useState("");
    useEffect(() => {
        if (document.getElementById("divLoader")) {
            setCloneDivLoader(document.getElementById("divLoader").cloneNode(true))
        }
    }, [])
    useEffect(() => {
        let interval;
        if (!document.getElementById("divLoader")) {
            let divContentMainLoader = document.getElementById("divContentMainLoader")
            divContentMainLoader.appendChild(cloneDivLoader)
        }

        let divLoader = document.getElementById("divLoader")
        let iconLoader = document.querySelectorAll(".icon-loader")
        const timeTransition = 200;
        let positionIconLoader = -1;
        let lastPositionLoader = 0;
        function getInterval() {
            interval = setInterval(() => {
                const limit = iconLoader.length;
                positionIconLoader = positionIconLoader + 1;
                for (let p = 0; p < iconLoader.length; p++) {
                    if (p == positionIconLoader) {
                        lastPositionLoader = p;
                        iconLoader[positionIconLoader].style.bottom = "20px";
                    } else {
                        iconLoader[p].style.bottom = "0";
                    }
                }
                if (positionIconLoader > (limit - 2)) {
                    positionIconLoader = -1;
                }

            }, timeTransition);
        }
        
        getInterval();
       function removeLoader(){
        setTimeout(() => {
            if (divLoader) {
                divLoader.remove()
            }

            clearInterval(interval)
            iconLoader[lastPositionLoader].style.bottom = "0";
            positionIconLoader = -1;
        }, 400);
       }
       window.addEventListener('load', removeLoader());
    }, [location.pathname]);


    return (
        <>
            <div id="divContentMainLoader">
                <div style={{
                    position: "fixed",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "white",
                    left: "0", top: "0",
                    zIndex: "9999999999999"
                }} id="divLoader" className="div-loader">
                    <div style={{
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }} className="icons-loader">
                        <div className="div-icon-loader" style={{
                            position: "relative",
                            width: "24px",
                            height: "20px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <svg style={{
                                width: "14px",
                                transform: "rotate(90deg)",
                                position: "absolute",
                                bottom: "0",
                                transition: "bottom 0.4s"
                            }} className="icon-loader" version="1.0" viewBox="0 0 134.000000 177.000000" >
                                <g transform="translate(0.000000,177.000000) scale(0.100000,-0.100000)" stroke="none">
                                    <path style={{ fill: " rgb(169, 53, 53)" }} className="color-top-icon-loader" d="M514 1729 c-211 -65 -392 -293 -466 -586 -19 -75 -23 -115 -23 -268 0 -157 3 -191 23 -268 51 -192 129 -333 245 -444 158 -150 297 -174 386 -67 50 61 64 127 59 268 -4 105 -10 135 -41 227 -20 59 -63 160 -96 225 -74 148 -97 206 -123 314 -27 111 -29 295 -4 390 19 69 67 173 93 203 9 9 14 19 12 21 -2 2 -31 -5 -65 -15z" />
                                    <path style={{ fill: "rgb(151, 46, 46)" }} className="color-bottom-icon-loader" d="M755 1705 c-68 -37 -107 -99 -137 -218 -43 -171 -9 -368 101 -587 83 -165 127 -280 151 -400 38 -184 18 -346 -56 -455 l-25 -37 28 6 c67 16 177 80 244 143 192 182 289 450 276 768 -13 335 -157 618 -382 754 -69 42 -151 52 -200 26z" />
                                </g>
                            </svg>
                        </div>
                        <div className="div-icon-loader" style={{
                            position: "relative",
                            width: "24px",
                            height: "20px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <svg style={{
                                width: "14px",
                                transform: "rotate(90deg)",
                                position: "absolute",
                                bottom: "0%",
                                transition: "bottom 0.4s"
                            }} className="icon-loader" version="1.0" viewBox="0 0 134.000000 177.000000" >
                                <g transform="translate(0.000000,177.000000) scale(0.100000,-0.100000)" stroke="none">
                                    <path style={{ fill: " rgb(169, 53, 53)" }} className="color-top-icon-loader" d="M514 1729 c-211 -65 -392 -293 -466 -586 -19 -75 -23 -115 -23 -268 0 -157 3 -191 23 -268 51 -192 129 -333 245 -444 158 -150 297 -174 386 -67 50 61 64 127 59 268 -4 105 -10 135 -41 227 -20 59 -63 160 -96 225 -74 148 -97 206 -123 314 -27 111 -29 295 -4 390 19 69 67 173 93 203 9 9 14 19 12 21 -2 2 -31 -5 -65 -15z" />
                                    <path style={{ fill: "rgb(151, 46, 46)" }} className="color-bottom-icon-loader" d="M755 1705 c-68 -37 -107 -99 -137 -218 -43 -171 -9 -368 101 -587 83 -165 127 -280 151 -400 38 -184 18 -346 -56 -455 l-25 -37 28 6 c67 16 177 80 244 143 192 182 289 450 276 768 -13 335 -157 618 -382 754 -69 42 -151 52 -200 26z" />
                                </g>
                            </svg>
                        </div> <div className="div-icon-loader" style={{
                            position: "relative",
                            width: "24px",
                            height: "20px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <svg style={{
                                width: "14px",
                                transform: "rotate(90deg)",
                                position: "absolute",
                                bottom: "0",
                                transition: "bottom 0.4s"
                            }} className="icon-loader" version="1.0" viewBox="0 0 134.000000 177.000000" >
                                <g transform="translate(0.000000,177.000000) scale(0.100000,-0.100000)" stroke="none">
                                    <path style={{ fill: " rgb(169, 53, 53)" }} className="color-top-icon-loader" d="M514 1729 c-211 -65 -392 -293 -466 -586 -19 -75 -23 -115 -23 -268 0 -157 3 -191 23 -268 51 -192 129 -333 245 -444 158 -150 297 -174 386 -67 50 61 64 127 59 268 -4 105 -10 135 -41 227 -20 59 -63 160 -96 225 -74 148 -97 206 -123 314 -27 111 -29 295 -4 390 19 69 67 173 93 203 9 9 14 19 12 21 -2 2 -31 -5 -65 -15z" />
                                    <path style={{ fill: "rgb(151, 46, 46)" }} className="color-bottom-icon-loader" d="M755 1705 c-68 -37 -107 -99 -137 -218 -43 -171 -9 -368 101 -587 83 -165 127 -280 151 -400 38 -184 18 -346 -56 -455 l-25 -37 28 6 c67 16 177 80 244 143 192 182 289 450 276 768 -13 335 -157 618 -382 754 -69 42 -151 52 -200 26z" />
                                </g>
                            </svg>
                        </div> <div className="div-icon-loader" style={{
                            position: "relative",
                            width: "24px",
                            height: "20px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <svg style={{
                                width: "14px",
                                transform: "rotate(90deg)",
                                position: "absolute",
                                bottom: "0",
                                transition: "bottom 0.4s"
                            }} className="icon-loader" version="1.0" viewBox="0 0 134.000000 177.000000" >
                                <g transform="translate(0.000000,177.000000) scale(0.100000,-0.100000)" stroke="none">
                                    <path style={{ fill: " rgb(169, 53, 53)" }} className="color-top-icon-loader" d="M514 1729 c-211 -65 -392 -293 -466 -586 -19 -75 -23 -115 -23 -268 0 -157 3 -191 23 -268 51 -192 129 -333 245 -444 158 -150 297 -174 386 -67 50 61 64 127 59 268 -4 105 -10 135 -41 227 -20 59 -63 160 -96 225 -74 148 -97 206 -123 314 -27 111 -29 295 -4 390 19 69 67 173 93 203 9 9 14 19 12 21 -2 2 -31 -5 -65 -15z" />
                                    <path style={{ fill: "rgb(151, 46, 46)" }} className="color-bottom-icon-loader" d="M755 1705 c-68 -37 -107 -99 -137 -218 -43 -171 -9 -368 101 -587 83 -165 127 -280 151 -400 38 -184 18 -346 -56 -455 l-25 -37 28 6 c67 16 177 80 244 143 192 182 289 450 276 768 -13 335 -157 618 -382 754 -69 42 -151 52 -200 26z" />
                                </g>
                            </svg>
                        </div> <div className="div-icon-loader" style={{
                            position: "relative",
                            width: "24px",
                            height: "20px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <svg style={{
                                width: "14px",
                                transform: "rotate(90deg)",
                                position: "absolute",
                                bottom: "0",
                                transition: "bottom 0.4s"
                            }} className="icon-loader" version="1.0" viewBox="0 0 134.000000 177.000000" >
                                <g transform="translate(0.000000,177.000000) scale(0.100000,-0.100000)" stroke="none">
                                    <path style={{ fill: " rgb(169, 53, 53)" }} className="color-top-icon-loader" d="M514 1729 c-211 -65 -392 -293 -466 -586 -19 -75 -23 -115 -23 -268 0 -157 3 -191 23 -268 51 -192 129 -333 245 -444 158 -150 297 -174 386 -67 50 61 64 127 59 268 -4 105 -10 135 -41 227 -20 59 -63 160 -96 225 -74 148 -97 206 -123 314 -27 111 -29 295 -4 390 19 69 67 173 93 203 9 9 14 19 12 21 -2 2 -31 -5 -65 -15z" />
                                    <path style={{ fill: "rgb(151, 46, 46)" }} className="color-bottom-icon-loader" d="M755 1705 c-68 -37 -107 -99 -137 -218 -43 -171 -9 -368 101 -587 83 -165 127 -280 151 -400 38 -184 18 -346 -56 -455 l-25 -37 28 6 c67 16 177 80 244 143 192 182 289 450 276 768 -13 335 -157 618 -382 754 -69 42 -151 52 -200 26z" />
                                </g>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <Outlet></Outlet>
        </>
    )
}