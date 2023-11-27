window.addEventListener("load", function () {

    ///Hacer que el mapa no crezca mas del 100% del height de la pantalla
    let divMapa = document.getElementById("divMapa");
    let contenido = document.getElementById("contenido");
    let contentMapa = document.getElementById("contentMapa");
    let mapa = document.getElementById("mapa");
    let directionContent;
    let heightContent;
    let predominate = "Width";

    if (window.innerHeight + 76 >= window.screen.availHeight) {
        heightContent = window.screen.availHeight - 76;
    } else {
        heightContent = document.body.scrollHeight;
    }

    if (document.body.scrollWidth > document.body.scrollHeight) {
        predominate = "Height"
    } else {
        predominate = "Width"
    }
    let directionContentInicial = window.screen["avail" + predominate];

    function getSizeMap(element) {

        if (window.innerHeight + 76 >= window.screen["avail" + element]) {
            directionContent = window.screen["avail" + element] - 76;
        } else {
            directionContent = document.body["scroll" + element];

        }
        if (document.body.scrollWidth > document.body.scrollHeight) {
            element = "Height"

        } else {
            element = "Width"
        }
        directionContent = document.body["scroll" + element];
        zoomDivMapa = (directionContent / divMapa["scroll" + element]) * 100;
        if (directionContent < contentMapa["scroll" + element] || directionContent <= directionContentInicial) {
            divMapa.style.zoom = zoomDivMapa + "%"
        }
        window.addEventListener("resize", function () {

            if (document.body.scrollWidth > document.body.scrollHeight) {
                element = "Height"

            } else {
                element = "Width"
            }
            directionContent = document.body["scroll" + element];
            zoomDivMapa = (directionContent / divMapa["scroll" + element]) * 100;
            if ( directionContent <= directionContentInicial ) {
                divMapa.style.zoom = zoomDivMapa + "%"
            }
        })
    }

    getSizeMap(predominate)


    ///Al dar click en  el departamento centra en relacion a su contenedor
    let departamentos = document.querySelectorAll(".departamento");
    let divContentMapa = document.getElementById("divContentMapa");
    let svgMapa = document.getElementById("svgMapa");

    divContentMapa.style.width = contentMapa.scrollWidth + "px";
    divContentMapa.style.height = contentMapa.scrollHeight + "px";
    for (let x = 0; x < departamentos.length; x++) {
        let bboxDepartamento = departamentos[x].getBBox();

        departamentos[x].addEventListener("click", function () {

            let top = ((bboxDepartamento.y / svgMapa.scrollHeight) * 100) + (((bboxDepartamento.height / 2) / svgMapa.scrollHeight) * 100);
            let left = ((bboxDepartamento.x / svgMapa.scrollWidth) * 100) + (((bboxDepartamento.width / 2) / svgMapa.scrollWidth) * 100);
            console.log(top, left, divContentMapa.scrollHeight, ((bboxDepartamento.y / svgMapa.scrollHeight) * 100) + (((bboxDepartamento.height / 2) / svgMapa.scrollHeight)))
            contentMapa.style.top = "calc(50% + " + top * -1 + "%)";
            contentMapa.style.left = "calc(50% + " + -left + "% )";

            ///Hacer grande el departamento en relacion a su padre
            let scale = svgMapa.scrollHeight / bboxDepartamento.height;




            if (document.body.scrollWidth > document.body.scrollHeight) {
                if (bboxDepartamento.width > bboxDepartamento.height + (bboxDepartamento.height  )) {
                    scale = ((svgMapa.scrollWidth * (document.body.scrollWidth / contentMapa.scrollWidth)) / bboxDepartamento.width) - 0.5;
                } else {
                    scale = ((svgMapa.scrollHeight * (document.body.scrollHeight / contentMapa.scrollHeight)) / bboxDepartamento.height - 0.5);
                }
            } else if (document.body.scrollHeight > document.body.scrollWidth) {

                    scale = ((svgMapa.scrollWidth * (document.body.scrollWidth / contentMapa.scrollWidth)) / bboxDepartamento.width );
                
            } else {

                scale = scale - 0.2;
            }
            divContentMapa.style.transform = "scale(" + scale + ")";

            ///Dar focus al elemento seleccionado con su contenido y darle transparencia a los demas
            for (let u = 0; u < departamentos.length; u++) {
                if (u == x) {
                    departamentos[x].style.fill = "white"
                } else {
                    departamentos[u].style.fill = "rgb(255,255,255, 0.4)"
                }

            }
        })
    }
    window.addEventListener("resize", function () {
        console.log(contentMapa.scrollWidth, contentMapa.scrollHeight)
        divContentMapa.style.width = contentMapa.scrollWidth + "px";
        divContentMapa.style.height = contentMapa.scrollHeight + "px";
    })





})


