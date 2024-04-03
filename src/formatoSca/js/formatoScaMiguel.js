

let valueRangeIntensidad = document.querySelectorAll(".value-range-intensidad");
let rangeIntensidad = document.querySelectorAll(".range-intensidad");
let puntajeRange = document.querySelectorAll(".puntaje-range ");
let puntajeSelect = document.querySelectorAll(".puntaje-select ");
let rangePuntaje = document.querySelectorAll(".range-puntaje ");
let cuadroSelect = document.querySelectorAll(".cuadro-select ");
let rangeColor = document.querySelectorAll(".range-color");
let divRangeColorIntensidad = document.querySelectorAll(".div-range-color-intensidad");
let resultadoTazasXIntensidad = document.getElementById("resultadoTazasXIntensidad");
let puntajeTotal = document.getElementById("puntajeTotal");
let puntajeFinal = document.getElementById("puntajeFinal");
let defectos = document.getElementById("defectos");
let intensidad = document.getElementById("intensidad");
let tazas = document.getElementById("tazas");
let defectosRechazo = document.getElementById("defectosRechazo");
let defectosLigero = document.getElementById("defectosLigero");
/* let notas = document.getElementById("notas"); */
let tazasValue;
let defectosValue;

function getPuntajeFinal() {
    let FocusCuadro = document.querySelectorAll(".focus-cuadro-select");
    let puntajeFinalValue = (parseFloat(document.getElementById("fragancia_aroma").value ? document.getElementById("fragancia_aroma").value : 0) + parseFloat(document.getElementById("sabor").value ? document.getElementById("sabor").value : 0) + parseFloat(document.getElementById("sabor_residual").value ? document.getElementById("sabor_residual").value : 0) + parseFloat(document.getElementById("acidez").value ? document.getElementById("acidez").value : 0) + parseFloat(document.getElementById("cuerpo").value ? document.getElementById("cuerpo").value : 0) + parseFloat(document.getElementById("balance").value ? document.getElementById("balance").value : 0) + parseFloat(document.getElementById("puntaje_catador").value ? document.getElementById("puntaje_catador").value : 0)) + (30 - (FocusCuadro.length * 2)) - (parseFloat(tazasValue ? tazasValue : 0) * parseFloat(defectosValue ? defectosValue : 0));
    puntajeFinal.innerHTML = puntajeFinalValue >= 0 ? puntajeFinalValue : 0
}

function getPuntajeTotal() {
    let resultadoRangePuntaje = 0;
    let resultadoCuadroSelectPuntaje = 0;
    for (let x = 0; x < puntajeSelect.length; x++) {
        resultadoCuadroSelectPuntaje = resultadoCuadroSelectPuntaje + parseFloat(puntajeSelect[x].innerHTML);
    }
    for (let u = 0; u < rangePuntaje.length; u++) {
        resultadoRangePuntaje = resultadoRangePuntaje + parseFloat(rangePuntaje[u].value);
    }
    let contador = 0;
    for (let u = 0; u < rangePuntaje.length; u++) {
        if (rangePuntaje[u].classList.contains("true")) {
            contador = contador + 1;
        }

    }
    /*  let contadorCuadroSelect = 0;
     for (let x = 0; x < puntajeSelect.length; x++) {
         if (puntajeSelect[x].innerHTML == 0) {
             contadorCuadroSelect = 1;
         }
     } */

    // if (contador == 7  /* contadorCuadroSelect == 0 */) {
    //     let resultadoPuntajeTotal = resultadoRangePuntaje + resultadoCuadroSelectPuntaje;
    //     puntajeTotal.innerHTML = resultadoPuntajeTotal;
    // }
    let resultadoPuntajeTotal = resultadoRangePuntaje + resultadoCuadroSelectPuntaje;
    puntajeTotal.innerHTML = resultadoPuntajeTotal;
}

