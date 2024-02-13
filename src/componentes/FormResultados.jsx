import { object, string } from "prop-types";
import React, { forwardRef, useEffect, useState } from "react";



export const FormResultados = forwardRef((data, ref) => {

    let elementEdit = [];
    let inputs = []
    let [dataInputs, setDataInputs] = useState({});
    const [selectsValues, changeSelectsValues] = useState({});
    const [dataSelect, setDataSelects] = useState({});
    const [modalSelect, changeModalSelect] = useState({});
    const [inputValor, setInputValor] = useState({});
    const [keyDown, setKeydown] = useState();
    const [keyData, setKeyData] = useState(0);
    const [modalFormNormal, setModalFormNormal] = useState(false);

    const [modeFormato, setModeFormato] = useState(null);
    const [tipoRegistro, setTipoRegistro] = useState(null);
    const [idFormato, setIdFormato] = useState(null);
    const [idAnalisis, setIdAnalisis] = useState(null);

    const handleInputChange = (e, key, type) => {
        if (type === "text") {
            e.target.value = e.target.value.replace("  ", " ").replace(/[@!#$%^¨¨.&*()-+=[{}|;:'",_<>/?`~¡¿´´°ç-]/, "").replace(/\d+/g, "").replace("]", "").replace("[", "").trimStart()
        } else if (type === "number") {
            e.target.value = e.target.value.replace(/\s/g, "").replace(/[^\w°'".-]/g, "").replace(/--+/g, '-').replace(/\.\.+/g, '.').trim();
            if (e.target.value.indexOf('-', 1) !== -1) {
                let primerValor = e.target.value.charAt(0); r
                let restoCadena = e.target.value.substring(1);
                restoCadena = restoCadena.replace("-", "")
                e.target.value = primerValor + restoCadena
            }
        } else if (type === "ubicacion") {
            if (!/^-?(\d+(?:\.\d*)?)°?(?:\s?(\d+(?:\.\d*)?)'?(?:\s?(\d+(?:\.\d*)?)")?)?([nsNSWEwe](?!\.))?$/i.test(e.target.value)) {

                if (typeof keyDown === 'string' && !/^"?\d+"?$/.test(keyDown)) {

                    if (/[a-zA-Z°'"]\./.test(e.target.value)) {
                        e.target.value = e.target.value.replace(/[a-zA-Z°'"]\./g, function (match) {
                            return match.charAt(0) + match.charAt(2);
                        });

                    } else {

                        if (keyDown == ".") {
                            e.target.value = e.target.value.replace(keyDown, ".").replace(/\./, '')

                        } else if (keyDown == "-") {
                            if (e.target.value != "-") {
                                e.target.value = e.target.value.replace(/-(?=\D*$)/, "").replace("--", "-").replace(/(?<!^)-/g, "")
                            }

                        }
                        else {
                            e.target.value = e.target.value.replace(keyDown, "")
                        }
                        e.target.value = e.target.value.replace("..", ".")
                    }
                } else if (/^(-?\d+(?:\.\d+)?)°?(?:\s?(\d+(?:\.\d+)?)'?(?:\s?(\d+(?:\.\d+)?)")(\d+)?)?([nsNS])?$/.test(e.target.value)) {

                    e.target.value = e.target.value.replace(/"\d+/g, '"')
                }
                e.target.value = e.target.value.replace(/[NSns]\d+/g, function (match) {
                    return match[0];
                });
            }
        } else if (type === "email") {
            let [beforeAt, afterAt] = e.target.value.split('@');
            if (afterAt != undefined) {
                afterAt = afterAt.replace("..", ".")
                e.target.value = beforeAt + "@" + afterAt
            } else {
                afterAt = ""
            }
            e.target.value = e.target.value.replace(/@(?=[^@]*@)/g, "").replace(/(@[^@.]*\.[^@.]*\.[^@.]*\.[^@.]*)\./, "$1");
        } else if (type === "normal") {
            e.target.value = e.target.value.replace("  ", " ").trimStart()
        }
        let value = "";
        let cloneInputValue = { ...inputValor }
        cloneInputValue[key] = e.target.value
        setInputValor(cloneInputValue)
    };




    function Init() {
        let cloneSlectValue = { ...selectsValues }
        let cloneModalSelect = { ...selectsValues }
        inputs.map((key, value) => {
            if (dataInputs[key]["type"] == "select") {
                cloneSlectValue[key] = "Seleccione una opción..."
                cloneModalSelect[key] = false
            }
        })
        changeSelectsValues(cloneSlectValue)
        changeModalSelect(cloneModalSelect)
    }
    function selectSearch(value, key) {
        let cloneDataSelect = { ...dataSelect }
        let selectOptions = document.querySelectorAll(".select-option-" + key)
        let cloneSlectValue = { ...selectsValues }
        cloneSlectValue[key] = value
        data.setStatusSelectDefault(false)
        data.setStatusSelect(false)
        let cloneModalSelect = { ...modalSelect }
        cloneModalSelect[key] = true
        changeModalSelect(cloneModalSelect)

        for (let s = 0; s < selectOptions.length; s++) {
            if (selectOptions[s].innerHTML.toLocaleLowerCase().includes(value.toLocaleLowerCase())) {
                selectOptions[s].style.display = ""
            } else {
                selectOptions[s].style.display = "none"
            }
            if (selectOptions[s].innerHTML.toLocaleLowerCase() == value.toLocaleLowerCase()) {
                cloneSlectValue[key] = selectOptions[s].innerHTML
                cloneDataSelect[key] = dataInputs[key]["opciones"][s][dataInputs[key]["key"]]
                break
            } else {
                cloneDataSelect[key] = ""
            }

        }
        changeSelectsValues(cloneSlectValue)

        setDataSelects(cloneDataSelect)


    }
    function clearElementsClick() {
        changeModalSelect({})
    }
    React.useImperativeHandle(ref, () => ({
        clearElementsClick
    }));
    function resizeFormatoSca() {
        const iframeFormatoSca = document.querySelectorAll(".iframe-formato-sca");
        if (iframeFormatoSca) {
            for (let i = 0; i < iframeFormatoSca.length; i++) {
                const iframeFormatoScaContentDocument = iframeFormatoSca[i].contentDocument;
                const formatoSca = iframeFormatoScaContentDocument.getElementById("contenidoFormatoSca");
                if (formatoSca) {
                    iframeFormatoSca[i].style.height = "calc(" + formatoSca.clientHeight + "px" + " + 1px)"
                }
            }
        }
    }
    useEffect(() => {
        setKeyData(keyData + 1)
        Init()
        if (data.data) {
            inputs = Object.keys(data.data)
            dataInputs = data.data

            elementEdit = data.elementEdit
        }


        setTimeout(() => {
            resizeForm()
        }, 100);
        document.addEventListener('keydown', function (event) {
            setKeydown(event.key)
        })
        function resizeForm() {
            let modalForm = document.getElementById("modalFormResult");
            let divContentForm = document.getElementById("divContentFormResult");
            let divFondomodalForm = document.getElementById("divFondomodalFormResult");
            let labelErrorSubmitForm = document.querySelectorAll(".label-error-submit-form-result");
            let displayNone = false;
            if (modalForm.style.display == "none") {
                modalForm.style.display = "block"
                displayNone = true
            }


            if (divContentForm.scrollHeight > document.body.clientHeight) {

                modalForm.style.justifyContent = "unset"
                modalForm.style.padding = "20px 20px"
                modalForm.style.height = "calc(100% - 40px)"
                modalForm.style.width = "calc(100% - 40px)"
                divFondomodalForm.style.height = divContentForm.clientHeight + 40 + "px"
                divFondomodalForm.style.width = modalForm.clientWidth + "px"
            } else {

                for (let x = 0; x < labelErrorSubmitForm.length; x++) {
                    labelErrorSubmitForm[x].style.height = ""
                }
                divFondomodalForm.style.height = "100vh"
                divFondomodalForm.style.width = "100vw"
                modalForm.style.alignItems = "center"
                modalForm.style.justifyContent = ""
                modalForm.style.padding = ""
                modalForm.style.height = "100%"
                modalForm.style.width = "100%"
            }
            if (displayNone) {
                modalForm.style.display = "none"
            }
            for (let x = 0; x < labelErrorSubmitForm.length; x++) {


                if ((labelErrorSubmitForm[x].scrollHeight) > labelErrorSubmitForm[x].clientHeight) {

                    labelErrorSubmitForm[x].style.height = "max-content"
                }
            }

        }
        function resizeModal() {
            let modalForm = document.querySelectorAll(".div-modal-form");
            let divContentForm = document.querySelectorAll(".div-content-modal");
            let divFondomodalForm = document.querySelectorAll(".div-fondo-modal ");

            for (let m = 0; m < modalForm.length; m++) {
                if (divContentForm[m].scrollHeight > document.body.clientHeight) {
                    modalForm[m].style.justifyContent = "unset"
                    modalForm[m].style.padding = "20px 20px"
                    modalForm[m].style.height = "calc(100% - 40px)"
                    modalForm[m].style.width = "calc(100% - 40px)"
                    divFondomodalForm[m].style.height = divContentForm[m].clientHeight + 40 + "px"
                    divFondomodalForm[m].style.width = modalForm[m].clientWidth + "px"
                } else {

                    divFondomodalForm[m].style.height = "100vh"
                    divFondomodalForm[m].style.width = "100vw"
                    modalForm[m].style.alignItems = "center"
                    modalForm[m].style.justifyContent = ""
                    modalForm[m].style.padding = ""
                    modalForm[m].style.height = "100%"
                    modalForm[m].style.width = "100%"
                }

            }
        }
        resizeForm()
        resizeModal()
        window.addEventListener("resize", function () {
            resizeForm()
            resizeModal()
        })
        const contenidoComponent = document.getElementById("divContentFormResult");
        const contentModal = document.getElementById("contentModal");

        const iframeFormatoSca = document.querySelectorAll(".iframe-formato-sca");
        for (let i = 0; i < iframeFormatoSca.length; i++) {
            iframeFormatoSca[i].addEventListener("load", function () {
                resizeFormatoSca()
            })
        }



        const resizeObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                resizeFormatoSca();
            });
        });
        resizeObserver.observe(contenidoComponent);
        resizeObserver.observe(contentModal);

    }, [data])


    const chageData = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const json = Object.fromEntries(formData);
        let objectSelect = Object.keys(dataSelect);
        objectSelect.map((key, value) => {
            json[key] = dataSelect[key]
        })
        let keysJson = Object.keys(json);

        keysJson.map((key, value) => {

            if (json[key]) {
                json[key] = json[key].toString().trimEnd().toLowerCase()
            }

        })


        if (!data.updateStatus) {
            data.funcionregistrar(json)
        } else {
            data.updateEntitie(json, elementEdit["id"])
        }

    };



    function setElementsTemplateFormatoSca(idElement, data) {
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

                let valuePuntajeTotal = ((data[0].fragancia_aroma ? data[0].fragancia_aroma : 0) + (data[0].sabor ? data[0].sabor : 0) + (data[0].sabor_residual ? data[0].sabor_residual : 0) + (data[0].acidez ? data[0].acidez : 0) + (data[0].cuerpo ? data[0].cuerpo : 0) + (data[0].uniformidad ? data[0].uniformidad : 0) + (data[0].taza_limpia ? data[0].taza_limpia : 0) + (data[0].balance ? data[0].balance : 0) + (data[0].dulzor ? data[0].dulzor : 0) + (data[0].puntaje_catador ? data[0].puntaje_catador : 0))
                let valueTazasXIntensidad = (data[0].tazas ? data[0].tazas : 0) * (data[0].intensidad ? data[0].intensidad : 0);
                if (puntajeTotal) {
                    puntajeTotal.innerHTML = valuePuntajeTotal;
                }
                if (intensiadDefectos) {
                    intensiadDefectos.innerHTML = (data[0].intensidad ? data[0].intensidad : 0);
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
                        if (divElement) {
                            let range = divElement.querySelectorAll(".div-range-color-intensidad")
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
    useEffect(() => {

        const iframeFormatoSca = document.querySelectorAll(".iframe-formato-sca");
        for (let i = 0; i < iframeFormatoSca.length; i++) {
            iframeFormatoSca[i].addEventListener("load", function () {
                resizeFormatoSca()
            })
        }

    }, [idFormato])
    useEffect(() => {
        let iframeVacio = document.querySelectorAll(".iframe-vacio-formato-sca")
        if (iframeVacio.length) {

            iframeVacio[0].addEventListener("load", function () {
                let contentIframe = iframeVacio[0].contentDocument.getElementById("contenidoFormatoSca")
                if (contentIframe) {
                    contentIframe.classList.add("content-iframe-vacio")
                }


            });
        }

        if (data.dataModalResultadoAnalisis.length > 0) {
            const iframe = document.getElementById("iframeFormatoSca");
            iframe.addEventListener("load", function () {
                setElementsTemplateFormatoSca("iframeFormatoSca", data.dataModalResultadoAnalisis);
            });
        }
    }, [data.dataModalResultadoAnalisis]);
    function registerFormatoSca(iframe, tipo, id) {
        let iframeElement = document.getElementById(iframe);
        if (iframeElement) {
            let dataFormatoSca = {};
            let keysRange = ["fragancia_aroma", "sabor", "sabor_residual", "acidez", "cuerpo", "balance", "puntaje_catador", "seco", "espuma", "intensidad", "nivel_cuerpo", "tueste", "tazas", "notas"]
            let keysCuadro = ["uniformidad", "taza_limpia", "dulzor"]
            let content = iframeElement.contentDocument

            if (content) {
                for (let r = 0; r < keysRange.length; r++) {
                    let divElement = content.getElementById(keysRange[r])
                    if (divElement) {
                        dataFormatoSca[keysRange[r]] = divElement.value
                    }
                }
                for (let c = 0; c < keysCuadro.length; c++) {
                    let divElement = content.getElementById(keysCuadro[c])
                    if (divElement) {
                        let cuadrosSelect = divElement.querySelectorAll(".focus-cuadro-select");
                        if (cuadrosSelect.length > 0) {
                            dataFormatoSca[keysCuadro[c]] = (10 - (cuadrosSelect.length * 2))
                        } else {
                            dataFormatoSca[keysCuadro[c]] = 0
                        }
                    }
                }
            }

            if (data.setFormatoSca) {
                data.setFormatoSca(dataFormatoSca, idFormato, tipo, modeFormato)
            }
        }
    }
    return (
        <>
            <link rel="stylesheet" href="../../public/css/form.css" />

            <div style={{ display: (!data.modalFormResults) ? "none" : "" }} className="modal-form" id="modalFormResult">
                <div onClick={() => { data.changeModalFormResults(false) }} className="div-fondo-modal-form" id="divFondomodalFormResult">
                </div>
                <div id="divContentFormResult" className="div-content-form">

                    <form /* onSubmit={chageData} */ action="" >
                        <div className="header-form">
                            <h3 className="tittle-form-register">{"Información General Sobre el Análisis"} </h3>
                            <div onClick={() => { data.changeModalFormResults(false) }} className="icon-quit-svg-form">
                                <svg version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                    <g><g><path fill="#000000" d="M150.7,128l90.6-90.7c6.3-6.3,6.3-16.4,0-22.7c-6.3-6.3-16.4-6.3-22.7,0L128,105.3L37.4,14.7c-6.3-6.3-16.4-6.3-22.7,0s-6.3,16.4,0,22.7l90.6,90.6l-90.6,90.6c-6.3,6.3-6.3,16.4,0,22.7c3.1,3.1,7.2,4.7,11.3,4.7c4.1,0,8.2-1.6,11.3-4.7l90.7-90.6l90.6,90.7c3.1,3.1,7.2,4.7,11.3,4.7c4.1,0,8.2-1.6,11.3-4.7c6.3-6.3,6.3-16.4,0-22.7L150.7,128z" /></g></g>
                                </svg>
                            </div>
                        </div>
                        <div className="div-body-form">
                            <div className="div-contenido-info-analisis">
                                <div className="info-analisis info-catador">
                                    <h3>Información sobre el catador</h3>
                                    {data.dataModalResultado ?

                                        data.dataModalResultado.map((key, index) => {
                                            if (index == 0) {
                                                return <div key={key.id + "catador"}>
                                                    <div className="div-info-analisis">
                                                        <div>
                                                            <h4>Nombre</h4>
                                                            <h3>{key.nombre_catador ? key.nombre_catador : "No registra"}</h3>
                                                        </div>
                                                        <div>
                                                            <h4>Documento</h4>
                                                            <h3>{key.catador_documento ? key.catador_documento : "No registra"}</h3>
                                                        </div>
                                                        <div>
                                                            <h4>Teléfono</h4>
                                                            <h3>{key.catador_telefono ? key.catador_telefono : "No registra"}</h3>
                                                        </div>
                                                        <div>
                                                            <h4>Correo</h4>
                                                            <h3>{key.catador_correo ? key.catador_correo : "No registra"}</h3>
                                                        </div>
                                                        <div>
                                                            <h4>Rol</h4>
                                                            <h3>{key.catador_rol ? key.catador_rol : "No registra"}</h3>
                                                        </div>
                                                        <div>
                                                            <h4>Cargo</h4>
                                                            <h3>{key.catador_cargo ? key.catador_cargo : "No registra"}</h3>
                                                        </div>

                                                    </div>
                                                </div>
                                            }

                                        })
                                        : "Error interno"}
                                </div>
                                <div className="info-analisis">
                                    <h3>Información sobre el análisis</h3>
                                    {data.dataModalAnalisis ?

                                        data.dataModalAnalisis.map((key, index) => {
                                            if (index == 0) {
                                                return <div key={key.id}>
                                                    <div className="div-info-analisis">
                                                        <div>
                                                            <h4>Id del análisis</h4>
                                                            <h3>{key.id ? key.id : "No registra"}</h3>
                                                        </div>
                                                        <div>
                                                            <h4>Tipo de proceso </h4>
                                                            <h3>{key.proceso ? key.proceso : "No registra"}</h3>
                                                        </div>
                                                        <div>
                                                            <h4>Calidad </h4>
                                                            <h3>{key.calidad && key.calidad != 0 ? key.calidad : "No registra"}</h3>
                                                        </div>
                                                        <div>
                                                            <h4>Fecha de Registro</h4>
                                                            <h3>{key.fecha_creacion ? key.proceso : "No registra"}</h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            }

                                        })
                                        : "Error interno"}
                                </div>
                                <div className="info-analisis">
                                    <h3>Información de la ubicación</h3>
                                    {data.dataModalAnalisis ?

                                        data.dataModalAnalisis.map((key, index) => {
                                            if (index == 0) {
                                                return <div key={key.id}>
                                                    <div className="div-info-analisis">
                                                        <div>
                                                            <h4>Departamento</h4>
                                                            <h3>{key.departamento ? key.departamento : "No registra"}</h3>
                                                        </div>
                                                        <div>
                                                            <h4>Municipio</h4>
                                                            <h3>{key.municipio ? key.municipio : "No registra"}</h3>
                                                        </div>
                                                        <div>
                                                            <h4>Vereda</h4>
                                                            <h3>{key.nombre_vereda ? key.nombre_vereda : "No registra"}</h3>
                                                        </div>
                                                        <div>
                                                            <h4>Lote </h4>
                                                            <h3>{key.lote ? key.lote : "No registra"}</h3>
                                                        </div>
                                                        <div>
                                                            <h4>Finca</h4>
                                                            <h3>{key.finca ? key.finca : "No registra"}</h3>
                                                        </div>
                                                        <div>
                                                            <h4>Latitud del Lote</h4>
                                                            <h3>{key.latitud_lote ? key.latitud_lote : "No registra"}</h3>
                                                        </div>
                                                        <div>
                                                            <h4>Longitud del Lote </h4>
                                                            <h3>{key.longitud_lote ? key.longitud_lote : "No registra"}</h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            }

                                        })
                                        : "Error interno"}
                                </div>
                                <div className="info-analisis">
                                    <h3>Información sobre la muestra</h3>
                                    {data.dataModalAnalisis ?

                                        data.dataModalAnalisis.map((key, index) => {
                                            if (index == 0) {
                                                return <div key={key.id}>
                                                    <div className="div-info-analisis">
                                                        <div>
                                                            <h4>Id del análisis</h4>
                                                            <h3>{key.id ? key.id : "No registra"}</h3>
                                                        </div>
                                                        <div>
                                                            <h4>Código de la muestra</h4>
                                                            <h3>{key.mu_id ? key.mu_id : "No registra"}</h3>
                                                        </div>
                                                        <div>
                                                            <h4>Cantidad </h4>
                                                            <h3>{key.cantidad ? key.cantidad : "No registra"}</h3>
                                                        </div>
                                                        <div>
                                                            <h4>Variedad</h4>
                                                            <h3>{key.variedad ? key.variedad : "No registra"}</h3>
                                                        </div>
                                                        <div>
                                                            <h4>Calidad </h4>
                                                            <h3>{key.calidad && key.calidad != 0 ? key.calidad : "No registra"}</h3>
                                                        </div>
                                                        <div>
                                                            <h4>Propietario </h4>
                                                            <h3>{key.nombre_propietario ? key.nombre_propietario : "No registra"}</h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            }

                                        })
                                        : "Error interno"}
                                </div>
                            </div>
                            <div className="contenido-info-resultado">

                                <h3>Información Sobre el Formato  {data.dataModalResultado.length > 0 ? data.dataModalResultado[0].tipos_analisis_id ? data.dataModalResultado[0].tipos_analisis_id == 1 ? "Físico" : data.dataModalResultado[0].tipos_analisis_id == 2 ? "SCA" : "No disponible" : "No registra" : ""}</h3>
                                {data.dataModalResultado ?

                                    data.dataModalResultado.length > 0 ?
                                        data.dataModalResultado.map((key, index) => {
                                            if (index == 0) {
                                                return <div className="cotent-info-analisis" key={key.id}>
                                                    <div className="div-info-analisis">
                                                        <div>
                                                            <h4>Id del Formato</h4>
                                                            <h3>{key.id ? key.id : "No registra"}</h3>
                                                        </div>
                                                        <div>
                                                            <h4>Fecha de registro</h4>
                                                            <h3>{key.fecha_creacion ? key.fecha_creacion : "No registra"}</h3>
                                                        </div>
                                                        <div>
                                                            <h4>Fecha de Análisis</h4>
                                                            <h3>{key.fecha_analisis ? key.fecha_analisis : "No registra"}</h3>
                                                        </div>
                                                        <div>
                                                            <h4>Fecha de actualización</h4>
                                                            <h3>{key.fecha_analisis ? key.fecha_analisis : "No registra"}</h3>
                                                        </div>
                                                        <div>
                                                            <h4>Tipo de análisis</h4>
                                                            <h3>{key.tipos_analisis_id ? key.tipos_analisis_id == 1 ? "Físico" : key.tipos_analisis_id == 2 ? "Sensorial" : "No disponible" : "No registra"}</h3>
                                                        </div>
                                                        <div>
                                                            <h4>Estado</h4>
                                                            <h3>{key.estado ? key.estado == 1 ? "Registrado" : key.estado == 2 ? "Pendiente" : key.estado == 3 ? "Asignado" : "No disponible" : "No registra"}</h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            }

                                        })
                                        : "Error interno"

                                    : "Error interno"}
                                {data.dataModalResultadoAnalisis.length > 0 ?
                                    (
                                        <div>
                                            <h3>Resultados para el Formato {data.dataModalResultado[0].tipos_analisis_id ? data.dataModalResultado[0].tipos_analisis_id == 1 ? "Físico" : data.dataModalResultado[0].tipos_analisis_id == 2 ? "SCA" : "No disponible" : "No registra"}</h3>
                                            <iframe id="iframeFormatoSca" className="iframe-formato-sca" src="/src/formatoSca/formatoScaTemplate.html" frameBorder="0"></iframe>
                                            {data.dataModalResultado.length > 0 ? data.dataModalResultado[0].permission_formato == "true" && data.dataModalResultado[0].permission_formato ? data.dataModalResultado[0].estado == 1 ? <button onClick={() => { setIdFormato(data.dataModalResultado[0].id); setModeFormato(data.dataModalResultado[0].tipos_analisis_id); setTipoRegistro(2); setModalFormNormal(true) }} type="button" className="button-submit-form">Actualizar</button> : "" : "" : ""}

                                        </div>
                                    )
                                    :
                                    (
                                        <div>
                                            <iframe id="iframeFormatoSca" className="iframe-vacio-formato-sca iframe-formato-sca" src="/src/formatoSca/formatoScaTemplate.html" frameBorder="0"></iframe>
                                            {data.dataModalResultado.length > 0 ? data.dataModalResultado[0].permission_formato == "true" ? data.dataModalResultado[0].estado == 2 || data.dataModalResultado[0].estado == 3 ? <button onClick={() => { setIdFormato(data.dataModalResultado[0].id), setModeFormato(data.dataModalResultado[0].tipos_analisis_id); setTipoRegistro(1), setModalFormNormal(true) }} type="button" className="button-submit-form">Analizar</button> : "" : "" : ""}
                                        </div>
                                    )

                                }

                            </div>
                        </div>

                    </form>
                </div>

            </div>

            <div style={{ display: (!modalFormNormal) ? "none" : "" }} className="div-modal-form modal-form" >
                <div onClick={() => { setIdFormato(null), setModeFormato(null); setTipoRegistro(null); setModalFormNormal(false) }} className="div-fondo-modal div-fondo-modal-form" >
                </div>
                <div id="contentModal" className="div-content-modal div-content-form">
                    <form /* onSubmit={chageData} */ action="" >
                        <div className="header-form">
                            <h3 className="tittle-form-register">{"Información General Sobre el Análisis"} </h3>
                            <div onClick={() => { setIdFormato(null), setModeFormato(null); setTipoRegistro(null); setModalFormNormal(false) }} className="icon-quit-svg-form">
                                <svg version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                    <g><g><path fill="#000000" d="M150.7,128l90.6-90.7c6.3-6.3,6.3-16.4,0-22.7c-6.3-6.3-16.4-6.3-22.7,0L128,105.3L37.4,14.7c-6.3-6.3-16.4-6.3-22.7,0s-6.3,16.4,0,22.7l90.6,90.6l-90.6,90.6c-6.3,6.3-6.3,16.4,0,22.7c3.1,3.1,7.2,4.7,11.3,4.7c4.1,0,8.2-1.6,11.3-4.7l90.7-90.6l90.6,90.7c3.1,3.1,7.2,4.7,11.3,4.7c4.1,0,8.2-1.6,11.3-4.7c6.3-6.3,6.3-16.4,0-22.7L150.7,128z" /></g></g>
                                </svg>
                            </div>
                        </div>
                        <div className="div-body-form">
                            {modeFormato + ", " + tipoRegistro + "," + idFormato}
                            {modeFormato == 2 ?
                                (
                                    <div>
                                        <iframe id="iframeFormRegister" className="iframe-formato-sca" src="/src/formatoSca/formatoSca.html" frameBorder="0"></iframe>
                                        {tipoRegistro == 1 ? <button onClick={() => { registerFormatoSca("iframeFormRegister", 1) }} type="button" className="button-submit-form">Registrar</button> : <button onClick={() => { registerFormatoSca("iframeFormRegister", 2) }} type="button" className="button-submit-form">Guardar</button>}
                                    </div>
                                )
                                : ""}
                        </div>

                    </form>
                </div>

            </div>

        </>
    )
})