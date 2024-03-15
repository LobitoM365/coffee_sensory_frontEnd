let contentForm = document.getElementById("contentForm");
let puntoUbicacion = document.querySelectorAll(".svg-ubicacion-cafe");
let templateModal = contentForm.cloneNode(true);
contentForm.innerHTML = "";
contentForm.remove()
let count = 0;

console.log(puntoUbicacion)
for (let x = 0; x < puntoUbicacion.length; x++) {
    puntoUbicacion[x].addEventListener("click", function () {
        document.body.append(templateModal)
        window.addEventListener("resize", resizeModal())
        resizeModal()
        setTimeout(() => {
            getResizeFormatoSca()
        }, 200);
        document.dispatchEvent(eventoElementoInsertado);
    })


}

const eventoElementoInsertado = new Event('iframeFormatoSca');




function resizeModal() {
    let modalForm = document.querySelectorAll(".div-modal-form");
    let divContentForm = document.querySelectorAll(".div-content-modal");
    let divFondomodalForm = document.querySelectorAll(".div-fondo-modal ");

    for (let m = 0; m < modalForm.length; m++) {
        if ((divContentForm[m].scrollHeight + 100) > document.body.clientHeight) {

            modalForm[m].style.alignItems = "unset"
            modalForm[m].style.padding = "20px 20px"
            modalForm[m].style.height = "calc(100% - 40px)"
            modalForm[m].style.width = "calc(100% - 40px)"
            if (divFondomodalForm[m]) {
                divFondomodalForm[m].style.height = divContentForm[m].clientHeight + 40 + "px"
                divFondomodalForm[m].style.width = modalForm[m].clientWidth + "px"
            }
        } else {
            if (divFondomodalForm[m]) {
                divFondomodalForm[m].style.height = "100vh"
                divFondomodalForm[m].style.width = "100vw"
            }
            modalForm[m].style.alignItems = "center"
            modalForm[m].style.justifyContent = ""
            modalForm[m].style.padding = ""
            modalForm[m].style.height = "100%"
            modalForm[m].style.width = "100%"
        }

    }
}


function resizeFormatoSca() {
    const iframeFormatoSca = document.getElementById("iframeFormatoSca");
    if (iframeFormatoSca) {
        const iframeFormatoScaContentDocument = iframeFormatoSca.contentDocument;
        const formatoSca = iframeFormatoScaContentDocument.getElementById("contenidoFormatoSca");
        if (formatoSca) {
            iframeFormatoSca.style.height = "calc(" + formatoSca.clientHeight + "px" + " + 7px)"
        }

    }
}

function getResizeFormatoSca() {
    let iframeFormatoSca = document.getElementById("iframeFormatoSca")
    const resizeObserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
            if (entries) {
                resizeFormatoSca();
            }
        });
    });
    if (iframeFormatoSca) {
        resizeObserver.observe(iframeFormatoSca);
        resizeFormatoSca();
    }
    resizeFormatoSca();

}
const dataFormatoSensorial = [
    {
        "notas": "noaplica",
        "usuario_catador_telefono": "3214571356",
        "usuario_catador_correo": "catador@gmail.com",
        "usuario_catador_documento": "1095218090",
        "usuario_catador_nombre": "catador nuevo",
        "usuario_owner_documento": "1231231232",
        "usuario_owner_nombre": "cliente cliente",
        "an_id": 5,
        "ca_id": 12,
        "nombre": "colombia",
        "estado": 1,
        "usuario_owner": 7,
        "usuario_catador": 8,
        "analisis": 5,
        "fragancia_aroma": 9.25,
        "sabor": 8.75,
        "acidez": 8.25,
        "cuerpo": 7.75,
        "uniformidad": 8,
        "balance": 7.75,
        "seco": 3.5999999046325684,
        "sabor_residual": 6,
        "taza_limpia": 10,
        "dulzor": 4,
        "puntaje_catador": 8.5,
        "tazas": 1,
        "intensidad": 3.5999999046325684,
        "espuma": 3.299999952316284,
        "nivel_cuerpo": 3.299999952316284,
        "tueste": 3,
        "puntaje_total": null
    }
]

