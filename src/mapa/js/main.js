window.addEventListener("load", function () {

    ///Hacer que el mapa no crezca mas del 100% del height de la pantalla
    let divMapa = document.getElementById("divMapa");
    let contenido = document.getElementById("contenido");
    let contentMapa = document.getElementById("contentMapa");
    let mapa = document.getElementById("mapa");
    let directionContent;
    let heightContent;
    let predominate = "Width";
    let municipios = document.querySelectorAll(".municipio-departamento");
    let departamentoFocus = "";

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
            if (directionContent <= directionContentInicial) {
                divMapa.style.zoom = zoomDivMapa + "%"
            }
        })
    }

    function resizeContentToElementFocus(bboxElement, type) {
        //Saber que tipo de elemento es para restarle a la escala
        let restScale = 0.5;
        let dividScale = 2.5;
        if (type == "departamento") {
            restScale = 0.5
            dividScale = 3
        } else {
            dividScale = 0;
            restScale = 2
        }
        console.log(restScale)
        //Calcular la posicion en top y left que movera el contenedor del mapa centrando el elemento al que se le dio click
        let top = ((bboxElement.y / svgMapa.scrollHeight) * 100) + (((bboxElement.height / 2) / svgMapa.scrollHeight) * 100);
        let left = ((bboxElement.x / svgMapa.scrollWidth) * 100) + (((bboxElement.width / 2) / svgMapa.scrollWidth) * 100);
        console.log(top, left, divContentMapa.scrollHeight, ((bboxElement.y / svgMapa.scrollHeight) * 100) + (((bboxElement.height / 2) / svgMapa.scrollHeight)))
        contentMapa.style.top = "calc(50% + " + top * -1 + "%)";
        contentMapa.style.left = "calc(50% + " + -left + "% )";

        ///Hacer grande el elemento en relacion a su padre
        let scale = svgMapa.scrollHeight / bboxElement.height;
        if (document.body.scrollWidth > document.body.scrollHeight) {
            
            if (bboxElement.width > bboxElement.height + (bboxElement.height * 1.2)  ) {
                scale = ((svgMapa.scrollWidth * (document.body.scrollWidth / contentMapa.scrollWidth)) / bboxElement.width) - restScale;
            } else {
                scale = ((svgMapa.scrollHeight * (document.body.scrollHeight / contentMapa.scrollHeight)) / bboxElement.height - restScale);
            }
        } else if (document.body.scrollHeight > document.body.scrollWidth) {

            scale = ((svgMapa.scrollWidth * (document.body.scrollWidth / contentMapa.scrollWidth)) / bboxElement.width);

        } else {

            scale = scale - restScale;
        }
        divContentMapa.style.transform = "scale(" + scale + ")";
    }

    getSizeMap(predominate)


    ///Al dar click en  el departamento centra en relacion a su contenedor
    let departamentos = document.querySelectorAll(".departamento");
    let divContentMapa = document.getElementById("divContentMapa");
    let svgMapa = document.getElementById("svgMapa");

    divContentMapa.style.width = contentMapa.scrollWidth + "px";
    divContentMapa.style.height = contentMapa.scrollHeight + "px";
    for (let x = 0; x < departamentos.length; x++) {

        departamentos[x].addEventListener("click", function () {
            let bboxDepartamento = departamentos[x].getBBox();
            let classListDepartamentos = departamentos[x].classList;
            departamentoFocus = classListDepartamentos[2];

            resizeContentToElementFocus(bboxDepartamento, "departamento")
            ///Dar focus al elemento seleccionado con su contenido y darle transparencia a los demas
            for (let u = 0; u < departamentos.length; u++) {
                if (x == u) {
                    departamentos[x].style.fill = "transparent"
                    departamentos[x].style.visibility = "hidden"
                } else {
                    departamentos[u].style.fill = "rgb(255,255,255, 0.15)"
                    departamentos[u].style.visibility = ""

                }
            }

            ///Hacer visible los municipios pertenecientes al departamento
            for (let m = 0; m < municipios.length; m++) {
                if (municipios[m].classList.contains(`municipio-${classListDepartamentos[2]}`)) {
                    municipios[m].style.visibility = "visible"
                    municipios[m].style.opacity = ""

                } else {
                    municipios[m].style.visibility = "hidden"
                }
            }
            console.log(municipios, departamentoFocus)
        })
    }
    for (let m = 0; m < municipios.length; m++) {

        municipios[m].addEventListener("click", function () {
            console.log(departamentoFocus)
            if (municipios[m].classList.contains(`municipio-${departamentoFocus}`)) {
                let bboxmunicipio = municipios[m].getBBox();
                resizeContentToElementFocus(bboxmunicipio, "municipio")

                for (let mf = 0; mf < municipios.length; mf++) {

                    if (mf == m) {
                        municipios[m].style.opacity = ""
                    } else {
                        municipios[mf].style.opacity = "0.3"

                    }

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


