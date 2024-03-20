let divMapa = document.getElementById("divMapa");
let sizeMap = document.getElementById("sizeMap");
let divPuntosUbicacion = document.getElementById("divPuntosUbicacion");
let divMainDivMapa = document.getElementById("divMainDivMapa");
let mainDivMapa = document.getElementById("mainDivMapa");
let departamentos = document.querySelectorAll(".element-departament");
let municipios = document.querySelectorAll(".municipio");
let zoomPunto = 20/window.screen.availWidth;
let departamentoFocus;
let focusDepartamento = "";
const heightMap = mainDivMapa.scrollHeight;
const widthMap = mainDivMapa.scrollWidth;

///Configuracion inicial para el contenedor del mapa
mainDivMapa.style.width = divMapa.scrollWidth + "px";
mainDivMapa.style.height = divMapa.scrollHeight + "px";
const userAgent = navigator.userAgent;
const android = /Android/.test(userAgent);
const heightSizeLess = android ? 10 : 84;
const zoom = window.screen.availHeight > window.screen.availWidth ? ((window.screen.availWidth) / divMapa.scrollWidth) * 100 : ((window.screen.availHeight - heightSizeLess) / divMapa.scrollHeight) * 100;
const sizeLess = window.screen.availHeight > window.screen.availWidth ? 100000 : 0;
mainDivMapa.style.zoom = zoom + "%";
console.log(document.body.scrollHeight, window.screen.availHeight, divMapa.scrollHeight, document.body.scrollWidth, window.screen.availWidth)
const widthDivMap = divMainDivMapa.scrollWidth;


let puntos = [

    {
        "latitud": 0.10287578916813371,
        "longitud": -70.04369418794504
    }
    ,
    {
        "latitud": 1.4186731846984189,
        "longitud": -69.84584162919936
    }
    ,
    {
        "latitud": 3.969264398811022,
        "longitud": -71.07736457031923
    }
    ,
    {
        "latitud": 1.985982604211773,
        "longitud": -73.65877392715846
    }
    ,
    {
        "latitud": 7.357557,
        "longitud": -75.842235
    }
    ,
    {
        "latitud": 1.9738581104257213,
        "longitud": -75.93284581613543
    }
    ,
    {
        "latitud": 4.701439276695983,
        "longitud": -74.07546980228544
    }
    ,
    {
        "latitud": 1.2936957437233512,
        "longitud": -66.99156480767924
    }
    ,
    {
        "latitud": 1.7274986978666207,
        "longitud": -69.39093655804524
    },
    {
        "latitud": 4.924693,
        "longitud": -71.077501,
    },
    {
        "latitud": 0.298710,
        "longitud": -76.411780,
    },
    {
        "latitud": 1.514291,
        "longitud": -69.845834
    },
    {
        "latitud": 3.715723,
        "longitud": -74.435186
    },
    {
        "latitud": 1.972854,
        "longitud": -75.932052
    },
    {
        "latitud": 1.9738581104257213,
        "longitud": -75.93284581613543
    }
]

for (let x = 0; x < puntos.length; x++) {
    getGeolocalizacion(puntos[x].latitud, puntos[x].longitud)
}

function getGeolocalizacion(latitud, longitud) {
    let divPunto = document.createElement("div");
    
    divPunto.classList.add("punto");
    divPunto.innerHTML = '<img class="img-punto-ubicacion" src="/src/mapa/img/puntoUbicacion.png"/>'
    console.log(divPunto)
    let topP = 12.49090539183309842
    let bottom = -4.13552330887985
    let left = -66.8698311193493
    let right = -79.03642861496417

    let latitudPorcentaje = topP - (bottom);
    let valorLatitudPorcentaje = latitud - (bottom);
    let porcentajeTotalLaitud = (valorLatitudPorcentaje / latitudPorcentaje) * 100;
    let longitudPorcentaje = left - (right);
    let valorLongitudPorcentaje = longitud - (right);
    let porcentajeTotalLongitud = (valorLongitudPorcentaje / longitudPorcentaje) * 100;

    divPunto.style.bottom = "calc(" + porcentajeTotalLaitud + "% ";
    divPunto.style.left = "calc(" + porcentajeTotalLongitud + "% ";
    divPuntosUbicacion.appendChild(divPunto)
}



