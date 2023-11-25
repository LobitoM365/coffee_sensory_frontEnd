let colombia = document.getElementById("colombia");
let colombiaMapa = document.getElementById("colombiaMapa");
let ejeY = document.getElementById("ejeY");
let ejeX = document.getElementById("ejeX");
let imgColombia = document.getElementById("imgColombia");

let heightColombia = colombia.clientHeight;
ejeY.style.width = heightColombia + "px";
let departamento = document.querySelectorAll(".departamento")
let contenidoDepartamento = document.querySelectorAll(".contenido-departamento")
let bboxMapa = colombiaMapa.getBBox();
console.log(bboxMapa)
for (let d = 0; d < departamento.length; d++) {

    departamento[d].addEventListener("click", function () {
        let bboxDepartamento = departamento[d].getBBox();
        let posicionTopMapa = ((bboxDepartamento.y / bboxMapa.height) * 100) + (((bboxDepartamento.height / 2) / bboxMapa.height) * 100);
        let posicionLeftMapa = ((bboxDepartamento.x / bboxMapa.width) * 100) + (((bboxDepartamento.width / 2) / bboxMapa.width) * 100);
        console.log(bboxDepartamento)

        for (let dC = 0; dC < departamento.length; dC++) {
            if (dC == d) {
                /* departamento[d].style.fill = "green"; */
                departamento[d].style.stroke = "red";
                departamento[d].style.visibility = "hidden";
            } else {
                /* departamento[dC].style.fill = "white"; */
                departamento[dC].classList.add("fill-departamento")
                departamento[dC].style.stroke = "transparent";
                departamento[dC].style.visibility = "";

            }
        }
        imgColombia.style.bottom = "calc(-50% + " + posicionTopMapa + "%)";
        imgColombia.style.left = "calc(50% - " + posicionLeftMapa + "% )";
        if (bboxDepartamento.width > bboxDepartamento.height * 2.5) {
            colombia.style.transform = "scale(" + ((bboxMapa.width * 2.8 / bboxDepartamento.width)) + ")";
        } else {
            colombia.style.transform = "scale(" + ((bboxMapa.height / bboxDepartamento.height)) + ")";
        }

    })
}

for (let x = 0; x < contenidoDepartamento.length; x++) {
    contenidoDepartamento[x].addEventListener("click", function () {
        
        alert("xd")
    })
}