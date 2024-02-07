import React, { useEffect, useRef, useState } from 'react'
import { Form } from './Form.jsx';


export const Tablas = (array) => {

    let data = [];
    let print = []
    let keysData = [];
    let keysPrint = [];
    let keysFilterEstado = [];
    let filterEstado = [];
    let [filterRotate, changeFilterRotate] = useState({});
    let [keyTable, setkeyTable] = useState(1);
    const [statusSelectDefault, setStatusSelectDefault] = useState(false);
    const [statusSelect, setStatusSelect] = useState(true);
    const [statusInputDefault, setStatusInputDefault] = useState(false);
    const [statusInput, setStatusInput] = useState(true);
    const [valueSearch, setValueSearch] = useState("")
    const [nameEstadoFocus, changeNameEstadoFocus] = useState("Estado...");
    const [modalEstado, changeModalEstado] = useState(false)
    const [modalFilter, changeModalFilter] = useState(false)
    const [nameLimitRegisters, changeNameModalLimitRegisters] = useState(5)
    const [positionElementPaginate, changePositionElementPaginate] = useState(1)
    const formRef = useRef(null);
    let [limit, setLimit] = useState(5);
    let [inicio, setInicio] = useState(0);
    let [fin, setFin] = useState(limit);
    let [positionFocusPaginate, setPositionFocusPaginate] = useState(1);
    let paginate = 0;
    let paginateJson = []
    let [posicionPaginate, setPosicionPaginate] = useState(0);

    let filtersLimitRegister = [
        "1",
        "2",
        "5",
        "10",
        "15",
        "20",
        "25",
        "30"
    ]


    if (array.count) {
        paginate = Math.ceil(array.count / limit)

        for (let x = 0; x < paginate; x++) {
            if (x < 5) {
                paginateJson[x + 1] = x + 1;
            } else {
                break
            }
        }
        paginateJson.map(() => {

        })
    }


    if (array.data) {
        data = array.data
        if (array.data.length > 0) {
            keysData = Object.keys(data[0])
        }
    }
    if (array.keys) {
        print = array.keys
        keysPrint = Object.keys(print)
    }
    if (array.filterEstado) {
        keysFilterEstado = array.filterEstado;
        filterEstado = Object.keys(keysFilterEstado)
    }
    function functionCancheFilterRotate(element) {
        let value = "asc"
        let filtersClone = { ...filterRotate };

        if (filtersClone !== null && Object.prototype.toString.call(filtersClone) === '[object Object]') {
            let keys = Object.keys(filtersClone)
            if (filtersClone[element]) {
                if (filtersClone[element]["value"] == "asc") {
                    value = "desc"
                } else {
                    value = "asc"
                }
                filtersClone[element]["value"] = value
            } else {
                if (keys.length == 2) {
                    delete filtersClone[keys[0]]
                }
                filtersClone[element] = {}
                filtersClone[element]["value"] = value
            }
        } else {
            filtersClone[element] = {}
            filtersClone[element]["value"] = value
        }
        changeFilterRotate(filtersClone)
    }
    useEffect(() => {
        array.getFiltersOrden(filterRotate)

    }, [filterRotate]);

    function changePositionPaginate(data) {
        setPosicionPaginate(posicionPaginate + data)
    }
    function functionSetLimit(data) {

        setPositionFocusPaginate(data)
        setInicio(limit * (data - 1));
    }
    function setClearClick() {
        formRef.current.clearElementsClick()
    }
    useEffect(() => {
        array.limitRegisters({ "inicio": inicio, "fin": limit })
    }, [inicio, limit, posicionPaginate])

    useEffect(() => {

        setkeyTable(keyTable + 1)
    }, [data])
    useEffect(() => {

        
        let contentTable = document.querySelectorAll(".content-table")
        let tableComponent = document.querySelectorAll(".table-component")
        let ziseTableComponent = 0;
        let svgPlusTable;
        let arrayThQuit = [];
        let ziseLess = 0;


        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                resizeTable()

            }
        });


        setTimeout(() => {
            resizeObserver.observe(contentTable[0]);
        }, [200])

        resizeTable()

        function resizeTable() {

         
  
            if (contentTable[0].clientWidth < tableComponent[0].clientWidth) {
                ziseTableComponent = tableComponent[0].clientWidth;

                let thQuit = contentTable[0].querySelectorAll("th");

                if (thQuit.length > 3) {

                    let tBody = contentTable[0].querySelectorAll("tbody")
                    let trTbody = tBody[0].querySelectorAll(".tr-table")
                    arrayThQuit.push(thQuit[(thQuit.length) - 1])
                    console.log(arrayThQuit, "tbodyyyyyyyyyyyyyyyyyyy")

                    let nameTd = thQuit[(thQuit.length) - 1].querySelectorAll(".tittle-item-header-table")
                    console.log(nameTd)
                    let name = nameTd[0].innerHTML
                    thQuit[(thQuit.length) - 1].remove();

                    for (let tr = 0; tr < trTbody.length; tr++) {
                        let tdTbody = trTbody[tr].querySelectorAll("td")
                        let newtr = document.createElement("tr");
                        let newtd = document.createElement("td");
                        let newdiv = document.createElement("div");
                        newtd.setAttribute("colspan", 999999999999999);
                        newtr.classList.add("new-tr-table")
                        newtd.classList.add("new-td-table")
                        newdiv.classList.add("new-div-table")
                        newtr.setAttribute("data-tr", tr)
                        console.log(newtr, "trrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
                        newtr.appendChild(newtd)
                        newtd.appendChild(newdiv)
                        console.log(ziseLess, "ahhhhhhhhhhh", tr)
                        if (ziseLess == 0) {


                            let td = document.createElement("td")
                            td.classList.add("td-view-elementos-ocult")
                            td.innerHTML = '<div class="div-svg-plus-table"> <svg class="svg-plus-table" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enable-background="new 0 0 256 256" <g><g><g><path fill="#000000" d="M109,10.5c-1.8,0.8-3.4,2.6-4.1,4.4c-0.4,0.9-0.5,15.4-0.5,45.4v44.1l-44.8,0.1c-44.4,0.1-44.8,0.1-46.2,1.2c-0.7,0.5-1.8,1.6-2.4,2.4c-1,1.3-1,1.9-1,20c0,18.1,0,18.7,1,20c0.5,0.7,1.6,1.8,2.4,2.4c1.3,1,1.8,1,46.2,1.2l44.8,0.1l0.1,44.8c0.1,44.4,0.1,44.8,1.2,46.2c0.5,0.7,1.6,1.8,2.4,2.4c1.3,1,1.9,1,20,1c18.1,0,18.7,0,20-1c0.7-0.5,1.8-1.6,2.4-2.4c1-1.3,1-1.8,1.2-46.2l0.1-44.8l44.8-0.1c44.4-0.1,44.8-0.1,46.2-1.2c0.7-0.5,1.8-1.6,2.4-2.4c1-1.3,1-1.9,1-20c0-18.1,0-18.7-1-20c-0.5-0.7-1.6-1.8-2.4-2.4c-1.3-1-1.8-1-46.2-1.2l-44.8-0.1l-0.1-44.8c-0.1-44.4-0.1-44.8-1.2-46.2c-0.5-0.7-1.6-1.8-2.4-2.4c-1.3-1-2-1-19.4-1.1C114.3,9.9,110.2,10,109,10.5z"/></g></g></g></svg> </div>'
                            console.log("xdxxx", trTbody[tr], newtr)
                            trTbody[tr].insertAdjacentElement('afterend', newtr)
                            trTbody[tr].insertBefore(td, trTbody[tr].children[0]);
                            let plus = td.querySelectorAll(".svg-plus-table")
                            plus[0].addEventListener("click", function () {
                                if (newtr.style.display == "table-row") {
                                    newtr.style.display = "";
                                    newdiv.style.height = "";
                                } else {
                                    newtr.style.display = "table-row";
                                    newdiv.style.height = "max-content";
                                }

                            })
                        }
                        let elementsNewTr = document.querySelectorAll(".new-div-table");
                        let div = document.createElement("div")
                        div.classList.add("div-element-add")
                        div.innerHTML = "<h4> " + name + "</h4>"
                        div.append(tdTbody[(thQuit.length) - 1])
                        elementsNewTr[tr].appendChild(div)
                    }
                    if (ziseLess == 0) {
                        let theadTable = document.querySelectorAll(".thead-table")
                        let th = document.createElement("th")
                        th.classList.add("th-plus-view-elements-ocult")
                        th.innerHTML = ''
                        theadTable[0].insertBefore(th, theadTable[0].children[0]);
                        ziseLess = 1;

                    }
                    resizeTable()
                }

            } else if (tableComponent[0].clientWidth > ziseTableComponent) {

                let theadTable = document.querySelectorAll(".thead-table")

                if (arrayThQuit.length > 0) {
                    let newDivTable = document.querySelectorAll(".new-div-table");
                    let trTable = document.querySelectorAll(".tr-table");
                    theadTable[0].append(arrayThQuit[arrayThQuit.length - 1])
                    arrayThQuit.pop()
                    for (let x = 0; x < newDivTable.length; x++) {
                        let divNewDivTable = newDivTable[x].querySelectorAll(".div-element-add");
                        let divNewDivTableTd = divNewDivTable[divNewDivTable.length - 1].querySelectorAll("td");
                        trTable[x].append(divNewDivTableTd[0])
                        divNewDivTable[divNewDivTable.length - 1].remove()
                        console.log(divNewDivTable, "removeeeeeeee")
                    }


                }
                let elementsNewDivTable = document.querySelectorAll(".div-element-add");

                if (elementsNewDivTable.length == 0) {
                    let newTrTable = document.querySelectorAll(".new-tr-table");
                    let tdPlus = document.querySelectorAll(".td-view-elementos-ocult");
                    let thPlus = document.querySelectorAll(".th-plus-view-elements-ocult");
                    for (let x = 0; x < newTrTable.length; x++) {
                        newTrTable[x].remove()
                    }
                    for (let x = 0; x < tdPlus.length; x++) {
                        tdPlus[x].remove()
                    }
                    for (let x = 0; x < thPlus.length; x++) {
                        thPlus[x].remove()
                    }

                    ziseLess = 0
                }



                ziseTableComponent = tableComponent[0].clientWidth;

            }
            if( document.getElementById("loadTable")){
                document.getElementById("loadTable").remove()
            }
            
        }
    }, [keyTable])
    return (

        <div >
            <link rel="stylesheet" href="../../public/css/tableComponent.css" />
            <div className="div-table">
                <div className="div-filters">
                    <div className='div-tittle'>
                        <h2> {array.tittle ? array.tittle : "Tabla de registros"}</h2>
                        <button onClick={() => { array.clearInputs ? array.clearInputs() : ""; setClearClick(); array.setErrors({}); setStatusInputDefault(false); setStatusInput(true); setStatusSelect(true), setStatusSelectDefault(false); array.changeModalForm(!array.modalForm); array.editarStatus(false) }} className='button-register-table'>Añadir</button>
                    </div>

                    <div className='content-filters'>
                        <div className='limit-registers'>
                            <h4>Mostrar</h4>
                            <div className="filter-estado limit-filter">

                                <div onClick={() => { changeModalFilter(!modalFilter) }} className='input-select-estado input-limit-filter' name="" id="">
                                    <h4>{nameLimitRegisters}</h4>
                                    <div className="icon-chevron-estado">
                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                            <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                            <g><g><path fill="#000000" d="M240.4,70.6L229,59.2c-4-3.7-8.5-5.6-13.8-5.6c-5.3,0-9.9,1.9-13.6,5.6L128,132.8L54.4,59.2c-3.7-3.7-8.3-5.6-13.6-5.6c-5.2,0-9.8,1.9-13.8,5.6L15.8,70.6C11.9,74.4,10,79,10,84.4c0,5.4,1.9,10,5.8,13.6l98.6,98.6c3.6,3.8,8.2,5.8,13.6,5.8c5.3,0,9.9-1.9,13.8-5.8L240.4,98c3.7-3.7,5.6-8.3,5.6-13.6C246,79.1,244.1,74.5,240.4,70.6z" /></g></g>
                                        </svg>
                                    </div>

                                </div>
                                <div style={{ display: modalFilter == false ? "none" : "block" }} className="opciones opciones-limit-filter">
                                    {filtersLimitRegister.map((key, index) => {
                                        return <h4 key={key} onClick={() => { changeNameModalLimitRegisters(key); setLimit(key); setPosicionPaginate(0); functionSetLimit(1) }} className='select-option select-option-limit-filter'>{key}</h4>

                                    })}

                                </div>
                            </div>
                            <h4>Registros</h4>
                        </div>
                        <div className="filter-estado">
                            <div onClick={() => { changeModalEstado(!modalEstado) }} className='input-select-estado' name="" id="">
                                <h4>{nameEstadoFocus}</h4>
                                <div className="icon-chevron-estado">
                                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                        <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                        <g><g><path fill="#000000" d="M240.4,70.6L229,59.2c-4-3.7-8.5-5.6-13.8-5.6c-5.3,0-9.9,1.9-13.6,5.6L128,132.8L54.4,59.2c-3.7-3.7-8.3-5.6-13.6-5.6c-5.2,0-9.8,1.9-13.8,5.6L15.8,70.6C11.9,74.4,10,79,10,84.4c0,5.4,1.9,10,5.8,13.6l98.6,98.6c3.6,3.8,8.2,5.8,13.6,5.8c5.3,0,9.9-1.9,13.8-5.8L240.4,98c3.7-3.7,5.6-8.3,5.6-13.6C246,79.1,244.1,74.5,240.4,70.6z" /></g></g>
                                    </svg>
                                </div>

                            </div>
                            <div style={{ display: modalEstado == false ? "none" : "block" }} className="opciones">

                                <h4 onClick={() => { changeNameEstadoFocus("Estado..."); array.getFilterEstado(false); setPosicionPaginate(0); functionSetLimit(1) }} className='select-option'>Estado...</h4>

                                {filterEstado.map((key, index) => {
                                    return <h4 key={key} onClick={() => { setPosicionPaginate(0); functionSetLimit(1), changeNameEstadoFocus(key); array.getFilterEstado(keysFilterEstado[key]["value"]) }} className='select-option'>{key}</h4>
                                })}

                            </div>
                        </div>
                        <div className="filters-search">
                            <div className="icon-search" onClick={() => { array.filterSeacth(valueSearch); setPosicionPaginate(0); functionSetLimit(1) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 256 256"     >
                                    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                    <g><g><g><path d="M93,10.1c-0.7,0.1-3.3,0.4-5.6,0.7c-28.3,3.5-54.3,22-67.7,48.1c-6.9,13.4-9.8,25.4-9.8,41c0,15.5,2.9,27.6,9.8,41c13.2,25.8,37,43,66.3,48c6.4,1.1,21.1,1.1,27.5,0c14.9-2.5,28.9-8.4,39.6-16.5l2.8-2.1l4.5,4.5l4.6,4.5l-1.1,1.7c-2.5,3.6-2.8,9.8-0.7,13.8c0.8,1.5,8.8,9.9,24.2,25.5c26,26.4,25.5,26,31.8,25.9c5.5,0,6.9-0.9,16.4-10.4c9.5-9.6,10.4-10.9,10.4-16.4c0.1-6,0.3-5.8-25.7-32.1c-25.1-25.4-25-25.3-30.5-25.6c-3.6-0.2-6.2,0.4-8.6,2.1l-1.8,1.2l-4.6-4.6l-4.5-4.5l2-2.6c8-10.5,13.9-24.7,16.4-39.5c1.1-6.4,1.1-21.1,0-27.5c-3.3-18.9-11.2-34.9-23.8-48.2C151,23.3,133.7,14.3,113.8,11C109.5,10.3,95.8,9.6,93,10.1z M109.7,25.9c16.4,2.1,30.9,9.3,42.8,21.2c25.8,25.8,29.2,66.3,8,96.1c-4,5.6-11.7,13.3-17.4,17.4c-22.7,16.1-52,18.4-76.8,6c-7.5-3.7-13.4-8.1-19.4-14c-11.9-11.9-19.1-26.5-21.2-42.8c-3.1-23.4,4.6-46,21.2-62.6C63.7,30.5,86.3,22.8,109.7,25.9z" /><path fill="#000000" d="M52.8,70.1c-5.6,8.6-9,19.6-9,29.5c0,19.7,11.8,38.7,29.4,47.6c9,4.5,15.4,6,25.4,6c7.4,0,11.9-0.7,17.9-2.7c3-1,10.8-4.8,10.8-5.1c0-0.1-2.9-0.1-6.4,0c-18.1,0.7-34.6-5.6-47.6-18.2c-9.7-9.4-15.7-20.4-18.6-33.9c-1-4.9-1.2-19.2-0.3-23.3c0.3-1.4,0.5-2.6,0.4-2.7C54.7,67.3,53.9,68.5,52.8,70.1z" /></g></g></g>
                                </svg>
                            </div>
                            <div className="div-search">
                                <input id='inputSearch' onInput={(e) => { setValueSearch(e.target.value) }} className='input-search' type="text" />
                            </div>
                        </div>
                    </div>
                </div>
                <div key={keyTable} id='contentTable' className="content-table">
                    <div id='loadTable' className='load-table'>
                        Cargando
                    </div>
                    <table className='table-component' cellSpacing={0}>
                        <thead>
                            <tr className='thead-table'>
                                {keysPrint.map((keys, index) => {

                                    return <th key={index}>
                                        <div className="items-header-table">
                                            <h4 className='tittle-item-header-table'>   {print[keys]["referencia"]} </h4>
                                            <svg onClick={() => functionCancheFilterRotate(keys)} style={{ rotate: filterRotate[keys] ? filterRotate[keys]["value"] == "desc" ? "0deg" : "180deg" : "0deg", fill: filterRotate[keys] ? "blue" : "" }} className="filter-asc-desc" version="1.0" viewBox="0 0 512.000000 512.000000">

                                                <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" stroke="none">
                                                    <path d="M680 4341 c-66 -23 -140 -97 -158 -158 -39 -131 13 -259 133 -322 l40 -21 1478 0 c1633 0 1508 -5 1587 67 58 51 80 102 80 186 0 109 -42 183 -132 233 l-53 29 -1460 2 c-1411 2 -1462 2 -1515 -16z" />
                                                    <path d="M655 3306 c-91 -43 -144 -126 -145 -227 0 -103 48 -188 133 -235 l52 -29 689 -3 c789 -3 762 -5 846 76 138 134 84 368 -99 430 -24 9 -229 12 -730 12 l-696 0 -50 -24z" />
                                                    <path d="M3490 3317 c-47 -14 -883 -842 -911 -902 -23 -49 -25 -161 -5 -210 42 -101 135 -161 246 -159 98 1 132 23 327 217 l172 171 3 -740 c3 -699 4 -741 22 -774 34 -64 63 -95 117 -125 45 -25 65 -29 124 -29 80 0 129 21 184 76 74 74 71 26 71 858 l0 745 178 -177 c198 -198 233 -221 326 -222 85 -1 146 24 199 84 72 80 88 190 43 285 -34 70 -829 864 -896 894 -50 23 -141 26 -200 8z" />
                                                    <path d="M698 2300 c-155 -47 -233 -220 -164 -365 28 -60 66 -97 126 -124 44 -20 63 -21 620 -21 639 0 611 -2 692 69 56 49 81 120 76 208 -4 64 -10 80 -42 127 -24 35 -54 63 -89 82 l-52 29 -570 2 c-314 1 -582 -2 -597 -7z" />
                                                </g>
                                            </svg>

                                        </div>
                                    </th>
                                })}
                                <th ><h4 className='tittle-item-header-table'>Actualizar</h4></th>
                            </tr>
                        </thead >
                        <tbody key={"tBody"}>
                            {data.length > 0 ? (
                                data.map((keysD, valuesD) => (
                                    <tr className='tr-table' key={"fincas" + valuesD}>
                                        {
                                            keysPrint.map((keys, index) => {
                                                if (keysData.includes(keys)) {
                                                    if (data[valuesD][keys] === "" || data[valuesD][keys] == null || data[valuesD][keys] == undefined) {
                                                        return <td key={index}><h4 className='table-attribute-no-registra'>No registra</h4></td>;
                                                    } else {
                                                        if (keys == "estado") {
                                                            if (data[valuesD][keys] == 0) {
                                                                return <td key={index}><h4 onClick={() => array.cambiarEstado(data[valuesD]["id"], data[valuesD][keys])} className='estado-0'>Inactivo</h4></td>;
                                                            } else if (data[valuesD][keys] == 1) {
                                                                return <td key={index}><h4 onClick={() => array.cambiarEstado(data[valuesD]["id"], data[valuesD][keys])} className='estado-1'>Activo</h4></td>;
                                                            } else if (data[valuesD][keys] == 2) {
                                                                return <td key={index}><h4 onClick={() => array.cambiarEstado(data[valuesD]["id"], data[valuesD][keys])} className='estado-2'>Pendiente</h4></td>;
                                                            } else if (data[valuesD][keys] == 3 || data[valuesD][keys] == 4) {
                                                                return <td key={index}><h4 onClick={() => array.cambiarEstado(data[valuesD]["id"], data[valuesD][keys])} className='estado-3'>Aginado</h4></td>;
                                                            }
                                                        } else {

                                                            if (print[keys]["values"]) {
                                                                let count = 0;
                                                                let group = ""
                                                                print[keys]["values"].map((ketV, indexV) => {
                                                                    if (data[valuesD][ketV]) {
                                                                        count = count + 1;
                                                                        if (count == 1) {
                                                                            group = data[valuesD][ketV]
                                                                        } else {
                                                                            group += ", " + data[valuesD][ketV]
                                                                        }
                                                                    }
                                                                })
                                                                if (group != "") {
                                                                    if (print[keys]["upper_case"]) {
                                                                        return <td key={index}><h4>{group.toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase())}</h4></td>;
                                                                    } else if (print[keys]["capital_letter"]) {
                                                                        return <td key={index}><h4>{group.toString().replace(/^[a-z]/, match => match.toUpperCase())}</h4></td>;
                                                                    } else {
                                                                        return <td key={index}><h4>{group}</h4></td>;

                                                                    }
                                                                } else {
                                                                    return <td key={index}><h4>No registra</h4></td>;
                                                                }
                                                            } else {
                                                                if (print[keys]["upper_case"]) {
                                                                    return <td key={index}><h4>{data[valuesD][keys].toString().replace(/(?:^|\s)\S/g, match => match.toUpperCase())}</h4></td>;
                                                                } else if (print[keys]["capital_letter"]) {
                                                                    return <td key={index}><h4>{data[valuesD][keys].toString().replace(/^[a-z]/, match => match.toUpperCase())}</h4></td>;
                                                                } else {
                                                                    return <td key={index}><h4>{data[valuesD][keys]}</h4></td>;
                                                                }

                                                            }

                                                        }
                                                    }
                                                } else {
                                                    return <td key={index}><h4 className='table-attribute-no-registra'>No registra</h4></td>;
                                                }
                                            })
                                        }
                                        <td className='td-update'>
                                            <div className="center-update">
                                                <h4 onClick={() => { setClearClick(); array.setErrors({}); setStatusInput(false); setStatusInputDefault(true); setStatusSelectDefault(true); array.editar(data[valuesD]["id"]); array.editarStatus(!array.updateStatus); }} className='item-options option-update'>
                                                    <svg version="1.0" viewBox="0 0 478.000000 522.000000" >

                                                        <g transform="translate(0.000000,522.000000) scale(0.100000,-0.100000)" stroke="none">
                                                            <path d="M2110 5203 c-33 -12 -40 -36 -40 -138 l0 -101 -137 -27 c-610 -121 -1166 -501 -1512 -1032 -315 -483 -442 -1101 -345 -1670 128 -750 594 -1380 1276 -1722 74 -38 144 -66 161 -66 51 0 77 63 40 95 -10 8 -70 40 -133 70 -679 330 -1147 987 -1241 1743 -16 127 -16 411 0 535 50 391 197 763 424 1066 291 389 674 661 1137 808 114 36 267 71 363 82 31 4 62 14 69 22 7 8 15 48 18 89 l5 74 187 -128 c102 -70 186 -132 187 -138 0 -5 -84 -74 -187 -152 l-187 -143 -5 86 c-4 60 -9 88 -20 94 -62 39 -423 -59 -669 -181 -408 -203 -723 -514 -922 -911 -263 -524 -289 -1134 -72 -1680 19 -47 43 -94 53 -103 25 -22 59 -16 82 16 19 26 19 26 -5 85 -165 395 -200 810 -102 1219 58 246 181 503 339 710 258 339 638 590 1065 701 140 36 131 41 131 -74 0 -72 4 -103 16 -120 32 -46 54 -34 355 193 156 119 290 227 297 241 21 39 1 59 -175 178 -87 59 -213 145 -280 191 -125 86 -147 97 -173 88z" />
                                                            <path d="M3280 4797 c-13 -7 -26 -21 -30 -32 -15 -42 5 -60 151 -132 681 -337 1133 -972 1235 -1733 18 -139 18 -410 -1 -557 -86 -658 -449 -1234 -1010 -1603 -121 -79 -364 -194 -515 -244 -119 -39 -367 -96 -419 -96 -10 0 -29 -8 -42 -19 -21 -17 -23 -26 -21 -91 2 -43 -1 -71 -7 -68 -19 7 -380 253 -381 260 0 3 86 72 190 152 l190 145 0 -55 c0 -105 24 -121 151 -99 584 102 1107 471 1417 1003 34 59 62 119 62 133 0 35 -31 61 -66 57 -24 -3 -36 -17 -81 -96 -243 -430 -606 -741 -1053 -899 -117 -41 -294 -85 -304 -75 -4 3 -6 44 -6 92 0 71 -3 90 -18 103 -30 27 -55 20 -128 -34 -295 -221 -514 -393 -519 -410 -15 -45 -16 -44 503 -396 51 -35 99 -63 108 -63 8 0 26 11 39 25 23 22 25 31 25 123 l0 99 77 13 c43 7 133 27 201 46 889 244 1553 972 1708 1874 61 348 37 750 -62 1077 -189 624 -617 1139 -1186 1427 -158 80 -179 87 -208 73z" />
                                                            <path d="M1311 3944 l-21 -27 0 -1316 c0 -1175 2 -1319 16 -1339 l15 -22 1093 0 c1005 0 1095 1 1107 17 12 13 15 130 17 647 1 347 0 641 -3 653 -12 51 -67 70 -98 35 -15 -16 -17 -46 -17 -208 0 -195 -13 -291 -45 -354 -27 -52 -92 -107 -148 -126 -56 -19 -193 -25 -263 -11 -33 7 -45 5 -64 -11 -23 -18 -23 -20 -12 -108 21 -159 -17 -283 -106 -351 -83 -63 -81 -63 -759 -63 l-613 0 0 1245 0 1245 1003 -2 1002 -3 3 -155 3 -154 -258 -258 -258 -258 -587 0 c-650 0 -623 3 -616 -64 5 -56 4 -56 568 -56 l515 0 -180 -180 -180 -180 -340 0 c-375 0 -385 -2 -385 -59 0 -59 9 -61 313 -61 152 0 277 -3 277 -7 0 -4 -21 -28 -46 -54 -44 -45 -47 -52 -111 -265 -56 -185 -71 -225 -100 -257 -38 -43 -41 -69 -13 -97 28 -28 59 -25 96 11 27 26 68 42 260 100 l228 68 613 613 c407 407 620 627 633 654 24 49 26 127 4 180 -19 46 -125 158 -180 190 -22 13 -61 27 -87 30 l-46 7 -3 169 c-3 165 -4 170 -27 189 -23 18 -55 19 -1101 19 l-1079 0 -20 -26z m2297 -488 c15 -8 53 -41 85 -74 51 -54 57 -65 57 -104 l0 -43 -582 -582 -583 -583 -112 112 c-62 62 -113 115 -113 119 0 4 901 907 955 957 2 2 38 -30 81 -72 81 -80 110 -92 146 -59 33 30 22 55 -62 138 l-80 80 53 53 c71 74 103 85 155 58z m-1223 -1356 c49 -49 87 -91 84 -94 -8 -8 -250 -78 -254 -74 -6 6 68 258 75 258 3 0 46 -40 95 -90z m1035 -485 l0 -254 -260 -3 c-143 -2 -260 -2 -260 0 0 2 11 18 24 35 60 80 86 166 86 285 l0 82 63 0 c114 0 236 37 306 91 13 11 28 19 32 19 5 0 9 -115 9 -255z" />
                                                            <path d="M1722 3494 c-26 -18 -30 -65 -6 -88 14 -14 89 -16 683 -16 539 0 671 3 685 13 26 19 24 67 -4 89 -21 17 -60 18 -679 18 -578 0 -659 -2 -679 -16z" />
                                                        </g>
                                                    </svg>
                                                </h4>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : data.find_error ? <tr><td colSpan={1000000} className='table-error'>{data.find_error}</td></tr> : <tr><td colSpan={1000000} className='table-error'>Error interno</td></tr>}
                        </tbody>

                    </table >
                </div>
                <div className="div-paginate">
                    <div className="legend">
                        <h4>Mostrando {paginate == 1 || paginate == 0 ? array.count : positionElementPaginate == paginate ? parseFloat(array.count - ((positionElementPaginate - 1) * limit)) : limit} desde {paginate == 0 ? 0 : inicio == 0 ? 1 : inicio + 1} a {positionElementPaginate * limit < array.count ? positionElementPaginate * limit : array.count} para {array.count}</h4>
                    </div>
                    <div className='paginate'>
                        {paginate > 5 ? <svg onClick={() => { posicionPaginate != 0 ? changePositionPaginate(-1) : "" }} className='chevron-paginate' style={{ rotate: "180deg", cursor: posicionPaginate == 0 ? "unset" : "", fill: posicionPaginate == 0 ? "rgba(152, 152, 152, 0.438)" : " rgb(0, 97, 227)" }} version="1.1" x="0px" y="0px" viewBox="0 0 256 256"  >

                            <g><g><path d="M169.3,130.8L61,233.7L73.3,246l109.5-101.6l12.3-12.3L73.2,10L60.8,22.4L169.3,130.8z" /></g></g>
                        </svg> : "  "}
                        {paginate > 1 ? paginateJson.map((key, index) => (
                            paginate == 5 && index <= 5 ? <div onClick={() => { functionSetLimit(index + posicionPaginate), changePositionElementPaginate(index + posicionPaginate) }} key={index + posicionPaginate} className={`${positionFocusPaginate == index + posicionPaginate ? "item-paginate-focus" : ""} item-paginate-round`} >{index + posicionPaginate}</div> : index <= 4 ? <div onClick={() => { functionSetLimit(index + posicionPaginate), changePositionElementPaginate(index + posicionPaginate) }} key={index + posicionPaginate} className={`${positionFocusPaginate == index + posicionPaginate ? "item-paginate-focus" : ""} item-paginate-round`} >{index + posicionPaginate}</div> : ""

                        )) : ""}
                        {paginate > 5 ?
                            <div className='items-overflow-paginate'>
                                <div className='div-points-paginate'><div className='points-paginate'></div><div className='points-paginate'></div><div className='points-paginate'></div></div>
                                <div onClick={() => { functionSetLimit(paginate), changePositionElementPaginate(paginate) }} className={`${positionFocusPaginate == paginate ? "item-paginate-focus" : ""} item-paginate-round`}>{paginate}</div>
                                <svg onClick={() => { posicionPaginate + 5 < paginate ? changePositionPaginate(1) : "" }} style={{ cursor: posicionPaginate + 5 < paginate ? "" : "unset", fill: posicionPaginate + 5 < paginate ? " rgb(0, 97, 227)" : "rgba(152, 152, 152, 0.438)" }} className='chevron-paginate' version="1.1" x="0px" y="0px" viewBox="0 0 256 256">
                                    <g><g><path d="M169.3,130.8L61,233.7L73.3,246l109.5-101.6l12.3-12.3L73.2,10L60.8,22.4L169.3,130.8z" /></g></g>
                                </svg>
                            </div> : "  "}
                    </div>
                </div>
            </div>



            <Form imgForm={array.imgForm} ref={formRef} setStatusInput={setStatusInput} statusInput={statusInput} setStatusInputDefault={setStatusInputDefault} statusInputDefault={statusInputDefault} setStatusSelect={setStatusSelect} statusSelect={statusSelect} setStatusSelectDefault={setStatusSelectDefault} statusSelectDefault={statusSelectDefault} updateEntitie={array.updateEntitie} updateStatus={array.updateStatus} editarStatus={array.editarStatus} editar={array.editar} elementEdit={array.elementEdit} changeModalForm={array.changeModalForm} modalForm={array.modalForm} errors={array.errors} funcionregistrar={array.funcionregistrar} data={array.inputsForm} tittle={array.tittle} />
        </div>

    )
}