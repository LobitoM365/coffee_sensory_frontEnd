
let valueRangeIntensidad = document.querySelectorAll(".value-range-intensidad");
let rangeIntensidad = document.querySelectorAll(".range-intensidad");
let puntajeRange = document.querySelectorAll(".puntaje-range ");
let puntajeSelect = document.querySelectorAll(".puntaje-select ");
let rangePuntaje = document.querySelectorAll(".range-puntaje ");
let cuadroSelect = document.querySelectorAll(".cuadro-select ");
let rangeColor = document.querySelectorAll(".range-color");
let divRangeColorIntensidad = document.querySelectorAll(".div-range-color-intensidad");
let inputTazasIntensidad = document.querySelectorAll(".inputTazasIntensidad");
let resultadoTazasXIntensidad = document.getElementById("resultadoTazasXIntensidad");
let puntajeTotal = document.getElementById("puntajeTotal");
let puntajeFinal = document.getElementById("puntajeFinal");
/* let notas = document.getElementById("notas"); */

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
        puntajeRange[x].innerHTML = rangePuntaje[x].value;
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

        if (contador == 7  /* contadorCuadroSelect == 0 */) {
            let resultadoPuntajeTotal = resultadoRangePuntaje + resultadoCuadroSelectPuntaje;
            puntajeTotal.innerHTML = resultadoPuntajeTotal;
        }
        let totalTazasXIntensidad = 1;
        let contadorInput = 0;
        for (let x = 0; x < inputTazasIntensidad.length; x++) {
            totalTazasXIntensidad = 1;
            contadorInput = 0;
            for (let u = 0; u < inputTazasIntensidad.length; u++) {
                if (inputTazasIntensidad[x].value == 0 && inputTazasIntensidad[u].value != 0) {
                    resultadoTazasXIntensidad.innerHTML = inputTazasIntensidad[u].value;
                } else if (inputTazasIntensidad[u].value != 0) {
                    totalTazasXIntensidad = parseFloat(totalTazasXIntensidad) * parseFloat(inputTazasIntensidad[u].value);
                } else if (inputTazasIntensidad[u].value == 0) {
                    contadorInput = 1;
                }
            }
        }
        console.log(contadorInput)
        for (let u = 0; u < inputTazasIntensidad.length; u++) {
            if (contadorInput == 0 && contador == 7) {
                puntajeFinal.innerHTML = parseFloat(puntajeTotal.innerHTML) - parseFloat(resultadoTazasXIntensidad.innerHTML);
            }
        }
        console.log(puntajeTotal)
    })

}
for (let CS = 0; CS < cuadroSelect.length; CS++) {

    if (CS >= 0 && CS <= 4) {
        cuadroSelect[CS].addEventListener("click", function () {

            for (let CSF = 0; CSF <= 4; CSF++) {
                if (CSF <= CS) {
                    cuadroSelect[CSF].classList.add("focus-cuadro-select")
                } else if (CSF > CS) {
                    cuadroSelect[CSF].classList.remove("focus-cuadro-select")
                }

            }
            let valorCuadroSelect = 0;
            for (let x = 0; x <= 4; x++) {
                if (cuadroSelect[x].classList.contains("focus-cuadro-select")) {
                    valorCuadroSelect = valorCuadroSelect + 1;
                }

            }
            puntajeSelect[0].innerHTML = 10 - (valorCuadroSelect * 2);
            console.log(valorCuadroSelect)
        })
    }
    if (CS >= 5 && CS <= 9) {
        cuadroSelect[CS].addEventListener("click", function () {
            for (let CSF = 5; CSF <= 9; CSF++) {
                if (CSF <= CS) {
                    cuadroSelect[CSF].classList.add("focus-cuadro-select")
                } else if (CSF > CS) {
                    cuadroSelect[CSF].classList.remove("focus-cuadro-select")
                }


            }
            let valorCuadroSelect = 0;
            for (let x = 5; x <= 9; x++) {
                if (cuadroSelect[x].classList.contains("focus-cuadro-select")) {
                    valorCuadroSelect = valorCuadroSelect + 1;
                }

            }
            puntajeSelect[1].innerHTML = 10 - (valorCuadroSelect * 2);
            console.log(valorCuadroSelect)
        })
    }
    if (CS >= 10 && CS <= 14) {
        cuadroSelect[CS].addEventListener("click", function () {

            for (let CSF = 10; CSF <= 14; CSF++) {
                if (CSF <= CS) {
                    cuadroSelect[CSF].classList.add("focus-cuadro-select")
                } else if (CSF > CS) {
                    cuadroSelect[CSF].classList.remove("focus-cuadro-select")

                }
            }

            let valorCuadroSelect = 0;
            for (let x = 10; x <= 14; x++) {
                if (cuadroSelect[x].classList.contains("focus-cuadro-select")) {
                    valorCuadroSelect = valorCuadroSelect + 1;
                }

            }
            puntajeSelect[2].innerHTML = 10 - (valorCuadroSelect * 2);
            console.log(valorCuadroSelect)
        })
    }

}
for (let CS = 0; CS < cuadroSelect.length; CS++) {
    cuadroSelect[CS].addEventListener("click", function () {
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

        if (contador == 7) {
            let resultadoPuntajeTotal = resultadoRangePuntaje + resultadoCuadroSelectPuntaje;
            puntajeTotal.innerHTML = resultadoPuntajeTotal;
        }

    })
}
for (let x = 0; x < inputTazasIntensidad.length; x++) {
    inputTazasIntensidad[x].addEventListener("input", function () {
        resultadoTazasXIntensidad.innerHTML = inputTazasIntensidad[x].value;
        let totalTazasXIntensidad = 1;
        let contador = 0;
        for (let u = 0; u < inputTazasIntensidad.length; u++) {
            if (inputTazasIntensidad[x].value == 0 && inputTazasIntensidad[u].value != 0) {
                resultadoTazasXIntensidad.innerHTML = inputTazasIntensidad[u].value;
            } else if (inputTazasIntensidad[u].value != 0) {
                totalTazasXIntensidad = parseFloat(totalTazasXIntensidad) * parseFloat(inputTazasIntensidad[u].value);
            } else if (inputTazasIntensidad[u].value == 0) {
                contador = 1;
            }

        }

        if (contador == 0) {
            resultadoTazasXIntensidad.innerHTML = totalTazasXIntensidad;
        }
        let contadorInput = 0;
        for (let u = 0; u < rangePuntaje.length; u++) {
            if (rangePuntaje[u].classList.contains("true")) {
                contadorInput = contadorInput + 1;
            }

        }
        for (let u = 0; u < inputTazasIntensidad.length; u++) {
            if (contadorInput == 7 && contador == 0) {
                puntajeFinal.innerHTML = parseFloat(puntajeTotal.innerHTML) - parseFloat(resultadoTazasXIntensidad.innerHTML);
            }
        }
        console.log(resultadoTazasXIntensidad, puntajeTotal.innerHTML)
    })

}


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