defectosLigero.addEventListener("click", function () {
    defectosRechazo.classList.remove("defectos-focus")
    if (defectosValue == 2) {
        defectosLigero.classList.remove("defectos-focus")
        defectos.innerHTML = 0;
        defectosValue = 0
    } else {
        defectosLigero.classList.add("defectos-focus")
        defectos.innerHTML = 2;
        defectosValue = 2
    }

    getValueDefectosTotales()
    getPuntajeFinal()
})
defectosRechazo.addEventListener("click", function () {
    defectosLigero.classList.remove("defectos-focus")
    if (defectosValue == 4) {
        defectosRechazo.classList.remove("defectos-focus")
        defectos.innerHTML = 0;
        defectosValue = 0
    } else {
        defectosRechazo.classList.add("defectos-focus")
        defectos.innerHTML = 4;
        defectosValue = 4
    }
    getValueDefectosTotales()
    getPuntajeFinal()
})
/* intensidad.addEventListener("input", function () {
    intensidadDefectos.innerHTML = intensidad.value;
}) */
function getValueDefectosTotales() {

    tazasValue = tazas.value

    if (!defectosValue) {
        if (parseFloat(defectos.innerHTML) == 4 || parseFloat(defectos.innerHTML) == 2) {
            defectosValue = parseFloat(defectos.innerHTML)
        } else {
            defectosValue = 0
        }
    }
    console.log(defectosValue, tazasValue, tazas.value, tazasValue, parseFloat(defectos.innerHTML), "valllllllllll")
    /* resultadoTazasXIntensidad.innerHTML = tazas.value != "" ? !Number.isInteger((tazas.value * intensidad.value)) ? (tazas.value * intensidad.value).toFixed(1) : (tazas.value * intensidad.value) : ""; */
    if (!isNaN(tazasValue * defectosValue)) {
        resultadoTazasXIntensidad.innerHTML = tazasValue != "" ? !Number.isInteger((tazasValue * defectosValue)) ? (tazasValue * defectosValue).toFixed(1) : (tazasValue * defectosValue) : "";
    } else {
        resultadoTazasXIntensidad.innerHTML = 0
    }
    getPuntajeFinal()
}
tazas.addEventListener("input", function () {
    tazas.value = tazas.value.replace(/\D/g, '')
    if (tazas.value > 10) {
        tazas.value = 10
    } else if (tazas.value < 0) {
        tazas.value = 0
    }
    tazasValue = tazas.value
    getValueDefectosTotales()
})

for (let RI = 0; RI < rangeIntensidad.length; RI++) {
    rangeIntensidad[RI].addEventListener("input", function () {
        valueRangeIntensidad[RI].innerHTML = rangeIntensidad[RI].value;
        if (RI == 0) {

        } else {
            divRangeColorIntensidad[RI - 1].style.height = ((rangeIntensidad[RI].value / 5) * 100) + "%";
        }
    })
}

for (let RI = 0; RI < 1; RI++) {
    rangeIntensidad[RI].addEventListener("input", function () {
        valueRangeIntensidad[RI].innerHTML = rangeIntensidad[RI].value;
        let cantidadColores = rangeColor[RI].querySelectorAll(".color");
        rangeColor[RI].style.height = ((rangeIntensidad[RI].value / cantidadColores.length) * 100) + "%";
    })
}



