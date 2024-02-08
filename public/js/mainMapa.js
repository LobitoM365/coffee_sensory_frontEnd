
/* window.addEventListener("load", function () {
    let iframeMapa = document.getElementById("iframeMapa").contentDocument;
    let departamentos = iframeMapa.querySelectorAll(".departamento");
    let divContentMapa = iframeMapa.getElementById("divContentMapa");
    let contentMapa = iframeMapa.getElementById("contentMapa");
    let svgMapa = iframeMapa.getElementById("svgMapa");
    let divMapa = iframeMapa.getElementById("divMapa");

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

        })
    }
    window.addEventListener("resize", function () {
        setTimeout(() => {
            console.log(contentMapa.scrollWidth, contentMapa.scrollHeight)
            divContentMapa.style.width = contentMapa.scrollWidth + "px";
            divContentMapa.style.height = contentMapa.scrollHeight + "px";
        }, 10);

    })

})
 */