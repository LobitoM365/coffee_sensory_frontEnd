import { object, string } from "prop-types";
import React, { useEffect, useState } from "react";



export const Form = (data) => {

    let elementEdit = [];
    let inputs = []
    let [dataInputs, setDataInputs] = useState([]);
    const [selectsValues, changeSelectsValues] = useState({});
    const [dataSelect, setDataSelects] = useState({});
    const [modalSelect, changeModalSelect] = useState({});
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


        } else if (type === "latitud") {
            if (!/^(-?\d+(?:\.\d*)?)°?(?:\s?(\d+(?:\.\d*)?)'?(?:\s?(\d+(?:\.\d*)?)")?)?([nsNS](?!\.))?$/i.test(e.target.value)) {

                console.log(keyDown, e.target.value.replace(keyDown, ""))
                if (typeof keyDown === 'string' && !/^"?\d+"?$/.test(keyDown)) {
                    if (/[a-zA-Z°'"]\./.test(e.target.value)) {
                        e.target.value = e.target.value.replace(/[a-zA-Z°'"]\./g, function (match) {
                            return match.charAt(0) + match.charAt(2);
                        });
                    } else {
                        console.log("xd1223")
                        e.target.value = e.target.value.replace(keyDown, "").replace("..", ".").replace(/\./, '');
                    }

                } else if (/^(-?\d+(?:\.\d+)?)°?(?:\s?(\d+(?:\.\d+)?)'?(?:\s?(\d+(?:\.\d+)?)")(\d+)?)?([nsNS])?$/.test(e.target.value)) {
                    e.target.value = e.target.value.replace(/"\d+/g, '"')

                } else {

                }
                e.target.value = e.target.value.replace(/[NSns]\d+/g, function (match) {
                    return match[0];
                });


            }




        }
        let value = "";
        let cloneInputValue = { ...inputValor }
        cloneInputValue[key] = e.target.value
        setInputValor(cloneInputValue)
    };



    if (data.data) {
        inputs = Object.keys(data.data)
        setDataInputs
        dataInputs = data.data
        elementEdit = data.elementEdit
        console.log(elementEdit, "xd")
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
        changeModalSelect(cloneModalSelect)
    }

    useEffect(() => {
        document.addEventListener('keydown', function (event) {
            setKeydown(event.key)
        })
        Init()
    }, [])


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
            json[key] = json[key].toString().trimEnd().toLowerCase()
        })

        console.log(json, "Infooo")
        if (!data.updateStatus) {
            data.funcionregistrar(json)
        } else {
            data.updateEntitie(json, elementEdit["id"])
        }

    };
    return (
        <>
            <link rel="stylesheet" href="../../public/css/form.css" />

            <div style={{ display: (!data.modalForm && !data.updateStatus) ? "none" : "" }} className="modal-form">
                <div onClick={() => { data.changeModalForm(false); data.editarStatus(false) }} className="div-fondo-modal-form">
                </div>
                <div className="div-form">
                    <div className="header-form">
                        <h3 className="tittle-form-register">{!data.updateStatus ? "Registrar Finca" : "Actualizar Finca"} </h3>
                        <div onClick={() => { data.changeModalForm(false); data.editarStatus(false) }} className="icon-quit-svg-form">
                            <svg version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                <g><g><path fill="#000000" d="M150.7,128l90.6-90.7c6.3-6.3,6.3-16.4,0-22.7c-6.3-6.3-16.4-6.3-22.7,0L128,105.3L37.4,14.7c-6.3-6.3-16.4-6.3-22.7,0s-6.3,16.4,0,22.7l90.6,90.6l-90.6,90.6c-6.3,6.3-6.3,16.4,0,22.7c3.1,3.1,7.2,4.7,11.3,4.7c4.1,0,8.2-1.6,11.3-4.7l90.7-90.6l90.6,90.7c3.1,3.1,7.2,4.7,11.3,4.7c4.1,0,8.2-1.6,11.3-4.7c6.3-6.3,6.3-16.4,0-22.7L150.7,128z" /></g></g>
                            </svg>
                        </div>
                    </div>
                    <form onSubmit={chageData} action="" className="form-register">
                        {
                            inputs.map((key, index) => {
                                if (dataInputs[key]["type"] === "text" || dataInputs[key]["type"] === "email" || dataInputs[key]["type"] === "number" || dataInputs[key]["type"] === "longitud" || dataInputs[key]["type"] === "latitud") {
                                    if (data.statusInputDefault) {
                                        inputValor[key] = dataInputs[key]["upper_case"] ? typeof elementEdit[key] === "string" ? elementEdit[key].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : elementEdit[key] ?? '' : dataInputs[key]["capital_letter"] ? typeof elementEdit[key] === "string" ? elementEdit[key].toString().replace(/^[a-z]/, match => match.toUpperCase()) : elementEdit[key] ?? '' : elementEdit[key] ?? ""
                                    } else if (data.statusInput) {
                                        inputValor[key] = ""

                                    }
                                    return (

                                        <div key={key} className={`${dataInputs[key]["type"] === "email" ? "input-email" : ""} input-content-form-register`}>
                                            <label className="label-from-register" htmlFor="">{dataInputs[key]["referencia"] ? dataInputs[key]["referencia"] : "Campo"}</label>
                                            <input autoComplete="false" onChange={(e) => { handleInputChange(e, key, dataInputs[key]["type"]); data.setStatusInputDefault(false); data.setStatusInput(false) }} value={data.statusInputDefault ? dataInputs[key]["upper_case"] ? typeof elementEdit[key] === "string" ? elementEdit[key].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : elementEdit[key] ?? '' : dataInputs[key]["capital_letter"] ? typeof elementEdit[key] === "string" ? elementEdit[key].toString().replace(/^[a-z]/, match => match.toUpperCase()) : elementEdit[key] ?? '' : elementEdit[key] ?? "" : inputValor[key]} name={key} className="input-form" type="text" />
                                            <label className="label-error-submit-form" htmlFor="">{data.errors ? data.errors[key] ? data.errors[key] : "" : ""}</label>
                                        </div>
                                    );

                                } else if (dataInputs[key]["type"] === "select") {
                                    if (data.statusSelect) {
                                        selectsValues[key] = "Seleccione una opción...";
                                        dataSelect[key] = ""
                                    }

                                    return (
                                        <div key={key} className="input-content-form-register">
                                            <label className="label-from-register" htmlFor="">{dataInputs[key]["referencia"] ? dataInputs[key]["referencia"] : "Campo"}</label>
                                            <div key={key} onClick={() => { let cloneModalSelect = { ...modalSelect }; cloneModalSelect[key] = !modalSelect[key]; changeModalSelect(cloneModalSelect) }} className="filter-estado div-select">

                                                <div key={index} style={{ display: modalSelect[key] == false ? "none" : "" }} className="opciones">

                                                    <h4 onClick={() => { selectsValues[key] = "Seleccione una opción..."; dataSelect[key] = ""; }} className='select-option'>Seleccione una opción...</h4>

                                                    {
                                                        dataInputs[key]["opciones"] ? dataInputs[key]["opciones"].map((select, indexSelect) => {
                                                            let value = ""
                                                            if (dataInputs[key]["values"]) {
                                                                dataInputs[key]["values"].map((nameSelect, nameIndexSelect) => {
                                                                    value += nameIndexSelect == 0 ? dataInputs[key]["opciones"][indexSelect][nameSelect] : ", " + dataInputs[key]["opciones"][indexSelect][nameSelect];
                                                                })
                                                            }

                                                            if (!data.modalForm && dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]] == elementEdit[key] && data.statusSelectDefault) {
                                                                selectsValues[key] = value;
                                                                dataSelect[key] = dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]]
                                                            }



                                                            if (dataInputs[key]["upper_case"]) {
                                                                value = value.toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase())
                                                            } else if (dataInputs[key]["capital_letter"]) {
                                                                value = value.toString().replace(/^[a-z]/, match => match.toUpperCase())
                                                            }
                                                            return <h4 key={indexSelect} onClick={() => { data.setStatusSelect(false); data.setStatusSelectDefault(false); dataSelect[key] = dataInputs[key]["opciones"][indexSelect][dataInputs[key]["key"]]; selectsValues[key] = value }} className="select-option" value="">
                                                                {value}
                                                            </h4>
                                                        }) : ""
                                                    }

                                                </div>
                                                <div className='input-select-estado' name="" id="">
                                                    <h4 className="label-select">{selectsValues[key]}</h4>
                                                    <div className="icon-chevron-estado">
                                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                                            <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                                            <g><g><path fill="#000000" d="M240.4,70.6L229,59.2c-4-3.7-8.5-5.6-13.8-5.6c-5.3,0-9.9,1.9-13.6,5.6L128,132.8L54.4,59.2c-3.7-3.7-8.3-5.6-13.6-5.6c-5.2,0-9.8,1.9-13.8,5.6L15.8,70.6C11.9,74.4,10,79,10,84.4c0,5.4,1.9,10,5.8,13.6l98.6,98.6c3.6,3.8,8.2,5.8,13.6,5.8c5.3,0,9.9-1.9,13.8-5.8L240.4,98c3.7-3.7,5.6-8.3,5.6-13.6C246,79.1,244.1,74.5,240.4,70.6z" /></g></g>
                                                        </svg>
                                                    </div>

                                                </div>
                                            </div>

                                            <label className="label-error-submit-form" htmlFor="">{data.errors ? data.errors[key] ? data.errors[key] : "" : ""}</label>

                                        </div>
                                    );
                                } else {

                                    if (index + 1 == inputs.length) {
                                        return "No hay nada para mostrar";
                                    }

                                }

                            })


                        }
                        <div className="div-div-input-submit-form">
                            <button type="submit" className="button-submit-form"> {!data.updateStatus ? "Registrar" : "Actualizar"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}