for (let x = 0; x < rangePuntaje.length; x++) {

    rangePuntaje[x].addEventListener("mousedown", function () {
        rangePuntaje[x].classList.add("true")
        for (let u = 0; u < rangePuntaje.length; u++) {

        }
    })

    rangePuntaje[x].addEventListener("input", function () {
        getPuntajeFinal()
        puntajeRange[x].innerHTML = rangePuntaje[x].value;

        let totalTazasXIntensidad = 1;
        let contadorInput = 0;
        getPuntajeTotal()
    })

}
for (let CS = 0; CS < cuadroSelect.length; CS++) {

    if (CS >= 0 && CS <= 4) {
        cuadroSelect[CS].addEventListener("click", function () {
            let valorCuadroSelect = 0;
            let focusCuadro = 0
            for (let x = 0; x <= 4; x++) {
                if (cuadroSelect[x].classList.contains("focus-cuadro-select")) {
                    focusCuadro = focusCuadro + 1
                }
            }

            if (cuadroSelect[CS].classList.contains("focus-cuadro-select")) {
                if (focusCuadro == ((CS) + 1)) {
                    cuadroSelect[CS].classList.remove("focus-cuadro-select")
                } else {
                    valorCuadroSelect = valorCuadroSelect + 1;
                }
            } else {
                cuadroSelect[CS].classList.add("focus-cuadro-select")
                valorCuadroSelect = valorCuadroSelect + 1;
            }
            for (let CSF = 0; CSF <= 4; CSF++) {
                if (CSF < CS) {
                    cuadroSelect[CSF].classList.add("focus-cuadro-select")
                    valorCuadroSelect = valorCuadroSelect + 1;
                } else if (CSF > CS) {
                    cuadroSelect[CSF].classList.remove("focus-cuadro-select")
                }

            }

            puntajeSelect[0].innerHTML = 10 - (valorCuadroSelect * 2);
        })
    }
    if (CS >= 5 && CS <= 9) {
        cuadroSelect[CS].addEventListener("click", function () {
            let valorCuadroSelect = 0;
            let focusCuadro = 0
            for (let x = 5; x <= 9; x++) {
                if (cuadroSelect[x].classList.contains("focus-cuadro-select")) {
                    focusCuadro = focusCuadro + 1
                }
            }

            if (cuadroSelect[CS].classList.contains("focus-cuadro-select")) {
                if (focusCuadro == ((CS - 5) + 1)) {
                    cuadroSelect[CS].classList.remove("focus-cuadro-select")
                } else {
                    valorCuadroSelect = valorCuadroSelect + 1;
                }
            } else {
                cuadroSelect[CS].classList.add("focus-cuadro-select")
                valorCuadroSelect = valorCuadroSelect + 1;
            }
            for (let CSF = 5; CSF <= 9; CSF++) {
                if (CSF < CS) {
                    cuadroSelect[CSF].classList.add("focus-cuadro-select")
                    valorCuadroSelect = valorCuadroSelect + 1;
                } else if (CSF > CS) {
                    cuadroSelect[CSF].classList.remove("focus-cuadro-select")
                }

            }

            puntajeSelect[1].innerHTML = 10 - (valorCuadroSelect * 2);
        })
    }
    if (CS >= 10 && CS <= 14) {
        cuadroSelect[CS].addEventListener("click", function () {
            let valorCuadroSelect = 0;
            let focusCuadro = 0
            for (let x = 10; x <= 14; x++) {
                if (cuadroSelect[x].classList.contains("focus-cuadro-select")) {
                    focusCuadro = focusCuadro + 1
                }
            }

            if (cuadroSelect[CS].classList.contains("focus-cuadro-select")) {
                if (focusCuadro == ((CS - 10) + 1)) {
                    cuadroSelect[CS].classList.remove("focus-cuadro-select")
                } else {
                    valorCuadroSelect = valorCuadroSelect + 1;
                }
            } else {
                cuadroSelect[CS].classList.add("focus-cuadro-select")
                valorCuadroSelect = valorCuadroSelect + 1;
            }
            for (let CSF = 10; CSF <= 14; CSF++) {
                if (CSF < CS) {
                    cuadroSelect[CSF].classList.add("focus-cuadro-select")
                    valorCuadroSelect = valorCuadroSelect + 1;
                } else if (CSF > CS) {
                    cuadroSelect[CSF].classList.remove("focus-cuadro-select")
                }

            }

            puntajeSelect[2].innerHTML = 10 - (valorCuadroSelect * 2);
        })
    }

}
for (let CS = 0; CS < cuadroSelect.length; CS++) {
    cuadroSelect[CS].addEventListener("click", function () {
        getPuntajeFinal()
        let resultadoRangePuntaje = 0;
        let resultadoCuadroSelectPuntaje = 0;
        for (let x = 0; x < puntajeSelect.length; x++) {
            resultadoCuadroSelectPuntaje = resultadoCuadroSelectPuntaje + parseFloat(puntajeSelect[x].innerHTML);
        }
        for (let u = 0; u < rangePuntaje.length; u++) {
            resultadoRangePuntaje = resultadoRangePuntaje + parseFloat(rangePuntaje[u].value);
        }
        let contador = 0;
        for (let u = 0; u < rangePuntaje.length; u++) {
            if (rangePuntaje[u].classList.contains("true")) {
                contador = contador + 1;
            }

        }

        getPuntajeTotal()
        /*  if (contador == 7) {
             let resultadoPuntajeTotal = resultadoRangePuntaje + resultadoCuadroSelectPuntaje;
             puntajeTotal.innerHTML = resultadoPuntajeTotal;
         }
  */
    })
}

getPuntajeFinal()
getPuntajeTotal()
getValueDefectosTotales()

/* let button = document.getElementById("button");
let notasDiv = document.getElementById("notasDiv");
notas.addEventListener("input", function () {
    console.log(notas.scrollHeight)
    if(notas.scrollHeight != notasDiv.scrollHeight){
        button.style.display = "block";
    }else{
        button.style.display = "none";
        notasDiv.style.height =  notas.scrollHeight + "px";
    }
})

button.addEventListener("click", function(){
    notasDiv.style.height = notas.scrollHeight + "px";
}) */