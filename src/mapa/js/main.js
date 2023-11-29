window.addEventListener("load", async function () {
    //Cargar los municipios y departamentos disponibles para mostrar
    let infoGeolocalizacion;
    let departamentosDisponibles = {};
    let municipiosDisponibles = {};

    async function fetchGeolocalizacion() {
        fetch("http://localhost:3000/api/muestra/geolocalizar/certificadas")
            .then(ressponse => ressponse.json())
            .then(data => {
                let data2 = data;
                if (data.status == true) {
                    infoGeolocalizacion = data.data;
                    for (let x = 0; x < data.data.length; x++) {
                        departamentosDisponibles[data.data[x].nombre_departamento.toLocaleLowerCase()] = true;
                    }
                    for (let x = 0; x < data.data.length; x++) {
                        municipiosDisponibles[data.data[x].nombre_municipio.toLocaleLowerCase()] = true;
                    }
                    console.log(departamentosDisponibles, municipiosDisponibles)
                } else {
                    infoGeolocalizacion = [];
                }
                map();

            })
            .catch(error => {
                map();
                console.log("Error" + error)
            })
    }

    await fetchGeolocalizacion();

    function map() {
        let divMapa = document.getElementById("divMapa");
        let contenido = document.getElementById("contenido");
        let contentMapa = document.getElementById("contentMapa");
        let mapa = document.getElementById("mapa");
        let directionContent;
        let heightContent;
        let predominate = "Width";
        let municipios = document.querySelectorAll(".municipio-departamento");
        let departamentoFocus = "";

        console.log(infoGeolocalizacion)


        ///Hacer que el mapa no crezca mas del 100% del height de la pantalla


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

            //Calcular la posicion en top y left que movera el contenedor del mapa centrando el elemento al que se le dio click
            let top = ((bboxElement.y / svgMapa.scrollHeight) * 100) + (((bboxElement.height / 2) / svgMapa.scrollHeight) * 100);
            let left = ((bboxElement.x / svgMapa.scrollWidth) * 100) + (((bboxElement.width / 2) / svgMapa.scrollWidth) * 100);
            console.log(top, left, divContentMapa.scrollHeight, ((bboxElement.y / svgMapa.scrollHeight) * 100) + (((bboxElement.height / 2) / svgMapa.scrollHeight)))
            contentMapa.style.top = "calc(50% + " + top * -1 + "%)";
            contentMapa.style.left = "calc(50% + " + -left + "% )";

            ///Hacer grande el elemento en relacion a su padre
            let scale = svgMapa.scrollHeight / bboxElement.height;
            if (document.body.scrollWidth > document.body.scrollHeight) {
                if (bboxElement.width > bboxElement.height + (bboxElement.height * 1.2)) {
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

        ///Al dar click en  el departamento centra en relacion a su contenedor si este esta disponible para mostrar algo
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
              
                    departamentoDisponible()
                


                function departamentoDisponible() {
                    resizeContentToElementFocus(bboxDepartamento, "departamento")
                    ///Dar focus al elemento seleccionado con su contenido y darle transparencia a los demas
                    for (let u = 0; u < departamentos.length; u++) {
                        if (x == u) {
                            departamentos[x].style.visibility = "hidden"
                            departamentos[u].classList.remove("element-opacity")

                        } else {
                            departamentos[u].classList.add("element-opacity")
                            departamentos[u].style.visibility = ""

                        }
                    }
                    ///Hacer visible los municipios pertenecientes al departamento
                    for (let m = 0; m < municipios.length; m++) {
                        if (municipios[m].classList.contains(`municipio-${classListDepartamentos[2]}`)) {
                            municipios[m].style.visibility = "visible"
                            municipios[m].classList.remove("element-opacity")

                        } else {
                            municipios[m].style.visibility = "hidden"
                        }
                    }
                    console.log(municipios, departamentoFocus)
                }
            })
        }
        for (let m = 0; m < municipios.length; m++) {
            municipios[m].addEventListener("click", function () {
                let nameMunicipio = municipios[m].getAttribute("name");
                console.log(municipiosDisponibles[nameMunicipio], municipiosDisponibles, nameMunicipio, departamentoFocus, "xd", municipios[m].classList.contains(`municipio-${departamentoFocus}`))
                if (/* municipios[m].classList.contains(`municipio-${departamentoFocus}`) && */ municipiosDisponibles[nameMunicipio.toLocaleLowerCase()]) {
                    let bboxmunicipio = municipios[m].getBBox();
                    resizeContentToElementFocus(bboxmunicipio, "municipio")
                    for (let mf = 0; mf < municipios.length; mf++) {
                        if (mf == m) {
                            municipios[mf].classList.remove("element-opacity")
                        } else {
                            municipios[mf].classList.add("element-opacity")

                        }
                    }
                }
            })
        }
        window.addEventListener("resize", function () {
            divContentMapa.style.width = contentMapa.clientWidth + "px";
            divContentMapa.style.height = contentMapa.clientHeight + "px";
        })

        ///Ubicar puntos en el mapa 

        function setUbicaciones() {
            for (let x = 0; x < infoGeolocalizacion.length; x++) {
                let top = 12.39667;
                let bottom = -4.22705;
                let left = -79.0091831957231;
                let right =-66.84623797929129;

                let latitudPorcentaje = top - (bottom);
                let valorLatitudPorcentaje = infoGeolocalizacion[x].latitud - (bottom);
                let porcentajeTotalLaitud = (valorLatitudPorcentaje / latitudPorcentaje) * 100;
                let longitudPorcentaje = right - (left);
                let valorLongitudPorcentaje =  infoGeolocalizacion[x].longitud - (left);
                let porcentajeTotalLongitud = (valorLongitudPorcentaje / longitudPorcentaje) * 100;

                let divPunto = document.createElement("div");

                divPunto.style.bottom = "calc(" + porcentajeTotalLaitud + "% - (1% / 2 )";
                divPunto.style.left = "calc(" + porcentajeTotalLongitud + "% - (1%  / 2) ";

                console.log(porcentajeTotalLongitud)

                divPunto.classList.add("div-punto-ubicacion");
                divPunto.innerHTML = '<svg class="punto-cafe" viewBox="0 0 352.000000 477.000000" ><g transform="translate(0.000000,477.000000) scale(0.100000,-0.100000)" fill="#000000"stroke="none"><path d="M1593 4669 c-590 -57 -1099 -403 -1367 -929 -116 -229 -174 -454 -183 -710 -7 -194 7 -319 57 -516 167 -649 466 -1204 976 -1813 103 -122 647 -671 666 -671 28 0 407 364 578 555 415 464 721 939 913 1415 104 259 195 583 217 773 17 145 8 390 -20 522 -131 621 -564 1107 -1158 1299 -218 70 -456 97 -679 75z m367 -174 c346 -49 630 -193 880 -444 302 -303 450 -660 451 -1081 0 -203 -16 -301 -87 -545 -206 -709 -621 -1357 -1283 -2008 l-171 -169 -112 104 c-136 126 -343 347 -480 511 -353 423 -614 861 -780 1307 -54 144 -132 424 -153 543 -23 139 -21 380 5 524 79 441 352 831 743 1061 294 173 652 244 987 197z" /><path d="M1842 4170 c136 -124 246 -300 288 -465 52 -200 7 -470 -106 -640 -21 -33 -92 -125 -158 -205 -237 -289 -284 -390 -274 -589 8 -148 65 -291 188 -471 60 -87 64 -90 100 -90 97 0 310 60 432 121 179 89 380 264 486 424 191 286 258 620 193 960 -51 269 -224 556 -435 724 -209 166 -449 263 -706 286 l-75 6 67 -61z" /> <path d="M1335 4156 c-187 -68 -317 -149 -456 -283 -202 -196 -320 -416 -369 -687 -104 -575 201 -1143 740 -1380 91 -40 247 -86 293 -86 l29 0 -32 53 c-192 322 -219 606 -84 879 48 98 94 165 228 328 144 175 188 242 215 323 85 256 18 494 -199 701 -80 76 -235 186 -262 186 -7 -1 -53 -16 -103 -34z" /></g></svg>';
                contentMapa.appendChild(divPunto)
                console.log(divPunto)
            }

        }
        setUbicaciones()
    }
})