///Hacer que el elemento al que se le dio click se centre y crezca a una scalatan grande igual a su contenedor

let bboxMap = sizeMap.getBBox();
divPuntosUbicacion.style.width = (bboxMap.width) + "px";
divPuntosUbicacion.style.height = (bboxMap.height) + "px";
console.log(bboxMap, "bboxx", (bboxMap.height * zoom) / 100)

for (let x = 0; x < departamentos.length; x++) {
    departamentos[x].addEventListener("click", function () {
        focusDepartamento = departamentos[x].classList[2];

        /* mainDivMapa.style.zoom = ((window.screen.availHeight - heightSizeLess ) / divMapa.scrollHeight) * 100+ "%"; */
        let bboxDepartamento = departamentos[x].getBBox();
        setMovementMap(bboxDepartamento, 1.8)

        departamentoFocus = x;
        for (let f = 0; f < departamentos.length; f++) {
            if (x == f) {

                for (let m = 0; m < municipios.length; m++) {
                    console.log(municipios[m].classList.contains(".municipio-" + departamentos[f].classList[2]),"xddddddddddddddd",)
                    if (municipios[m].classList.contains("municipio-" + departamentos[f].classList[2])) {
                        municipios[m].style.visibility = "unset";
                    } else {
                        municipios[m].style.visibility = "";
                    }
                }
                departamentos[f].style.opacity = ""
                departamentos[f].style.display = "none"
                departamentos[f].style.stroke = "1px black"
            } else {
                departamentos[f].style.display = ""
                departamentos[f].style.visibility = ""
                departamentos[f].style.opacity = "0.5"
            }
        }
    })
}




function setMovementMap(bboxElement, lessScale) {
    let less = lessScale ? lessScale : 1.8;
    let topMap = ((bboxElement.y / divMapa.scrollHeight) * 100) + (((bboxElement.height / 2) / divMapa.scrollHeight) * 100);
    let leftMap = ((bboxElement.x / divMapa.scrollWidth) * 100) + (((bboxElement.width / 2) / divMapa.scrollWidth) * 100);
    divMapa.style.top = "calc(50% - " + topMap + "%)"
    divMapa.style.left = "calc(50% - " + leftMap + "%)"
    let scale = 0;
    if (bboxElement.width > bboxElement.height) {
        scale = document.body.scrollWidth / (bboxElement.width)
    } else {
        scale = document.body.scrollHeight / (bboxElement.height)
    }
    console.log(widthDivMap, document.body.scrollWidth, ((widthDivMap) * (((bboxElement.width / mainDivMapa.clientWidth) * 100) * (scale * less))) / 100);

    if (((widthDivMap) * (((bboxElement.width / mainDivMapa.clientWidth) * 100) * (scale * less))) / 100 > (document.body.scrollWidth - sizeLess)) {
        scale = document.body.scrollWidth / (bboxElement.width)
    } else if (((window.screen.availHeight - heightSizeLess) * (((bboxElement.height / mainDivMapa.clientHeight) * 100) * (scale * less))) / 100 > (document.body.scrollHeight - sizeLess)) {
        scale = document.body.scrollHeight / (bboxElement.height + 1)

    }


    mainDivMapa.style.transform = "scale(" + scale * less + ")"
    /*  console.log((((window.screen.availHeight - 87) * ((bboxDepartamento.height / mainDivMapa.scrollHeight) * 100)) / 100) * (scale * 1.9)) */
    console.log(((bboxElement.width / mainDivMapa.scrollWidth) * 100), document.body.scrollWidth)

}


for (let m = 0; m < municipios.length; m++) {
    municipios[m].addEventListener("click", function () {
        console.log(focusDepartamento, "xd")
        if (municipios[m].classList.contains("municipio-" + focusDepartamento)) {
            let bboxMunicipio = municipios[m].getBBox();
            municipios[m].style.visibility = "unset";
            setMovementMap(bboxMunicipio, 1.7)

        } else {
            municipios[m].style.visibility = "";
        }
    })
}


window.addEventListener("resize", function () {
    let puntoUbicacion = document.querySelectorAll(".punto-ubicacion")
    for (let x = 0; x < puntoUbicacion; x++) {

    }
})



console.log(10/window.screen.availWidth)