import { object, string } from "prop-types";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import "../../public/css/globalInputs.css"
import { type } from "jquery";


export const GlobalInputs = forwardRef((data, ref) => {
    let elementEdit = "";
    let inputs = []
    let [dataInputs, setDataInputs] = useState({});
    const [selectsValues, changeSelectsValues] = useState({});
    const [statusInputDefault, setStatusInputDefault] = useState(data.elementEdit ? true : false);
    const [statusSelect, setStatusSelect] = useState({});
    const [dataSelect, setDataSelects] = useState({});
    let [inputValor, setInputValor] = useState();

    const [keyDown, setKeydown] = useState();
    const inputRef = useRef(null);

    function colorToRgba(color, alpha) {
        alpha = alpha / 100
        if (/^#[0-9A-F]{6}$/i.test(color)) {
            var r = parseInt(color.substring(1, 3), 16);
            var g = parseInt(color.substring(3, 5), 16);
            var b = parseInt(color.substring(5, 7), 16);
            return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
        } else if (/^rgb\((\s*\d+\s*,){2}\s*\d+\s*\)$/i.test(color)) {
            return color.replace("rgb", "rgba").replace(")", ", " + alpha + ")");
        } else if (/^rgba\((\s*\d+\s*,){3}\s*[\d.]+\s*\)$/i.test(color)) {
            return color;
        } else if (/^hsl\(\s*\d+(\.\d+)?\s*,\s*\d+(\.\d+)?%\s*,\s*\d+(\.\d+)?%\s*\)$/i.test(color)) {

            var hsl = color.match(/(\d+(\.\d+)?)/g);
            var h = parseFloat(hsl[0]) / 360;
            var s = parseFloat(hsl[1]) / 100;
            var l = parseFloat(hsl[2]) / 100;
            var r, g, b;

            if (s === 0) {
                r = g = b = l;
            } else {
                var hueToRgb = function hueToRgb(p, q, t) {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                };
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hueToRgb(p, q, h + 1 / 3);
                g = hueToRgb(p, q, h);
                b = hueToRgb(p, q, h - 1 / 3);
            }

            return "rgba(" + Math.round(r * 255) + ", " + Math.round(g * 255) + ", " + Math.round(b * 255) + ", " + alpha + ")";
        } else if (/^hsla\(\s*\d+(\.\d+)?\s*,\s*\d+(\.\d+)?%\s*,\s*\d+(\.\d+)?%\s*,\s*[\d.]+\s*\)$/i.test(color)) {
            return color;
        } else {
            throw new Error("Formato de color no reconocido: " + color);
        }
    }
    const inputChange = (e, key, type) => {
        setStatusInputDefault(false)

        if (type === "color") {
            const nodoOpacityKey = document.getElementById(key + "_opacity")
            if (nodoOpacityKey) {
                if (typeof data.value == "object") {
                    let cloneDataInput = { ...data.value }
                    cloneDataInput[key + "_rgba"] = colorToRgba(e.target.value, nodoOpacityKey.value)
                    data.input(cloneDataInput)
                    data.value[key + "_rgba"] = colorToRgba(e.target.value, nodoOpacityKey.value)
                }
            }
        } else if (type === "color_opacity") {
            if (e.target.value < 0) {
                e.target.value = 0
            } else if (e.target.value > 100) {
                e.target.value = 100
            }
            const faterKey = key.replace("_opacity", "")
            const nodoFaterKey = document.getElementById(faterKey)
            if (nodoFaterKey) {
                nodoFaterKey.style.opacity = e.target.value / 100
                if (typeof data.value == "object") {
                    let cloneDataInput = { ...data.value }
                    cloneDataInput[faterKey + "_rgba"] = colorToRgba(nodoFaterKey.value, e.target.value)
                    data.input(cloneDataInput)
                    data.value[faterKey + "_rgba"] = colorToRgba(nodoFaterKey.value, e.target.value)
                }
            }
        } else if (type === "text") {
            e.target.value = e.target.value.replace("  ", " ").replace(/[@!#$%^¨¨.&*()-+=[{}|;:'",_<>/?`~¡¿´´°ç-]/, "").replace(/\d+/g, "").replace("]", "").replace("[", "").trimStart()
        } else if (type === "number") {
            e.target.value = e.target.value.replace(/[^\d-]/g, "").replace(/[^\w°'".-]/g, "").replace(/--+/g, '-').replace(/\.\.+/g, '.').trim();
            if (e.target.value.indexOf('-', 1) !== -1) {
                let primerValor = e.target.value.charAt(0);
                let restoCadena = e.target.value.substring(1);
                restoCadena = restoCadena.replace("-", "")
                e.target.value = primerValor + restoCadena
            }
            if (dataInputs[key]["min"] != undefined) {
                if (!isNaN(dataInputs[key]["min"])) {
                    if (e.target.value < dataInputs[key]["min"]) {
                        e.target.value = dataInputs[key]["min"]
                    }
                }
            }
            if (dataInputs[key]["max"] != undefined) {
                if (!isNaN(dataInputs[key]["max"])) {
                    if (e.target.value > dataInputs[key]["max"]) {
                        e.target.value = dataInputs[key]["max"]
                    }
                }
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
        setInputValor(e.target.value)
        if (typeof data.value == "object") {
            let cloneDataInput = { ...data.value }
            cloneDataInput[key] = e.target.value
            data.input(cloneDataInput)
        } else {
            data.input(e.target.value)
        }

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
                    // data.input("Seleccione una opción...")
                    if (typeof data.value == "object") {
                        let cloneDataInput = { ...data.value }
                        cloneDataInput[key] = ""
                        data.input(cloneDataInput)
                    } else {
                        data.input("")
                    }
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
        if (typeof data.value == "object") {
            let cloneDataInput = { ...data.value }
            cloneDataInput[key] = value
            data.input(cloneDataInput)
        } else {
            data.input(value)
        }
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
                if (typeof data.value == "object") {
                    let cloneDataInput = { ...data.value }
                    cloneDataInput[key] = dataInputs[key]["opciones"][s][dataInputs[key]["key"]]
                    data.input(cloneDataInput)
                } else {
                    data.input(dataInputs[key]["opciones"][s][dataInputs[key]["key"]])
                }
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
                if (typeof data.value == "object") {
                    let cloneDataInput = { ...data.value }
                    cloneDataInput[key] = ""
                    data.input(cloneDataInput)
                } else {
                    data.input("")
                }
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
        <div id="mainGlobalInput">
            <div ref={inputRef} /* style={{ display: Object.keys(inputs).length == 1 ? "unset" : "" }} */ className={(data.class ? data.class : "") + " form-register"}>
                {
                    inputs.map((key, index) => {
                        if (data.userInfo && dataInputs[key]["rol"]) {
                            if (data.userInfo != undefined) {
                                if (!dataInputs[key]["rol"].includes(data.userInfo.rol)) {
                                    return
                                }
                            }
                        }
                        if (dataInputs[key]["type"] === "color" || dataInputs[key]["type"] === "area" || dataInputs[key]["type"] === "date" || dataInputs[key]["type"] === "text" || dataInputs[key]["type"] === "email" || dataInputs[key]["type"] === "number" || dataInputs[key]["type"] === "ubicacion" || dataInputs[key]["type"] === "normal") {
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
                                                } else if (value == "all") {
                                                    execute = "all"
                                                }
                                            }
                                        }

                                    } else {
                                        execute = dataInputs[key]["function"]["execute"]["value"];
                                    }
                                }
                            }

                            let value = ""
                            let edit = true;
                            if (data.edit != undefined) {
                                edit = data.edit
                            }

                            if (typeof elementEdit == "object" && statusInputDefault) {
                                if (typeof data.value == "object") {
                                    value = elementEdit[key] ? dataInputs[key]["upper_case"] ? typeof elementEdit[key] === "string" ? elementEdit[key].toString().replace(/\b\w{4,}\b/g, function (match) {
                                        return match.charAt(0).toUpperCase() + match.slice(1);
                                    }) : elementEdit[key] ?? '' : dataInputs[key]["capital_letter"] ? typeof elementEdit[key] === "string" ? elementEdit[key].toString().replace(/^[a-z]/, match => match.toUpperCase()) : elementEdit[key] ?? '' : elementEdit[key] ?? "" : ""
                                    data.value[key] = elementEdit[key] ? dataInputs[key]["upper_case"] ? typeof elementEdit[key] === "string" ? elementEdit[key].toString().replace(/\b\w{4,}\b/g, function (match) {
                                        return match.charAt(0).toUpperCase() + match.slice(1);
                                    }) : elementEdit[key] ?? '' : dataInputs[key]["capital_letter"] ? typeof elementEdit[key] === "string" ? elementEdit[key].toString().replace(/^[a-z]/, match => match.toUpperCase()) : elementEdit[key] ?? '' : elementEdit[key] ?? "" : ""
                                    if (dataInputs[key]["type"] == "color") {
                                        if (dataInputs[key]["opacity"]) {
                                            data.value[key + "_opacity"] = 100
                                            data.value[key + "_rgba"] = colorToRgba(data.value[key], data.value[key + "_opacity"])
                                        }
                                    }
                                } else {
                                    value = elementEdit ? dataInputs[key]["upper_case"] ? typeof elementEdit === "string" ? elementEdit.toString().replace(/\b\w{4,}\b/g, function (match) {
                                        return match.charAt(0).toUpperCase() + match.slice(1);
                                    }) : elementEdit ?? '' : dataInputs[key]["capital_letter"] ? typeof elementEdit === "string" ? elementEdit.toString().replace(/^[a-z]/, match => match.toUpperCase()) : elementEdit ?? '' : elementEdit ?? "" : ""
                                    data.value = elementEdit ? dataInputs[key]["upper_case"] ? typeof elementEdit === "string" ? elementEdit.toString().replace(/\b\w{4,}\b/g, function (match) {
                                        return match.charAt(0).toUpperCase() + match.slice(1);
                                    }) : elementEdit ?? '' : dataInputs[key]["capital_letter"] ? typeof elementEdit === "string" ? elementEdit.toString().replace(/^[a-z]/, match => match.toUpperCase()) : elementEdit ?? '' : elementEdit ?? "" : ""
                                }
                                setStatusInputDefault(false)
                            }

                            return (
                                <div key={key} className={`${dataInputs[key]["type"] === "email" ? "input-email " : ""}input-content-form-register`}>
                                    <div className="head-input">
                                        <label htmlFor={key} className="label-from-register" >{dataInputs[key]["referencia"] ? dataInputs[key]["referencia"] : dataInputs[key]["referencia"] === false ? "" : ""}</label>
                                        {edit == false ?

                                            dataInputs[key]["type"] === "area" ?
                                                ""
                                                :
                                                < button type="button" id={key} name={key} className="input-form" > {value != "" ? value : data.value[key]}</button>
                                            :

                                            dataInputs[key]["type"] === "area" ?
                                                <textarea id={key} name={key} autoComplete="false" onInput={(e) => {
                                                    if (typeof functionExecute == "function") {
                                                        functionExecute(execute == "key" ? dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]] : execute == "all" ? dataInputs[key]["opciones"][indexSelect] : "", dataInputs[key]["index"] ? indexSelect : "");
                                                    }
                                                    inputChange(e, key, dataInputs[key]["type"]); setStatusInputDefault(false);/*  data.setStatusInput(false) */
                                                }}

                                                    value={value != "" ? value : data.value[key]} className="input-form text-area-form" type="text" />
                                                : dataInputs[key]["type"] === "date" ?
                                                    <input placeholder={dataInputs[key]["placeholder"] ? dataInputs[key]["placeholder"] : ""} id={key} name={key} autoComplete="false" onInput={(e) => {
                                                        if (typeof functionExecute == "function") {
                                                            functionExecute(execute == "key" ? dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]] : execute == "all" ? dataInputs[key]["opciones"][indexSelect] : "", dataInputs[key]["index"] ? indexSelect : "");
                                                        }
                                                        inputChange(e, key, dataInputs[key]["type"]); setStatusInputDefault(false);/*  data.setStatusInput(false) */
                                                    }}

                                                        value={value != "" ? value : data.value[key]} className="input-date" type="datetime-local" />
                                                    :
                                                    dataInputs[key]["type"] === "color" ?
                                                        <div className="div-input-color">
                                                            <div className="content-input-color">
                                                                <input placeholder={dataInputs[key]["placeholder"] ? dataInputs[key]["placeholder"] : ""} id={key} name={key} autoComplete="false" onInput={(e) => {
                                                                    if (typeof functionExecute == "function") {
                                                                        functionExecute(execute == "key" ? dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]] : execute == "all" ? dataInputs[key]["opciones"][indexSelect] : "", dataInputs[key]["index"] ? indexSelect : "");
                                                                    }
                                                                    inputChange(e, key, dataInputs[key]["type"]); setStatusInputDefault(false);/*  data.setStatusInput(false) */
                                                                }}
                                                                    value={value != "" ? value : data.value[key]} className="input-color" type="color" />
                                                            </div>

                                                            {dataInputs[key]["opacity"] ?
                                                                <div>
                                                                    <input onInput={(e) => {
                                                                        setStatusInputDefault(false);
                                                                        inputChange(e, key + "_opacity", "color_opacity")
                                                                    }} type="range" min={0} max={100} step={0.1} value={data.value[key + "_opacity"]} id={key + "_opacity"} name={key + "_opacity"} className="range-input-color" />
                                                                </div>
                                                                : ""}
                                                        </div>
                                                        :
                                                        <input placeholder={dataInputs[key]["placeholder"] ? dataInputs[key]["placeholder"] : ""} id={key} name={key} autoComplete="false" onInput={(e) => {
                                                            if (typeof functionExecute == "function") {
                                                                functionExecute(execute == "key" ? dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]] : execute == "all" ? dataInputs[key]["opciones"][indexSelect] : "", dataInputs[key]["index"] ? indexSelect : "");
                                                            }
                                                            inputChange(e, key, dataInputs[key]["type"]); setStatusInputDefault(false);/*  data.setStatusInput(false) */
                                                        }}

                                                            value={value != "" ? value : data.value[key]} className="input-form" type="text" />}

                                    </div>

                                    {data.errors ? data.errors[key] ? <h4 className="label-error-submit-form" htmlFor="">{data.errors[key]}</h4> : "" : ""}

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
                                                } else if (value == "all") {
                                                    execute = "all"
                                                }
                                            }
                                        }

                                    }
                                } else {
                                    execute = dataInputs[key]["function"]["execute"]["value"];
                                }
                            }
                            if (data.statusSelect) {
                                selectsValues[key] = "";

                                if (typeof data.value == "object") {
                                    let cloneDataInput = { ...data.value }
                                    cloneDataInput[key] = ""
                                    data.input(cloneDataInput)
                                } else {
                                    data.input("")
                                }
                            }
                            return (
                                <div key={key} className="input-content-form-register">
                                    <div className="head-input">
                                        {dataInputs[key]["referencia"] ? <label htmlFor={key} className="label-from-register">{dataInputs[key]["referencia"] ? dataInputs[key]["referencia"] : dataInputs[key]["referencia"] === false ? "" : ""}</label> : ""}
                                        <div>
                                            <div key={key} className="filter-estado div-select">
                                                <div key={index} style={{ display: "none" }} className="opciones opciones-input-select">
                                                    <h4 onClick={(e) => {

                                                        const parentElement = e.target.closest(".div-select");
                                                        const divOptions = parentElement.querySelectorAll(".opciones-input-select")
                                                        divOptions[0] ? divOptions[0].style.display = "none" : ""

                                                        setStatusSelect(false); setStatusInputDefault(false); let cloneSelectsValues = { ...selectsValues }; setInputValor(""); changeSelectsValues(cloneSelectsValues);
                                                        if (typeof data.value == "object") {
                                                            let cloneDataInput = { ...data.value }
                                                            cloneDataInput[key] = ""
                                                            data.input(cloneDataInput)
                                                        } else {
                                                            data.input("")
                                                        }
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
                                                                value = value.toString().replace(/\b\w{4,}\b/g, function (match) {
                                                                    return match.charAt(0).toUpperCase() + match.slice(1);
                                                                })
                                                            } else if (dataInputs[key]["capital_letter"]) {
                                                                value = value.toString().replace(/^[a-z]/, match => match.toUpperCase())
                                                            }
                                                            if (elementEdit) {
                                                                let editValue = "";
                                                                if (typeof elementEdit == "object") {
                                                                    editValue = elementEdit[key]
                                                                } else {
                                                                    editValue = elementEdit
                                                                }
                                                                if (dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]] == editValue && statusInputDefault) {
                                                                    inputValor = value
                                                                    if (typeof data.value == "object") {
                                                                        data.value[key] = dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]]
                                                                    } else {
                                                                        data.value = dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]]
                                                                    }
                                                                }
                                                            }
                                                            return <h4 key={indexSelect} onClick={(e) => {
                                                                clearOptionsSelect(key);
                                                                if (typeof functionExecute == "function") {
                                                                    functionExecute(execute == "key" ? dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]] : execute == "all" ? dataInputs[key]["opciones"][indexSelect] : "", dataInputs[key]["index"] ? indexSelect : "");
                                                                }

                                                                const parentElement = e.target.parentElement.parentElement;
                                                                const divOptions = parentElement.querySelectorAll(".opciones-input-select")
                                                                divOptions[0] ? divOptions[0].style.display = "none" : ""; let cloneSelectsValues = { ...selectsValues }; setInputValor(value); changeSelectsValues(cloneSelectsValues); setStatusSelect(false); setStatusInputDefault(false);
                                                                if (typeof data.value == "object") {
                                                                    let cloneDataInput = { ...data.value }
                                                                    cloneDataInput[key] = dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]]
                                                                    data.input(cloneDataInput)
                                                                } else {
                                                                    data.input(dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]])
                                                                }
                                                            }} className={`select-option select-option-${key} ${typeof data.value == "object" ? data.value[key] == dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]] ? 'option-focus' : "" : data.value == dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]] ? 'option-focus' : ""}`} value="">
                                                                {value}
                                                            </h4>
                                                        }) : ""
                                                    }
                                                </div>
                                                <div className='input-select-estado input-select-search' name="" id="" onClick={(e) => {
                                                    const parentElement = e.target.closest(".div-select");
                                                    const divOptions = parentElement.querySelectorAll(".opciones-input-select")
                                                    divOptions[0] ? divOptions[0].style.display == "block" ? divOptions[0].style.display = "none" : divOptions[0].style.display = "block" : ""
                                                }}>

                                                    <input id={key} type="text" className="input-select" onInput={(e) => {
                                                        const parentElement = e.target.closest(".div-select");
                                                        const divOptions = parentElement.querySelectorAll(".opciones-input-select")
                                                        divOptions[0] ? divOptions[0].style.display = "block" : ""
                                                        selectSearch(e.target.value, key, functionExecute, execute == "key" ? "key" : "");
                                                    }} placeholder={"Seleccione una opción..."} value={inputValor != "Seleccione una opción..." ? inputValor : ""} />
                                                    <div className="icon-chevron-estado">
                                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                                            <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                                            <g><g><path d="M240.4,70.6L229,59.2c-4-3.7-8.5-5.6-13.8-5.6c-5.3,0-9.9,1.9-13.6,5.6L128,132.8L54.4,59.2c-3.7-3.7-8.3-5.6-13.6-5.6c-5.2,0-9.8,1.9-13.8,5.6L15.8,70.6C11.9,74.4,10,79,10,84.4c0,5.4,1.9,10,5.8,13.6l98.6,98.6c3.6,3.8,8.2,5.8,13.6,5.8c5.3,0,9.9-1.9,13.8-5.8L240.4,98c3.7-3.7,5.6-8.3,5.6-13.6C246,79.1,244.1,74.5,240.4,70.6z" /></g></g>
                                                        </svg>
                                                    </div>

                                                </div>
                                            </div>
                                            {data.errors ? data.errors[key] ? <h4 className="label-error-submit-form" htmlFor="">{data.errors[key]}</h4> : "" : ""}
                                        </div>
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
        </div >
    )
})