import React, { useEffect, useState } from "react";


export const Alert = (data) => {

    return (
        <>
            <link rel="stylesheet" href="/../public/css/alert.css" />

            <div style={{ display: !data.statusAlert ? "none" : "" }} className="div-alert">
                <div className="alert">
                    <div className="div-img-alert">
                        {data.dataAlert["status"] ? data.dataAlert["status"] === "true" ?
                            <svg className="icon-true-alert" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                <g><g><path d="M128,10c-16.1,0-31.4,3.1-45.9,9.4C67.6,25.7,55,34,44.5,44.5s-18.9,23-25.1,37.6C13.1,96.6,10,111.9,10,128c0,10.8,1.4,21.2,4.2,31.4c2.8,10.1,6.8,19.5,11.9,28.2c5.1,8.6,11.3,16.6,18.5,23.8c7.2,7.2,15.2,13.4,23.8,18.5s18,9.1,28.2,11.9c10.1,2.8,20.6,4.2,31.4,4.2c16.1,0,31.4-3.1,45.9-9.4c14.5-6.3,27.1-14.6,37.6-25.1s18.9-23,25.1-37.6c6.3-14.5,9.4-29.9,9.4-45.9c0-16-3.1-31.4-9.4-45.9C230.3,67.6,222,55,211.5,44.5s-23-18.9-37.6-25.1C159.4,13.1,144.1,10,128,10L128,10z M184.9,108.4l-67.7,68.5v0.3c-0.4,0.4-0.9,0.7-1.6,1.1c-0.2,0-0.3,0-0.4,0.1c-0.1,0.1-0.2,0.2-0.4,0.3c-0.2,0.1-0.4,0.2-0.5,0.4c-1.1,0.4-2.1,0.5-3.2,0.5s-2.1-0.2-3.2-0.5l-0.5-0.5c-0.2,0-0.3-0.1-0.3-0.3c-1.1-0.5-1.7-0.9-1.9-1.1V177H105l-33.3-34.1c-1.1-1.1-1.8-2.3-2.1-3.8c-0.4-1.5-0.3-3,0.1-4.4c0.4-1.4,1.2-2.7,2.3-4c1.6-1.6,3.6-2.3,5.9-2.2c2.4,0.1,4.4,0.9,5.9,2.5l27.3,28.1L173,96.5c1.6-1.6,3.6-2.4,5.9-2.4c2.4,0,4.4,0.8,5.9,2.4s2.4,3.6,2.5,5.9C187.5,104.9,186.6,106.8,184.9,108.4L184.9,108.4z" /></g></g>
                            </svg> : data.dataAlert["status"] === "false" ?
                                <svg className="icon-false-alert" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                    <g><g><path d="M128,10C62.8,10,10,62.8,10,128c0,65.2,52.8,118,118,118c65.2,0,118-52.8,118-118C246,62.8,193.2,10,128,10L128,10z M180.3,168.4c3.3,3.3,3.3,8.6,0,11.9c-1.6,1.6-3.8,2.5-6,2.5c-2.2,0-4.3-0.8-5.9-2.5L128,139.9l-40.4,40.4c-1.6,1.6-3.8,2.5-5.9,2.5c-2.2,0-4.3-0.8-5.9-2.5c-3.3-3.3-3.3-8.6,0-11.9l40.4-40.4L75.7,87.6c-3.3-3.3-3.3-8.6,0-11.9c3.3-3.3,8.6-3.3,11.9,0l40.4,40.4l40.4-40.4c3.3-3.3,8.6-3.3,11.9,0c3.3,3.3,3.3,8.6,0,11.9L139.9,128L180.3,168.4L180.3,168.4z" /></g></g>
                                </svg>
                                : data.dataAlert["status"] === "warning" ?
                                    <svg className="icon-warning-alert" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                        <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                        <g><g><g><path d="M124.3,29.1c-5.3,1.2-11.5,5.7-15,10.9c-1.5,2.1-92.2,150.4-94.9,155.2c-8.5,14.7-4.3,27.6,10.2,31.4c3,0.8,9.8,0.8,103.4,0.8c93.7,0,100.4,0,103.4-0.8c12.2-3.1,17.2-12.5,13.2-24.7c-1.5-4.6,2.3,1.7-53.5-89.5c-39.2-64.2-44.5-72.6-47.5-75.8C137.7,30.2,130.9,27.6,124.3,29.1z M140.7,94c0,14-0.1,15.2-2.8,43.8c-1.5,16.1-3,30.1-3.1,30.9l-0.3,1.5H128h-6.5l-0.3-2c-0.1-1.1-1.5-14.9-3.1-30.7c-2.8-28.2-2.8-29.1-2.8-43.3V79.7H128h12.7L140.7,94L140.7,94z M139.8,190v11.7H128h-11.7V190v-11.7H128h11.7V190z" /></g></g></g>
                                    </svg>
                                    : data.dataAlert["status"] === "interrogative" ? <div>
                                        <svg className="icon-interrogative-alert interrogative-rotate-alert" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >

                                            <g><g><g><path  d="M121.4,10.3c-17.5,1.3-34.1,7.8-47.2,18.5c-14,11.4-23.3,28.9-23.5,44.1c-0.1,6.1,0.6,8.4,3.7,12.6c4.6,6.1,10.1,8.7,17.8,8.3c3.6-0.1,4.8-0.4,7.2-1.6c5.7-2.7,8.9-7.1,11.5-15.8c2.7-8.8,7.3-16.8,13.1-22.7c6.1-6.3,14.4-9.2,25.9-9.2c10.2,0,17.3,2.6,23.8,8.7c6.7,6.3,8.9,10.9,8.9,18.8c0,5.5-1,8.9-4.1,13.9c-2.9,4.7-6.8,8.7-18.4,19c-12.1,10.7-20.5,19-23.5,23.2c-7.3,9.9-10.7,19.5-11.2,32.1c-0.5,11.7,2.6,18.4,10.4,22c3,1.4,3.3,1.5,8.9,1.5c5.3,0,6-0.1,8.3-1.2c6.3-3,8.3-6.5,10.4-18.2c2.3-12.9,4.6-16.1,26.5-36c14.8-13.4,22-20.9,26-26.9c12.5-18.7,12.5-41.3,0.2-60.4c-9.4-14.5-26-24.9-45.8-29C141.4,10.2,130.5,9.6,121.4,10.3z" /><path  d="M120.2,196c-8.8,1.9-16.6,9.4-18.8,18c-0.9,3.5-0.9,9.9,0,13.4c3,11.4,14.7,19.6,26.6,18.5c9.7-0.9,17.9-7.1,21.6-16.7c0.9-2.4,1.1-3.6,1.1-8.5c0-5.2-0.1-6.1-1.2-8.9c-2.5-6.3-6.7-10.9-12.6-13.7C131.2,195.4,126.1,194.8,120.2,196z" /></g></g></g>
                                        </svg>  <svg  className="icon-interrogative-alert" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >

                                            <g><g><g><path  d="M121.4,10.3c-17.5,1.3-34.1,7.8-47.2,18.5c-14,11.4-23.3,28.9-23.5,44.1c-0.1,6.1,0.6,8.4,3.7,12.6c4.6,6.1,10.1,8.7,17.8,8.3c3.6-0.1,4.8-0.4,7.2-1.6c5.7-2.7,8.9-7.1,11.5-15.8c2.7-8.8,7.3-16.8,13.1-22.7c6.1-6.3,14.4-9.2,25.9-9.2c10.2,0,17.3,2.6,23.8,8.7c6.7,6.3,8.9,10.9,8.9,18.8c0,5.5-1,8.9-4.1,13.9c-2.9,4.7-6.8,8.7-18.4,19c-12.1,10.7-20.5,19-23.5,23.2c-7.3,9.9-10.7,19.5-11.2,32.1c-0.5,11.7,2.6,18.4,10.4,22c3,1.4,3.3,1.5,8.9,1.5c5.3,0,6-0.1,8.3-1.2c6.3-3,8.3-6.5,10.4-18.2c2.3-12.9,4.6-16.1,26.5-36c14.8-13.4,22-20.9,26-26.9c12.5-18.7,12.5-41.3,0.2-60.4c-9.4-14.5-26-24.9-45.8-29C141.4,10.2,130.5,9.6,121.4,10.3z" /><path  d="M120.2,196c-8.8,1.9-16.6,9.4-18.8,18c-0.9,3.5-0.9,9.9,0,13.4c3,11.4,14.7,19.6,26.6,18.5c9.7-0.9,17.9-7.1,21.6-16.7c0.9-2.4,1.1-3.6,1.1-8.5c0-5.2-0.1-6.1-1.2-8.9c-2.5-6.3-6.7-10.9-12.6-13.7C131.2,195.4,126.1,194.8,120.2,196z" /></g></g></g>
                                        </svg>
                                    </div> : "" : <h4>{"icon"}</h4>}

                    </div>
                    <h4 className="titulo-alert">
                        {data.dataAlert["tittle"] ? data.dataAlert["status"] === "warning" ? <span className="tittle-warning-alert">{data.dataAlert["tittle"]}</span> : data.dataAlert["tittle"] : "Alerta"}
                    </h4>
                    <div className="description-alert">
                        {data.dataAlert["description"] ? data.dataAlert["description"] : "Esta es una alerta"}
                    </div>
                    <div className="inputs-alert">
                        {data.dataAlert["status"] ?
                            data.dataAlert["status"] === "true" || data.dataAlert["status"] === "false" ?
                                <button onClick={() => {
                                    data.setStatusAlert(false);
                                    if (data.dataAlert["continue"]) {
                                        if (data.dataAlert["continue"]["function"]) {
                                            data.dataAlert.continue.function()
                                        }

                                    }
                                }}
                                    className="input-alert input-ok-alert">Ok</button>
                                : data.dataAlert["status"] === "warning" ?
                                    <div className="div-content-inpunts-alert">
                                        <button onClick={() => { data.setStatusAlert(false); }} className="input-alert input-cancelar-alert">Cancelar</button>
                                        <button onClick={() => {
                                            data.setStatusAlert(false);
                                            if (data.dataAlert["continue"]) {
                                                if (data.dataAlert["continue"]["function"]) {
                                                    data.dataAlert.continue.function()
                                                }

                                            }
                                        }} className="input-alert input-warning-alert">Continuar</button>
                                    </div>
                                    :  data.dataAlert["status"] === "interrogative" ?  <button onClick={() => { if(data.dataAlert.continue.location ){location.href = data.dataAlert.continue.location}else{location.href = "/"}}} className="input-alert input-entiendo-alert">Entiendo</button> : <button onClick={() => { data.setStatusAlert(false) }} className="input-alert input-cancelar-alert">Cancelar</button> :
                            <button onClick={() => { data.setStatusAlert(false) }} className="input-alert input-cancelar-alert">Cancelar</button>}
                    </div>
                </div>
            </div>
        </>
    )
}