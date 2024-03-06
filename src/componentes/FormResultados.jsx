import { object, string } from "prop-types";
import React, { forwardRef, useEffect, useState } from "react";



export const FormResultados = forwardRef((data, ref) => {

    let elementEdit = [];
    let inputs = []
    let inputsFormatoFisico = []
    let elementEditFormatoFisico = []
    let [dataInputs, setDataInputs] = useState({});
    let [dataInputsFormatoFisico, setDataInputsFormatoFisico] = useState({});
    const [selectsValues, changeSelectsValues] = useState({});
    const [dataSelect, setDataSelects] = useState({});
    const [statusInputDefault, setStatusInputDefault] = useState(false);
    const [statusInput, setStatusInput] = useState(true);

    const [inputValor, setInputValor] = useState({});
    const [keyDown, setKeydown] = useState();
    const [keyData, setKeyData] = useState(0);
    const [modalFormNormal, setModalFormNormal] = useState(false);
    const [statusSelectDefault, setStatusSelectDefault] = useState(true);

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



    if (data.inputsForm) {
        inputs = Object.keys(data.inputsForm)
        dataInputs = data.inputsForm
        elementEdit = data.elementEdit
    }
    if (data.inputsFormatoFisico) {
        inputsFormatoFisico = Object.keys(data.inputsFormatoFisico)
        dataInputsFormatoFisico = data.inputsFormatoFisico
        elementEditFormatoFisico = data.dataModalResultadoAnalisis.length > 0 ? data.dataModalResultadoAnalisis[0] : {}
    }
    function Init() {
        let cloneSlectValue = { ...selectsValues }

        inputs.map((key, value) => {
            if (dataInputs[key]["type"] == "select") {
                cloneSlectValue[key] = "Seleccione una opción..."

            }
        })
        changeSelectsValues(cloneSlectValue)

    }
    function selectSearch(value, key) {
        let cloneDataSelect = { ...dataSelect }
        let selectOptions = document.querySelectorAll(".select-option-" + key)
        let cloneSlectValue = { ...selectsValues }
        cloneSlectValue[key] = value


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
        /*  changeModalSelect({}) */
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
                    iframeFormatoSca[i].style.height = "calc(" + formatoSca.clientHeight + "px" + " + 7px)"
                }
            }
        }
    }
    useEffect(() => {
        setKeyData(keyData + 1)
        Init()
        if (data.inputsForm) {
            inputs = Object.keys(data.inputsForm)
            dataInputs = data.inputsForm
            elementEdit = data.elementEdit
        }



        document.addEventListener('keydown', function (event) {
            setKeydown(event.key)
        })

        function resizeModal() {

            let modalForm = document.querySelectorAll(".div-modal-form");
            let divContentForm = document.querySelectorAll(".div-content-modal");
            let divFondomodalForm = document.querySelectorAll(".div-fondo-modal ");

            for (let m = 0; m < modalForm.length; m++) {
                if ((divContentForm[m].scrollHeight + 100) > document.body.clientHeight) {
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
        resizeModal()
        window.addEventListener("resize", function () {
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

    useEffect(() => {

        const iframeFormatoSca = document.querySelectorAll(".iframe-formato-sca");
        for (let i = 0; i < iframeFormatoSca.length; i++) {
            iframeFormatoSca[i].addEventListener("load", function () {
                resizeFormatoSca()
            })
        }

    }, [idFormato])
    useEffect(() => {
        if (data.tipoAnalisis) {
            if (data.tipoAnalisis == 2) {
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
            }
        }
    }, [data.dataModalResultadoAnalisis]);


    useEffect(() => {
        const iframe = document.getElementById("iframeFormUpdate");
        if (iframe) {
            iframe.addEventListener("load", function () {
                setElementsTemplateFormatoSca("iframeFormUpdate", data.dataModalResultadoAnalisis);
            });
        }

    }, [tipoRegistro])
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
                            dataFormatoSca[keysCuadro[c]] = 10
                        }
                    }
                }
            }

            if (data.setAnalisisFormato) {
                data.setAnalisisFormato(dataFormatoSca, idFormato, tipo, modeFormato, id)
            }
        }
    }
    useEffect(() => {
        if (data.dataModalResultado) {
            if (data.dataModalResultado.length > 0) {
                setStatusSelectDefault(true)
            }
        }
    }, [data.dataModalResultado])
    useEffect(() => {
        if (data.setErrorsFormato) {
            data.setErrorsFormato({})
        }
    }, [data.modalFormResults])

    function registerFormatoFisico(e) {
        e.preventDefault()
        let formData = new FormData(e.target);
        let jsonData = {};
        console.log(formData, "formmm")

        formData.forEach((value, key) => {
            if (Object.prototype.hasOwnProperty.call(jsonData, key)) {
                if (!Array.isArray(jsonData[key])) {
                    jsonData[key] = [jsonData[key]];
                }
                jsonData[key].push(value);
            } else {
                jsonData[key] = value;
            }
        });


        if (data.setAnalisisFormato) {
            data.setAnalisisFormato(jsonData, idFormato, tipoRegistro, modeFormato)
        }
    }
    useEffect(() => {
        console.log(data)
    }, [data])
    return (
        <>
            <link rel="stylesheet" href="../../public/css/form.css" />
            <div style={{ display: (!data.modalFormResults) ? "none" : "" }} className="div-modal-form modal-form" id="modalFormResult">
                <div onClick={() => { setDataSelects({}), data.changeModalFormResults(false) }} className="div-fondo-modal div-fondo-modal-form" id="divFondomodalFormResult">
                </div>
                <div id="divContentFormResult" className="div-content-modal div-content-form">

                    <form /* onSubmit={chageData} */ action="" >
                        <div className="header-form">
                            <h3 className="tittle-form-register">{"Información General Sobre el Análisis"} </h3>
                            <div onClick={() => { setDataSelects({}), data.changeModalFormResults(false) }} className="icon-quit-svg-form">
                                <svg version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                    <g><g><path  d="M150.7,128l90.6-90.7c6.3-6.3,6.3-16.4,0-22.7c-6.3-6.3-16.4-6.3-22.7,0L128,105.3L37.4,14.7c-6.3-6.3-16.4-6.3-22.7,0s-6.3,16.4,0,22.7l90.6,90.6l-90.6,90.6c-6.3,6.3-6.3,16.4,0,22.7c3.1,3.1,7.2,4.7,11.3,4.7c4.1,0,8.2-1.6,11.3-4.7l90.7-90.6l90.6,90.7c3.1,3.1,7.2,4.7,11.3,4.7c4.1,0,8.2-1.6,11.3-4.7c6.3-6.3,6.3-16.4,0-22.7L150.7,128z" /></g></g>
                                </svg>
                            </div>
                        </div>
                        <div className="div-body-form">
                            <div className="div-contenido-info-analisis">
                                <div className="info-analisis info-catador">
                                    <h3>Información sobre el catador</h3>
                                    {data.dataModalResultado ?
                                        (
                                            <div>{
                                                data.dataModalResultado.length > 0 ?
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
                                                    : <div>
                                                        Aún no se ha asignado nigún usuario para el formato {data.tipoAnalisis == 1 ? "Físico" : "Sensorial"}
                                                    </div>
                                            }
                                                {
                                                    inputs.length > 0 && data.userInfo.userInfo.rol == "administrador" ?
                                                        inputs.map((key, index) => {
                                                            if (data.dataModalResultado.length > 0) {
                                                                if (data.dataModalResultado[0]["permission_update"] == "false") {
                                                                    return;
                                                                }
                                                            }
                                                            if (dataInputs[key]["type"] === "select" && dataInputs[key]["visibility"] != false) {

                                                                if (data.statusSelect) {
                                                                    selectsValues[key] = "Seleccione una opción...";
                                                                    dataSelect[key] = ""
                                                                }

                                                                return (
                                                                    <div key={key}>
                                                                        <div key={key} className="input-content-form-register">
                                                                            <div className="head-input">
                                                                                <label htmlFor={key} className="label-from-register">{dataInputs[key]["referencia"] ? dataInputs[key]["referencia"] : "Campo"}</label>
                                                                                <div key={key} className="filter-estado div-select">

                                                                                    <div key={index} style={{ display: "none" }} className="opciones opciones-input-select">

                                                                                        <h4 onClick={(e) => {
                                                                                            const parentElement = e.target.closest(".div-select");
                                                                                            const divOptions = parentElement.querySelectorAll(".opciones-input-select")
                                                                                            divOptions[0] ? divOptions[0].style.display = "none" : ""

                                                                                            setStatusSelectDefault(false); let cloneSelectsValues = { ...selectsValues }; cloneSelectsValues[key] = "Seleccione una opción..."; changeSelectsValues(cloneSelectsValues); dataSelect[key] = "";
                                                                                        }} className='select-option'>Seleccione una opción...</h4>

                                                                                        {
                                                                                            dataInputs[key]["opciones"] ? dataInputs[key]["opciones"].map((select, indexSelect) => {
                                                                                                let value = ""
                                                                                                if (dataInputs[key]["values"]) {
                                                                                                    dataInputs[key]["values"].map((nameSelect, nameIndexSelect) => {
                                                                                                        value += nameIndexSelect == 0 ? dataInputs[key]["opciones"][indexSelect][nameSelect] : ", " + dataInputs[key]["opciones"][indexSelect][nameSelect];
                                                                                                    })
                                                                                                }
                                                                                                if (dataInputs[key]["upper_case"]) {
                                                                                                    value = value.toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase())
                                                                                                } else if (dataInputs[key]["capital_letter"]) {
                                                                                                    value = value.toString().replace(/^[a-z]/, match => match.toUpperCase())
                                                                                                }
                                                                                                if (data.dataModalResultado.length > 0) {
                                                                                                    console.log("ahhhhholaaaaaaaaaaaaaaaaaaaa", statusSelectDefault)
                                                                                                    if (dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]] == data.dataModalResultado[0][key] && statusSelectDefault) {
                                                                                                        selectsValues[key] = value;
                                                                                                        dataSelect[key] = dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]]
                                                                                                    }
                                                                                                }
                                                                                                return <h4 key={indexSelect} onClick={(e) => {
                                                                                                    const parentElement = e.target.closest(".div-select");
                                                                                                    const divOptions = parentElement.querySelectorAll(".opciones-input-select")
                                                                                                    divOptions[0] ? divOptions[0].style.display = "none" : ""
                                                                                                    setStatusSelectDefault(false); let cloneSelectsValues = { ...selectsValues }; cloneSelectsValues[key] = value; changeSelectsValues(cloneSelectsValues); dataSelect[key] = dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]];
                                                                                                }} className={`select-option select-option-${key} ${selectsValues[key] == value ? 'option-focus' : ''}`} value="">
                                                                                                    {value}
                                                                                                </h4>
                                                                                            }) : ""
                                                                                        }

                                                                                    </div>
                                                                                    <div className='input-select-estado input-select-search' name="" id="">

                                                                                        <input id={key} type="text" className="input-select" onInput={(e) => {
                                                                                            const parentElement = e.target.closest(".div-select");
                                                                                            const divOptions = parentElement.querySelectorAll(".opciones-input-select")
                                                                                            divOptions[0] ? divOptions[0].style.display = "block" : ""
                                                                                            selectSearch(e.target.value, key)
                                                                                        }} placeholder={selectsValues[key] == "Seleccione una opción..." ? "Seleccione una opción..." : ""} value={selectsValues[key] != "Seleccione una opción..." ? selectsValues[key] : ""} />
                                                                                        <div onClick={(e) => {
                                                                                            const parentElement = e.target.closest(".div-select");
                                                                                            const divOptions = parentElement.querySelectorAll(".opciones-input-select")
                                                                                            divOptions[0] ? divOptions[0].style.display == "none" ? divOptions[0].style.display = "block" : divOptions[0].style.display = "none" : ""
                                                                                        }} className="icon-chevron-estado">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                                                                                <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                                                                                <g><g><path  d="M240.4,70.6L229,59.2c-4-3.7-8.5-5.6-13.8-5.6c-5.3,0-9.9,1.9-13.6,5.6L128,132.8L54.4,59.2c-3.7-3.7-8.3-5.6-13.6-5.6c-5.2,0-9.8,1.9-13.8,5.6L15.8,70.6C11.9,74.4,10,79,10,84.4c0,5.4,1.9,10,5.8,13.6l98.6,98.6c3.6,3.8,8.2,5.8,13.6,5.8c5.3,0,9.9-1.9,13.8-5.8L240.4,98c3.7-3.7,5.6-8.3,5.6-13.6C246,79.1,244.1,74.5,240.4,70.6z" /></g></g>
                                                                                            </svg>
                                                                                        </div>

                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <h4 className="label-error-submit-form" htmlFor="">{data.errorsFormato ? data.errorsFormato[key] ? data.errorsFormato[key] : "" : ""}</h4>

                                                                        </div>
                                                                        {data.dataModalResultado.length > 0 ?
                                                                            data.dataModalResultado[0]["permission_update"] == "true" ?
                                                                                <button onClick={() => { data.actualizarFormato(data.dataModalAnalisis.length > 0 ? data.dataModalAnalisis[0].id ? data.dataModalAnalisis[0].id : "" : "", data.dataModalResultado[0].id, data.tipoAnalisis, dataSelect["usuarios_id"]) }} type="button" className="button-submit-form">Actualizar</button>
                                                                                : ""
                                                                            :
                                                                            <button onClick={() => { data.asignarFormato(data.dataModalAnalisis.length > 0 ? data.dataModalAnalisis[0].id ? data.dataModalAnalisis[0].id : "" : "", data.tipoAnalisis, dataSelect["usuarios_id"]) }} type="button" className="button-submit-form">Asignar</button>
                                                                        }

                                                                    </div>
                                                                );
                                                            }
                                                        })
                                                        : ""
                                                }
                                            </div>
                                        )
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

                                <h3>Información Sobre el Formato {data.tipoAnalisis == 1 ? "Físico" : "Sensorial"}</h3>
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
                                        : <div> Aún no se ha registrado un formato {data.tipoAnalisis == 1 ? "Físico" : "Sensorial"}</div>

                                    : "Error interno"}
                                {data.dataModalResultadoAnalisis.length > 0 ?
                                    (
                                        <div className="div-content-info-analisis-formato">
                                            <h3>Resultados para el Formato {data.dataModalResultado[0].tipos_analisis_id ? data.dataModalResultado[0].tipos_analisis_id == 1 ? "Físico" : data.dataModalResultado[0].tipos_analisis_id == 2 ? "SCA" : "No disponible" : "No registra"}</h3>
                                            {data.tipoAnalisis == 1 ?
                                                <div className="div-table-formato-fisico-template">
                                                    <table cellSpacing={0} className="table-formato-fisico-template">
                                                        <thead>
                                                            <tr>
                                                                <th colSpan={900000}>Análisis Físico</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>Peso C.P.S (g)</td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["peso_cps"] ? data.dataModalResultadoAnalisis[0]["peso_cps"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td>Humedad (%)</td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["humedad"] ? data.dataModalResultadoAnalisis[0]["humedad"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Peso Cisco (g)</td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["peso_cisco"] ? data.dataModalResultadoAnalisis[0]["peso_cisco"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td> Merma por trilla (%) </td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["merma_trilla"] ? data.dataModalResultadoAnalisis[0]["merma_trilla"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Peso total de la almendra (g) </td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["peso_total_almendra"] ? data.dataModalResultadoAnalisis[0]["peso_total_almendra"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td>Porcentaje de almendra sana (%)</td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["porcentaje_almendra_sana"] ? data.dataModalResultadoAnalisis[0]["porcentaje_almendra_sana"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Peso defectos totales (g)</td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["peso_defectos_totales"] ? data.dataModalResultadoAnalisis[0]["peso_defectos_totales"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td>Factor de rendimiento (Kg C.P.S) </td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["factor_rendimiento"] ? data.dataModalResultadoAnalisis[0]["factor_rendimiento"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Peso de almendra sana (g) </td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["peso_almendra_sana"] ? data.dataModalResultadoAnalisis[0]["peso_almendra_sana"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td>Porcentaje de defectos totales (%) </td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["porcentaje_defectos_totales"] ? data.dataModalResultadoAnalisis[0]["porcentaje_defectos_totales"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Negro total o parcial (g)</td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["negro_total"] ? data.dataModalResultadoAnalisis[0]["negro_total"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td>Cardenillo (g)</td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["cardenillo"] ? data.dataModalResultadoAnalisis[0]["cardenillo"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Vinagre (g)</td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["vinagre"] ? data.dataModalResultadoAnalisis[0]["vinagre"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td>Cristalizado (g)</td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["cristalizado"] ? data.dataModalResultadoAnalisis[0]["cristalizado"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Veteado (g)</td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["veteado"] ? data.dataModalResultadoAnalisis[0]["veteado"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td>Ámbar o mantequillo (g) </td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["ambar"] ? data.dataModalResultadoAnalisis[0]["ambar"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Sobresecado (g) </td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["sobresecado"] ? data.dataModalResultadoAnalisis[0]["sobresecado"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td>Mordido o cortado (g)</td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["mordido"] ? data.dataModalResultadoAnalisis[0]["mordido"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Picado por insectos (g) </td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["picado_insectos"] ? data.dataModalResultadoAnalisis[0]["picado_insectos"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td>Averanado o arrugado (g) </td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["averanado"] ? data.dataModalResultadoAnalisis[0]["averanado"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Inmaduro o paloteado(g) </td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["inmaduro"] ? data.dataModalResultadoAnalisis[0]["inmaduro"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td>Aplastado (g) </td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["aplastado"] ? data.dataModalResultadoAnalisis[0]["aplastado"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Flojo (g) </td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["flojo"] ? data.dataModalResultadoAnalisis[0]["flojo"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td>Decolorado o reposado (g)</td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["decolorado"] ? data.dataModalResultadoAnalisis[0]["decolorado"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Malla 18 (g) </td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["malla18"] ? data.dataModalResultadoAnalisis[0]["malla18"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td>Malla 15 (g)</td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["malla15"] ? data.dataModalResultadoAnalisis[0]["malla15"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Malla 17 (g) </td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["malla17"] ? data.dataModalResultadoAnalisis[0]["malla17"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td>Malla 14 (g)</td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["malla14"] ? data.dataModalResultadoAnalisis[0]["malla14"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Malla 16 (g) </td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["malla16"] ? data.dataModalResultadoAnalisis[0]["malla16"] : <div> {/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                                <td> Mallas menores (g) </td>
                                                                <td>{data.dataModalResultadoAnalisis[0]["mallas_menores"] ? data.dataModalResultadoAnalisis[0]["mallas_menores"] : <div> {/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></div>}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                : <iframe id="iframeFormatoSca" className="iframe-formato-sca" src="/src/formatoSca/formatoScaTemplate.html" frameBorder="0"></iframe>}


                                            {data.dataModalResultado.length > 0 ? data.dataModalResultado[0].permission_formato == "true" && data.dataModalResultado[0].permission_formato ? data.dataModalResultado[0].estado == 1 ? <button onClick={() => { setStatusInputDefault(true); setIdFormato(data.dataModalResultado[0].id); setModeFormato(data.dataModalResultado[0].tipos_analisis_id); setTipoRegistro(2); setModalFormNormal(true) }} type="button" className="button-submit-form">Actualizar</button> : "" : "" : ""}

                                        </div>
                                    )
                                    :
                                    (
                                        <div className="div-content-info-analisis-formato">


                                            {data.tipoAnalisis == 1 ?
                                                <div className="div-table-formato-fisico-template">
                                                    <table cellSpacing={0} className="table-formato-fisico-template">
                                                        <thead>
                                                            <tr>
                                                                <th colSpan={900000}>Análisis Físico</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>Peso C.P.S (g)</td>
                                                                <td>{/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                                <td>Humedad (%)</td>
                                                                <td>{/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Peso Cisco (g)</td>
                                                                <td>{/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                                <td> Merma por trilla (%) </td>
                                                                <td>{/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Peso total de la almendra (g) </td>
                                                                <td>{/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                                <td>Porcentaje de almendra sana (%)</td>
                                                                <td>{/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Peso defectos totales (g)</td>
                                                                <td>{/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                                <td>Factor de rendimiento (Kg C.P.S) </td>
                                                                <td>{/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Peso de almendra sana (g) </td>
                                                                <td>{/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                                <td>Porcentaje de defectos totales (%) </td>
                                                                <td>{/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Negro total o parcial (g)</td>
                                                                <td>{/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                                <td>Cardenillo (g)</td>
                                                                <td>{/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Vinagre (g)</td>
                                                                <td>{/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                                <td>Cristalizado (g)</td>
                                                                <td>{/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Veteado (g)</td>
                                                                <td>{/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                                <td>Ámbar o mantequillo (g) </td>
                                                                <td>{/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Sobresecado (g) </td>
                                                                <td>{/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                                <td>Mordido o cortado (g)</td>
                                                                <td>{/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Picado por insectos (g) </td>
                                                                <td>{/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                                <td>Averanado o arrugado (g) </td>
                                                                <td>{/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Inmaduro o paloteado(g) </td>
                                                                <td>{/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                                <td>Aplastado (g) </td>
                                                                <td>{/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Flojo (g) </td>
                                                                <td>{/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                                <td>Decolorado o reposado (g)</td>
                                                                <td>{/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Malla 18 (g) </td>
                                                                <td>{/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                                <td>Malla 15 (g)</td>
                                                                <td>{/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Malla 17 (g) </td>
                                                                <td>{/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                                <td>Malla 14 (g)</td>
                                                                <td>{/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Malla 16 (g) </td>
                                                                <td>{/*250*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                                <td> Mallas menores (g) </td>
                                                                <td>{/*10.4*/}<span className="no-registra-formato-fisico"><div className="line-no-registra-formato-fisico"> </div><h4>No Registra </h4></span></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                :

                                                <iframe id="iframeFormatoSca" className="iframe-vacio-formato-sca iframe-formato-sca" src="/src/formatoSca/formatoScaTemplate.html" frameBorder="0"></iframe>
                                            }

                                            {data.dataModalResultado.length > 0 ? data.dataModalResultado[0].permission_formato == "true" ? data.dataModalResultado[0].estado == 2 || data.dataModalResultado[0].estado == 3 ? <button onClick={() => { setStatusInput(true); setInputValor({}); setStatusInputDefault(false); setIdFormato(data.dataModalResultado[0].id), setModeFormato(data.dataModalResultado[0].tipos_analisis_id); setTipoRegistro(1), setModalFormNormal(true) }} type="button" className="button-submit-form">Analizar</button> : "" : "" : ""}
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

                    <div className="header-form">
                        <h3 className="tittle-form-register">Registro de análisis  {data.tipoAnalisis == 1 ? "Físico" : "Sensorial"}</h3>
                        <div onClick={() => { setIdFormato(null), setModeFormato(null); setTipoRegistro(null); setModalFormNormal(false) }} className="icon-quit-svg-form">
                            <svg version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                <g><g><path  d="M150.7,128l90.6-90.7c6.3-6.3,6.3-16.4,0-22.7c-6.3-6.3-16.4-6.3-22.7,0L128,105.3L37.4,14.7c-6.3-6.3-16.4-6.3-22.7,0s-6.3,16.4,0,22.7l90.6,90.6l-90.6,90.6c-6.3,6.3-6.3,16.4,0,22.7c3.1,3.1,7.2,4.7,11.3,4.7c4.1,0,8.2-1.6,11.3-4.7l90.7-90.6l90.6,90.7c3.1,3.1,7.2,4.7,11.3,4.7c4.1,0,8.2-1.6,11.3-4.7c6.3-6.3,6.3-16.4,0-22.7L150.7,128z" /></g></g>
                            </svg>
                        </div>
                    </div>
                    <div className="div-body-form">
                        {modeFormato == 2 ?
                            (
                                <div>

                                    {tipoRegistro == 1 ? (
                                        <div>
                                            <iframe id="iframeFormRegister" className="iframe-formato-sca" src="/src/formatoSca/formatoSca.html" frameBorder="0"></iframe>
                                            <button onClick={() => { registerFormatoSca("iframeFormRegister", 1, data.dataModalAnalisis[0].id) }} type="button" className="button-submit-form">Registrar</button>
                                        </div>
                                    ) : (
                                        <div>
                                            <iframe id="iframeFormUpdate" className="iframe-formato-sca" src="/src/formatoSca/formatoSca.html" frameBorder="0"></iframe>
                                            <button onClick={() => { registerFormatoSca("iframeFormUpdate", 2, data.dataModalAnalisis[0].id) }} type="button" className="button-submit-form">Guardar</button>
                                        </div>
                                    )}
                                </div>
                            )
                            :
                            <div id="divFormFormatoFisico" className="div-form-formato-fisico">
                                <form onSubmit={(e) => { registerFormatoFisico(e) }}>
                                    <div style={{ display: Object.keys(inputsFormatoFisico).length == 1 ? "unset" : "" }} className="form-register-formato-fisico">
                                        {
                                            inputsFormatoFisico.map((key, index) => {
                                                if (dataInputsFormatoFisico[key]["type"] === "text" || dataInputsFormatoFisico[key]["type"] === "email" || dataInputsFormatoFisico[key]["type"] === "number" || dataInputsFormatoFisico[key]["type"] === "ubicacion" || dataInputsFormatoFisico[key]["type"] === "normal") {
                                                    console.log(statusInputDefault, inputValor[key])
                                                    if (statusInputDefault && elementEditFormatoFisico) {
                                                        inputValor[key] = elementEditFormatoFisico[key] ? dataInputsFormatoFisico[key]["upper_case"] ? typeof elementEditFormatoFisico[key] === "string" ? elementEditFormatoFisico[key].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : elementEditFormatoFisico[key] ?? '' : dataInputsFormatoFisico[key]["capital_letter"] ? typeof elementEditFormatoFisico[key] === "string" ? elementEditFormatoFisico[key].toString().replace(/^[a-z]/, match => match.toUpperCase()) : elementEditFormatoFisico[key] ?? '' : elementEditFormatoFisico[key] ?? "" : ""
                                                    } else if (statusInput) {
                                                        inputValor[key] = ""

                                                    }
                                                    return (

                                                        <div key={key} className={`${dataInputsFormatoFisico[key]["type"] === "email" ? "input-email " : ""}input-content-form-register`}>
                                                            <div className="head-input">
                                                                <label htmlFor={key} className="label-from-register" >{dataInputsFormatoFisico[key]["referencia"] ? dataInputsFormatoFisico[key]["referencia"] : "Campo"}</label>
                                                                <input id={key} name={key} autoComplete="false" onChange={(e) => { setStatusInput(false); setStatusInputDefault(false); handleInputChange(e, key, dataInputsFormatoFisico[key]["type"]); }} value={statusInputDefault && elementEdit ? dataInputsFormatoFisico[key]["upper_case"] ? typeof elementEdit[key] === "string" ? elementEdit[key].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : elementEdit[key] ?? '' : dataInputsFormatoFisico[key]["capital_letter"] ? typeof elementEdit[key] === "string" ? elementEdit[key].toString().replace(/^[a-z]/, match => match.toUpperCase()) : elementEdit[key] ?? '' : elementEdit[key] ?? "" : inputValor[key]} className="input-form" type="text" />
                                                            </div>
                                                            <h4 className="label-error-submit-form">{data.errorsFormato ? data.errorsFormato[key] ? data.errorsFormato[key] : "" : ""}</h4>
                                                        </div>
                                                    );

                                                } else if (dataInputsFormatoFisico[key]["type"] === "select" && dataInputsFormatoFisico[key]["visibility"] != false) {

                                                    if (data.statusSelect) {
                                                        selectsValues[key] = "";
                                                        dataSelect[key] = ""
                                                    }

                                                    return (
                                                        <div key={key} className="input-content-form-register">
                                                            <div className="head-input">
                                                                <label htmlFor={key} className="label-from-register">{dataInputsFormatoFisico[key]["referencia"] ? dataInputsFormatoFisico[key]["referencia"] : "Campo"}</label>
                                                                <div key={key} className="filter-estado div-select">

                                                                    <div key={index} style={{ display: "none" }} className="opciones opciones-input-select">

                                                                        <h4 onClick={(e) => {
                                                                            const parentElement = e.target.closest(".div-select");
                                                                            const divOptions = parentElement.querySelectorAll(".opciones-input-select")
                                                                            divOptions[0] ? divOptions[0].style.display = "none" : ""

                                                                            data.setStatusSelect(false); data.setStatusSelectDefault(false); let cloneSelectsValues = { ...selectsValues }; cloneSelectsValues[key] = ""; changeSelectsValues(cloneSelectsValues); dataSelect[key] = "";
                                                                        }} className='select-option'>Seleccione una opción...</h4>

                                                                        {
                                                                            dataInputsFormatoFisico[key]["opciones"] ? dataInputsFormatoFisico[key]["opciones"].map((select, indexSelect) => {
                                                                                let value = ""
                                                                                if (dataInputsFormatoFisico[key]["values"]) {
                                                                                    dataInputsFormatoFisico[key]["values"].map((nameSelect, nameIndexSelect) => {
                                                                                        value += nameIndexSelect == 0 ? dataInputsFormatoFisico[key]["opciones"][indexSelect][nameSelect] : ", " + dataInputsFormatoFisico[key]["opciones"][indexSelect][nameSelect];
                                                                                    })
                                                                                }



                                                                                if (dataInputsFormatoFisico[key]["upper_case"]) {
                                                                                    value = value.toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase())
                                                                                } else if (dataInputsFormatoFisico[key]["capital_letter"]) {
                                                                                    value = value.toString().replace(/^[a-z]/, match => match.toUpperCase())
                                                                                }
                                                                                if (elementEdit) {
                                                                                    if (!data.modalForm && dataInputsFormatoFisico[key]["opciones"][indexSelect][dataInputsFormatoFisico[key]["key"]] == elementEdit[key] && data.statusSelectDefault) {
                                                                                        selectsValues[key] = value;
                                                                                        dataSelect[key] = dataInputsFormatoFisico[key]["opciones"][indexSelect][dataInputsFormatoFisico[key]["key"]]
                                                                                    }
                                                                                }


                                                                                return <h4 key={indexSelect} onClick={(e) => {
                                                                                    const parentElement = e.target.parentElement.parentElement;
                                                                                    const divOptions = parentElement.querySelectorAll(".opciones-input-select")
                                                                                    divOptions[0] ? divOptions[0].style.display = "none" : ""; let cloneSelectsValues = { ...selectsValues }; cloneSelectsValues[key] = value; changeSelectsValues(cloneSelectsValues); data.setStatusSelect(false); data.setStatusSelectDefault(false); dataSelect[key] = dataInputsFormatoFisico[key]["opciones"][indexSelect][dataInputsFormatoFisico[key]["key"]];
                                                                                }} className={`select-option select-option-${key} ${selectsValues[key] == value ? 'option-focus' : ''}`} value="">
                                                                                    {value}
                                                                                </h4>
                                                                            }) : ""
                                                                        }

                                                                    </div>
                                                                    <div className='input-select-estado input-select-search' name="" id="">

                                                                        <input id={key} type="text" className="input-select" onInput={(e) => {
                                                                            const parentElement = e.target.closest(".div-select");
                                                                            const divOptions = parentElement.querySelectorAll(".opciones-input-select")
                                                                            divOptions[0] ? divOptions[0].style.display = "block" : ""
                                                                            selectSearch(e.target.value, key)
                                                                        }} placeholder={"Seleccione una opción..."} value={selectsValues[key] != "Seleccione una opción..." ? selectsValues[key] : ""} />
                                                                        <div onClick={(e) => {
                                                                            const parentElement = e.target.closest(".div-select");
                                                                            const divOptions = parentElement.querySelectorAll(".opciones-input-select")
                                                                            divOptions[0] ? divOptions[0].style.display == "none" ? divOptions[0].style.display = "block" : divOptions[0].style.display = "none" : ""
                                                                            console.log(parentElement)
                                                                        }} className="icon-chevron-estado">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                                                                <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                                                                <g><g><path  d="M240.4,70.6L229,59.2c-4-3.7-8.5-5.6-13.8-5.6c-5.3,0-9.9,1.9-13.6,5.6L128,132.8L54.4,59.2c-3.7-3.7-8.3-5.6-13.6-5.6c-5.2,0-9.8,1.9-13.8,5.6L15.8,70.6C11.9,74.4,10,79,10,84.4c0,5.4,1.9,10,5.8,13.6l98.6,98.6c3.6,3.8,8.2,5.8,13.6,5.8c5.3,0,9.9-1.9,13.8-5.8L240.4,98c3.7-3.7,5.6-8.3,5.6-13.6C246,79.1,244.1,74.5,240.4,70.6z" /></g></g>
                                                                            </svg>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <h4 className="label-error-submit-form" htmlFor="">{data.errorsFormato ? data.errorsFormato[key] ? data.errorsFormato[key] : "" : ""}</h4>

                                                        </div>
                                                    );
                                                } else {

                                                    if (index == inputs.length) {
                                                        return "No hay nada para mostrar " + key;
                                                    }

                                                }

                                            })
                                        }

                                    </div>
                                    {tipoRegistro == 1 ? (
                                        <div>
                                            <button onClick={() => { }} type="submit" className="button-submit-form">Registrar</button>

                                        </div>
                                    ) : (
                                        <div>
                                            <button onClick={() => { }} type="submit" className="button-submit-form">Guardar</button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        }
                    </div>
                </div >

            </div >

        </>
    )
})