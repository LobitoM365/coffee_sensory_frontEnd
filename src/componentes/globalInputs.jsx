import { object, string } from "prop-types";
import React, { forwardRef, useEffect, useRef, useState } from "react";



export const GlobalInputs = forwardRef((data, ref) => {

    let elementEdit = [];
    let inputs = []
    let [dataInputs, setDataInputs] = useState({});
    const [selectsValues, changeSelectsValues] = useState({});
    const [statusInputDefault, setStatusInputDefault] = useState({});
    const [statusSelect, setStatusSelect] = useState({});
    const [dataSelect, setDataSelects] = useState({});
    const [inputValor, setInputValor] = useState();

    const [keyDown, setKeydown] = useState();
    const inputRef = useRef(null);

    const inputChange = (e, key, type) => {
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
        setInputValor(e.target.value)
        data.input(e.target.value)
    };


    if (data.data) {
        inputs = Object.keys(data.data)
        inputs = [inputs[0]]
        dataInputs = data.data
        elementEdit = data.elementEdit
    }
    function Init() {
        if (data.input) {
            inputs.map((key, value) => {
                if (dataInputs[key]["type"] == "select") {
                    data.input("Seleccione una opción...")
                }
            })
        }
    }
    function clearOptionsSelect(key) {
        if (inputRef.current != null) {


            let selectOptions = inputRef.current.querySelectorAll(".select-option-" + key)
            for (let s = 0; s < selectOptions.length; s++) {
                selectOptions[s].style.display = "";
            }
        }
    }
    function selectSearch(value, key, functionExecute, execute) {

        let coincidencia = false;
        let cloneDataSelect = { ...dataSelect }
        let selectOptions = inputRef.current.querySelectorAll(".select-option-" + key)
        let cloneSlectValue = { ...selectsValues }
        let parent = "";
        data.input(value)
        setStatusInputDefault(false)
        setStatusSelect(false)
        for (let s = 0; s < selectOptions.length; s++) {
            if (selectOptions[s].innerHTML.toLocaleLowerCase().includes(value.toLocaleLowerCase())) {
                selectOptions[s].style.display = ""
            } else {
                selectOptions[s].style.display = "none"
            }

            if (selectOptions[s].innerHTML.toLocaleLowerCase() == value.toLocaleLowerCase()) {
                setInputValor(selectOptions[s].innerHTML)
                data.input(dataInputs[key]["opciones"][s][dataInputs[key]["key"]])
                coincidencia = true
                parent = selectOptions[s].parentNode;
                if (functionExecute) {
                    if (execute) {
                        if (execute == "key") {
                            functionExecute(dataInputs[key]["opciones"][s][dataInputs[key]["key"]])
                        }
                    }
                }
                break
            } else {
                setInputValor(value)
                data.input("")
            }

        }
        changeSelectsValues(cloneSlectValue)
        setDataSelects(cloneDataSelect)
        if (coincidencia) {
            parent.style.display = "none";
            clearOptionsSelect(key);
        }
    }

    useEffect(() => {
        Init()
    }, [])




    return (
        <>
            <link rel="stylesheet" href="/public/css/form.css" />

            <div ref={inputRef} style={{ display: Object.keys(inputs).length == 1 ? "unset" : "" }} className={(data.class ? data.class : "") + " form-register"}>
                {
                    inputs.map((key, index) => {
                        if (data.userInfo && dataInputs[key]["rol"]) {
                            if (data.userInfo != undefined) {
                                if (!dataInputs[key]["rol"].includes(data.userInfo.rol)) {
                                    return
                                }
                            }
                        }

                        if (dataInputs[key]["type"] === "text" || dataInputs[key]["type"] === "email" || dataInputs[key]["type"] === "number" || dataInputs[key]["type"] === "ubicacion" || dataInputs[key]["type"] === "normal") {
                            if (statusInputDefault && elementEdit) {
                                setInputValor(elementEdit[key] ? dataInputs[key]["upper_case"] ? typeof elementEdit[key] === "string" ? elementEdit[key].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : elementEdit[key] ?? '' : dataInputs[key]["capital_letter"] ? typeof elementEdit[key] === "string" ? elementEdit[key].toString().replace(/^[a-z]/, match => match.toUpperCase()) : elementEdit[key] ?? '' : elementEdit[key] ?? "" : "")
                            } else if (data.statusInput) {
                                setInputValor("")

                            }
                            return (
                                <div key={key} className={`${dataInputs[key]["type"] === "email" ? "input-email " : ""}input-content-form-register`}>
                                    <div className="head-input">
                                        <label htmlFor={key} className="label-from-register" >{dataInputs[key]["referencia"] ? dataInputs[key]["referencia"] : "Campo"}</label>
                                        <input id={key} name={key} autoComplete="false" onChange={(e) => { inputChange(e, key, dataInputs[key]["type"]); setStatusInputDefault(false);/*  data.setStatusInput(false) */ }} value={statusInputDefault && elementEdit ? dataInputs[key]["upper_case"] ? typeof elementEdit[key] === "string" ? elementEdit[key].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : elementEdit[key] ?? '' : dataInputs[key]["capital_letter"] ? typeof elementEdit[key] === "string" ? elementEdit[key].toString().replace(/^[a-z]/, match => match.toUpperCase()) : elementEdit[key] ?? '' : elementEdit[key] ?? "" : inputValor} className="input-form" type="text" />
                                    </div>
                                    <h4 className="label-error-submit-form">{data.errors ? data.errors[key] ? data.errors[key] : "" : ""}</h4>
                                </div>
                            );
                        } else if (dataInputs[key]["type"] === "select" && dataInputs[key]["visibility"] != false) {
                            let functionExecute = "";
                            let execute = "";
                            if (dataInputs[key]["function"]) {
                                if (dataInputs[key]["function"]["value"]) {
                                    functionExecute = dataInputs[key]["function"]["value"];
                                }
                                if (dataInputs[key]["function"]["execute"]) {
                                    if (dataInputs[key]["function"]["execute"]["type"]) {
                                        let type = dataInputs[key]["function"]["execute"]["type"];
                                        if (dataInputs[key]["function"]["execute"]["value"]) {
                                            let value = dataInputs[key]["function"]["execute"]["value"];
                                            if (type == "own") {
                                                if (value == "key") {
                                                    execute = "key";
                                                }
                                            }
                                        }

                                    }
                                }
                            }
                            if (data.statusSelect) {
                                selectsValues[key] = "";
                                data.input("")
                            }
                            return (
                                <div key={key} className="input-content-form-register">
                                    <div className="head-input">
                                        <label htmlFor={key} className="label-from-register">{dataInputs[key]["referencia"] ? dataInputs[key]["referencia"] : "Campo"}</label>
                                        <div>
                                        <div key={key} className="filter-estado div-select">
                                            <div key={index} style={{ display: "none" }} className="opciones opciones-input-select">
                                                <h4 onClick={(e) => {
                                                    const parentElement = e.target.closest(".div-select");
                                                    const divOptions = parentElement.querySelectorAll(".opciones-input-select")
                                                    divOptions[0] ? divOptions[0].style.display = "none" : ""

                                                    setStatusSelect(false); setStatusInputDefault(false); let cloneSelectsValues = { ...selectsValues }; setInputValor(""); changeSelectsValues(cloneSelectsValues); data.input("");
                                                    clearOptionsSelect(key);
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
                                                            if (!data.modalForm && dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]] == elementEdit[key] && statusInputDefault) {
                                                                selectsValues[key] = value;
                                                                data.input(dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]])
                                                            }
                                                        }


                                                        return <h4 key={indexSelect} onClick={(e) => {
                                                            clearOptionsSelect(key);
                                                            if (typeof functionExecute == "function") {
                                                                functionExecute(execute == "key" ? dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]] : "");
                                                            }

                                                            const parentElement = e.target.parentElement.parentElement;
                                                            const divOptions = parentElement.querySelectorAll(".opciones-input-select")
                                                            divOptions[0] ? divOptions[0].style.display = "none" : ""; let cloneSelectsValues = { ...selectsValues }; setInputValor(value); changeSelectsValues(cloneSelectsValues); setStatusSelect(false); setStatusInputDefault(false); console.log(data, dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]], "valaaaaaaaa");
                                                            data.input(dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]]);
                                                            console.log(inputValor, value)
                                                        }} className={`select-option select-option-${key} ${data.value == dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]] ? 'option-focus' : ''}`} value="">
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
                                                    selectSearch(e.target.value, key, functionExecute, execute == "key" ? "key" : "");
                                                }} placeholder={"Seleccione una opción..."} value={inputValor != "Seleccione una opción..." ? inputValor : ""} />
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
                                        <h4 className="label-error-submit-form" htmlFor="">{data.errors ? data.errors[key] ? data.errors[key] : "" : ""}</h4>
                                        </div>
                                    </div>
                                    
                                </div>
                            );
                        } else if (dataInputs[key]["type"] === "date" && dataInputs[key]["visibility"] != false) {
                            return (

                                <div key={key} className={`${dataInputs[key]["type"] === "email" ? "input-email " : ""}input-content-form-register`}>
                                    <div className="head-input">
                                        <label htmlFor={key} className="label-from-register" >{dataInputs[key]["referencia"] ? dataInputs[key]["referencia"] : "Campo"}</label>
                                        <input id={key} name={key} className='input-date' type="datetime-local" />
                                    </div>

                                </div>
                            );
                        } else {
                            if (index == inputs.length) {
                                return "No hay nada para mostrar " + key;
                            }
                        }
                    })
                }
            </div >
        </>
    )
})