function setElementsTemplateFormatoSca(idElement, data, setInputs) {
    if (data) {
        let iframe = document.getElementById(idElement);
        if (iframe) {

            let keysRange = ["fragancia_aroma", "sabor", "sabor_residual", "acidez", "cuerpo", "balance", "puntaje_catador"]
            let keysIntensidad = ["seco", "espuma", "intensidad", "nivel_cuerpo", "tueste"]
            let keysCuadro = ["uniformidad", "taza_limpia", "dulzor"]
            let keysNormal = ["tazas"]

            let keysResult = Object.keys(data[0])
            let content = iframe.contentDocument

            let puntajeTotal = content.getElementById("puntajeTotal")
            let intensiadDefectos = content.getElementById("intensidadDefectos")
            let resultadoTazasXIntensidad = content.getElementById("resultadoTazasXIntensidad")
            let puntajeFinal = content.getElementById("puntajeFinal")
            let notas = content.getElementById("div-notas")
            let textNotas = content.getElementById("notas")
            if (textNotas) {
                textNotas.innerHTML = data[0].notas
            }

            let valuePuntajeTotal = ((data[0].fragancia_aroma ? data[0].fragancia_aroma : 0) + (data[0].sabor ? data[0].sabor : 0) + (data[0].sabor_residual ? data[0].sabor_residual : 0) + (data[0].acidez ? data[0].acidez : 0) + (data[0].cuerpo ? data[0].cuerpo : 0) + (data[0].uniformidad ? data[0].uniformidad : 0) + (data[0].taza_limpia ? data[0].taza_limpia : 0) + (data[0].balance ? data[0].balance : 0) + (data[0].dulzor ? data[0].dulzor : 0) + (data[0].puntaje_catador ? data[0].puntaje_catador : 0))
            let valueTazasXIntensidad = ((data[0].tazas ? data[0].tazas : 0) * (data[0].intensidad ? data[0].intensidad : 0)).toFixed(1);
            if (puntajeTotal) {
                puntajeTotal.innerHTML = valuePuntajeTotal;
            }
            if (intensiadDefectos) {
                intensiadDefectos.innerHTML = (data[0].intensidad ? data[0].intensidad : 0) < 10 ? (data[0].intensidad ? data[0].intensidad : 0).toFixed(1) : (data[0].intensidad ? data[0].intensidad : 0);
            }
            if (resultadoTazasXIntensidad) {
                resultadoTazasXIntensidad.innerHTML = valueTazasXIntensidad;
            }
            if (puntajeFinal) {
                puntajeFinal.innerHTML = valuePuntajeTotal - valueTazasXIntensidad;
            }
            if (notas) {
                notas.innerHTML = (data[0].notas ? data[0].notas : "No registra");
            }
            for (let r = 0; r < keysRange.length; r++) {
                if (keysResult.includes(keysRange[r])) {
                    let divElement = content.getElementById("div-" + keysRange[r])
                    let divElementInput = content.getElementById(keysRange[r])
                    if (divElementInput) {
                        divElementInput.value = data[0][keysRange[r]]
                    }
                    if (divElement) {
                        let range = divElement.querySelectorAll(".value-range-item")
                        let puntaje = divElement.querySelectorAll(".puntaje-range ")
                        if (data[0][keysRange[r]]) {

                            if (range.length > 0) {
                                range[0].style.width = "calc(" + ((data[0][keysRange[r]] - 6) / 4) * 100 + "% - 2px )";
                                range[0].style.height = "100%"


                            }
                            if (puntaje.length > 0) {
                                puntaje[0].innerHTML = data[0][keysRange[r]]
                            }
                        }
                    }

                }
            }
            for (let i = 0; i < keysIntensidad.length; i++) {
                if (keysResult.includes(keysIntensidad[i])) {
                    let divElement = content.getElementById("div-" + keysIntensidad[i])
                    let divElementInput = content.getElementById(keysIntensidad[i])
                    if (divElementInput) {
                        divElementInput.value = data[0][keysIntensidad[i]]
                    }
                    if (divElement) {
                        let range = divElement.querySelectorAll(".range-color-intensidad")
                        if (range.length > 0) {
                            if (data[0][keysIntensidad[i]]) {
                                range[0].style.height = "calc(" + ((data[0][keysIntensidad[i]] / (keysIntensidad[i] != "tueste" ? 5 : 4)) * 100) + "%)"
                            }
                        }
                    }

                }
            }
            for (let c = 0; c < keysCuadro.length; c++) {
                if (keysResult.includes(keysCuadro[c])) {
                    let divElement = content.getElementById("div-" + keysCuadro[c])
                    if (divElement) {
                        let cuadro = divElement.querySelectorAll(".cuadro-select")
                        let puntaje = divElement.querySelectorAll(".puntaje-select")
                        if (data[0][keysCuadro[c]] != undefined) {

                            if (cuadro.length > 0) {

                                for (let cs = 0; cs < (5 - (data[0][keysCuadro[c]] / 2)); cs++) {
                                    cuadro[cs].classList.add("focus-cuadro-select")

                                }

                            }
                            if (puntaje.length > 0) {
                                puntaje[0].innerHTML = data[0][keysCuadro[c]]
                            }
                        }

                    }
                }
            }
            for (let n = 0; n < keysNormal.length; n++) {
                if (keysResult.includes(keysNormal[n])) {
                    let divElement = content.getElementById("div-" + keysNormal[n])
                    let divElementInput = content.getElementById(keysNormal[n])
                    if (divElementInput) {
                        divElementInput.value = data[0][keysNormal[n]]
                    }
                    if (data[0][keysNormal[n]]) {
                        if (divElement) {
                            divElement.innerHTML = data[0][keysNormal[n]];
                        }
                    }
                }
            }
        }
    }

}

setElementsTemplateFormatoSca("iframeFormatoSca", dataFormatoSensorial)