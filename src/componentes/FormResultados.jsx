import { object, string } from "prop-types";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { formatDate } from "./tablas";
import { $ } from "jquery"
import "../../public/css/formResultados.css"


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
    const divContentFormRef = useRef(null);
    const modalRef = useRef(null);

    const [inputValor, setInputValor] = useState({});
    const [keyDown, setKeydown] = useState();
    const [keyData, setKeyData] = useState(0);
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
        if (data.modalFormResults) {

            if (modalRef.current != null) {
                const modal = modalRef.current
                let modalForm = modalRef.current;
                let divContentForm = modalRef.current.querySelector("#divContentFormResult");
                let labelErrorSubmitForm = modalRef.current.querySelector(".label-error-submit-form");

                setTimeout(() => {
                    resizeForm()
                }, 100);
                document.addEventListener('keydown', function (event) {
                    setKeydown(event.key)
                })
                function resizeForm() {
                    console.log(modalForm, divContentForm)
                    if (modalForm && divContentForm) {
                        let displayNone = false;
                        if (modalForm.style.display == "none") {
                            modalForm.style.display = "block"
                            displayNone = true
                        }

                        if (divContentForm.scrollHeight > document.body.clientHeight) {
                            modalForm.style.alignItems = "unset"
                            modalForm.style.padding = "20px 20px"
                            modalForm.style.height = "calc(100% - 40px)"
                            modalForm.style.width = "calc(100% - 40px)"
                        } else {
                            if (labelErrorSubmitForm) {
                                for (let x = 0; x < labelErrorSubmitForm.length; x++) {
                                    labelErrorSubmitForm[x].style.height = ""
                                }
                            }

                            modalForm.style.alignItems = "center"
                            modalForm.style.padding = ""
                            modalForm.style.height = "100%"
                            modalForm.style.width = "100%"
                        }
                        if (displayNone) {
                            modalForm.style.display = "none"
                        }
                        if (labelErrorSubmitForm) {
                            for (let x = 0; x < labelErrorSubmitForm.length; x++) {
                                if ((labelErrorSubmitForm[x].scrollHeight) > labelErrorSubmitForm[x].clientHeight) {
                                    labelErrorSubmitForm[x].style.height = "max-content"
                                }
                            }
                        }
                    }

                }
                resizeForm()
                window.addEventListener("resize", function () {
                    resizeForm()
                })

            }
        }
    }, [modalRef.current, data.modalFormResults])
    useEffect(() => {
        if (data.modalFormResults) {
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
        }
    }, [data, data.modalFormResults])


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
        if (data.modalFormResults) {
            const iframeFormatoSca = document.querySelectorAll(".iframe-formato-sca");
            for (let i = 0; i < iframeFormatoSca.length; i++) {
                iframeFormatoSca[i].addEventListener("load", function () {
                    resizeFormatoSca()
                })
            }
        }
    }, [idFormato, data.modalFormResults])
    const [keyModalResultado, setkeyModalResultado] = useState(0)
    useEffect(() => {
        if (data.modalFormResults) {
            if (data.dataModalResultadoAnalisis.length == 0) {
                setkeyModalResultado(keyModalResultado + 1)
            }
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
        }
    }, [data.dataModalResultadoAnalisis, data.modalFormResults]);


    useEffect(() => {
        if (data.modalFormResults) {
            const iframe = document.getElementById("iframeFormUpdate");
            if (iframe) {
                iframe.addEventListener("load", function () {
                    setElementsTemplateFormatoSca("iframeFormUpdate", data.dataModalResultadoAnalisis);
                });
            }
        }
    }, [tipoRegistro, data.modalFormResults])
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
        if (data.modalFormResults) {
            if (data.dataModalResultado) {
                if (data.dataModalResultado.length > 0) {
                    setStatusSelectDefault(true)
                }
            }
        }
    }, [data.dataModalResultado, data.modalFormResults])
    useEffect(() => {
        if (data.modalFormResults) {
            if (data.setErrorsFormato) {
                data.setErrorsFormato({})
            }
        }
    }, [data.modalFormResults])

    function registerFormatoFisico(e) {
        e.preventDefault()
        let formData = new FormData(e.target);
        let jsonData = {};

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


    return (

        <>
            {
                data.modalFormResults ? <div id="mainFormResultados">


                    <div onClick={(e) => {
                        if (divContentFormRef.current != null) {
                            console.log(e.target)
                            if (e.target != divContentFormRef.current && !divContentFormRef.current.contains(e.target)) {
                                setDataSelects({}), data.changeModalFormResults(false)
                            }
                        }
                    }} ref={modalRef} className="div-modal-form modal-form" id="modalFormResult">


                        <div ref={divContentFormRef} id="divContentFormResult" className="div-content-modal div-content-form">

                            <form /* onSubmit={chageData} */ action="" >
                                <div className="header-form">
                                    <h3 className="tittle-form-register">{"Información General Sobre el Análisis"} </h3>
                                    <div onClick={() => { setDataSelects({}), data.changeModalFormResults(false) }} className="icon-quit-svg-form">
                                        <svg version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                            <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                            <g><g><path d="M150.7,128l90.6-90.7c6.3-6.3,6.3-16.4,0-22.7c-6.3-6.3-16.4-6.3-22.7,0L128,105.3L37.4,14.7c-6.3-6.3-16.4-6.3-22.7,0s-6.3,16.4,0,22.7l90.6,90.6l-90.6,90.6c-6.3,6.3-6.3,16.4,0,22.7c3.1,3.1,7.2,4.7,11.3,4.7c4.1,0,8.2-1.6,11.3-4.7l90.7-90.6l90.6,90.7c3.1,3.1,7.2,4.7,11.3,4.7c4.1,0,8.2-1.6,11.3-4.7c6.3-6.3,6.3-16.4,0-22.7L150.7,128z" /></g></g>
                                        </svg>
                                    </div>
                                </div>
                                <div className="div-body-form">
                                    <div className="div-contenido-info-analisis">
                                        <div className="info-analisis info-catador">
                                            <h3 className="title-info">Información sobre el catador  <div className="title-svg"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enableBackground="new 0 0 256 256" >
                                                <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                                <g> <path fill="#3d2b1f" d="M222.4,233.4H33.6C21.5,233.4,10,222,10,209.9v-3.6c0-3,2.4-5.4,5.4-5.5l225.1-0.1c1.5,0,2.8,0.6,3.9,1.6 c1,1,1.6,2.4,1.6,3.8v3.6C246,222.2,234.8,233.4,222.4,233.4L222.4,233.4z M21.1,211.7c1.1,5.5,7,10.8,12.5,10.8h188.8 c5.7,0,11.5-5.2,12.5-10.9L21.1,211.7z" /> <path fill="#3d2b1f" d="M200.6,99.8v27.3c0,35.7-20.7,74-66.3,74h-19.5c-45.5,0-66.3-38.4-66.3-74V99.8H200.6 M200.6,90.8h-152 c-5,0-9.1,4.1-9.1,9.1v27.3c0,40,23.6,83.1,75.3,83.1h19.5c51.8,0,75.3-43.1,75.3-83.1V99.8C209.7,94.8,205.7,90.8,200.6,90.8z" /> <path fill="#3d2b1f" d="M209.6,144.6h-8.9v-8.9h8.9c10.9,0,17.9-7,17.9-17.9s-7-17.9-17.9-17.9h-8.9v-8.9h8.9 c15.8,0,26.8,11,26.8,26.8C236.4,133.6,225.4,144.6,209.6,144.6z M152.9,137.9c-6.6-16.2-23-24.8-36.6-19.3 c-13.6,5.5-19.4,23.2-12.8,39.4s23,24.8,36.6,19.3C153.7,171.7,159.5,154.1,152.9,137.9z M138.6,169c-0.2,0.3-0.4,0.4-0.6,0.6 c-0.3,0.1-0.7,0.1-1,0c-0.6-0.2-0.9-0.9-0.8-1.5c0.1-0.3,1.5-8.7-10.4-18.5c-13.1-10.8-6.4-23.3-6.3-23.4c0.3-0.6,1-0.8,1.6-0.6 c0.6,0.2,1,0.8,0.9,1.5c-0.1,0.4-1.2,9,10.4,18.5C145.9,156.6,138.7,168.8,138.6,169z M222.4,232.5H33.6c-11.7,0-22.7-11-22.7-22.6 v-3.6c0-2.5,2-4.5,4.5-4.5l225.1-0.1c1.2,0,2.3,0.5,3.2,1.3c0.8,0.8,1.3,2,1.3,3.2v3.6C245.1,221.7,234.3,232.5,222.4,232.5z  M20,210.8c0.6,6.3,7.3,12.6,13.6,12.6h188.8c6.6,0,13-6.2,13.6-12.7L20,210.8z M126,77.8c-1.4,0-2.8-0.7-3.7-1.9 c-1.5-2.1-0.9-4.9,1.1-6.3c1.7-1.2,6.5-5.5,6.6-9.6c0-0.8,0.1-3.1-3.5-6.1c-6-5-7.2-10.3-7.2-13.9c0-9,7.5-15.7,8.4-16.4 c1.9-1.6,4.8-1.4,6.4,0.5c1.6,1.9,1.4,4.8-0.5,6.4c-1.5,1.2-5.2,5.4-5.2,9.5c0,2.4,1.3,4.7,4,6.9c5.8,4.9,6.9,10,6.7,13.4 c-0.4,9.3-9.5,15.9-10.5,16.6C127.7,77.5,126.9,77.8,126,77.8z M168.7,77.8c-1.4,0-2.8-0.7-3.7-1.9c-1.5-2.1-0.9-4.9,1.1-6.3 c1.7-1.2,6.5-5.5,6.6-9.6c0-0.8,0.1-3.1-3.5-6.1c-6-5-7.2-10.3-7.2-13.9c0-9,7.5-15.7,8.4-16.4c1.9-1.6,4.8-1.4,6.4,0.5 c1.6,1.9,1.4,4.8-0.5,6.4c-1.5,1.2-5.2,5.4-5.2,9.5c0,2.4,1.3,4.7,4,6.9c5.8,4.9,6.9,10,6.7,13.4c-0.4,9.3-9.5,15.9-10.5,16.6 C170.5,77.5,169.6,77.8,168.7,77.8z M83.2,77.8c-1.4,0-2.8-0.7-3.7-1.9c-1.5-2.1-0.9-4.9,1.1-6.3c1.7-1.2,6.5-5.5,6.6-9.6 c0-0.8,0.1-3.1-3.5-6.1c-6-5-7.2-10.3-7.2-13.9c0-9,7.5-15.7,8.4-16.4c1.9-1.6,4.8-1.4,6.4,0.5c1.6,1.9,1.4,4.8-0.5,6.4 c-1.5,1.2-5.2,5.4-5.2,9.5c0,2.4,1.3,4.7,4,6.9c5.8,4.9,6.9,10,6.7,13.4C96,69.7,86.9,76.3,85.9,77C85,77.5,84.1,77.8,83.2,77.8z" /></g>
                                            </svg></div></h3>
                                            {data.dataModalResultado ?
                                                (
                                                    <div>{
                                                        data.dataModalResultado.length > 0 ?
                                                            data.dataModalResultado.map((key, index) => {
                                                                if (index == 0) {
                                                                    return <div key={key.id + "catador"}>
                                                                        <div className="div-info-analisis">
                                                                            <div>
                                                                                <h4>Nombre:</h4>
                                                                                <p>{key.nombre_catador ? key.nombre_catador : "No registra"}</p>
                                                                            </div>
                                                                            <div>
                                                                                <h4>Documento:</h4>
                                                                                <p>{key.catador_documento ? key.catador_documento : "No registra"}</p>
                                                                            </div>
                                                                            <div>
                                                                                <h4>Teléfono:</h4>
                                                                                <p>{key.catador_telefono ? key.catador_telefono : "No registra"}</p>
                                                                            </div>
                                                                            <div>
                                                                                <h4>Correo:</h4>
                                                                                <span>{key.catador_correo ? key.catador_correo : "No registra"}</span>
                                                                            </div>
                                                                            <div>
                                                                                <h4>Rol:</h4>
                                                                                <p>{key.catador_rol ? key.catador_rol : "No registra"}</p>
                                                                            </div>
                                                                            <div>
                                                                                <h4>Cargo:</h4>
                                                                                <p>{key.catador_cargo ? key.catador_cargo : "No registra"}</p>
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
                                                                                                        <g><g><path d="M240.4,70.6L229,59.2c-4-3.7-8.5-5.6-13.8-5.6c-5.3,0-9.9,1.9-13.6,5.6L128,132.8L54.4,59.2c-3.7-3.7-8.3-5.6-13.6-5.6c-5.2,0-9.8,1.9-13.8,5.6L15.8,70.6C11.9,74.4,10,79,10,84.4c0,5.4,1.9,10,5.8,13.6l98.6,98.6c3.6,3.8,8.2,5.8,13.6,5.8c5.3,0,9.9-1.9,13.8-5.8L240.4,98c3.7-3.7,5.6-8.3,5.6-13.6C246,79.1,244.1,74.5,240.4,70.6z" /></g></g>
                                                                                                    </svg>
                                                                                                </div>

                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <h4 className="label-error-submit-form" htmlFor="">{data.errorsFormato ? data.errorsFormato[key] ? data.errorsFormato[key] : "" : ""}</h4>

                                                                                </div>
                                                                                {data.dataModalResultado.length > 0 ?
                                                                                    data.dataModalResultado[0]["permission_update"] == "true" ?
                                                                                        data.dataModalResultado[0]["estado"] != 4 ?
                                                                                            <div>
                                                                                                <button onClick={() => { data.actualizarFormato(data.dataModalAnalisis.length > 0 ? data.dataModalAnalisis[0].id ? data.dataModalAnalisis[0].id : "" : "", data.dataModalResultado[0].id, data.tipoAnalisis, dataSelect["usuarios_id"]) }} type="button" className="button-submit-form">Actualizar</button>
                                                                                                {/*  <button onClick={() => { data.finalizarFormato ? data.finalizarFormato(data.dataModalResultado[0].id) : "" }} type="button" className="button-submit-form">Finalizar</button> */}
                                                                                            </div>
                                                                                            : ""
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
                                            <h3 className="title-info">Información sobre el análisis<div className="title-svg"><svg version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enableBackground="new 0 0 256 256" >
                                                <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                                <g><g><path fill="#000000" d="M48.9,10h107.9c2.5,0,4.9,1,6.4,2.5l66,65.5c2,2,2.5,4.4,2.5,6.4l0,0v137.5c0,6.4-2.5,12.8-7.4,17.2l0,0l0,0c-4.4,4.4-10.4,6.9-17.2,6.9H48.9c-6.9,0-12.8-3-17.2-7.4l0,0c-4.4-3.4-7.4-9.8-7.4-16.8V34.2c0-6.9,3-12.8,7.4-17.2C35.6,13,42,10,48.9,10L48.9,10z M163.7,129.2L163.7,129.2L163.7,129.2c9.4,9.4,15.3,22.2,15.3,36c0,14.3-5.9,27.1-15.3,36c-9.4,9.4-22.2,15.3-36,15.3s-27.1-5.9-36-15.3l0,0c-9.4-9.4-15.3-22.2-15.3-36c0-14.3,5.9-27.1,15.3-36l0.5-0.5C112,109,144,109.5,163.7,129.2L163.7,129.2z M65.7,106.1L65.7,106.1c-3,0-5.4-2.5-5.4-5.4c0-3,2.5-5.4,5.4-5.4h19.7c3,0,5.4,2.5,5.4,5.4c0,3-2.5,5.4-5.4,5.4H65.7L65.7,106.1z M65.7,83.9L65.7,83.9c-3,0-5.4-2.5-5.4-5.4c0-3,2.5-5.4,5.4-5.4h63.6c3,0,5.4,2.5,5.4,5.4c0,3-2.5,5.4-5.4,5.4H65.7L65.7,83.9z M65.7,62.2L65.7,62.2c-3,0-5.4-2.5-5.4-5.4c0-3,2.5-5.4,5.4-5.4h63.6c3,0,5.4,2.5,5.4,5.4c0,3-2.5,5.4-5.4,5.4H65.7L65.7,62.2z M133.2,125.3L133.2,125.3v36.9l32,18.2c2-4.9,3-9.8,3-15.3c0-10.8-4.4-20.7-11.3-28.1l-0.5-0.5C149.9,130.7,142,126.8,133.2,125.3L133.2,125.3z M159.3,189.9L159.3,189.9l-34-19.7c-2-1-3.4-2.5-3.4-4.9v-39.9c-8.9,1-16.8,5.4-22.7,11.3l-0.5,0.5c-7.4,7.4-11.8,17.2-11.8,28.6s4.4,21.2,11.8,28.6l0,0c7.4,7.4,17.2,11.8,28.6,11.8c10.8,0,21.2-4.4,28.6-11.8C157.3,192.8,158.3,191.3,159.3,189.9L159.3,189.9z M213,90.3L213,90.3h-41.4c-5.9,0-10.8-2.5-14.8-5.9v-0.5c-3.4-3.9-5.9-8.9-5.9-14.3V28.2h-102c-2,0-3.4,0.5-4.4,2c-1.5,1-2,2.5-2,3.9v187.7c0,1.5,0.5,3.4,2,4.4l0,0c1,1,2.5,2,4.4,2h158.2c1.5,0,3.4-1,4.4-2l0,0c1-1,2-2.5,2-4.4V90.3H213z M203.6,79.5L203.6,79.5l-41.9-41.9v32c0,2.5,1,4.9,2.5,6.9l0.5,0.5c2,2,4.4,3,6.9,3h32L203.6,79.5L203.6,79.5z" /></g></g>
                                            </svg></div></h3>
                                            {data.dataModalAnalisis ?

                                                data.dataModalAnalisis.map((key, index) => {
                                                    if (index == 0) {
                                                        return <div key={key.id}>
                                                            <div className="div-info-analisis">
                                                                <div>
                                                                    <h4>Id del análisis:</h4>
                                                                    <p>{key.id ? key.id : "No registra"}</p>
                                                                </div>
                                                                <div>
                                                                    <h4>Tipo de proceso: </h4>
                                                                    <p>{key.proceso ? key.proceso : "No registra"}</p>
                                                                </div>
                                                                <div>
                                                                    <h4>Calidad: </h4>
                                                                    <p>{key.calidad && key.calidad != 0 ? key.calidad : "No registra"}</p>
                                                                </div>
                                                                <div>
                                                                    <h4>Fecha de Registro:</h4>
                                                                    <p>{key.fecha_creacion ? key.proceso : "No registra"}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }

                                                })
                                                : "Error interno"}
                                        </div>
                                        <div className="info-analisis">
                                            <h3 className="title-info">Información de la ubicación<div className="title-svg"><svg version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enableBackground="new 0 0 256 256" >
                                                <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                                <g><g><g><path fill="#000000" d="M118.3,10.4c-2.2,0.2-6.5,1-9.4,1.7c-30.4,6.8-55,29.6-63.9,59.4C42,81,41.6,84.7,41.6,97.9c0,12.2,0.5,16.9,2.7,26.9c8.8,40.4,37,83,77.8,117.3c5.9,5,5.5,4.9,9.5,1.6c30.8-24.9,58.4-60.5,71.5-92.4c10.3-25.2,13.9-51.7,9.6-72.2c-6.7-32.2-31.4-58.2-63-66.4C140.5,10.4,127.2,9.4,118.3,10.4z M138.1,29.1c12.8,2.2,25,8.3,34.5,17.2c8.2,7.6,14.3,17.1,17.9,27.4c2.2,6.4,3.2,11.9,3.5,19.3c0.8,19.5-6.1,37-20.1,50.8c-9.4,9.3-21.7,15.8-35.3,18.4c-5.9,1.2-18.2,1.2-24.1,0c-27.8-5.5-48.3-25.7-54.4-53.7c-1.2-5.6-1.2-20.2,0-25.9c3-13.7,8.9-24.6,18.7-34.5c11-11,23.1-17.1,39.2-19.5C121.7,28.1,134.1,28.3,138.1,29.1z" /><path fill="#000000" d="M124.5,67c-3.4,5.3-6.2,9.7-6.1,9.8c0.6,0.6,5.8-2,8.1-4.1c3.6-3.3,4.6-5.9,4.4-11.2l-0.1-4.1L124.5,67z" /><path fill="#000000" d="M111.6,58.7c-4.5,1.6-7.5,4.3-9.3,8.5c-0.6,1.4-1.4,9.2-0.8,9.2c0.1,0,2.7-3.4,5.8-7.7c3.1-4.2,6.1-8.4,6.7-9.2c1-1.4,1.1-1.5,0.3-1.5C113.7,58.1,112.5,58.4,111.6,58.7z" /><path fill="#000000" d="M149.9,59.1c-5.2,2-8.5,6.7-9.3,13.2c-0.6,5.2,0,4.8,6.9-4.7c3.5-4.8,6.5-9,6.5-9.2C154.3,57.7,152.6,58,149.9,59.1z" /><path fill="#000000" d="M92.8,98.3c0,20.5,0,20.7,3.8,24.1c1.7,1.6,3,2.3,4.8,2.6c1.7,0.4,9.7,0.5,25.9,0.4l23.4-0.1l2.3-1.4c1.4-0.9,2.8-2.3,3.7-3.7c1.2-1.9,1.4-2.8,1.6-6.5l0.2-4.2h2.5c3,0,5.2-1.3,6.5-3.8c0.7-1.4,0.9-2.9,0.9-9.2c0-5.1-0.2-7.9-0.6-8.7c-1-2.1-2.9-3.1-6.2-3.3l-3.1-0.2v-1.8v-1.8h-32.8H92.8V98.3z M163.6,88.7c0.7,1.3,0.6,14.8-0.1,15.5c-0.3,0.3-1.6,0.6-2.8,0.6h-2.3v-8.5v-8.5h2.4C162.5,87.8,163.2,88,163.6,88.7z" /><path fill="#000000" d="M80.6,128.9c-0.8,0.8-0.7,1.7,0.2,2c0.4,0.1,3.3,0.3,6.4,0.3c5.1,0,5.6,0.1,5.6,0.9c0,2-0.2,2,32.8,2c33,0,32.8,0,32.8-2c0-0.8,0.6-0.9,7.9-0.9c8.3,0,9.7-0.3,8.8-1.7c-0.5-0.8-3.1-0.8-47.2-1C91.9,128.4,81,128.5,80.6,128.9z" /></g></g></g>
                                            </svg></div></h3>
                                            {data.dataModalAnalisis ?

                                                data.dataModalAnalisis.map((key, index) => {
                                                    if (index == 0) {
                                                        return <div key={key.id}>
                                                            <div className="div-info-analisis">
                                                                <div>
                                                                    <h4>Departamento:</h4>
                                                                    <p>{key.departamento ? key.departamento : "No registra"}</p>
                                                                </div>
                                                                <div>
                                                                    <h4>Municipio:</h4>
                                                                    <p>{key.municipio ? key.municipio : "No registra"}</p>
                                                                </div>
                                                                <div>
                                                                    <h4>Vereda:</h4>
                                                                    <p>{key.nombre_vereda ? key.nombre_vereda : "No registra"}</p>
                                                                </div>
                                                                <div>
                                                                    <h4>Lote: </h4>
                                                                    <p>{key.lote ? key.lote : "No registra"}</p>
                                                                </div>
                                                                <div>
                                                                    <h4>Finca:</h4>
                                                                    <p>{key.finca ? key.finca : "No registra"}</p>
                                                                </div>
                                                                <div>
                                                                    <h4>Latitud del Lote:</h4>
                                                                    <p>{key.latitud_lote ? key.latitud_lote : "No registra"}</p>
                                                                </div>
                                                                <div>
                                                                    <h4>Longitud del Lote: </h4>
                                                                    <p>{key.longitud_lote ? key.longitud_lote : "No registra"}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }

                                                })
                                                : "Error interno"}
                                        </div>
                                        <div className="info-analisis">
                                            <h3 className="title-info">Información sobre la muestra <div className="title-svg ">
                                                <svg version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enableBackground="new 0 0 256 256" >
                                                    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                                    <g><g><g><path fill="#000000" d="M183.4,3.9c-10.9,2.1-20.1,10.8-23.6,22.4c-6.2,20.1,4.2,46.6,24.1,61.7c4.6,3.5,14.1,8.1,19.5,9.4c5.6,1.4,13.6,1.5,18.3,0.3c5.7-1.5,10.1-4,14.2-8.1c8.8-8.8,12.1-22.1,9-36.9C238.6,22.3,209-1.2,183.4,3.9z M184.5,24.9c2.2,6.8,6.5,11,22.7,22.4c9.6,6.7,13.2,9.9,16.5,14.6c5.5,7.9,5.7,16.4,0.5,23.8c-1.4,2-2.1,2.4-1.8,0.9c0.4-1.6-0.8-6.5-2.4-9.8c-2-4.1-8.5-10.7-13.8-13.9c-12.6-7.6-20.5-14.2-24.4-20.4c-6-9.5-6-19.5,0.1-28.4l1.3-1.9l0.3,5.6C183.9,20.9,184.2,24,184.5,24.9z" /><path fill="#000000" d="M51.8,10.4c-5.3,0.5-9.4,1.7-14.4,4.1c-23,11.2-33,44.1-24.4,79.8c6.9,28.4,24.1,53.9,45.7,67.6l1.3,0.9l2.5-5.1C68,146.9,74.5,137.6,82,130c2.5-2.6,4.5-4.8,4.5-5c0-0.5-3.8-6.1-6.1-8.8c-1.1-1.4-5.2-5.8-9.1-9.8C54.8,89.2,46.2,75.4,43.2,60.5c-1.2-5.8-0.7-14.4,1-19.6c1.7-5,4.4-9.7,8-13.4c4.3-4.7,4.5-4.6,3.5,0.4c-2,9.8-1.7,17.8,1.1,25c2.9,7.7,8.2,14.9,24.6,34.1c10.3,12.1,16,19.6,18.1,24c0.5,1,1,1.9,1.2,1.9s2.1-1.1,4.2-2.4c8.1-5,16.3-8.6,24.6-10.7c6.2-1.6,6-1.3,4.1-9.6c-4.7-21.1-15.5-41.6-29.7-56.3C87.5,17.1,69.2,8.8,51.8,10.4z" /><path fill="#000000" d="M150.2,103.3c-12.1,1.3-25.9,6.5-37.1,14c-30.1,20-51,55.7-51,87.1c0,24.6,12.6,42.2,34,47.5c5.3,1.3,17.5,1.2,24-0.2c24.1-5.4,46.9-21.8,63.2-45.5c10.8-15.7,17.5-33.8,18.4-49.8c1-17.5-3-30.6-12.3-40.4c-7.1-7.5-15.4-11.5-26.4-12.8C157.9,102.6,155.7,102.6,150.2,103.3z M174.7,129c3.6,0.6,9.4,2.3,9.4,2.8c0,0.2-1.8,0.8-3.9,1.4c-11.8,3.3-19.8,8.7-25.5,17.3c-4.2,6.4-7.1,12.5-15.4,33c-6.1,14.9-8.5,20-12.6,26.3c-6,9-13.1,15.1-21,17.9c-3.6,1.3-4.9,1.5-9.1,1.5c-5,0-7.6-0.5-11.6-2.2l-2.3-1L86,225c12.9-4.1,23.5-17.2,29.9-36.7c10.3-31.7,23.5-50.5,39.9-56.9C162.4,128.8,168.5,128.1,174.7,129z" /></g></g></g>
                                                </svg></div></h3>
                                            {data.dataModalAnalisis ?

                                                data.dataModalAnalisis.map((key, index) => {
                                                    if (index == 0) {
                                                        return <div key={key.id}>
                                                            <div className="div-info-analisis">
                                                                <div>
                                                                    <h4>Id del análisis:</h4>
                                                                    <p>{key.id ? key.id : "No registra"}</p>
                                                                </div>
                                                                <div>
                                                                    <h4>Código de la muestra:</h4>
                                                                    <p>{key.mu_id ? key.mu_id : "No registra"}</p>
                                                                </div>
                                                                <div>
                                                                    <h4>Cantidad: </h4>
                                                                    <p>{key.cantidad ? key.cantidad : "No registra"}</p>
                                                                </div>
                                                                <div>
                                                                    <h4>Variedad:</h4>
                                                                    <p>{key.variedad ? key.variedad : "No registra"}</p>
                                                                </div>
                                                                <div>
                                                                    <h4>Calidad: </h4>
                                                                    <p>{key.calidad && key.calidad != 0 ? key.calidad : "No registra"}</p>
                                                                </div>
                                                                <div>
                                                                    <h4>Propietario: </h4>
                                                                    <p>{key.nombre_propietario ? key.nombre_propietario : "No registra"}</p>
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
                                                            <div className="div-info-analisis div-table-analisis">
                                                                <div>
                                                                    <h4>Id del Formato</h4>
                                                                    <p>{key.id ? key.id : "No registra"}</p>
                                                                </div>
                                                                <div>
                                                                    <h4>Fecha de registro</h4>
                                                                    <p>{formatDate(key.fecha_creacion ? key.fecha_creacion : 'No registra')}</p>
                                                                </div>
                                                                <div>
                                                                    <h4>Fecha de Análisis</h4>
                                                                    <p>{key.fecha_analisis ? key.fecha_analisis : "No registra"}</p>
                                                                </div>
                                                                <div>
                                                                    <h4>Fecha de actualización</h4>
                                                                    <p>{key.fecha_analisis ? key.fecha_analisis : "No registra"}</p>
                                                                </div>
                                                                <div>
                                                                    <h4>Tipo de análisis</h4>
                                                                    <p>{key.tipos_analisis_id ? key.tipos_analisis_id == 1 ? "Físico" : key.tipos_analisis_id == 2 ? "Sensorial" : "No disponible" : "No registra"}</p>
                                                                </div>
                                                                <div>
                                                                    <h4>Estado</h4>
                                                                    <p>{key.estado ? key.estado == 1 ? "Registrado" : key.estado == 2 ? "Pendiente" : key.estado == 3 ? "Asignado" : "No disponible" : "No registra"}</p>
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



                                                    {data.dataModalResultado.length > 0 ? data.dataModalResultado[0].estado != 4 && data.dataModalResultado[0].permission_formato == "true" ?
                                                        <div>
                                                            <button onClick={() => { setStatusInputDefault(true); setIdFormato(data.dataModalResultado[0].id); setModeFormato(data.dataModalResultado[0].tipos_analisis_id); setTipoRegistro(2); data.setModalFormNormal(true) }} type="button" className="button-submit-form">Actualizar</button>
                                                            <button onClick={() => { data.finalizarFormato ? data.finalizarFormato(data.dataModalResultado[0].id) : "" }} type="button" className="button-submit-form">Finalizar</button>
                                                        </div>

                                                        : "" : ""}

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

                                                    {data.dataModalResultado.length > 0 ? data.dataModalResultado[0].permission_formato == "true" ? data.dataModalResultado[0].estado != 4 ? <div>
                                                        <button onClick={() => { setStatusInput(true); setInputValor({}); setStatusInputDefault(false); setIdFormato(data.dataModalResultado[0].id), setModeFormato(data.dataModalResultado[0].tipos_analisis_id); setTipoRegistro(1), data.setModalFormNormal(true) }} type="button" className="button-submit-form">Analizar</button>
                                                    </div> : "" : "" : ""}
                                                </div>
                                            )

                                        }

                                    </div>
                                </div>

                            </form>
                        </div>

                    </div>

                    <div style={{ display: (!data.modalFormNormal) ? "none" : "" }} className="div-modal-form modal-form" >
                        <div onClick={() => { setIdFormato(null), setModeFormato(null); setTipoRegistro(null); data.setModalFormNormal(false) }} className="div-fondo-modal div-fondo-modal-form" >
                        </div>
                        <div id="contentModal" className="div-content-modal div-content-form">

                            <div className="header-form">
                                <h3 className="tittle-form-register">Registro de análisis  {data.tipoAnalisis == 1 ? "Físico" : "Sensorial"}</h3>
                                <div onClick={() => { setIdFormato(null), setModeFormato(null); setTipoRegistro(null); data.setModalFormNormal(false) }} className="icon-quit-svg-form">
                                    <svg version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                        <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                        <g><g><path d="M150.7,128l90.6-90.7c6.3-6.3,6.3-16.4,0-22.7c-6.3-6.3-16.4-6.3-22.7,0L128,105.3L37.4,14.7c-6.3-6.3-16.4-6.3-22.7,0s-6.3,16.4,0,22.7l90.6,90.6l-90.6,90.6c-6.3,6.3-6.3,16.4,0,22.7c3.1,3.1,7.2,4.7,11.3,4.7c4.1,0,8.2-1.6,11.3-4.7l90.7-90.6l90.6,90.7c3.1,3.1,7.2,4.7,11.3,4.7c4.1,0,8.2-1.6,11.3-4.7c6.3-6.3,6.3-16.4,0-22.7L150.7,128z" /></g></g>
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
                                                                                }} className="icon-chevron-estado">
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                                                                        <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                                                                        <g><g><path d="M240.4,70.6L229,59.2c-4-3.7-8.5-5.6-13.8-5.6c-5.3,0-9.9,1.9-13.6,5.6L128,132.8L54.4,59.2c-3.7-3.7-8.3-5.6-13.6-5.6c-5.2,0-9.8,1.9-13.8,5.6L15.8,70.6C11.9,74.4,10,79,10,84.4c0,5.4,1.9,10,5.8,13.6l98.6,98.6c3.6,3.8,8.2,5.8,13.6,5.8c5.3,0,9.9-1.9,13.8-5.8L240.4,98c3.7-3.7,5.6-8.3,5.6-13.6C246,79.1,244.1,74.5,240.4,70.6z" /></g></g>
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

                </div>
                    : ""
            }
        </>
    )
})