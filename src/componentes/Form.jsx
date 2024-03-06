import { object, string } from "prop-types";
import React, { forwardRef, useEffect, useState } from "react";



export const Form = forwardRef((data, ref) => {

    let elementEdit = [];
    let inputs = []
    let [dataInputs, setDataInputs] = useState({});
    const [selectsValues, changeSelectsValues] = useState({});
    const [dataSelect, setDataSelects] = useState({});
    const [inputValor, setInputValor] = useState({});
    const [keyDown, setKeydown] = useState();
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
                            alert("xd")
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



    if (data.data) {
        inputs = Object.keys(data.data)
        dataInputs = data.data

        elementEdit = data.elementEdit
    }
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
    }
    function selectSearch(value, key) {
        let cloneDataSelect = { ...dataSelect }
        let selectOptions = document.querySelectorAll(".select-option-" + key)
        let cloneSlectValue = { ...selectsValues }
        cloneSlectValue[key] = value
        data.setStatusSelectDefault(false)
        data.setStatusSelect(false)


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
    useEffect(() => {
        Init()
    }, [])

    useEffect(() => {

        let modalForm = document.getElementById("modalForm");
        let divContentForm = document.getElementById("divContentForm");
        let divFondomodalForm = document.getElementById("divFondomodalForm");
        let labelErrorSubmitForm = document.querySelectorAll(".label-error-submit-form");

        setTimeout(() => {
            resizeForm()
        }, 100);
        document.addEventListener('keydown', function (event) {
            setKeydown(event.key)
        })
        function resizeForm() {
            if (modalForm) {
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
                    divFondomodalForm.style.height = divContentForm.clientHeight + 40 + "px"
                    divFondomodalForm.style.width = modalForm.clientWidth + "px"
                } else {

                    for (let x = 0; x < labelErrorSubmitForm.length; x++) {
                        labelErrorSubmitForm[x].style.height = ""
                    }
                    divFondomodalForm.style.height = "100vh"
                    divFondomodalForm.style.width = "100vw"
                    modalForm.style.alignItems = "center"
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

        }
        resizeForm()
        window.addEventListener("resize", function () {
            resizeForm()
        })

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
    return (
        <>
            <link rel="stylesheet" href="/public/css/form.css" />

            <div style={{ display: (!data.modalForm && !data.updateStatus) ? "none" : "" }} className="modal-form" id="modalForm">
                <div onClick={() => { data.changeModalForm(false); data.editarStatus(false) }} className="div-fondo-modal-form" id="divFondomodalForm">
                </div>
                <div id="divContentForm" className="div-content-form">
                    <form onSubmit={chageData} action="" >
                        <div className="header-form">
                            <h3 className="tittle-form-register">{!data.updateStatus ? "Registrar " + data.tittle + "" : "Actualizar " + data.tittle + ""} </h3>
                            <div onClick={() => { data.changeModalForm(false); data.editarStatus(false) }} className="icon-quit-svg-form">
                                <svg version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                    <g><g><path  d="M150.7,128l90.6-90.7c6.3-6.3,6.3-16.4,0-22.7c-6.3-6.3-16.4-6.3-22.7,0L128,105.3L37.4,14.7c-6.3-6.3-16.4-6.3-22.7,0s-6.3,16.4,0,22.7l90.6,90.6l-90.6,90.6c-6.3,6.3-6.3,16.4,0,22.7c3.1,3.1,7.2,4.7,11.3,4.7c4.1,0,8.2-1.6,11.3-4.7l90.7-90.6l90.6,90.7c3.1,3.1,7.2,4.7,11.3,4.7c4.1,0,8.2-1.6,11.3-4.7c6.3-6.3,6.3-16.4,0-22.7L150.7,128z" /></g></g>
                                </svg>
                            </div>
                        </div>
                        <div className="div-body-form">
                            <div className="div-img-form">
                                <img className="img-form" src={data.imgForm ? data.imgForm : "/img/formularios/default-img-form.png"} alt="" />
                            </div>

                            <div id="divForm" className="div-form">


                                <div style={{ display: Object.keys(inputs).length == 1 ? "unset" : "" }} className="form-register">
                                    {
                                        inputs.map((key, index) => {
                                            if (dataInputs[key]["type"] === "text" || dataInputs[key]["type"] === "email" || dataInputs[key]["type"] === "number" || dataInputs[key]["type"] === "ubicacion" || dataInputs[key]["type"] === "normal") {
                                                if (data.statusInputDefault && elementEdit) {


                                                    inputValor[key] = elementEdit[key] ? dataInputs[key]["upper_case"] ? typeof elementEdit[key] === "string" ? elementEdit[key].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : elementEdit[key] ?? '' : dataInputs[key]["capital_letter"] ? typeof elementEdit[key] === "string" ? elementEdit[key].toString().replace(/^[a-z]/, match => match.toUpperCase()) : elementEdit[key] ?? '' : elementEdit[key] ?? "" : ""
                                                } else if (data.statusInput) {
                                                    inputValor[key] = ""

                                                }
                                                return (

                                                    <div key={key} className={`${dataInputs[key]["type"] === "email" ? "input-email " : ""}input-content-form-register`}>
                                                        <div className="head-input">
                                                            <label htmlFor={key} className="label-from-register" >{dataInputs[key]["referencia"] ? dataInputs[key]["referencia"] : "Campo"}</label>
                                                            <input id={key} name={key} autoComplete="false" onChange={(e) => { handleInputChange(e, key, dataInputs[key]["type"]); data.setStatusInputDefault(false); data.setStatusInput(false) }} value={data.statusInputDefault && elementEdit ? dataInputs[key]["upper_case"] ? typeof elementEdit[key] === "string" ? elementEdit[key].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : elementEdit[key] ?? '' : dataInputs[key]["capital_letter"] ? typeof elementEdit[key] === "string" ? elementEdit[key].toString().replace(/^[a-z]/, match => match.toUpperCase()) : elementEdit[key] ?? '' : elementEdit[key] ?? "" : inputValor[key]} className="input-form" type="text" />
                                                        </div>
                                                        <h4 className="label-error-submit-form">{data.errors ? data.errors[key] ? data.errors[key] : "" : ""}</h4>
                                                    </div>
                                                );

                                            } else if (dataInputs[key]["type"] === "select" && dataInputs[key]["visibility"] != false) {

                                                if (data.statusSelect) {
                                                    selectsValues[key] = "";
                                                    dataSelect[key] = ""
                                                }

                                                return (
                                                    <div key={key} className="input-content-form-register">
                                                        <div className="head-input">
                                                            <label htmlFor={key} className="label-from-register">{dataInputs[key]["referencia"] ? dataInputs[key]["referencia"] : "Campo"}</label>
                                                            <div key={key} className="filter-estado div-select">

                                                                <div key={index} style={{ display: "none" }} className="opciones opciones-input-select">

                                                                    <h4 onClick={(e) => {
                                                                        const parentElement = e.target.closest(".div-select");
                                                                        const divOptions = parentElement.querySelectorAll(".opciones-input-select")
                                                                        divOptions[0] ? divOptions[0].style.display = "none" : ""

                                                                        data.setStatusSelect(false); data.setStatusSelectDefault(false); let cloneSelectsValues = { ...selectsValues }; cloneSelectsValues[key] = ""; changeSelectsValues(cloneSelectsValues); dataSelect[key] = "";
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
                                                                            if (elementEdit) {
                                                                                if (!data.modalForm && dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]] == elementEdit[key] && data.statusSelectDefault) {
                                                                                    selectsValues[key] = value;
                                                                                    dataSelect[key] = dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]]
                                                                                }
                                                                            }


                                                                            return <h4 key={indexSelect} onClick={(e) => {
                                                                                const parentElement = e.target.parentElement.parentElement;
                                                                                const divOptions = parentElement.querySelectorAll(".opciones-input-select")
                                                                                divOptions[0] ? divOptions[0].style.display = "none" : ""; let cloneSelectsValues = { ...selectsValues }; cloneSelectsValues[key] = value; changeSelectsValues(cloneSelectsValues); data.setStatusSelect(false); data.setStatusSelectDefault(false); dataSelect[key] = dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]];
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
                                                                            <g><g><path d="M240.4,70.6L229,59.2c-4-3.7-8.5-5.6-13.8-5.6c-5.3,0-9.9,1.9-13.6,5.6L128,132.8L54.4,59.2c-3.7-3.7-8.3-5.6-13.6-5.6c-5.2,0-9.8,1.9-13.8,5.6L15.8,70.6C11.9,74.4,10,79,10,84.4c0,5.4,1.9,10,5.8,13.6l98.6,98.6c3.6,3.8,8.2,5.8,13.6,5.8c5.3,0,9.9-1.9,13.8-5.8L240.4,98c3.7-3.7,5.6-8.3,5.6-13.6C246,79.1,244.1,74.5,240.4,70.6z" /></g></g>
                                                                        </svg>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <h4 className="label-error-submit-form" htmlFor="">{data.errors ? data.errors[key] ? data.errors[key] : "" : ""}</h4>

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


                            </div>

                        </div>
                        <div className="div-div-input-submit-form">
                            <button onClick={() => { clearElementsClick() }} type="submit" className="button-submit-form"> {!data.updateStatus ? "Registrar" : "Actualizar"}</button>
                        </div>
                    </form>
                </div>

            </div>

        </>
    )
})