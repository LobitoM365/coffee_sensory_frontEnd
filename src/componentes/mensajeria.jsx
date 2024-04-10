import React, { useEffect, useState } from "react";
import "/public/css/mensajeria.css"
import { GlobalModal } from "./globalModal";
import { GlobalInputs } from "./globalInputs";
import Api from "./Api";
import { Alert } from "./alert";
import { useRef } from "react";
import { host } from "./Api";
import { cssNumber } from "jquery";


export const Mensajeria = (data) => {


    const [valueGlobalInput, setValueGlobalInput] = useState({});
    const [statusModal, setStatusModal] = useState(false);
    const [errrosInputGlobal, setErrorsInputsGlobal] = useState(false);
    const [statusAlert, setStatusAlert] = useState(false);
    const [dataAlert, setdataAlert] = useState({});
    const [modePanel, setModePanel] = useState("mensajes");
    const [vinculosAgregados, setVinculosAgregados] = useState([]);
    const [messagesChat, setMessagesChat] = useState([]);
    const [chatId, setChatId] = useState([]);
    const [chatsActivos, setChatsActivos] = useState([]);
    const sendMessageRef = useRef(null);
    const divListChatsAvticosRef = useRef(null);
    const divChatRef = useRef(null);
    const [chatUserFocus, setChatUserFocus] = useState(0);
    const [lastStateItemsChat, setLastStateItemsChat] = useState({});
    const [messagesSend, setMessagesSend] = useState({});
    const [keyDivMessages, setKeyDivMessages] = useState(0);
    const [keyDivPanel, setKeyDivPanel] = useState(0);
    const [updateKeyDivMessages, setUpdateKeyDivMessages] = useState(false);
    const [positionChats, setPositionChats] = useState({});
    let [lastChatMovement, setLastChatMovement] = useState(0);



    useEffect(() => {
        if (data.socket) {
            const setNewMessage = (message) => {
                if (message.emisor && data.user.id) {
                    setMovementChat(message.comunicaciones_id)
                    let hour = getHourModify(message.date)
                    let date = getDateModify(message.date)
                    const divChatInfo = document.querySelectorAll(".div-chat-active")

                    if (positionChats[message.comunicaciones_id]) {
                        let positionParent = ""
                        if (positionChats[message.comunicaciones_id]["position_before"] != undefined) {
                            positionParent = positionChats[message.comunicaciones_id]["position_before"]
                        } else if (positionChats[message.comunicaciones_id]["position"] != undefined) {
                            positionParent = positionChats[message.comunicaciones_id]["position"]
                        }
                        if (divChatInfo[positionParent]) {
                            const divMessage = divChatInfo[positionParent].querySelectorAll(".div-info-last-message-contact")
                            const divDate = divChatInfo[positionParent].querySelectorAll(".div-info-time-message-new")
                            if (divMessage[0]) {
                                divMessage[0].innerHTML = message.message ? message.message.substring(0, 15) + (message.message.length > 15 ? "..." : "") : ""
                            }
                            if (divDate[0]) {
                                divDate[0].innerHTML = "<h3> " + date + "</h3><h3> " + hour + "</h3>"
                            }
                        }
                    }
                    let statusMessage = 2

                    console.log(message.send)
                    if (message.send == "you") {
                        if (chatId != message.comunicaciones_id) {
                            audioPlay("../../public/audio/tonoNotificacion/tonoNotificacion (2).mp3")
                            let updateNotify = document.getElementById("mesaggesCount_" + message.comunicaciones_id);
                            if (!updateNotify) {
                                const divParent = document.querySelectorAll(".div-info-contacto-date-count");
                                if (positionChats[message.comunicaciones_id]) {
                                    let positionParent = ""
                                    if (positionChats[message.comunicaciones_id]["position_before"] != undefined) {
                                        positionParent = positionChats[message.comunicaciones_id]["position_before"]
                                    } else if (positionChats[message.comunicaciones_id]["position"] != undefined) {
                                        positionParent = positionChats[message.comunicaciones_id]["position"]
                                    }
                                    const div = document.createElement("div")
                                    div.classList.add("div-count-message-new")
                                    div.innerHTML = "<h4 id=mesaggesCount_" + message.comunicaciones_id + ">1</h4>"
                                    updateNotify = div
                                    if (divParent[positionParent]) {
                                        divParent[positionParent].appendChild(div)
                                    }
                                }
                            }
                            let count = updateNotify.innerHTML;
                            if (!isNaN(parseFloat(count))) {
                                count = parseFloat(count) + 1
                                if (updateNotify.parentNode) {
                                    updateNotify.innerHTML = count
                                    if (count > 999) {
                                        updateNotify.parentNode.classList.add("notify-count-four")
                                        updateNotify.innerHTML = "999+"
                                    } if (count >= 100) {
                                        updateNotify.parentNode.classList.add("notify-count-tree")
                                    } else if (count >= 10) {
                                        updateNotify.parentNode.classList.add("notify-count-two")
                                    }
                                }
                            }
                        } else {
                            statusMessage = 0
                            if (message.emisor != data.user.id) {
                                if (divChatRef.current) {
                                    let div = document.createElement("div")
                                    div.classList.add("content-message-send", "message-send-you")
                                    div.innerHTML = '<div><div class="message-content message-content-send-you"><div class="div-content-description-message"><h4>' + message.message + '</h4><h4 class="h4-hour-description">' + hour + '</h4></div><div class="div-info-message"><div></div><div class="div-icon-confirm-message"></div></div></div></div>'
                                    divChatRef.current.appendChild(div)
                                    divChatRef.current.scrollTop = divChatRef.current.scrollHeight
                                }
                            }
                        }
                    }
                    updateMessage(message.comunicaciones_id, message.miembros_comunicaciones_id, statusMessage)

                    if (positionChats[message.comunicaciones_id]) {
                        if (positionChats[message.comunicaciones_id]["message"]) {
                            if (Array.isArray(positionChats[message.comunicaciones_id]["message"])) {
                                let procedureMessage = true
                                let messageEstado = 1
                                if (message.send == "you" && message.emisor == data.user.id) {
                                    procedureMessage = false
                                }
                                if (message.emisor == data.user.id) {
                                    messageEstado = 2
                                }
                                if (procedureMessage == true) {
                                    const cloneMessage = { ...message }
                                    const newMessage = {
                                        "fecha_creacion": cloneMessage.date,
                                        "descripcion": cloneMessage.message,
                                        "estado_mensaje": messageEstado,
                                        "message_propietario": cloneMessage.send
                                    }
                                    let clonePositionChats = { ...positionChats }
                                    clonePositionChats[message.comunicaciones_id]["message"].unshift(newMessage)
                                    setPositionChats(clonePositionChats)
                                    console.log(clonePositionChats, "positionssssssssssssssssssssssssssssssssssssssssssss")
                                    divChatRef.current.scrollTop = divChatRef.current.scrollHeight
                                    setMovementChat(cloneMessage.comunicaciones_id)
                                }
                            }
                        }
                    }
                    if (chatId == message.comunicaciones_id) {
                        audioPlay("../../public/audio/tonoChatAbierto/tonoChatAbierto (5).mp3")
                    }
                }
            };

            data.socket.on("newMessage", setNewMessage);
            async function receptorStatus(message) {
                if (message.comunicaciones_id == chatId) {
                    const divCheckSend = document.querySelectorAll(".div-icon-confirm-message-send")
                    const iconCheckSendReceived = document.querySelectorAll(".icon-check-confirm-message-received")

                    console.log(divCheckSend, "seneeeeeeeeeeeeeeeeeeeeeeeeeed")
                    for (let x = 0; x < iconCheckSendReceived.length; x++) {
                        if (iconCheckSendReceived[x]) {
                            if (message.message_receptor_status == 0) {
                                iconCheckSendReceived[x].classList.add("icon-check-active")
                            }
                        }
                    }
                    for (let x = 0; x < divCheckSend.length; x++) {
                        if (divCheckSend[x]) {
                            const svgDiv = divCheckSend[x].querySelector("svg")
                            if (message.message_receptor_status == 0) {
                                svgDiv.classList.add("icon-check-active")
                            }

                            const clone = svgDiv.cloneNode(true)
                            divCheckSend[x].appendChild(clone)
                            divCheckSend[x].classList.remove("div-icon-confirm-message-send")
                        }
                    }
                }
            }
            data.socket.on("messageReceived", receptorStatus);

            function setUserOnline(message) {
                if (message.comunicaciones_id) {

                    if (positionChats[message.comunicaciones_id]) {
                        const divChatInfo = document.querySelectorAll(".div-chat-active")

                        let positionParent = ""
                        if (positionChats[message.comunicaciones_id]["position_before"] != undefined) {
                            positionParent = positionChats[message.comunicaciones_id]["position_before"]
                        } else if (positionChats[message.comunicaciones_id]["position"] != undefined) {
                            positionParent = positionChats[message.comunicaciones_id]["position"]
                        }
                        if (divChatInfo[positionParent]) {
                            const divStatus = divChatInfo[positionParent].querySelector(".div-status")
                            if (divStatus) {
                                if (message.status == 1) {
                                    divStatus.classList.add("div-status-online")
                                    divStatus.classList.remove("div-status-inactivo")
                                } else {
                                    divStatus.classList.remove("div-status-online")
                                    divStatus.classList.add("div-status-inactivo")
                                }
                            }
                        }
                    }

                }
            }
            async function setConectedChat(message) {
                if (message) {
                    if (Array.isArray(message)) {
                        for (let x = 0; x < message.length; x++) {
                            setUserOnline({ "comunicaciones_id": message[x], "status": 1 })
                        }
                    }
                }
            }
            data.socket.on("conectedChat", setConectedChat);
            data.socket.on("userOnline", setUserOnline);

            return () => {
                data.socket.off('conectedChat', setConectedChat);
                data.socket.off('newMessage', setNewMessage);
                data.socket.off('messageReceived', receptorStatus);
                data.socket.off('userOnline', setUserOnline);
            };
        }


    }, [data.socket, chatId, data.user]);

    useEffect(() => {
        setValueGlobalInput({})
        setErrorsInputsGlobal({})
    }, [statusModal])
    async function closeModalRegistrarVinculo() {
        setStatusModal(false)
    }

    async function updateMessage(comunicaciones_id, miembros_id, statusMessage) {
        try {
            const data = {
                "comunicaciones_id": comunicaciones_id,
                "miembros_comunicaciones_id": miembros_id,
                "estado": statusMessage
            }
            const response = await Api.post("comunicaciones/actualizar/estado/mensajes", data)
        } catch (e) {
            console.log("Error: " + e)
        }
    }
    async function audioPlay(audioSrc) {
        if (audioSrc) {
            const audio = document.createElement("audio")
            audio.setAttribute("src", audioSrc)
            audio.setAttribute("autoplay", "true")
            document.body.appendChild(audio)
            audio.addEventListener('loadedmetadata', function () {
                audio.play()
                setTimeout(() => {
                    audio.remove()
                }, audio.duration * 1000);
            });
        }
    }
    async function agregarVinculo() {
        try {
            setErrorsInputsGlobal({})
            const data = {
                "nickname": valueGlobalInput["nickname"],
                "referencia": valueGlobalInput["referencia"],
            }
            const response = await Api.post("vinculo/agregar", data)
            if (response.data.status == true) {
                if (modePanel == "contactos") {
                    listarVinculosAgregados()
                }
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "true",
                        description: response.data.message,
                        "tittle": "Excelente",
                        continue: {
                            "function": closeModalRegistrarVinculo,
                        }
                    }
                )
            } else if (response.data.errors) {
                setErrorsInputsGlobal(response.data.errors)
            } else if (response.data.status == false) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "false",
                        description: response.data.register_error,
                        "tittle": "Inténtalo de nuevo"
                    }
                )
            } else {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "false",
                        description: response.data.message,
                        "tittle": "Error interno, Inténtalo de nuevo..."
                    }
                )
            }
        } catch (e) {
            console.log("Error: " + e)
        }
    }
    useEffect(() => {
        if (modePanel == "contactos") {
            listarVinculosAgregados()
        }
    }, [modePanel])
    useEffect(() => {
        if (divChatRef.current != null) {
            sendMessageRef.current.value = ""

            if (lastStateItemsChat[chatId]) {
                if (lastStateItemsChat[chatId]["scroll"] != undefined) {
                    divChatRef.current.scrollTop = lastStateItemsChat[chatId]["scroll"]
                } else {
                    divChatRef.current.scrollTop = divChatRef.current.scrollHeight
                }
            } else {
                divChatRef.current.scrollTop = divChatRef.current.scrollHeight
            }

            if (lastStateItemsChat[chatId]) {
                if (lastStateItemsChat[chatId]["input"]) {
                    sendMessageRef.current.value = lastStateItemsChat[chatId]["input"]
                }
            }
        }
    }, [messagesChat])

    async function obtenerChat(id, e) {
        try {

            setModePanel("mensajes")
            let clonePositionChats = { ...positionChats }




            const elemetsFocus = document.querySelectorAll(".div-content-lista-contacts-items-focus")

            for (let x = 0; x < elemetsFocus.length; x++) {
                if (elemetsFocus[x]) {
                    elemetsFocus[x].classList.remove("div-content-lista-contacts-items-focus")
                }
            }
            if (updateKeyDivMessages) {
                setKeyDivMessages(keyDivMessages + 1)
                setUpdateKeyDivMessages(false)
            }

            if (chatUserFocus != id) {
                const response = await Api.post("/comunicaciones/buscar", { vinculos_id: id })
                console.log(response, "responssssssssse")
                /* updateMessage(response.id, miembros_id, statusMessage) */

                if (response.data.status == true) {
                    setChatUserFocus(id)
                    setChatId(response.data.data.id)
                    let procedureNormal = true
                    if (positionChats[response.data.data.id]) {
                        if (positionChats[response.data.data.id]["message"]) {
                            procedureNormal = false
                            if (clonePositionChats[response.data.data.id]["procedure_normal"] != false) {
                                clonePositionChats[response.data.data.id]["procedure_normal"] = false
                                setPositionChats(clonePositionChats)
                            }
                            setMessagesChat(positionChats[response.data.data.id]["message"])
                            
                            const actualizarMessage = await Api.post("/comunicaciones/actualizar/estado/mensajes", { "comunicaciones_id": response.data.data.id })
                            alert("xd")
                            console.log(actualizarMessage, "mesaaaaaa")

                        }
                    }

                    if (procedureNormal == true) {
                        const divChatInfo = document.querySelectorAll(".div-chat-active")
                        let positionParent = ""
                        if (positionChats[response.data.data.id]["position_before"] != undefined) {
                            positionParent = positionChats[response.data.data.id]["position_before"]
                        } else if (positionChats[response.data.data.id]["position"] != undefined) {
                            positionParent = positionChats[response.data.data.id]["position"]
                        }
                        if (divChatInfo[positionParent]) {
                            const divCount = divChatInfo[positionParent].querySelectorAll(".div-count-message-new");
                            if (divCount[0]) {
                                divCount[0].remove()
                            }
                        }

                        /*  const itemsFocus = document.querySelectorAll(".div-item-main-content-panel");
                         for (let x = 0; x < itemsFocus.length; x++) {
                             if (itemsFocus[x]) {
                                 itemsFocus[x].classList.remove("div-content-lista-contacts-items-focus")
                             }
                         } */


                        if (e.target) {
                            e.target.closest(".div-item-main-content-panel").classList.add("div-content-lista-contacts-items-focus")
                        }

                        const messages = await Api.post("/comunicaciones/buscar/mensajes/personal", { "comunicaciones_id": response.data.data.id })
                        if (clonePositionChats[response.data.data.id]) {
                            clonePositionChats[response.data.data.id]["message"] = messages.data.data
                            clonePositionChats[response.data.data.id]["procedure_normal"] = false
                            clonePositionChats[response.data.data.id]["target"] = e
                            setPositionChats(clonePositionChats)
                        }


                        if (messages.data.status == true) {
                            setMessagesChat(messages.data.data)
                        } else if (messages.data.find_error) {
                            setMessagesChat(messages.data)
                        } else if (messages.data.status == false) {
                            setStatusAlert(true)
                            setdataAlert(
                                {
                                    status: "false",
                                    description: messages.data.find_error,
                                    "tittle": "Inténtalo de nuevo"
                                }
                            )
                        } else {
                            setStatusAlert(true)
                            setdataAlert(
                                {
                                    status: "false",
                                    description: messages.data.message,
                                    "tittle": "Error interno, Inténtalo de nuevo..."
                                }
                            )
                        }
                    }
                } else if (response.data.status == false) {
                    setStatusAlert(true)
                    setdataAlert(
                        {
                            status: "false",
                            description: response.data.register_error,
                            "tittle": "Inténtalo de nuevo"
                        }
                    )
                } else {
                    setStatusAlert(true)
                    setdataAlert(
                        {
                            status: "false",
                            description: response.data.message,
                            "tittle": "Error interno, Inténtalo de nuevo..."
                        }
                    )
                }
            }

        } catch (e) {
            console.log("ERROR: " + e)
        }
    }

    async function listarVinculosAgregados() {
        try {
            const response = await Api.post("vinculo/listar/agregados")
            if (response.data.status == true) {
                setVinculosAgregados(response.data.data)
            } else if (response.data.find_error) {
                setVinculosAgregados(response.data)
            }
        } catch (e) {
            console.log("Error: " + e)
        }
    }
    function setMovementChat(chatId) {
        if (chatId) {
            let divItemsChat = document.querySelectorAll(".div-content-lista-contacts-items");
            if (positionChats[chatId]) {
                if (divItemsChat[positionChats[chatId]["position"]]) {

                    const clonePositionChats = { ...positionChats }
                    if (clonePositionChats[chatId]["position_before"] != 0) {
                        if (clonePositionChats[chatId]["position_before"] == undefined) {
                            clonePositionChats[chatId]["position_before"] = clonePositionChats[chatId]["position"]
                        }
                        let positionElement = clonePositionChats[chatId]["position_before"]
                        const divMovement = divItemsChat[positionElement]
                        const topInicital = divMovement.scrollHeight * positionElement
                        divMovement.style.top = topInicital + "px"
                        const keysDivChats = Object.keys(clonePositionChats)
                        for (let x = 0; x < keysDivChats.length; x++) {

                            if (clonePositionChats[keysDivChats[x]]["position_before"] == undefined) {
                                if (clonePositionChats[keysDivChats[x]]["position"] != undefined) {
                                    clonePositionChats[keysDivChats[x]]["position_before"] = clonePositionChats[keysDivChats[x]]["position"]
                                }
                            }
                            if (clonePositionChats[keysDivChats[x]]["position_before"] < positionElement) {
                                clonePositionChats[keysDivChats[x]]["position_before"] = clonePositionChats[keysDivChats[x]]["position_before"] + 1
                            }
                        }
                        divMovement.style.position = "absolute"
                        divListChatsAvticosRef.current.insertBefore(divMovement, divListChatsAvticosRef.current.children[0]);
                        clonePositionChats[chatId]["position_before"] = 0

                        setTimeout(() => {

                            /* divMovement.style.transition = "all 0.5s" */

                            divMovement.style.top = "0px"
                            if (divListChatsAvticosRef.current) {
                                divListChatsAvticosRef.current.style.paddingTop = divMovement.scrollHeight + "px"
                            }
                            setTimeout(() => {
                                setLastChatMovement(positionElement);
                                divListChatsAvticosRef.current.style.paddingTop = ""
                                divMovement.style.position = ""
                                divMovement.style.top = "100%"
                            }, 600)
                        }, 500)
                        setPositionChats(clonePositionChats)

                    }
                }
            }
        }
    }

    useEffect(() => {
        setKeyDivPanel(keyDivPanel + 1)
    }, [modePanel])
    async function enviarMessage() {
        try {

            if (sendMessageRef != null && chatId != "") {
                if (sendMessageRef.current) {
                    setMovementChat(chatId)
                    setUpdateKeyDivMessages(true)
                    let div = document.createElement("div")
                    div.classList.add("content-message-send", "message-send-i")
                    div.innerHTML = '<div><div class="message-content message-content-send-i"><div class="div-content-description-message"><h4>' + sendMessageRef.current.value + '</h4><h4 class="h4-hour-description"></h4></div><div class="div-info-message"><div class="loader-div"></div></div></div></div>'
                    if (divChatRef.current && sendMessageRef.current.value) {
                        divChatRef.current.appendChild(div)
                    }
                    const dataSend = {
                        "comunicaciones_id": chatId,
                        "tipo": "normal",
                        "descripcion": sendMessageRef.current.value
                    }
                    const response = await Api.post("comunicaciones/mensajes/normal/insertar", dataSend)
                    divChatRef.current.scrollTop = divChatRef.current.scrollHeight

                    if (response.data.status == true) {
                        if (div) {
                            let hour = getHourModify(response.data.date)
                            div.remove()
                            /* div.innerHTML = '<div><div class="message-content message-content-send-i"><div class="div-content-description-message"><h4>' + response.data.message + '</h4><h4 class="h4-hour-description">' + hour + '</h4></div><div class="div-info-message"><div class="div-icon-confirm-message div-icon-confirm-message-send"><svg class="icon-check-normal icon-check-confirm-message-received" viewBox="0 0 468.000000 459.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,459.000000) scale(0.100000,-0.100000)" ><path d="M4085 4507 c-68 -18 -146 -61 -187 -106 -19 -20 -102 -119 -183 -221 -82 -102 -176 -219 -210 -260 -33 -41 -236 -291 -450 -555 -214 -264 -430 -530 -479 -591 -50 -61 -272 -334 -494 -608 -222 -273 -407 -496 -412 -496 -14 0 -68 72 -285 385 -324 467 -342 488 -477 556 -112 56 -253 74 -380 48 -193 -40 -374 -214 -429 -414 -22 -81 -18 -227 9 -313 29 -94 42 -114 311 -497 123 -176 363 -519 534 -763 170 -243 329 -463 353 -488 27 -28 74 -59 122 -82 73 -35 82 -37 177 -37 94 0 104 2 175 36 78 38 148 99 198 172 60 90 397 572 1447 2072 601 858 1101 1578 1112 1600 53 104 54 234 1 347 -76 166 -275 260 -453 215z" /></g></svg></div></div></div></div>'
                            divChatRef.current.scrollTop = divChatRef.current.scrollHeight */
                        }
                        sendMessageRef.current.value = ""
                        const cloneLastStateItemsChat = { ...lastStateItemsChat }
                        if (!cloneLastStateItemsChat[chatId]) {
                            cloneLastStateItemsChat[chatId] = {}
                        }
                        cloneLastStateItemsChat[chatId]["input"] = ""
                        setLastStateItemsChat(cloneLastStateItemsChat)
                    }
                    sendMessageRef.current.value = ""
                }
            }
        } catch (e) {
            console.log("Error: " + e)
        }
    }
    async function listarComunicaciones() {
        try {
            const response = await Api.post("/comunicaciones/listar")
            if (response.data.status == true) {
                setChatsActivos(response.data.data)
            } else if (response.data.find_error) {
                setChatsActivos(response.data)
            } else {

            }
        } catch (e) {
            console.log("ERROR: " + e)
        }
    }

    useEffect(() => {
        listarComunicaciones()
    }, [])
    function getDateModify(date) {
        let dateGroupMessages = ""
        date = new Date(date)
        if (date) {
            let fechaAyer = new Date();
            let fechaAnteayer = new Date();
            let fechaActual = new Date();
            fechaAyer.setDate(fechaAyer.getDate() - 1);
            fechaAnteayer.setDate(fechaAnteayer.getDate() - 2);
            if (date.toDateString() === fechaActual.toDateString()) {
                dateGroupMessages = "Hoy"
            } else if (date.toDateString() === fechaAyer.toDateString()) {
                dateGroupMessages = "Ayer"
            } else if (date.toDateString() === fechaAnteayer.toDateString()) {
                dateGroupMessages = "Anteayer"
            } else {
                dateGroupMessages = date.getFullYear() + "/" + (date.getDay() < 10 ? "0" + "" + date.getDay() : date.getDay()) + "/" + (date.getDate() < 10 ? "0" + "" + date.getDate() : date.getDate())
            }
        }
        return dateGroupMessages
    }
    function getHourModify(date) {
        let hourMessage = ""
        date = new Date(date)
        if (date) {
            let timeHour = "a.m";
            if (date.getHours() == 12 || date.getHours() == 0) {
                hourMessage = 12
                timeHour = "p.m"
            } else if (date.getHours() > 12) {
                hourMessage = date.getHours() - 12
                timeHour = "p.m"
            } else {
                hourMessage = date.getHours()
                timeHour = "a.m"
            }
            hourMessage += ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + " " + timeHour
        }
        return hourMessage
    }

    useEffect(() => {
        function keyEnviarMensage(event) {
            if (event.key === "Enter") {
                if (document.activeElement === sendMessageRef.current && chatId) {
                    enviarMessage();
                } else {
                    sendMessageRef.current.focus();
                }
            }
        }
        document.addEventListener("keydown", keyEnviarMensage);

        return () => {
            document.removeEventListener("keydown", keyEnviarMensage);
        };
    }, [chatId]);

    return (
        <div id="mainMensajeria">
            <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />

            <div className="main-content-mensajeria">
                <div className="header-mensajeria">
                    <nav className="header-mensajeria-nav">
                        <ul className="ul-main-items-nav">
                            <div className="div-item-contact-panel-img-icono-perfil">
                                <div>
                                    {Object.keys(data.user).length > 0 ? data.user.img ? <img className='img-icono' src={"http://" + host + ":3000/img/usuarios/" + (data.user.id ? data.user.id : "") + "/iconos/" + (data.user.img ? data.user.img : "")} /> : data.user.cargo == "administrador" ? <img className='img-perfil-usuario' src="/img/analisisPrueba.jpg" alt="" /> : data.user.cargo == "instructor" ? <img className='img-perfil-usuario' src="/img/img_instructor.jpg" alt="" /> : data.user.cargo == "aprendiz" ? <img className='img-perfil-usuario' src="/img/img_aprendiz.jpg" alt="" /> : data.user.cargo == "cliente" ? <img className='img-perfil-usuario' src="/img/img_client.jpg" alt="" /> : <img className='img-perfil-usuario' src="/img/analisisPrueba.jpg" alt="" />

                                        :
                                        <img className='img-perfil-usuario' src="/img/analisisPrueba.jpg" alt="" />}
                                </div>
                            </div>
                            <li onClick={() => {
                                setModePanel("mensajes")
                            }}>
                                <div className="icon-nav-mensajeria">
                                    <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512"  >
                                        <g>
                                            <path d="M431.2,13.5H134.7c-44.6,0-80.8,36.3-80.8,80.8v26.9H26.9C12,121.3,0,133.3,0,148.2s12,26.9,26.9,26.9h26.9v53.9H26.9   C12,229.1,0,241.1,0,256c0,14.9,12,26.9,26.9,26.9h26.9v53.9H26.9C12,336.8,0,348.9,0,363.8c0,14.9,12,26.9,26.9,26.9h26.9v26.9   c0,44.6,36.3,80.8,80.8,80.8h296.4c44.6,0,80.8-36.3,80.8-80.8V94.3C512,49.8,475.7,13.5,431.2,13.5z M107.8,94.3   c0-14.8,12.1-26.9,26.9-26.9v53.9h-26.9V94.3z M107.8,175.2h26.9v53.9h-26.9V175.2z M107.8,282.9h26.9v53.9h-26.9V282.9z    M107.8,417.7v-26.9h26.9v53.9C119.9,444.6,107.8,432.5,107.8,417.7z M458.1,417.7c0,14.8-12.1,26.9-26.9,26.9H161.7V67.4h269.5   c14.8,0,26.9,12.1,26.9,26.9V417.7z" />
                                            <circle cx="296.4" cy="215.6" r="53.9" />
                                            <path d="M296.4,292.5c-42.1,0-67.4,19.3-67.4,38.5c0,9.6,25.3,19.3,67.4,19.3c39.5,0,67.4-9.6,67.4-19.3   C363.8,311.8,337.4,292.5,296.4,292.5z" />
                                        </g>
                                    </svg>

                                </div>
                                <h4 className="tittle-nav-mensajeria">Chats</h4>
                            </li>
                            <li onClick={() => {
                                setModePanel("contactos")
                            }}>
                                <div className="icon-nav-mensajeria">
                                    <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512"  >
                                        <g>
                                            <path d="M431.2,13.5H134.7c-44.6,0-80.8,36.3-80.8,80.8v26.9H26.9C12,121.3,0,133.3,0,148.2s12,26.9,26.9,26.9h26.9v53.9H26.9   C12,229.1,0,241.1,0,256c0,14.9,12,26.9,26.9,26.9h26.9v53.9H26.9C12,336.8,0,348.9,0,363.8c0,14.9,12,26.9,26.9,26.9h26.9v26.9   c0,44.6,36.3,80.8,80.8,80.8h296.4c44.6,0,80.8-36.3,80.8-80.8V94.3C512,49.8,475.7,13.5,431.2,13.5z M107.8,94.3   c0-14.8,12.1-26.9,26.9-26.9v53.9h-26.9V94.3z M107.8,175.2h26.9v53.9h-26.9V175.2z M107.8,282.9h26.9v53.9h-26.9V282.9z    M107.8,417.7v-26.9h26.9v53.9C119.9,444.6,107.8,432.5,107.8,417.7z M458.1,417.7c0,14.8-12.1,26.9-26.9,26.9H161.7V67.4h269.5   c14.8,0,26.9,12.1,26.9,26.9V417.7z" />
                                            <circle cx="296.4" cy="215.6" r="53.9" />
                                            <path d="M296.4,292.5c-42.1,0-67.4,19.3-67.4,38.5c0,9.6,25.3,19.3,67.4,19.3c39.5,0,67.4-9.6,67.4-19.3   C363.8,311.8,337.4,292.5,296.4,292.5z" />
                                        </g>
                                    </svg>

                                </div>
                                <h4 className="tittle-nav-mensajeria">Contactos</h4>
                            </li>
                            <li>
                                <div className="icon-nav-mensajeria">
                                    <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512"  >
                                        <g>
                                            <path d="M431.2,13.5H134.7c-44.6,0-80.8,36.3-80.8,80.8v26.9H26.9C12,121.3,0,133.3,0,148.2s12,26.9,26.9,26.9h26.9v53.9H26.9   C12,229.1,0,241.1,0,256c0,14.9,12,26.9,26.9,26.9h26.9v53.9H26.9C12,336.8,0,348.9,0,363.8c0,14.9,12,26.9,26.9,26.9h26.9v26.9   c0,44.6,36.3,80.8,80.8,80.8h296.4c44.6,0,80.8-36.3,80.8-80.8V94.3C512,49.8,475.7,13.5,431.2,13.5z M107.8,94.3   c0-14.8,12.1-26.9,26.9-26.9v53.9h-26.9V94.3z M107.8,175.2h26.9v53.9h-26.9V175.2z M107.8,282.9h26.9v53.9h-26.9V282.9z    M107.8,417.7v-26.9h26.9v53.9C119.9,444.6,107.8,432.5,107.8,417.7z M458.1,417.7c0,14.8-12.1,26.9-26.9,26.9H161.7V67.4h269.5   c14.8,0,26.9,12.1,26.9,26.9V417.7z" />
                                            <circle cx="296.4" cy="215.6" r="53.9" />
                                            <path d="M296.4,292.5c-42.1,0-67.4,19.3-67.4,38.5c0,9.6,25.3,19.3,67.4,19.3c39.5,0,67.4-9.6,67.4-19.3   C363.8,311.8,337.4,292.5,296.4,292.5z" />
                                        </g>
                                    </svg>

                                </div>
                                <h4 className="tittle-nav-mensajeria">Perfil</h4>
                            </li>
                            <li>
                                <div className="icon-nav-mensajeria">
                                    <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512"  >
                                        <g>
                                            <path d="M431.2,13.5H134.7c-44.6,0-80.8,36.3-80.8,80.8v26.9H26.9C12,121.3,0,133.3,0,148.2s12,26.9,26.9,26.9h26.9v53.9H26.9   C12,229.1,0,241.1,0,256c0,14.9,12,26.9,26.9,26.9h26.9v53.9H26.9C12,336.8,0,348.9,0,363.8c0,14.9,12,26.9,26.9,26.9h26.9v26.9   c0,44.6,36.3,80.8,80.8,80.8h296.4c44.6,0,80.8-36.3,80.8-80.8V94.3C512,49.8,475.7,13.5,431.2,13.5z M107.8,94.3   c0-14.8,12.1-26.9,26.9-26.9v53.9h-26.9V94.3z M107.8,175.2h26.9v53.9h-26.9V175.2z M107.8,282.9h26.9v53.9h-26.9V282.9z    M107.8,417.7v-26.9h26.9v53.9C119.9,444.6,107.8,432.5,107.8,417.7z M458.1,417.7c0,14.8-12.1,26.9-26.9,26.9H161.7V67.4h269.5   c14.8,0,26.9,12.1,26.9,26.9V417.7z" />
                                            <circle cx="296.4" cy="215.6" r="53.9" />
                                            <path d="M296.4,292.5c-42.1,0-67.4,19.3-67.4,38.5c0,9.6,25.3,19.3,67.4,19.3c39.5,0,67.4-9.6,67.4-19.3   C363.8,311.8,337.4,292.5,296.4,292.5z" />
                                        </g>
                                    </svg>

                                </div>
                                <h4 className="tittle-nav-mensajeria">Cuenta</h4>
                            </li>
                            <li>
                                <div className="icon-nav-mensajeria">
                                    <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512"  >
                                        <g>
                                            <path d="M431.2,13.5H134.7c-44.6,0-80.8,36.3-80.8,80.8v26.9H26.9C12,121.3,0,133.3,0,148.2s12,26.9,26.9,26.9h26.9v53.9H26.9   C12,229.1,0,241.1,0,256c0,14.9,12,26.9,26.9,26.9h26.9v53.9H26.9C12,336.8,0,348.9,0,363.8c0,14.9,12,26.9,26.9,26.9h26.9v26.9   c0,44.6,36.3,80.8,80.8,80.8h296.4c44.6,0,80.8-36.3,80.8-80.8V94.3C512,49.8,475.7,13.5,431.2,13.5z M107.8,94.3   c0-14.8,12.1-26.9,26.9-26.9v53.9h-26.9V94.3z M107.8,175.2h26.9v53.9h-26.9V175.2z M107.8,282.9h26.9v53.9h-26.9V282.9z    M107.8,417.7v-26.9h26.9v53.9C119.9,444.6,107.8,432.5,107.8,417.7z M458.1,417.7c0,14.8-12.1,26.9-26.9,26.9H161.7V67.4h269.5   c14.8,0,26.9,12.1,26.9,26.9V417.7z" />
                                            <circle cx="296.4" cy="215.6" r="53.9" />
                                            <path d="M296.4,292.5c-42.1,0-67.4,19.3-67.4,38.5c0,9.6,25.3,19.3,67.4,19.3c39.5,0,67.4-9.6,67.4-19.3   C363.8,311.8,337.4,292.5,296.4,292.5z" />
                                        </g>
                                    </svg>

                                </div>
                                <h4 className="tittle-nav-mensajeria">Opciones</h4>
                            </li>
                        </ul>
                        <ul>
                            <li onClick={() => {
                                setStatusModal(true)
                            }} >
                                <div className="icon-nav-mensajeria">
                                    <svg viewBox="0 0 16 16" fill="none"><path d="M9 3.5a.75.75 0 00-1.5 0V7H4a.75.75 0 000 1.5h3.5V12A.75.75 0 009 12V8.5h3.5a.75.75 0 000-1.5H9V3.5z" /></svg>
                                </div>
                            </li>

                        </ul>
                    </nav>
                </div>
                <div className="body-mensajeria">
                    <div className="section-message-content-mensajeria">
                        <div className="header-section-contacts-content-mensajeria">
                            <div className="div-search-header-section-contacs-content-mensajeria">
                                <div className="div-content-search-header-section-contacs-content-mensajeria">
                                    <div>
                                        <input type="text" />
                                    </div>
                                    <div className="div-icon-search-header-section-contacs-content-mensajeria">
                                        <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 122.879 119.799" ><g><path d="M49.988,0h0.016v0.007C63.803,0.011,76.298,5.608,85.34,14.652c9.027,9.031,14.619,21.515,14.628,35.303h0.007v0.033v0.04 h-0.007c-0.005,5.557-0.917,10.905-2.594,15.892c-0.281,0.837-0.575,1.641-0.877,2.409v0.007c-1.446,3.66-3.315,7.12-5.547,10.307 l29.082,26.139l0.018,0.016l0.157,0.146l0.011,0.011c1.642,1.563,2.536,3.656,2.649,5.78c0.11,2.1-0.543,4.248-1.979,5.971 l-0.011,0.016l-0.175,0.203l-0.035,0.035l-0.146,0.16l-0.016,0.021c-1.565,1.642-3.654,2.534-5.78,2.646 c-2.097,0.111-4.247-0.54-5.971-1.978l-0.015-0.011l-0.204-0.175l-0.029-0.024L78.761,90.865c-0.88,0.62-1.778,1.209-2.687,1.765 c-1.233,0.755-2.51,1.466-3.813,2.115c-6.699,3.342-14.269,5.222-22.272,5.222v0.007h-0.016v-0.007 c-13.799-0.004-26.296-5.601-35.338-14.645C5.605,76.291,0.016,63.805,0.007,50.021H0v-0.033v-0.016h0.007 c0.004-13.799,5.601-26.296,14.645-35.338C23.683,5.608,36.167,0.016,49.955,0.007V0H49.988L49.988,0z M50.004,11.21v0.007h-0.016 h-0.033V11.21c-10.686,0.007-20.372,4.35-27.384,11.359C15.56,29.578,11.213,39.274,11.21,49.973h0.007v0.016v0.033H11.21 c0.007,10.686,4.347,20.367,11.359,27.381c7.009,7.012,16.705,11.359,27.403,11.361v-0.007h0.016h0.033v0.007 c10.686-0.007,20.368-4.348,27.382-11.359c7.011-7.009,11.358-16.702,11.36-27.4h-0.006v-0.016v-0.033h0.006 c-0.006-10.686-4.35-20.372-11.358-27.384C70.396,15.56,60.703,11.213,50.004,11.21L50.004,11.21z" /></g></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="header-section-message-content-mensajeria">
                        <div>
                            <div className="div-item-contact-panel">
                                <div className="div-item-contact-panel-img-icono">
                                    <img className="item-contact-panel-img-icono" src="http://localhost:3000/img/usuarios/6/iconos/rick__dribbble (1).gif" />
                                </div>
                                <div className="div-info-contact-panel">
                                    <div className="info-text-contact-panel">
                                        <div className="div-info-name-contact">
                                            <h4>Juan Miguel</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="div-icons-header-section-message-content-mensajeria">
                            <div className="div-icon-normal-icons-header-section-message-content-mensajeria">
                                <svg className="svg-icon-call" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 122.88 122.27" ><g><path d="M33.84,50.25c4.13,7.45,8.89,14.6,15.07,21.12c6.2,6.56,13.91,12.53,23.89,17.63c0.74,0.36,1.44,0.36,2.07,0.11 c0.95-0.36,1.92-1.15,2.87-2.1c0.74-0.74,1.66-1.92,2.62-3.21c3.84-5.05,8.59-11.32,15.3-8.18c0.15,0.07,0.26,0.15,0.41,0.21 l22.38,12.87c0.07,0.04,0.15,0.11,0.21,0.15c2.95,2.03,4.17,5.16,4.2,8.71c0,3.61-1.33,7.67-3.28,11.1 c-2.58,4.53-6.38,7.53-10.76,9.51c-4.17,1.92-8.81,2.95-13.27,3.61c-7,1.03-13.56,0.37-20.27-1.69 c-6.56-2.03-13.17-5.38-20.39-9.84l-0.53-0.34c-3.31-2.07-6.89-4.28-10.4-6.89C31.12,93.32,18.03,79.31,9.5,63.89 C2.35,50.95-1.55,36.98,0.58,23.67c1.18-7.3,4.31-13.94,9.77-18.32c4.76-3.84,11.17-5.94,19.47-5.2c0.95,0.07,1.8,0.62,2.25,1.44 l14.35,24.26c2.1,2.72,2.36,5.42,1.21,8.12c-0.95,2.21-2.87,4.25-5.49,6.15c-0.77,0.66-1.69,1.33-2.66,2.03 c-3.21,2.33-6.86,5.02-5.61,8.18L33.84,50.25L33.84,50.25L33.84,50.25z" /></g></svg>
                            </div>
                            <div className="div-icon-suspensive-points">
                                <svg className="icon-loader" version="1.0" viewBox="0 0 134.000000 177.000000" >
                                    <g transform="translate(0.000000,177.000000) scale(0.100000,-0.100000)" stroke="none">
                                        <path style={{ fill: " rgb(169, 53, 53)" }} className="color-top-icon-loader" d="M514 1729 c-211 -65 -392 -293 -466 -586 -19 -75 -23 -115 -23 -268 0 -157 3 -191 23 -268 51 -192 129 -333 245 -444 158 -150 297 -174 386 -67 50 61 64 127 59 268 -4 105 -10 135 -41 227 -20 59 -63 160 -96 225 -74 148 -97 206 -123 314 -27 111 -29 295 -4 390 19 69 67 173 93 203 9 9 14 19 12 21 -2 2 -31 -5 -65 -15z" />
                                        <path style={{ fill: "rgb(151, 46, 46)" }} className="color-bottom-icon-loader" d="M755 1705 c-68 -37 -107 -99 -137 -218 -43 -171 -9 -368 101 -587 83 -165 127 -280 151 -400 38 -184 18 -346 -56 -455 l-25 -37 28 6 c67 16 177 80 244 143 192 182 289 450 276 768 -13 335 -157 618 -382 754 -69 42 -151 52 -200 26z" />
                                    </g>
                                </svg>
                                <svg className="icon-loader" version="1.0" viewBox="0 0 134.000000 177.000000" >
                                    <g transform="translate(0.000000,177.000000) scale(0.100000,-0.100000)" stroke="none">
                                        <path style={{ fill: " rgb(169, 53, 53)" }} className="color-top-icon-loader" d="M514 1729 c-211 -65 -392 -293 -466 -586 -19 -75 -23 -115 -23 -268 0 -157 3 -191 23 -268 51 -192 129 -333 245 -444 158 -150 297 -174 386 -67 50 61 64 127 59 268 -4 105 -10 135 -41 227 -20 59 -63 160 -96 225 -74 148 -97 206 -123 314 -27 111 -29 295 -4 390 19 69 67 173 93 203 9 9 14 19 12 21 -2 2 -31 -5 -65 -15z" />
                                        <path style={{ fill: "rgb(151, 46, 46)" }} className="color-bottom-icon-loader" d="M755 1705 c-68 -37 -107 -99 -137 -218 -43 -171 -9 -368 101 -587 83 -165 127 -280 151 -400 38 -184 18 -346 -56 -455 l-25 -37 28 6 c67 16 177 80 244 143 192 182 289 450 276 768 -13 335 -157 618 -382 754 -69 42 -151 52 -200 26z" />
                                    </g>
                                </svg>
                                <svg className="icon-loader" version="1.0" viewBox="0 0 134.000000 177.000000" >
                                    <g transform="translate(0.000000,177.000000) scale(0.100000,-0.100000)" stroke="none">
                                        <path style={{ fill: " rgb(169, 53, 53)" }} className="color-top-icon-loader" d="M514 1729 c-211 -65 -392 -293 -466 -586 -19 -75 -23 -115 -23 -268 0 -157 3 -191 23 -268 51 -192 129 -333 245 -444 158 -150 297 -174 386 -67 50 61 64 127 59 268 -4 105 -10 135 -41 227 -20 59 -63 160 -96 225 -74 148 -97 206 -123 314 -27 111 -29 295 -4 390 19 69 67 173 93 203 9 9 14 19 12 21 -2 2 -31 -5 -65 -15z" />
                                        <path style={{ fill: "rgb(151, 46, 46)" }} className="color-bottom-icon-loader" d="M755 1705 c-68 -37 -107 -99 -137 -218 -43 -171 -9 -368 101 -587 83 -165 127 -280 151 -400 38 -184 18 -346 -56 -455 l-25 -37 28 6 c67 16 177 80 244 143 192 182 289 450 276 768 -13 335 -157 618 -382 754 -69 42 -151 52 -200 26z" />
                                    </g>
                                </svg>
                            </div>

                        </div>
                    </div>
                    <div className="section-contacts-content-mensajeria">
                        <div className="div-lista-items-panel">
                            <div className="div-item-main-content-panel div-tittle-main-content-panel">
                                <div>
                                    <h4>Lista de {modePanel == "mensajes" ? "Mensaje" : modePanel == "contactos" ? "Contactos" : ""}</h4>
                                </div>
                            </div>
                            <div className="div-content-list-items-panel" key={keyDivPanel}>

                                {modePanel ? modePanel == "mensajes" ?

                                    <div ref={divListChatsAvticosRef}>
                                        {chatsActivos ? chatsActivos.find_error ?
                                            <div>
                                                {chatsActivos.find_error}
                                            </div>
                                            : chatsActivos.length > 0 ?
                                                (() => {

                                                    return chatsActivos.map((key, index) => {
                                                        let date = new Date(key.last_message_fecha_creacion ? key.last_message_fecha_creacion : "")

                                                        let hourMessage = "";
                                                        let dayMessage = "";
                                                        if (date != "Invalid Date") {
                                                            let timeHour = "a.m";
                                                            if (date.getHours() == 12 || date.getHours() == 0) {
                                                                timeHour = "p.m"
                                                                hourMessage = 12
                                                            } else if (date.getHours() > 12) {
                                                                hourMessage = date.getHours() - 12
                                                                timeHour = "p.m"
                                                            } else {
                                                                hourMessage = date.getHours()
                                                            }
                                                            hourMessage += " : " + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + " " + timeHour
                                                            dayMessage = getDateModify(date)
                                                        }
                                                        if (!positionChats[key.id]) {
                                                            positionChats[key.id] = {
                                                                "position": index,
                                                                "cantidad_mensajes": key.cantidad_mensajes_estado_0
                                                            }
                                                        }
                                                        return <div onClick={(e) => { obtenerChat(key.vinculos_id, e) }} key={index} className={"div-chat-active div-item-main-content-panel div-content-lista-contacts-items " + (chatId ? chatId == key.id ? "div-content-lista-contacts-items-focus" : "" : "")} >
                                                            <div className="div-item-contact-panel">
                                                                <div className="div-info-user-contact-list">
                                                                    <div>
                                                                        <div className="div-status">
                                                                        </div>
                                                                        <div className="div-item-contact-panel-img-icono">

                                                                            {key.imagen_vinculo ?
                                                                                <img className="item-contact-panel-img-icono" src={"http://localhost:3000/img/usuarios/" + key.vinculos_id + "/iconos/" + key.imagen_vinculo} />
                                                                                :
                                                                                <svg viewBox="0 0 45.532 45.532" xmlSpace="preserve">
                                                                                    <g>
                                                                                        <path d="M22.766,0.001C10.194,0.001,0,10.193,0,22.766s10.193,22.765,22.766,22.765c12.574,0,22.766-10.192,22.766-22.765   S35.34,0.001,22.766,0.001z M22.766,6.808c4.16,0,7.531,3.372,7.531,7.53c0,4.159-3.371,7.53-7.531,7.53   c-4.158,0-7.529-3.371-7.529-7.53C15.237,10.18,18.608,6.808,22.766,6.808z M22.761,39.579c-4.149,0-7.949-1.511-10.88-4.012   c-0.714-0.609-1.126-1.502-1.126-2.439c0-4.217,3.413-7.592,7.631-7.592h8.762c4.219,0,7.619,3.375,7.619,7.592   c0,0.938-0.41,1.829-1.125,2.438C30.712,38.068,26.911,39.579,22.761,39.579z" />
                                                                                    </g>
                                                                                </svg>
                                                                            }

                                                                        </div>
                                                                    </div>
                                                                    <div className="info-text-contact-panel">
                                                                        <div className="div-info-name-contact">
                                                                            <h4>{key.vinculo_nickName ? key.vinculo_nickName : key.telefono_vinculo}</h4>
                                                                        </div>
                                                                        <div className="div-info-last-message-concact-panel">
                                                                            <h3 className="div-info-last-message-contact">{key.last_message ? key.last_message.substring(0, 15) + (key.last_message.length > 15 ? "..." : "") : ""}</h3>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className={"div-info-contact-panel div-info-contacto-date-count"}>
                                                                    <div className="div-info-time-message-new">
                                                                        <h3>{dayMessage}</h3>
                                                                        <h3>{hourMessage}</h3>
                                                                    </div>
                                                                    {key.cantidad_mensajes_estado_0 > 0 ?
                                                                        <div className="div-count-message-new">
                                                                            <h4 id={"mesaggesCount_" + key.id}>{key.cantidad_mensajes_estado_0}</h4>
                                                                        </div> : ""
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    })
                                                })()
                                                :

                                                "No tiene lista de chats activos." :
                                            "No hay nada para ver."}
                                    </div>
                                    : modePanel == "contactos" ?
                                        <div className={vinculosAgregados.find_error ? "div-contacts-empty" : ""}>

                                            {vinculosAgregados ? vinculosAgregados.length > 0 ?
                                                vinculosAgregados.map((value, index) => {
                                                    return <div onClick={(e) => {
                                                        if (value.id_usuario_vinculo) {
                                                            obtenerChat(value.id_usuario_vinculo, e)
                                                        }
                                                    }} key={index} className="div-item-main-content-panel div-content-lista-contacts-items">
                                                        <div className="div-item-contact-panel">
                                                            <div className="div-info-user-contact-list">
                                                                <div className="div-item-contact-panel-img-icono">
                                                                    <div className="div-status">

                                                                    </div>
                                                                    {value.id_usuario_vinculo && value.img_vinculo ?
                                                                        <img className="item-contact-panel-img-icono" src={"http://localhost:3000/img/usuarios/" + value.id_usuario_vinculo + "/iconos/" + value.img_vinculo + ""} />
                                                                        :
                                                                        <svg viewBox="0 0 45.532 45.532" xmlSpace="preserve">
                                                                            <g>
                                                                                <path d="M22.766,0.001C10.194,0.001,0,10.193,0,22.766s10.193,22.765,22.766,22.765c12.574,0,22.766-10.192,22.766-22.765   S35.34,0.001,22.766,0.001z M22.766,6.808c4.16,0,7.531,3.372,7.531,7.53c0,4.159-3.371,7.53-7.531,7.53   c-4.158,0-7.529-3.371-7.529-7.53C15.237,10.18,18.608,6.808,22.766,6.808z M22.761,39.579c-4.149,0-7.949-1.511-10.88-4.012   c-0.714-0.609-1.126-1.502-1.126-2.439c0-4.217,3.413-7.592,7.631-7.592h8.762c4.219,0,7.619,3.375,7.619,7.592   c0,0.938-0.41,1.829-1.125,2.438C30.712,38.068,26.911,39.579,22.761,39.579z" />
                                                                            </g>
                                                                        </svg>
                                                                    }
                                                                </div>
                                                                <div className="info-text-contact-panel">
                                                                    <div className="div-info-name-contact">
                                                                        <h4>{value.vinculo_nickName ? value.vinculo_nickName : ""}</h4>
                                                                    </div>
                                                                    <div className="div-info-last-message-concact-panel">
                                                                        {/* <h3 className="div-info-last-message-contact">Holaaaaaaaaaaaaaa</h3> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                })
                                                : vinculosAgregados.find_error ?
                                                    <div >
                                                        {vinculosAgregados.find_error}
                                                    </div> : "No hay nada para mostrar." : ""}
                                        </div>
                                        : "" : ""}
                            </div>
                        </div>
                    </div>
                    {messagesChat ? messagesChat.length == 0 ?
                        <div className="text-chat-vacio">
                            <h4>
                                Inicia una nueva conversación, tu privacidad es nuestra prioridad.
                            </h4>
                        </div>
                        :
                        <div className="content-messages">
                            <div className="content-text-message">
                                {typeof messagesChat == "object" ? messagesChat.find_error ?
                                    <div>
                                        <img className="img-fondo-chat-text" src="/public/img/fondoChatLight.png" alt="" />
                                        <div className="text-chat-vacio">
                                            <h4>
                                                {messagesChat.find_error}
                                            </h4>
                                        </div>
                                    </div>
                                    : messagesChat.length > 0 ?
                                        <div key={keyDivMessages}>
                                            <img className="img-fondo-chat-text" src="/public/img/fondoChatLight.png" alt="" />
                                            <div className="content-messages-send">
                                                <div onScroll={() => {
                                                    setLastStateItemsChat(prevState => {
                                                        const cloneLastStateItemsChat = { ...prevState }
                                                        if (!cloneLastStateItemsChat[chatId]) {
                                                            cloneLastStateItemsChat[chatId] = {}
                                                        }
                                                        cloneLastStateItemsChat[chatId]["scroll"] = divChatRef.current.scrollTop
                                                        return cloneLastStateItemsChat
                                                    })
                                                }} ref={divChatRef}>
                                                    {(() => {
                                                        let count = 0
                                                        let dateGroup = ""
                                                        let statusMessage = 0

                                                        return messagesChat.slice().reverse().map((value, index) => {
                                                            /*    return messagesChat.map((value, index) => { */
                                                            count = count + 1

                                                            statusMessage = value.estado_mensaje
                                                            /* if (value.last_count_mensajes != 0) {
                                                                if (messagesChat.length - count == value.last_count_mensajes) {
                                                                    console.log(value.last_status_mensajes, statusMessage, "laaaaaaaaaaaaaaaaaaaaaast", value.last_count_mensajes, messagesChat.length, count)
                                                                    if (value.last_status_mensajes == 1) {
                                                                        statusMessage = 1
                                                                    } else if (value.last_status_mensajes == 2) {
                                                                        statusMessage = 2
                                                                    }
                                                                }
                                                            } */
                                                            const dataPush = []
                                                            let messagePropietario = ""
                                                            let date = new Date(value.fecha_creacion ? value.fecha_creacion : "")
                                                            if (value.message_propietario) {
                                                                if (value.message_propietario == "i") {
                                                                    messagePropietario = "i"
                                                                } else if (value.message_propietario == "you") {
                                                                    messagePropietario = "you"
                                                                }
                                                            }
                                                            let hourMessage = "00:00";
                                                            let timeHour = "a.m";
                                                            if (date.getHours() == 12 || date.getHours() == 0) {
                                                                hourMessage = 12
                                                                timeHour = "p.m"
                                                            } else if (date.getHours() > 12) {
                                                                hourMessage = date.getHours() - 12
                                                                timeHour = "p.m"
                                                            } else {
                                                                hourMessage = date.getHours()
                                                                timeHour = "a.m"
                                                            }
                                                            hourMessage += ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + " " + timeHour

                                                            let dateGroupMessages = getDateModify(date)

                                                            if (dateGroupMessages != dateGroup) {
                                                                dateGroup = dateGroupMessages
                                                                dataPush.push(
                                                                    <div key={index + messagesChat.length} className="div-date-group-messages">
                                                                        <h4 className="h4-date-message">{dateGroupMessages}</h4>
                                                                    </div>
                                                                )
                                                            }

                                                            if (messagePropietario == "you") {
                                                                dataPush.push(
                                                                    <div key={index} className="content-message-send message-send-you">
                                                                        <div>
                                                                            <div className="message-content message-content-send-you">
                                                                                <div className="div-content-description-message">
                                                                                    <h4>{value.descripcion}</h4>
                                                                                    <h4 className="h4-hour-description">{hourMessage}</h4>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            } else if (messagePropietario == "i") {
                                                                dataPush.push(<div key={index} className="content-message-send message-send-i">
                                                                    <div>
                                                                        <div className="message-content message-content-send-i">
                                                                            <div className="div-content-description-message">
                                                                                <h4>{value.descripcion}</h4>
                                                                                <h4 className="h4-hour-description">{hourMessage}</h4>
                                                                            </div>
                                                                            <div className="div-info-message">
                                                                                {statusMessage == 1 ?
                                                                                    <div className="div-icon-confirm-message div-icon-confirm-message-send">
                                                                                        <svg className={"icon-check-normal"} viewBox="0 0 468.000000 459.000000" preserveAspectRatio="xMidYMid meet">
                                                                                            <g transform="translate(0.000000,459.000000) scale(0.100000,-0.100000)" >
                                                                                                <path d="M4085 4507 c-68 -18 -146 -61 -187 -106 -19 -20 -102 -119 -183 -221 -82 -102 -176 -219 -210 -260 -33 -41 -236 -291 -450 -555 -214 -264 -430 -530 -479 -591 -50 -61 -272 -334 -494 -608 -222 -273 -407 -496 -412 -496 -14 0 -68 72 -285 385 -324 467 -342 488 -477 556 -112 56 -253 74 -380 48 -193 -40 -374 -214 -429 -414 -22 -81 -18 -227 9 -313 29 -94 42 -114 311 -497 123 -176 363 -519 534 -763 170 -243 329 -463 353 -488 27 -28 74 -59 122 -82 73 -35 82 -37 177 -37 94 0 104 2 175 36 78 38 148 99 198 172 60 90 397 572 1447 2072 601 858 1101 1578 1112 1600 53 104 54 234 1 347 -76 166 -275 260 -453 215z" />
                                                                                            </g>
                                                                                        </svg>
                                                                                    </div>
                                                                                    :
                                                                                    <div className="div-icon-confirm-message">

                                                                                        <svg className={"icon-check-normal " + (statusMessage == 0 ? "icon-check-active" : "icon-check-confirm-message-received")} viewBox="0 0 468.000000 459.000000" preserveAspectRatio="xMidYMid meet">
                                                                                            <g transform="translate(0.000000,459.000000) scale(0.100000,-0.100000)" >
                                                                                                <path d="M4085 4507 c-68 -18 -146 -61 -187 -106 -19 -20 -102 -119 -183 -221 -82 -102 -176 -219 -210 -260 -33 -41 -236 -291 -450 -555 -214 -264 -430 -530 -479 -591 -50 -61 -272 -334 -494 -608 -222 -273 -407 -496 -412 -496 -14 0 -68 72 -285 385 -324 467 -342 488 -477 556 -112 56 -253 74 -380 48 -193 -40 -374 -214 -429 -414 -22 -81 -18 -227 9 -313 29 -94 42 -114 311 -497 123 -176 363 -519 534 -763 170 -243 329 -463 353 -488 27 -28 74 -59 122 -82 73 -35 82 -37 177 -37 94 0 104 2 175 36 78 38 148 99 198 172 60 90 397 572 1447 2072 601 858 1101 1578 1112 1600 53 104 54 234 1 347 -76 166 -275 260 -453 215z" />
                                                                                            </g>
                                                                                        </svg>
                                                                                        <svg className={"icon-check-normal " + (statusMessage == 0 ? "icon-check-active" : "icon-check-confirm-message-received")} viewBox="0 0 468.000000 459.000000" preserveAspectRatio="xMidYMid meet">
                                                                                            <g transform="translate(0.000000,459.000000) scale(0.100000,-0.100000)" >
                                                                                                <path d="M4085 4507 c-68 -18 -146 -61 -187 -106 -19 -20 -102 -119 -183 -221 -82 -102 -176 -219 -210 -260 -33 -41 -236 -291 -450 -555 -214 -264 -430 -530 -479 -591 -50 -61 -272 -334 -494 -608 -222 -273 -407 -496 -412 -496 -14 0 -68 72 -285 385 -324 467 -342 488 -477 556 -112 56 -253 74 -380 48 -193 -40 -374 -214 -429 -414 -22 -81 -18 -227 9 -313 29 -94 42 -114 311 -497 123 -176 363 -519 534 -763 170 -243 329 -463 353 -488 27 -28 74 -59 122 -82 73 -35 82 -37 177 -37 94 0 104 2 175 36 78 38 148 99 198 172 60 90 397 572 1447 2072 601 858 1101 1578 1112 1600 53 104 54 234 1 347 -76 166 -275 260 -453 215z" />
                                                                                            </g>
                                                                                        </svg>
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                )
                                                            }
                                                            return dataPush
                                                        })
                                                    })()}

                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div className="text-chat-vacio">
                                            <h4>
                                                Inicia una nueva conversación, tu privacidad es nuestra prioridad.
                                            </h4>
                                        </div>
                                    :
                                    <div className="text-chat-vacio">
                                        <h4>
                                            Error Interno
                                        </h4>
                                    </div>}
                                {messagesChat ?
                                    <div>

                                    </div>
                                    : <div className="text-chat-vacio">
                                        <h4>
                                            Inicia una nueva conversación, tu privacidad es nuestra prioridad.
                                        </h4>
                                    </div>}


                            </div>
                            <div className="footer-content-message">
                                <div className="div-foter-send-message">
                                    <div className="div-load-message">
                                        <div className="div-icons-load-message">
                                            <div className="div-icon-footer-send-message">
                                                <svg viewBox="0 0 330.591 330.591">
                                                    <g>
                                                        <g>
                                                            <path d="M52.575,320.395c-0.693,0-1.391-0.015-2.09-0.043c-12.979-0.54-25.361-6.071-34.865-15.576    c-9.504-9.504-15.035-21.886-15.576-34.864c-0.549-13.213,4.115-25.456,13.133-34.475L221.581,27.033    c11.523-11.523,27.197-17.483,44.096-16.78c16.676,0.693,32.594,7.81,44.822,20.037c12.228,12.229,19.346,28.147,20.037,44.823    c0.703,16.911-5.256,32.571-16.781,44.096L156.711,276.255c-2.928,2.927-7.676,2.928-10.607,0c-2.928-2.93-2.928-7.678,0-10.608    l157.045-157.047c8.523-8.522,12.928-20.194,12.4-32.865c-0.537-12.906-6.098-25.279-15.658-34.84    c-9.559-9.56-21.932-15.119-34.838-15.656c-12.67-0.533-24.344,3.876-32.865,12.399L23.784,246.044    c-12.596,12.594-11.498,34.184,2.443,48.125c6.836,6.837,15.672,10.813,24.881,11.195c8.975,0.349,17.229-2.734,23.244-8.752    l169.441-169.439c7.422-7.422,6.691-20.229-1.629-28.549c-4.113-4.114-9.414-6.505-14.924-6.733    c-5.289-0.212-10.115,1.595-13.625,5.106L95.536,215.08c-2.93,2.927-7.678,2.928-10.607,0c-2.93-2.93-2.93-7.678,0-10.607    L203.008,86.39c6.512-6.512,15.322-9.9,24.855-9.486c9.281,0.385,18.127,4.332,24.906,11.114    c14.17,14.167,14.9,36.49,1.631,49.762L84.959,307.22C76.418,315.76,64.985,320.395,52.575,320.395z" />
                                                        </g>
                                                    </g>
                                                </svg>
                                            </div>
                                            <div className="div-icon-footer-send-message">
                                                <svg className="icon-footer-modal" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 122.88 122.88" xmlSpace="preserve"><g><path d="M61.44,0L61.44,0l0,0.01c16.97,0,32.33,6.87,43.44,17.98c11.11,11.11,17.98,26.47,17.98,43.44l0.01,0v0.01h-0.01 c0,16.97-6.87,32.33-17.98,43.44c-11.11,11.11-26.47,17.98-43.44,17.98v0.01l-0.01,0v-0.01c-16.97,0-32.33-6.87-43.44-17.98 C6.89,93.77,0.02,78.41,0.02,61.44H0v-0.01h0.02C0.02,44.47,6.89,29.11,18,18C29.11,6.89,44.47,0.02,61.44,0.01L61.44,0L61.44,0 L61.44,0z M87.77,77.33c-15.86,13.2-33.31,14.03-52.67,0C44.64,103.03,80.48,102.63,87.77,77.33L87.77,77.33z M52.95,38.32 c0.71,0.17,1.29,0.53,1.77,1.02c2.57-1.44,5.08-2.09,7.52-2.04c2.14,0.05,4.17,0.62,6.11,1.67c1.26-1.25,3.38-1.64,6.94-1.57 c5.83,0.12,12.87-0.12,17.22,0.91c0.55,0.13,1.02,0.37,1.42,0.7l8.58,2.08l-6.19,4.93c0.05,0.8,0.06,1.58,0.06,2.31 c0,8.24-6.68,14.34-14.91,14.34c-8.24,0-14.91-6.1-14.91-14.34c0-1.74,0.03-3.21,0.14-4.47c-1.48-0.96-3-1.49-4.55-1.52 c-1.72-0.04-3.57,0.52-5.56,1.76c0.2,1.42,0.24,2.92,0.24,4.23c0,8.24-6.68,14.34-14.91,14.34c-8.24,0-14.91-6.1-14.91-14.34 c0-0.94,0.01-1.8,0.03-2.6l-6.66-5.23l8.92-1.97c1.3-0.92,3.31-1.21,6.43-1.14C41.56,37.52,48.6,37.28,52.95,38.32L52.95,38.32z M61.44,7.83v0.02h-0.01L61.44,7.83c-14.79,0-28.19,6.01-37.9,15.71C13.84,33.25,7.83,46.65,7.83,61.43l0.01,0v0.01H7.83 c0,14.79,6.01,28.19,15.71,37.89c9.71,9.71,23.11,15.72,37.89,15.72v-0.02l0.01,0v0.02c14.79,0,28.19-6.01,37.89-15.71 c9.71-9.71,15.71-23.11,15.71-37.9l-0.01,0v-0.01h0.02c0-14.78-6.01-28.18-15.71-37.89C89.63,13.83,76.23,7.83,61.44,7.83 L61.44,7.83L61.44,7.83z" /></g></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <input onInput={(e) => {
                                            const cloneLastStateItemsChat = { ...lastStateItemsChat }
                                            if (!cloneLastStateItemsChat[chatId]) {
                                                cloneLastStateItemsChat[chatId] = {}
                                            }
                                            cloneLastStateItemsChat[chatId]["input"] = e.target.value
                                            setLastStateItemsChat(cloneLastStateItemsChat)
                                        }} ref={sendMessageRef} id="sendMessage" className="input-send-message" type="text" placeholder="Escribe aquí tu mensaje." />
                                    </div>
                                    <div>
                                        <div className="div-icons-load-message">
                                            <div className="div-icon-footer-send-message">
                                                <svg className="icon-footer-modal" viewBox="0 0 1024 1024" >
                                                    <path d="M842 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 140.3-113.7 254-254 254S258 594.3 258 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 168.7 126.6 307.9 290 327.6V884H326.7c-13.7 0-24.7 14.3-24.7 32v36c0 4.4 2.8 8 6.2 8h407.6c3.4 0 6.2-3.6 6.2-8v-36c0-17.7-11-32-24.7-32H548V782.1c165.3-18 294-158 294-328.1zM512 624c93.9 0 170-75.2 170-168V232c0-92.8-76.1-168-170-168s-170 75.2-170 168v224c0 92.8 76.1 168 170 168zm-94-392c0-50.6 41.9-92 94-92s94 41.4 94 92v224c0 50.6-41.9 92-94 92s-94-41.4-94-92V232z" />
                                                </svg>
                                            </div>
                                            <div onClick={() => {
                                                enviarMessage()
                                            }} className="div-icon-footer-send-message">

                                                <svg viewBox="0 0 28 28" version="1.1">
                                                    <g troke="none" strokeWidth="1" fillRule="evenodd">
                                                        <g id="ic_fluent_send_28_filled" fillRule="nonzero">
                                                            <path d="M3.78963301,2.77233335 L24.8609339,12.8499121 C25.4837277,13.1477699 25.7471402,13.8941055 25.4492823,14.5168992 C25.326107,14.7744476 25.1184823,14.9820723 24.8609339,15.1052476 L3.78963301,25.1828263 C3.16683929,25.4806842 2.42050372,25.2172716 2.12264586,24.5944779 C1.99321184,24.3238431 1.96542524,24.015685 2.04435886,23.7262618 L4.15190935,15.9983421 C4.204709,15.8047375 4.36814355,15.6614577 4.56699265,15.634447 L14.7775879,14.2474874 C14.8655834,14.2349166 14.938494,14.177091 14.9721837,14.0981464 L14.9897199,14.0353553 C15.0064567,13.9181981 14.9390703,13.8084248 14.8334007,13.7671556 L14.7775879,13.7525126 L4.57894108,12.3655968 C4.38011873,12.3385589 4.21671819,12.1952832 4.16392965,12.0016992 L2.04435886,4.22889788 C1.8627142,3.56286745 2.25538645,2.87569101 2.92141688,2.69404635 C3.21084015,2.61511273 3.51899823,2.64289932 3.78963301,2.77233335 Z" id="🎨-Color">

                                                            </path>
                                                        </g>
                                                    </g>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : <div className="text-chat-vacio">
                            <h4>
                                Inicia una nueva conversación, tu privacidad es nuestra prioridad.
                            </h4>
                        </div>}

                </div>
                {statusModal ?
                    <GlobalModal statusModal={setStatusModal} content={
                        <div>
                            <div action="" className="form-agregar-usuario">
                                <h3>Agregar Contacto</h3>
                                <div className="div-content-form-inputs">
                                    <div>
                                        <h4 className="h4-tittle-section-agregate-usuario">¿Cómo deseas agregarlo?</h4>
                                        < GlobalInputs
                                            input={setValueGlobalInput}
                                            value={valueGlobalInput}
                                            errors={errrosInputGlobal}
                                            /* errors={errorsInputGlobal}
                                            elementEdit={value.catador_id} */
                                            data={{
                                                ["nickname"]: {
                                                    type: "normal",
                                                    upper_case: true,
                                                    referencia: "Nick Name",
                                                    placeholder: "Ingresa su nick name."
                                                },
                                            }} />
                                    </div>
                                    <div>
                                        <h4 className="h4-tittle-section-agregate-usuario">¡Búscalo(a) por su correo o número de teléfono.!</h4>
                                        < GlobalInputs
                                            input={setValueGlobalInput}
                                            value={valueGlobalInput}
                                            errors={errrosInputGlobal}
                                            /* elementEdit={value.catador_id} */
                                            data={{
                                                ["referencia"]: {
                                                    type: "normal",
                                                    placeholder: "Ingrese el campo para buscar usuario.",
                                                    upper_case: true,
                                                    referencia: "Correo o Teléfono"
                                                },
                                            }} />
                                    </div>
                                </div>
                                <div className="div-button-agregar-usuario">
                                    <button onClick={() => { agregarVinculo() }} className="button-agregar-usuario">Agregar</button>
                                </div>
                            </div>
                        </div>
                    } />
                    : ""}
            </div>

        </div >
    )

}