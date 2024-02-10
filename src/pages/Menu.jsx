import React, { useEffect, useRef, useState } from "react"
import { Link, Outlet, json, useLocation } from "react-router-dom"

import Api from '../componentes/Api.jsx';
import { validateViews } from "../componentes/ValidateViews.jsx";


export const Menu = () => {
    const [pageLoad, setPageLoad] = useState({});
    const [queryMenu, setQueryMenu] = useState(document.body.scrollWidth <= 610 ? true : false)
    let responseValidate = validateViews();

    let haburguerMode = queryMenu ? 1 : 0;
    const [user, setUser] = useState({});
    const [asignaciones, setAsignaciones] = useState([]);
    const [modalNotificaciones, changeModalNotificaciones] = useState(false);
    const [modalPerfil, changeModalPerfil] = useState(false);
    const [liSelected, changeSelected] = useState(location.pathname);

    if (!localStorage.getItem("darkMode")) {
        localStorage.setItem("darkMode", false)
    }
    const [valueDarkMode, changeDarkMode] = useState(JSON.parse(localStorage.getItem("darkMode")));

    function selectedLi(location) {
        changeSelected(location)
    }

    async function getAgignaciones() {

        try {
            const response = await Api.get("/analisis/buscarAsignaciones");
            if (response.data.status == true) {
                setAsignaciones(response.data.data)
            }
        } catch (e) {
            
        }
    }
    function stateMenu() {
        let linkMenu = document.querySelectorAll(".change-hamburguer-quit");
        let hamburguerCentered = document.querySelectorAll(".hamburguer-centered");
        let navHorizontal = document.getElementById("navHorizontal");
        if (queryMenu) {
            let height = document.querySelectorAll(".nav-vertical")

            navHorizontal.style.height = "calc(100% - " + height[0].clientHeight + "px - 50px)";
            navHorizontal.style.bottom = "0";
            navHorizontal.style.width = "100%";

            for (let x = 0; x < linkMenu.length; x++) {
                linkMenu[x].style.opacity = "1"
                linkMenu[x].style.fontSize = ""
                setTimeout(() => {
                    linkMenu[x].style.display = "block"
                }, 100)

            }
            for (let x = 0; x < hamburguerCentered.length; x++) {

                hamburguerCentered[x].style.display = ""
                hamburguerCentered[x].style.justifyContent = ""

            }
        } else {
            navHorizontal.style.height = "";
            navHorizontal.style.left = "0%";

        }
        if (haburguerMode == 0) {
            if (queryMenu) {
                navHorizontal.style.left = "0%";
            } else {
                for (let x = 0; x < linkMenu.length; x++) {

                    linkMenu[x].style.transition = "all  0.3s"
                    linkMenu[x].style.opacity = "0"
                    linkMenu[x].style.fontSize = "10px"
                    setTimeout(() => {
                        linkMenu[x].style.display = "none"

                    }, 100)

                }
                for (let x = 0; x < hamburguerCentered.length; x++) {
                    setTimeout(() => {
                        hamburguerCentered[x].style.display = "flex"
                        hamburguerCentered[x].style.justifyContent = "center"
                    }, 100)

                }
                navHorizontal.style.width = "75px";
            }

            haburguerMode = 1;
        } else {
            if (queryMenu) {
                navHorizontal.style.left = "-100%";
            } else {
                for (let x = 0; x < linkMenu.length; x++) {
                    navHorizontal.style.width = "";
                    linkMenu[x].style.transition = "all  0.3s"
                    linkMenu[x].style.opacity = "1"
                    linkMenu[x].style.fontSize = ""
                    setTimeout(() => {
                        linkMenu[x].style.display = "block"
                    }, 100)

                }
                for (let x = 0; x < hamburguerCentered.length; x++) {
                    setTimeout(() => {
                        hamburguerCentered[x].style.display = ""
                        hamburguerCentered[x].style.justifyContent = ""
                    }, 100)
                }
            }
            haburguerMode = 0;

        }
    }

    useEffect(() => {
        let ulContentLi = document.getElementById("ulContentLi")
        setTimeout(() => {
            resizeMenuToOverFlowUl()
        }, 100);
        function resizeMenuToOverFlowUl() {
            if (ulContentLi.scrollHeight > ulContentLi.clientHeight) {
                divHeaderNav.style.width = "calc(100% - 10px)"
                footerNav.style.width = "calc(100% - 10px)"
            } else {
                divHeaderNav.style.width = ""
                footerNav.style.width = ""
            }
        }
        getAgignaciones();
        async function getUser() {
            try {
                const response = await Api.get("/usuarios/perfil");
                if (response.data.status == true) {
                    setUser(response.data.data)
                }

            } catch (e) {
              
            }
        }
        getUser();

        window.addEventListener("resize", function () {


            resizeMenuToOverFlowUl()
        })
        stateMenu()
        let iconHamburguer = document.getElementById("iconHamburguer")

        iconHamburguer.addEventListener("click", function () {
            stateMenu();
        })
    }, [responseValidate])
    useEffect(() => {
        let iconHamburguer = document.getElementById("iconHamburguer")

        window.addEventListener("resize", function () {
            if (document.body.scrollWidth <= 610) {
                    if(!queryMenu){
                        setQueryMenu(true)
                    }

            } else {
                if(queryMenu){
                    setQueryMenu(false)
                }
                    
            }

        })
        if (iconHamburguer) {
            iconHamburguer.addEventListener("click", function () {
                stateMenu();
            })

            stateMenu()

        }

    }, [queryMenu])

    function darkMode() {
        changeDarkMode(!valueDarkMode)
        localStorage.setItem("darkMode", !valueDarkMode)
    }
    async function obtenerNotificaciones() {
        try {
            const response = await Api.put("/analisis/cambiarEstado");
            getAgignaciones()
        } catch (e) {
           
        }

    }
    function verNotificaciones() {
        changeModalPerfil(false)
        changeModalNotificaciones(!modalNotificaciones)
    }
    function verOpcionesPerfil() {
        changeModalPerfil(!modalPerfil)
        changeModalNotificaciones(false)
    }

    // Cerrar sesión
    async function LogoutSesion() {
        // alert('?xd')
        // const navigate = useNavigate();
        try {
            const response = await Api.post("/auth/close");
            location.href = '/Login'

        } catch (e) {
            location.href = '/Login'
      
        }

    };

    pageLoad[location.pathname] = false

    return (

        <div className="main-content">

            <link rel="stylesheet" href="../../public/css/menu.css" />
            <link rel="stylesheet" href="../../public/css/loader.css" />


            <nav id="navHorizontal" className="nav-main nav-horizontal" style={{ backgroundColor: !valueDarkMode ? "green" : "" }}>
                <div className="div-img-nav">
               <img className="logo-menu" src="/img/logoENCC.png" alt="" />
                    
                    <img className="img-nav" src="/img/fondoMenuVertical2.webp" alt="" />
                </div>
                <div id="divHeaderNav" className="div-header-nav">
                    {!queryMenu ? <div className="header-nav hamburguer-centered">
                        <img className="img-logo-nav change-hamburguer-quit" src="../../public/img/logo-coffee-sensory.png" alt="" />

                        <h2 className="title-header-nav-horizontal change-hamburguer-quit">Dashboard</h2>
                        <svg id="iconHamburguer" className="icon-hamburguer-li-nav-horizontal icon-li-nav-horizontal" version="1.0" viewBox="0 0 1024.000000 1024.000000" preserveAspectRatio="xMidYMid meet">

                            <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" stroke="none">
                                <path d="M1105 8301 c-222 -64 -392 -238 -449 -458 -21 -80 -21 -246 0 -327 43 -167 168 -325 320 -404 153 -79 -244 -72 4144 -72 4388 0 3991 -7 4144 72 109 57 207 155 263 263 55 107 73 181 73 305 0 124 -18 198 -73 305 -56 108 -154 206 -262 262 -156 80 262 73 -4151 72 -3726 0 -3952 -1 -4009 -18z" />
                                <path d="M1105 5741 c-222 -64 -392 -238 -449 -458 -21 -80 -21 -246 0 -327 43 -167 168 -325 320 -404 153 -79 -244 -72 4144 -72 4388 0 3991 -7 4144 72 109 57 207 155 263 263 55 107 73 181 73 305 0 124 -18 198 -73 305 -56 108 -154 206 -262 262 -156 80 262 73 -4151 72 -3726 0 -3952 -1 -4009 -18z" />
                                <path d="M1105 3181 c-222 -64 -392 -238 -449 -458 -21 -80 -21 -246 0 -327 43 -167 168 -325 320 -404 153 -79 -244 -72 4144 -72 4388 0 3991 -7 4144 72 109 57 207 155 263 263 55 107 73 181 73 305 0 124 -18 198 -73 305 -56 108 -154 206 -262 262 -156 80 262 73 -4151 72 -3726 0 -3952 -1 -4009 -18z" />
                            </g>
                        </svg>
                    </div> : ""}
                </div>
                <ul id="ulContentLi">
                    <li className="hamburguer-centered line-nav-li">
                        <h4 className="title-li change-hamburguer-quit">Principal</h4>
                        <ul>
                            <Link to={"/dashboard"} onClick={() => { selectedLi("/dashboard") }} className={`link-memu-horizontal  ${liSelected == "/dashboard" ? "selected-li" : ""}`}>
                                <li className="hamburguer-centered"><svg className="icon-li-nav-horizontal" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 256 256"  >
                                    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                    <g><g><g><path d="M119.1,22c-42.9,3.2-80.9,29.7-98.7,69c-4.6,10.1-7.7,20.7-9.5,32.8c-1.1,7.1-1.1,24.9,0,32.1c4.3,28.4,16.6,51.8,37.6,71.3c3.9,3.6,8.5,7.2,8.8,7c0.1-0.1,0.8-2.9,1.6-6.2c3.6-14.5,6.2-22.3,8.2-24.4c2.3-2.4,14.4-5.9,29.1-8.5c9.5-1.6,9.5-1.6,9.5-2.3c0-0.3,1-1.5,2.2-2.7l2.2-2.1l0-6.1c0-3.3-0.1-7-0.1-8.1l0-2l-3.1-1.4c-4.7-2.2-10.5-6.3-11.8-8.3c-3.2-4.9-6.6-13.4-8.7-22c-0.8-3.1-1.4-6.1-1.4-6.7c0-0.6-0.9-2.1-2.1-3.5c-4.3-5-5.1-12.5-2.2-18.6l1.5-3V95.7c0-9.5,0.2-13.4,0.7-15.6c3.2-13.4,14.9-23.2,34.5-28.7c8.2-2.3,12.7-2.3,20.9,0c18.1,5.1,29.5,14,33.8,26.3c1,2.8,1.1,3.8,1.2,16.8c0.1,13.8,0.1,13.8,1.3,15.5c3.8,5.7,3,15.5-1.8,20.4c-1.3,1.3-1.6,2.3-2.5,6.9c-1.4,6.9-3.8,14.1-6.7,20c-3.2,6.5-5.1,8.3-13.9,12.8l-3.9,2l-0.1,7.9l-0.1,7.8l2.3,2.3c1.3,1.3,2.3,2.5,2.3,2.9c0,0.3,0.7,0.7,1.5,0.8c24.5,4.2,35,7.2,37.8,10.7c1.2,1.5,4.6,11.9,7.1,21.9c1.1,4.4,2.1,8,2.3,8c0.8,0,9.6-7.9,14.4-12.8c36.7-37.9,43.4-96.5,16.3-141.9c-12.6-21.1-31.1-37.6-53.6-47.7C158.9,24.3,137.9,20.6,119.1,22z" /></g></g></g>
                                </svg> <h5 className="change-hamburguer-quit ">Inicio</h5>
                                </li>
                            </Link>
                            <Link to={"/"}>
                                <li className="hamburguer-centered"><img className="icon-li-nav-horizontal" src="/img/iconMapColombia.png" alt="" />
                                    <h5 className="change-hamburguer-quit ">Mapa</h5>
                                </li>
                            </Link>
                        </ul>
                    </li>
                    <li className="hamburguer-centered">
                        <h4 className="title-li change-hamburguer-quit">Registros</h4>
                        <ul>

                            {responseValidate && responseValidate.data.user.rol == 'administrador' && (
                                <Link to={"/dashboard/usuarios/registros"} onClick={() => { selectedLi("/dashboard/usuarios/registros") }} className={`link-memu-horizontal  ${liSelected == "/dashboard/usuarios/registros" ? "selected-li" : ""}`}>
                                    <li className="hamburguer-centered"><svg className="icon-li-nav-horizontal" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 256 256"  >
                                        <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                        <g><g><g><path d="M119.1,22c-42.9,3.2-80.9,29.7-98.7,69c-4.6,10.1-7.7,20.7-9.5,32.8c-1.1,7.1-1.1,24.9,0,32.1c4.3,28.4,16.6,51.8,37.6,71.3c3.9,3.6,8.5,7.2,8.8,7c0.1-0.1,0.8-2.9,1.6-6.2c3.6-14.5,6.2-22.3,8.2-24.4c2.3-2.4,14.4-5.9,29.1-8.5c9.5-1.6,9.5-1.6,9.5-2.3c0-0.3,1-1.5,2.2-2.7l2.2-2.1l0-6.1c0-3.3-0.1-7-0.1-8.1l0-2l-3.1-1.4c-4.7-2.2-10.5-6.3-11.8-8.3c-3.2-4.9-6.6-13.4-8.7-22c-0.8-3.1-1.4-6.1-1.4-6.7c0-0.6-0.9-2.1-2.1-3.5c-4.3-5-5.1-12.5-2.2-18.6l1.5-3V95.7c0-9.5,0.2-13.4,0.7-15.6c3.2-13.4,14.9-23.2,34.5-28.7c8.2-2.3,12.7-2.3,20.9,0c18.1,5.1,29.5,14,33.8,26.3c1,2.8,1.1,3.8,1.2,16.8c0.1,13.8,0.1,13.8,1.3,15.5c3.8,5.7,3,15.5-1.8,20.4c-1.3,1.3-1.6,2.3-2.5,6.9c-1.4,6.9-3.8,14.1-6.7,20c-3.2,6.5-5.1,8.3-13.9,12.8l-3.9,2l-0.1,7.9l-0.1,7.8l2.3,2.3c1.3,1.3,2.3,2.5,2.3,2.9c0,0.3,0.7,0.7,1.5,0.8c24.5,4.2,35,7.2,37.8,10.7c1.2,1.5,4.6,11.9,7.1,21.9c1.1,4.4,2.1,8,2.3,8c0.8,0,9.6-7.9,14.4-12.8c36.7-37.9,43.4-96.5,16.3-141.9c-12.6-21.1-31.1-37.6-53.6-47.7C158.9,24.3,137.9,20.6,119.1,22z" /></g></g></g>
                                    </svg> <h5 className="change-hamburguer-quit ">Usuarios</h5>
                                    </li>
                                </Link>
                            )}
                            <Link to={"/dashboard/municipios/registros"} onClick={() => { selectedLi("/dashboard/municipios/registros") }} className={`link-memu-horizontal  ${liSelected == "/dashboard/municipios/registros" ? "selected-li" : ""}`}>
                                <li className="hamburguer-centered"><svg className="icon-li-nav-horizontal" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 256 256"  >
                                    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                    <g><g><g><path d="M119.1,22c-42.9,3.2-80.9,29.7-98.7,69c-4.6,10.1-7.7,20.7-9.5,32.8c-1.1,7.1-1.1,24.9,0,32.1c4.3,28.4,16.6,51.8,37.6,71.3c3.9,3.6,8.5,7.2,8.8,7c0.1-0.1,0.8-2.9,1.6-6.2c3.6-14.5,6.2-22.3,8.2-24.4c2.3-2.4,14.4-5.9,29.1-8.5c9.5-1.6,9.5-1.6,9.5-2.3c0-0.3,1-1.5,2.2-2.7l2.2-2.1l0-6.1c0-3.3-0.1-7-0.1-8.1l0-2l-3.1-1.4c-4.7-2.2-10.5-6.3-11.8-8.3c-3.2-4.9-6.6-13.4-8.7-22c-0.8-3.1-1.4-6.1-1.4-6.7c0-0.6-0.9-2.1-2.1-3.5c-4.3-5-5.1-12.5-2.2-18.6l1.5-3V95.7c0-9.5,0.2-13.4,0.7-15.6c3.2-13.4,14.9-23.2,34.5-28.7c8.2-2.3,12.7-2.3,20.9,0c18.1,5.1,29.5,14,33.8,26.3c1,2.8,1.1,3.8,1.2,16.8c0.1,13.8,0.1,13.8,1.3,15.5c3.8,5.7,3,15.5-1.8,20.4c-1.3,1.3-1.6,2.3-2.5,6.9c-1.4,6.9-3.8,14.1-6.7,20c-3.2,6.5-5.1,8.3-13.9,12.8l-3.9,2l-0.1,7.9l-0.1,7.8l2.3,2.3c1.3,1.3,2.3,2.5,2.3,2.9c0,0.3,0.7,0.7,1.5,0.8c24.5,4.2,35,7.2,37.8,10.7c1.2,1.5,4.6,11.9,7.1,21.9c1.1,4.4,2.1,8,2.3,8c0.8,0,9.6-7.9,14.4-12.8c36.7-37.9,43.4-96.5,16.3-141.9c-12.6-21.1-31.1-37.6-53.6-47.7C158.9,24.3,137.9,20.6,119.1,22z" /></g></g></g>
                                </svg> <h5 className="change-hamburguer-quit ">Municipios</h5>
                                </li>
                            </Link>

                            <li className="hamburguer-centered">
                                <svg className="icon-li-nav-horizontal" version="1.1" x="0px" y="0px" viewBox="0 0 256 256"  >
                                    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                    <g><g><path d="M235,24.8H21.1C15,24.8,10,29.7,10,35.8v184.4c0,6.1,5,11.1,11.1,11.1h213.9c6.1,0,11.1-5,11.1-11.1V35.8C246,29.7,241.1,24.8,235,24.8z M98.5,35.8c6.1,0,11.1,5,11.1,11.1c0,6.1-5,11.1-11.1,11.1c-6.1,0-11.1-5-11.1-11.1C87.5,40.8,92.4,35.8,98.5,35.8z M65.3,35.8c6.1,0,11.1,5,11.1,11.1c0,6.1-5,11.1-11.1,11.1c-6.1,0-11.1-5-11.1-11.1C54.3,40.8,59.2,35.8,65.3,35.8z M32.1,35.8c6.1,0,11.1,5,11.1,11.1c0,6.1-5,11.1-11.1,11.1c-6.1,0-11.1-5-11.1-11.1C21.1,40.8,26,35.8,32.1,35.8z M235,220.2H21.1V69h11.1h191.8h11.1L235,220.2L235,220.2z" /><path d="M43.7,103h16.9v16.9H43.7V103L43.7,103z" /><path d="M77.5,103h134.5v16.9H77.5V103L77.5,103z" /><path d="M43.7,136.8h16.9v16.9H43.7V136.8L43.7,136.8z" /><path d="M77.5,136.8h134.5v16.9H77.5V136.8L77.5,136.8z" /><path d="M43.7,169.9h16.9v16.9H43.7V169.9L43.7,169.9z" /><path d="M77.5,169.9h134.5v16.9H77.5V169.9L77.5,169.9z" /></g></g>
                                </svg>
                                <Link onClick={() => { selectedLi("formatoSca") }} className={`link-memu-horizontal change-hamburguer-quit change-hamburguer-quit ${liSelected == "formatoSca" ? "selected-li" : ""}`}> Formato SCA</Link>
                            </li>
                            <Link to={"/dashboard/muestras/verRegistros"} onClick={() => { selectedLi("/dashboard/muestras/verRegistros") }} className={`link-memu-horizontal  ${liSelected == "/dashboard/muestras/verRegistros" ? "selected-li" : ""}`}>
                                <li className="hamburguer-centered">
                                    <svg className="icon-li-nav-horizontal" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                        <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                        <g><g><g><path fill="#ffffff" data-title="Layer 0" xs="0" d="M27.1,10.4c-8.5,1.2-15.5,8.5-16.7,17.4c-0.3,1.9-0.4,35.9-0.3,85.5l0.1,82.3l1,2.6c2.5,6,6.6,10.1,12.3,12.1l3.1,1.1h37.1h37.1v-9.9v-9.9H65.3H29.8v-20.3v-20.3h35.5h35.5V141V131H65.3H29.8v-20.3V90.4h80.9h80.9v5.2v5.2h9.9h9.9V63.9c0-35.6,0-37-0.9-39.9c-2.2-7.1-8.4-12.3-16.1-13.5C190.8,9.8,31.1,9.8,27.1,10.4z M191.6,50.1v20.3h-80.9H29.8V50.1V29.8h80.9h80.9V50.1z" /><path fill="#ffffff" data-title="Layer 1" xs="1" d="M40.2,50.1v9.9h25.1h25.1v-9.9v-9.9H65.3H40.2V50.1z" /><path fill="#ffffff" data-title="Layer 2" xs="2" d="M138.2,40.9c-7.3,2.3-9.2,12-3.4,16.9c6.2,5.2,16.1,0.7,16.1-7.3C150.9,43.7,144.6,38.9,138.2,40.9z" /><path fill="#ffffff" data-title="Layer 3" xs="3" d="M168.7,40.9c-7.5,2-9.6,12-3.7,17c6.2,5.2,16.1,0.7,16.1-7.3C181.2,43.7,175.3,39.1,168.7,40.9z" /><path fill="#ffffff" data-title="Layer 4" xs="4" d="M40.2,110.7v9.9h25.1h25.1v-9.9v-9.9H65.3H40.2V110.7z" /><path fill="#ffffff" data-title="Layer 5" xs="5" d="M164.4,121.6c-11.1,1.8-20.7,6.6-28.5,14.4c-27.1,27.1-15.1,73,21.7,83.7c12,3.5,24.4,2.3,36-3.5l5.7-2.8l16.3,16.3L232,246l7-7l7-7l-16.3-16.3l-16.3-16.3l2.8-5.7c3.1-6.3,4.5-11,5.2-17.7c2.5-24.2-13.8-47.3-37.7-53.3C178.4,121.4,169.2,120.9,164.4,121.6z M178.5,141.9c6,1.5,9.5,3.5,14.1,8c3.4,3.3,4.4,4.7,6,8c2.5,5.3,3.2,8.2,3.1,13.7c0,8.3-2.8,15-8.9,21.1c-7.3,7.3-16.7,10.4-26.6,8.6c-14-2.5-24.2-14.1-25-28.2C140,152.7,158.9,136.9,178.5,141.9z" /><path fill="#ffffff" data-title="Layer 6" xs="6" d="M40.2,171.3v9.9h25.1h25.1v-9.9v-9.9H65.3H40.2V171.3z" /></g></g></g>
                                    </svg>
                                    <h5 className="change-hamburguer-quit ">Ver Registros</h5>
                                </li>
                            </Link>

                            <Link to={"/dashboard/fincas/registros"} onClick={() => { selectedLi("/dashboard/fincas/registros") }} className={`link-memu-horizontal  ${liSelected == "/dashboard/fincas/registros" ? "selected-li" : ""}`}>
                                <li className="hamburguer-centered">
                                    <svg className="icon-li-nav-horizontal" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enableBackground="new 0 0 256 256" >
                                        <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                        <g><g><path d="M240.3,123.1c-0.9-0.4-1.8-0.6-2.7-0.6c-0.8-1.2-2-2-3.4-2.1c-2.3-0.3-4.4,1.3-5.3,3.7c-0.3-0.2-0.6-0.4-0.9-0.6c-2.7-1.4-5.6-0.5-7.3,1.9c-0.3-0.3-0.7-0.5-1.1-0.7c-1.4-0.7-2.8-0.7-4.1-0.2c-0.2-1.2-0.9-2.3-2-2.8c-1.6-0.8-3.4,0-3.9,2c-0.1,0.3-0.1,0.7-0.2,1.1c-1.3-0.3-2.6,0.1-3.6,0.9c-0.6-1.2-1.8-1.9-3.1-1.9c-2,0-3.6,1.8-3.6,4c0,0.4,0.1,0.9,0.2,1.3c15.9,1.6,31.3,3.8,46,6.6l0,0C247.1,130.4,244.8,124.9,240.3,123.1z M53.5,124.1c-0.6,0.3-1.1,0.7-1.6,1.3c-1-0.9-2.3-1.3-3.6-1.1c0-0.4,0-0.7-0.1-1.1c-0.6-2-2.3-3-3.9-2.1c-1,0.5-1.8,1.6-2,2.9c-1.3-0.6-2.7-0.6-4.1,0.1c-0.4,0.2-0.8,0.4-1.1,0.7c-1.7-2.5-4.6-3.5-7.4-2.2c-1.1,0.5-1.5,0.9-1.8,1.1c-2.6-3.6-7.1-5.1-11.2-3.4c-5.2,2.1-7.9,8.5-6,14.3l0,0c15.5-2.7,31.7-4.9,48.5-6.5c0-0.2-0.1-0.9-0.4-1.7C57.8,124.2,55.6,123.1,53.5,124.1z" /><path d="M171.7,160.9c16.3,1.2,34.1,3,53.4,6c1.7-1.7,3.4-3.6,5.2-5.7c-11.6-1.9-22.7-3.3-33.2-4.3L171.7,160.9z M199.3,150.6c11.3,1.3,23.1,2.9,35.5,5c1.1-1.5,2.2-3.2,3.3-4.9c-13.6-2.4-26.6-4.1-38.8-5.3V150.6z M199.3,139.1c13.2,1.4,27.3,3.4,42,6c0.7-1.3,1.3-2.7,1.9-4c-15.5-2.8-30.2-4.8-43.9-6.2V139.1z M55.7,161v-2.1c-19.4,2.5-27.8,4.6-27.8,4.6S36.4,162.3,55.7,161z M55.7,148.7v-2.1c-25.5,3.1-36.4,5.8-36.4,5.8S30.4,150.7,55.7,148.7z M54.5,136c-28.6,3.3-40.8,6.4-40.8,6.4s11.8-2.1,39.1-4.5L54.5,136z" /><path d="M98.5,81.5c-1.4,0-2.6,1.2-2.6,2.7v7.1l5.1,0.2v-7.1C101.1,82.9,99.9,81.6,98.5,81.5z M138.5,119.4c0-1.9-1.4-3.5-3.1-3.6c-1.7-0.1-3.1,1.4-3.1,3.3v8.6l6.2,0.3L138.5,119.4L138.5,119.4z M123.3,118.8c0-1.9-1.4-3.5-3.1-3.6c-1.7-0.1-3.1,1.4-3.1,3.3v8.6l6.2,0.2L123.3,118.8L123.3,118.8z M153.8,120c0-1.9-1.4-3.5-3.1-3.6c-1.7-0.1-3.1,1.4-3.1,3.3v8.6l6.2,0.3L153.8,120L153.8,120z M71.3,133.2v4l5.1,0.2v-4c0-1.6-1.2-2.9-2.6-3C72.5,130.3,71.3,131.6,71.3,133.2z M73.9,143.4c-1.4-0.1-2.6,1.2-2.6,2.7v5.6l5.1,0.2v-5.6C76.5,144.8,75.3,143.5,73.9,143.4z M179.5,91.8l-56.5-2.3l-0.6,0.7V76.1l2.7-0.4l-20.4-23.8L85.3,77.5l2.7,0.1v23.4c-0.2-1.8-0.3-3.6-0.6-5.3c-0.4-2-1-3.9-1.5-5.9c-0.4-1.8-0.2-3.6-1-5.3c-0.4-0.8-0.8-3.3-2.4-3.2C82,81.6,81,82,80.8,82.6c-0.1,0.2,0.1,0.4,0,0.6c-0.9,1.5-1.4,3.5-1.7,5.2c-0.3,1.6-0.3,3.2-0.6,4.8c-0.3,1.7-0.8,3.3-1.2,5c-0.6,2.3-0.9,4.5-1.1,6.8c-0.1,0.8-0.1,1.6-0.2,2.5c-0.1,0.8-0.5,1.6-0.7,2.4c-0.4,1.3,0,2.6-0.2,3.9c-0.2,1.5-0.7,3-0.9,4.6c-0.1,0.7-0.1,1.4-0.1,2.2l-0.7,0.1l-18,19.1l3.4,0.1v21.4l29.2,1.2l33.2-5.2l42.2,1.7l33.2-5.2v-45.3l4.1-0.7L179.5,91.8z M178.1,115.4l1.9-0.3v9.7l-1.9,0.3V115.4z M168.4,94.4l-16.4,15.7c-1.7-0.1-3.6-0.1-5.6-0.2l12.9-15.8C162.7,94.2,165.8,94.3,168.4,94.4z M159.2,94l-16.4,15.7c-1.8-0.1-3.7-0.1-5.6-0.2l12.9-15.8C153.2,93.8,156.3,93.9,159.2,94z M149.9,93.6l-16.4,15.7c-1.9-0.1-3.8-0.1-5.6-0.2l13-15.8C143.8,93.4,146.9,93.5,149.9,93.6z M140.7,93.3l-16.4,15.7c-2-0.1-3.9-0.1-5.6-0.2l13-15.8C134.2,93,137.3,93.1,140.7,93.3z M111.8,84.3c0-1.5,1.1-2.9,2.5-3.2s2.5,0.8,2.5,2.4v6.9l-5,0.8V84.3z M124.1,92.6c0.5,0,3.3,0.1,7.3,0.3L115,108.6c-2.2-0.1-4.1-0.2-5.5-0.2C114.8,102.7,122.9,93.9,124.1,92.6z M103.8,57.8l2.4,17.5c-2.5-0.1-11.2-0.5-15.2-0.6C93.8,71.1,101,61.5,103.8,57.8z M90.7,77.7l15.5,0.7v29.2l-3.3,3.6l3.3,0.1v4.1l-15.5,2.4V77.7z M78.4,108.9c0.3-6.5,3.9-21.7,3.7-21.8c0.2-0.1,1.2,16.1,0,21.9c-0.3,1.4,0.7,5.7,0.6,10.1l-5.4,0.8C77.8,115.7,78.2,111.5,78.4,108.9z M86.4,159.2c-2.5-0.1-22.7-0.9-24.9-1v-20.9c4.4-4.7,10.8-11.4,12.5-13.2l12.5,14.3L86.4,159.2L86.4,159.2z M82.1,122.3l14.7,14.2l-2.7,0.4L82.1,122.3z M100.4,151.1l-5,0.8V145c0-1.5,1.1-2.9,2.5-3.2c1.4-0.2,2.5,0.8,2.5,2.4V151.1z M102.9,135.5l-12-14.6l14.7,14.2L102.9,135.5z M112,149.3l-5,0.8v-6.8c0-1.5,1.1-2.9,2.5-3.2c1.4-0.2,2.5,0.8,2.5,2.4V149.3z M111.6,134.2l-12-14.6l14.7,14.2L111.6,134.2z M161.7,155.8c-0.5,0-2.9-0.1-6.3-0.3v-11.1c0-2.9-2.1-5.4-4.8-5.5c-2.6-0.1-4.8,2.2-4.8,5.1v11.1c-8-0.3-17.5-0.7-24.8-1v-18.3l2.7-0.4l-14.7-16.8v-7.1l52.7,2.2L161.7,155.8L161.7,155.8z M175.3,125.5l-1.9,0.3v-9.7l1.9-0.3V125.5z M161.2,110.5c-0.4,0-2.5-0.1-5.5-0.2l12.9-15.8c3.4,0.1,5.9,0.2,7.1,0.3C173.4,97.3,162.6,109,161.2,110.5z M181.6,146l-5,0.8v-6.9c0-1.5,1.1-2.9,2.5-3.2c1.4-0.2,2.5,0.8,2.5,2.4V146z M184.7,124l-1.9,0.3v-9.7l1.9-0.3V124z" /><path d="M59,187.3c0.7-0.2,1.3-0.7,1.9-1.2c1.3,1.3,3,1.9,4.6,1.4c2.3-0.7,3.7-3.6,3.3-6.6c1.1,1.4,2.6,2,4.1,1.5c1-0.3,1.8-1.1,2.3-2.1c0.8,0.5,1.6,0.7,2.5,0.4c1.8-0.6,2.9-3,2.3-5.4c0-0.2-0.1-0.4-0.2-0.6c0.8-1.1,1.2-2.7,0.8-4.3c-0.6-2.4-2.6-3.9-4.4-3.3c-0.6,0.2-1.1,0.6-1.5,1.1c-1.1-1-2.4-1.5-3.7-1.1c-0.4,0.1-0.7,0.3-1.1,0.6c-0.8-1.1-2-1.6-3.2-1.2c-1.3,0.4-2.2,1.9-2.2,3.5c-0.6-0.1-1.1,0-1.7,0.2c-0.6,0.2-1.1,0.5-1.5,0.9c-1.4-1.6-3.4-2.4-5.2-1.8c-1.6,0.5-2.8,1.9-3.3,3.8c-1-0.3-2-0.4-3,0c-0.8,0.3-1.5,0.7-2,1.3c-0.8-1-2-1.6-3.3-1.6c-1.7,0-3.1,1-3.9,2.5C46.1,179.7,52.3,183.8,59,187.3C59,187.3,59,187.3,59,187.3z M126.1,190.5c0.7,0,1.4-0.1,2.1-0.4c0.7-0.3,1.3-0.7,1.8-1.3c1.2,1.7,3,2.5,4.6,1.8c1.4-0.6,2.3-2.1,2.5-3.9c0.5,0,1-0.1,1.5-0.3c1.6-0.7,2.7-2.3,3.2-4.2c0.8,0.2,1.6,0.2,2.3-0.1c2.3-0.9,3.4-4.1,2.5-7.1c-0.3-1-0.8-1.8-1.4-2.5c0.6-1.4,0.7-3.1,0.2-4.8c-0.9-3-3.6-4.7-6-3.8c-1.1,0.4-1.9,1.3-2.4,2.5c-1.2-0.7-2.6-0.8-3.9-0.3c-1.9,0.8-3.1,2.8-3.3,5.1c-1.7-3.4-5.1-5.2-8.1-3.9c-2.1,0.9-3.4,3-3.8,5.4c-0.9-0.1-1.9,0-2.8,0.4c-1,0.4-1.8,1.1-2.4,2c-2.1-1.9-4.8-2.5-7.2-1.4c-1.9,0.9-3.3,2.6-3.9,4.8c-1.2-1.7-3.2-2.5-4.8-1.7c-2.1,1-2.9,3.9-1.9,6.6c0.2,0.6,0.5,1.1,0.9,1.5c-2.3-2-5.3-2.7-7.9-1.4c-1.2,0.6-2.2,1.5-2.9,2.6c-2.3-2-5.3-2.6-7.9-1.3c-2.9,1.5-4.5,4.9-4.3,8.7c10.6,4.2,21.9,7.2,33.6,8.9c0.7-1.2,1.1-2.7,1.1-4.4c1.8,1.1,3.9,1.3,5.8,0.5c1.3-0.6,2.2-1.5,3-2.8c1.8,1.3,4,1.8,5.9,0.9C124.4,195.8,125.8,193.3,126.1,190.5z M205.1,179.4c0.7-1.7,0.9-3.9,0.1-6c-1.2-3.5-4.3-5.4-6.8-4.3c-0.8,0.4-1.5,1-2,1.9c-1.7-1.4-3.7-1.9-5.5-1c-0.5,0.2-1,0.6-1.4,1c-1.3-1.4-3.2-2-4.8-1.3c-1.8,0.8-2.7,3.2-2.4,5.6c-0.8,0-1.6,0.2-2.3,0.5c-0.8,0.4-1.4,0.9-2,1.5c-2.3-2.2-5.2-2.9-7.7-1.7c-2.1,1.1-3.5,3.4-3.9,6.2c-1.4-0.3-2.9-0.2-4.3,0.6c-2.1,1.1-3.4,3.2-3.9,5.8c-2-2.3-4.9-3.1-7.2-1.9c-1.4,0.7-2.3,2.1-2.8,3.8c-2.2-1.1-4.6-1.1-6.7,0c-2.8,1.5-4.3,4.9-4.2,8.7c-1.4-0.1-2.8,0.1-4,0.8c-0.7,0.4-1.3,0.9-1.8,1.5c-1.9-2-4.5-2.6-6.5-1.4c-1.5,0.9-2.3,2.5-2.6,4.4c1.9,0.1,3.7,0.1,5.6,0.1c22.2,0,43.7-4.8,62.5-13.5c0-0.4-0.1-0.8-0.2-1.2c0.3,0.3,0.6,0.6,0.9,0.8c5-2.4,9.8-5,14.3-7.9c0-0.9-0.2-1.8-0.5-2.8C205.2,179.6,205.1,179.5,205.1,179.4z" /></g></g>
                                    </svg>
                                    <h5 className="change-hamburguer-quit ">Fincas</h5>
                                </li>
                            </Link>
                            <Link to={"/dashboard/lotes/registros"} onClick={() => { selectedLi("/dashboard/lotes/registros") }} className={`link-memu-horizontal  ${liSelected == "/dashboard/lotes/registros" ? "selected-li" : ""}`}>
                                <li className="hamburguer-centered">
                                    <svg className="icon-li-nav-horizontal" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 256 256"  >
                                        <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                        <g><g><g><path d="M118.3,39.3V49h9.7h9.7v-9.7v-9.7H128h-9.7V39.3z" /><path d="M79.4,49.8l-6.8,6.8l6.8,6.8l6.8,6.8l6.8-6.8l6.8-6.8L93,49.8L86.2,43L79.4,49.8z" /><path d="M163,49.8l-6.8,6.8l6.8,6.8l6.8,6.8l6.8-6.8l6.8-6.8l-6.8-6.8l-6.8-6.8L163,49.8z" /><path d="M123.3,59.6c-9,1.1-17.6,5.5-23.9,12.4c-9.2,9.9-12.6,23.5-9.2,36.4c1.2,4.6,2.6,6.7,5.4,8.4l2.2,1.3H128h30.3l2.1-1.2c4.4-2.5,6.7-8.7,6.7-18.5c0-8.8-2.2-15.7-7.3-22.9C151.6,64.2,137.2,57.9,123.3,59.6z M134.7,79.9c7,2.4,12.3,9.2,13.1,16.5l0.3,2.4h-20h-19.9v-1.3c0-1.8,1.2-6.3,2.4-8.5c1.4-2.7,5.7-6.9,8.5-8.2C124,78.4,129.6,78.1,134.7,79.9z" /><path d="M59.2,98.4v9.7h9.7h9.7v-9.7v-9.7h-9.7h-9.7V98.4z" /><path d="M177.5,98.4v9.7h9.7h9.7v-9.7v-9.7h-9.7h-9.7V98.4z" /><path d="M54.6,129.4c-1.1,0.6-2.5,1.7-3.1,2.4c-0.6,0.8-10.2,19.7-21.4,42C11,212.4,10,214.5,10,216.8c0.1,4.1,2.3,7.4,5.8,8.9c1.5,0.6,13.5,0.7,112.2,0.7c98.7,0,110.7-0.1,112.2-0.7c3.6-1.5,5.8-4.9,5.8-9c0-2.4-1-4.5-20.7-43.9c-19.9-39.7-20.8-41.4-22.7-42.7l-2-1.4l-71.9-0.1l-72-0.1L54.6,129.4z M84.1,148.2c0,0.2-4.9,13.5-11,29.6l-11,29.3H48.9c-7.3,0-13.3-0.1-13.3-0.2c0-0.1,6.6-13.4,14.6-29.6l14.7-29.3h9.6C79.8,147.9,84.1,148,84.1,148.2z M118.3,177.4V207h-17.6c-9.7,0-17.6-0.1-17.6-0.4c0-0.2,4.9-13.5,11-29.6l11-29.2h6.6h6.6V177.4z M161.9,177.1c6.1,16.1,11,29.4,11,29.6c0,0.2-7.9,0.4-17.6,0.4h-17.6v-29.6v-29.6h6.6h6.6L161.9,177.1z M205.8,177.2c8,16.1,14.6,29.4,14.6,29.6c0,0.1-6,0.2-13.3,0.2h-13.3l-11-29.3c-6.1-16-11-29.3-11-29.6c0-0.2,4.3-0.3,9.6-0.3h9.6L205.8,177.2z" /></g></g></g>
                                    </svg>
                                    <h5 className="change-hamburguer-quit ">Lotes</h5>
                                </li>
                            </Link>



                            <Link to={"/dashboard/variedades/registros"} onClick={() => { selectedLi("/dashboard/variedades/registros") }} className={`link-memu-horizontal  ${liSelected == "/dashboard/variedades/registros" ? "selected-li" : ""}`}>
                                <li className="hamburguer-centered"><svg className="icon-li-nav-horizontal" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 256 256"  >
                                    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                    <g><g><path d="M99.6,10.4H29.1C18.6,10.4,10,18.4,10,29v69c0,10.5,8.6,20.2,19.1,20.2h70.6c10.5,0,19.1-9.7,19.1-20.2V29C118.7,18.4,110.1,10.4,99.6,10.4z M99.6,99.1H29.1V29h70.6V99.1z M99.6,137.8H29.1c-10.5,0-19.1,8.6-19.1,19.1v69.6c0,10.5,8.6,19.1,19.1,19.1h70.6c10.5,0,19.1-8.6,19.1-19.1v-69.6C118.7,146.5,110.1,137.8,99.6,137.8z M99.6,226.5H29.1v-70.1h70.6V226.5z M226.9,10.4h-70c-10.5,0-19.6,8.1-19.6,18.6v70.1c0,10.5,9.1,19.1,19.6,19.1h70c10.5,0,19.1-8.6,19.1-19.1V29C246,18.4,237.4,10.4,226.9,10.4z M226.9,99.1h-70V29h70V99.1L226.9,99.1z M224.8,137.8h-68.4c-10.5,0-19.1,8.6-19.1,19.1v69.6c0,10.5,8.6,19.1,19.1,19.1h70.6c10.5,0,19.1-8.6,19.1-19.1v-69.6C246,146.5,235.3,137.8,224.8,137.8z M226.9,226.5h-70V157h70V226.5L226.9,226.5z" /></g></g>
                                </svg> <h5 className="change-hamburguer-quit ">Variedades</h5>
                                </li>
                            </Link>



                            <Link to={"/dashboard/muestras/registros"} onClick={() => { selectedLi("/dashboard/muestras/registros") }} className={`link-memu-horizontal  ${liSelected == "/dashboard/muestras/registros" ? "selected-li" : ""}`}>
                                <li className="hamburguer-centered"><svg className="icon-li-nav-horizontal" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 256 256">
                                    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                    <g><g><g><path d="M121.3,20.2c-17.2,2.5-30.7,16.4-36.1,37.1c-2.1,8-2.8,14.1-2.8,24.4c0,18.2,3.7,32.2,11.4,43.8c2.6,3.9,8.3,9.4,12.4,11.9c5.7,3.5,14.6,6.3,18.8,5.8l1.5-0.1l-1.9-2.8c-2.4-3.5-5.1-9.3-6.6-13.8c-2-6.1-2.7-11.3-2.5-18.9c0.4-9.8,1.8-14.9,8.8-32.3c5.7-14.1,7.2-20.7,7.2-31.3c0-6.9-0.7-12.5-2.4-19.9l-1-4.4l-2.1,0C125,19.8,122.8,19.9,121.3,20.2z" /><path d="M129.4,19.9c0,0.1,1,1.7,2.1,3.6c6.5,10,9.4,20.6,8.8,32.6c-0.4,8.9-2.1,15.3-8.4,30.8c-3.8,9.4-6,16.3-7,22c-1.1,6.5-0.7,18.7,0.9,26.4c1.9,9,1.3,8.1,4.7,8.1c9,0,19-4.4,26.2-11.6c8.4-8.3,13.6-19.9,16-35.7c1.1-7.2,1.1-21.9,0-29.1c-2.3-15.1-7.1-26-15.1-34.5c-5.9-6.3-12.1-9.9-19.8-11.6C134,20,129.4,19.5,129.4,19.9z" /><path d="M46.2,124.8c-7.1,0.8-14.8,4.1-20.8,8.9c-1.9,1.5-3.4,2.9-3.4,3.1c0,0.9,8.5,13,11.8,16.8c7.7,8.8,14.5,13.2,31.4,20.5c14,6,20.8,9.8,27,15.1c8.5,7.4,15.1,18.8,17.4,30.5c0.3,1.6,0.8,2.9,1,2.9c0.9,0.1,5-5.5,6.9-9.6c4.9-9.9,5.3-21.5,1.3-33.5c-6-18.1-24.3-38.4-43.2-48.2C65.3,125.9,55.6,123.8,46.2,124.8z" /><path d="M200.5,124.8c-12.3,1.3-25.5,7.9-38.3,19.2c-9.2,8.1-16.7,17.7-21.7,27.8c-4.4,8.8-5.6,13.3-5.9,22c-0.3,8.2,0.6,12.7,3.8,19.2c2.1,4.3,6.1,9.8,6.9,9.5c0.3-0.1,0.7-1.5,1.1-3.2c2-10.1,7.6-20.6,15-27.8c6.4-6.4,13.9-10.8,29.8-17.6c16.6-7.1,23.4-11.5,31.1-20.3c3.2-3.7,11.8-15.8,11.8-16.7c0-0.2-1-1.2-2.2-2.2c-7.1-5.9-14-8.9-22.6-9.9c-2.3-0.2-4.5-0.4-4.9-0.4C204.1,124.4,202.2,124.6,200.5,124.8z" /><path d="M19.2,139.9c-7.5,8.5-10.7,20.5-8.6,32.9c3.9,24.2,29.7,52.8,55.1,61c13.4,4.3,25.9,3.1,36.5-3.7c3.4-2.1,7.3-5.6,7.3-6.3c0-0.7-6.6-10.6-9.6-14.3c-3.9-4.8-9.1-9.5-14.1-12.9c-5.3-3.6-8-4.9-20.3-10.1c-5.5-2.3-11.5-5.1-13.4-6.1c-15.9-8.7-25.5-20.7-29.6-37.2c-0.5-2-1-4.1-1.1-4.6C21.3,137.8,20.9,138,19.2,139.9z" /><path d="M234.1,140.7c-1.6,7.9-5.4,16.7-9.8,22.6c-3.3,4.4-9.5,10.2-14.4,13.5c-5,3.2-9.4,5.4-20.8,10.3c-10.5,4.4-13.6,6-18.8,9.5c-5,3.4-10.2,8.1-14.1,12.9c-3.2,4-9.6,13.6-9.6,14.4c0,0.8,2.6,3.1,6.8,5.8c10.9,7.3,23.4,8.6,37.6,3.9c21.7-7.2,45-30.5,52.5-52.6c3.6-10.5,3.6-20.9,0-30.2c-1.5-3.8-5.1-9.7-7.3-11.7l-1.3-1.3L234.1,140.7z" /></g></g></g>
                                </svg> <h5 className="change-hamburguer-quit ">Muestras</h5>
                                </li>
                            </Link>
                            <Link to={"/dashboard/cafes/registros"} onClick={() => { selectedLi("/dashboard/cafes/registros") }} className={`link-memu-horizontal  ${liSelected == "/dashboard/cafes/registros" ? "selected-li" : ""}`}>
                                <li className="hamburguer-centered"><svg className="icon-li-nav-horizontal" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 256 256">
                                    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                    <g><g><g><path d="M121.3,20.2c-17.2,2.5-30.7,16.4-36.1,37.1c-2.1,8-2.8,14.1-2.8,24.4c0,18.2,3.7,32.2,11.4,43.8c2.6,3.9,8.3,9.4,12.4,11.9c5.7,3.5,14.6,6.3,18.8,5.8l1.5-0.1l-1.9-2.8c-2.4-3.5-5.1-9.3-6.6-13.8c-2-6.1-2.7-11.3-2.5-18.9c0.4-9.8,1.8-14.9,8.8-32.3c5.7-14.1,7.2-20.7,7.2-31.3c0-6.9-0.7-12.5-2.4-19.9l-1-4.4l-2.1,0C125,19.8,122.8,19.9,121.3,20.2z" /><path d="M129.4,19.9c0,0.1,1,1.7,2.1,3.6c6.5,10,9.4,20.6,8.8,32.6c-0.4,8.9-2.1,15.3-8.4,30.8c-3.8,9.4-6,16.3-7,22c-1.1,6.5-0.7,18.7,0.9,26.4c1.9,9,1.3,8.1,4.7,8.1c9,0,19-4.4,26.2-11.6c8.4-8.3,13.6-19.9,16-35.7c1.1-7.2,1.1-21.9,0-29.1c-2.3-15.1-7.1-26-15.1-34.5c-5.9-6.3-12.1-9.9-19.8-11.6C134,20,129.4,19.5,129.4,19.9z" /><path d="M46.2,124.8c-7.1,0.8-14.8,4.1-20.8,8.9c-1.9,1.5-3.4,2.9-3.4,3.1c0,0.9,8.5,13,11.8,16.8c7.7,8.8,14.5,13.2,31.4,20.5c14,6,20.8,9.8,27,15.1c8.5,7.4,15.1,18.8,17.4,30.5c0.3,1.6,0.8,2.9,1,2.9c0.9,0.1,5-5.5,6.9-9.6c4.9-9.9,5.3-21.5,1.3-33.5c-6-18.1-24.3-38.4-43.2-48.2C65.3,125.9,55.6,123.8,46.2,124.8z" /><path d="M200.5,124.8c-12.3,1.3-25.5,7.9-38.3,19.2c-9.2,8.1-16.7,17.7-21.7,27.8c-4.4,8.8-5.6,13.3-5.9,22c-0.3,8.2,0.6,12.7,3.8,19.2c2.1,4.3,6.1,9.8,6.9,9.5c0.3-0.1,0.7-1.5,1.1-3.2c2-10.1,7.6-20.6,15-27.8c6.4-6.4,13.9-10.8,29.8-17.6c16.6-7.1,23.4-11.5,31.1-20.3c3.2-3.7,11.8-15.8,11.8-16.7c0-0.2-1-1.2-2.2-2.2c-7.1-5.9-14-8.9-22.6-9.9c-2.3-0.2-4.5-0.4-4.9-0.4C204.1,124.4,202.2,124.6,200.5,124.8z" /><path d="M19.2,139.9c-7.5,8.5-10.7,20.5-8.6,32.9c3.9,24.2,29.7,52.8,55.1,61c13.4,4.3,25.9,3.1,36.5-3.7c3.4-2.1,7.3-5.6,7.3-6.3c0-0.7-6.6-10.6-9.6-14.3c-3.9-4.8-9.1-9.5-14.1-12.9c-5.3-3.6-8-4.9-20.3-10.1c-5.5-2.3-11.5-5.1-13.4-6.1c-15.9-8.7-25.5-20.7-29.6-37.2c-0.5-2-1-4.1-1.1-4.6C21.3,137.8,20.9,138,19.2,139.9z" /><path d="M234.1,140.7c-1.6,7.9-5.4,16.7-9.8,22.6c-3.3,4.4-9.5,10.2-14.4,13.5c-5,3.2-9.4,5.4-20.8,10.3c-10.5,4.4-13.6,6-18.8,9.5c-5,3.4-10.2,8.1-14.1,12.9c-3.2,4-9.6,13.6-9.6,14.4c0,0.8,2.6,3.1,6.8,5.8c10.9,7.3,23.4,8.6,37.6,3.9c21.7-7.2,45-30.5,52.5-52.6c3.6-10.5,3.6-20.9,0-30.2c-1.5-3.8-5.1-9.7-7.3-11.7l-1.3-1.3L234.1,140.7z" /></g></g></g>
                                </svg> <h5 className="change-hamburguer-quit ">Cafés</h5>
                                </li>
                            </Link>
                            <Link to={"/dashboard/analisis/registros"} onClick={() => { selectedLi("/dashboard/analisis/registros") }} className={`link-memu-horizontal  ${liSelected == "/dashboard/analisis/registros" ? "selected-li" : ""}`}>
                                <li className="hamburguer-centered"><svg className="icon-li-nav-horizontal" xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 335.000000 291.000000" preserveAspectRatio="xMidYMid meet">
                                    <metadata>
                                        Created by potrace 1.16, written by Peter Selinger 2001-2019
                                    </metadata>
                                    <g transform="translate(0.000000,291.000000) scale(0.100000,-0.100000)" stroke="none">
                                        <path d="M95 2838 c10 -46 41 -94 81 -124 115 -88 287 -21 319 124 6 30 5 32 -22 32 -24 -1 -32 -9 -53 -53 -21 -44 -32 -55 -72 -71 -42 -17 -52 -18 -90 -7 -49 15 -93 58 -101 101 -6 26 -11 30 -38 30 -29 0 -30 -1 -24 -32z" />
                                        <path d="M1570 2853 c1 -64 80 -154 151 -173 98 -27 218 38 244 130 3 14 9 33 12 43 4 15 0 18 -27 15 -27 -2 -34 -9 -45 -40 -15 -45 -34 -64 -81 -84 -74 -31 -172 18 -189 95 -5 26 -11 31 -36 31 -21 0 -29 -5 -29 -17z" />
                                        <path d="M1180 2430 c0 -330 -2 -345 -59 -393 -39 -33 -115 -37 -162 -10 -27 16 -69 84 -69 111 0 7 -13 12 -29 12 -20 0 -30 -6 -34 -20 -3 -11 -17 -25 -31 -31 -20 -10 -30 -9 -51 5 -14 9 -25 23 -25 31 0 10 -10 15 -30 15 -24 0 -30 -4 -30 -22 0 -13 14 -37 30 -55 38 -40 87 -51 131 -29 39 19 39 19 39 3 0 -17 47 -60 87 -81 78 -39 202 -9 246 60 12 19 27 32 32 30 60 -26 83 -28 119 -11 36 17 66 58 66 90 0 24 -56 20 -63 -5 -3 -11 -17 -25 -31 -31 -20 -10 -30 -9 -51 5 l-25 16 0 305 0 305 -30 0 -30 0 0 -300z" />
                                        <path d="M280 1603 c0 -85 20 -226 46 -332 45 -181 124 -342 230 -467 30 -35 54 -65 54 -68 0 -2 -91 -3 -202 -2 l-201 2 33 -25 c19 -14 76 -59 127 -98 l94 -73 573 0 574 0 121 93 c66 50 121 94 121 97 0 3 -89 5 -198 5 l-198 0 52 62 c29 34 61 74 70 90 10 15 19 30 20 32 2 2 24 -7 51 -20 83 -40 225 -22 272 34 10 13 30 17 74 17 60 0 60 0 42 -20 -20 -22 -32 -111 -21 -154 3 -14 20 -42 38 -61 l31 -36 -25 -27 c-39 -41 -48 -66 -48 -125 0 -42 6 -63 26 -93 15 -21 32 -42 38 -46 7 -5 2 -17 -15 -35 -15 -15 -32 -38 -38 -50 -14 -28 -14 -113 0 -150 12 -33 73 -91 104 -99 11 -3 178 -4 371 -2 l349 3 67 27 c242 97 393 301 413 559 16 201 -70 399 -229 527 -98 79 -202 124 -323 142 -56 8 -84 18 -120 43 -56 39 -110 63 -173 77 -59 13 -201 13 -276 0 -65 -12 -254 -68 -268 -80 -4 -5 -31 3 -60 16 -28 13 -64 24 -80 24 -26 0 -28 2 -23 33 3 17 9 76 13 130 l6 97 -756 0 -756 0 0 -47z m1446 -55 c-3 -24 -8 -68 -11 -98 -3 -30 -8 -70 -12 -89 -6 -34 -6 -34 27 -28 18 4 51 2 74 -4 l40 -11 -34 -15 c-19 -8 -56 -21 -81 -29 l-46 -14 -31 -88 c-30 -85 -30 -88 -13 -117 11 -20 34 -36 66 -49 28 -10 70 -27 95 -36 l44 -18 -41 -11 c-57 -15 -127 1 -177 41 -37 30 -40 31 -50 14 -43 -74 -94 -140 -149 -194 l-64 -63 -284 -4 c-364 -5 -365 -5 -426 54 -176 169 -279 412 -308 729 l-7 72 697 0 696 0 -5 -42z m803 -195 c30 -11 56 -24 58 -29 2 -5 -107 -8 -274 -6 -296 4 -306 7 -143 43 110 24 279 21 359 -8z m331 -121 c287 -96 453 -376 396 -663 -24 -115 -66 -196 -149 -285 -54 -58 -86 -83 -151 -114 -124 -62 -200 -72 -534 -68 -309 3 -311 4 -342 71 -23 50 -12 99 29 141 30 30 34 31 136 34 l105 4 0 29 0 29 -104 0 c-97 0 -107 2 -134 25 -33 27 -51 68 -46 101 14 89 55 114 187 114 l97 0 0 30 0 30 -99 0 c-86 0 -102 3 -132 23 -64 43 -69 136 -9 190 29 26 35 27 135 27 l105 0 0 30 0 30 -245 0 c-268 0 -293 4 -334 56 -19 24 -22 38 -18 77 2 27 12 56 23 68 43 49 48 49 549 46 453 -3 472 -4 535 -25z m-1180 -557 c0 -1 -20 -19 -45 -39 l-44 -37 -556 1 -557 0 -43 34 c-25 18 -42 36 -39 39 6 5 1284 8 1284 2z" />
                                        <path d="M1060 1196 c0 -130 4 -236 9 -236 40 0 106 110 117 196 12 100 -32 220 -97 258 l-29 17 0 -235z" />
                                        <path d="M958 1400 c-33 -25 -68 -109 -75 -177 -9 -79 20 -175 67 -224 20 -21 42 -39 48 -39 9 0 12 63 12 230 0 249 -1 251 -52 210z" />
                                    </g>
                                </svg> <h5 className="change-hamburguer-quit ">Análisis</h5>
                                </li>
                            </Link>

                            <li className="hamburguer-centered">
                                <svg className="icon-li-nav-horizontal" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                    <g><g><g><path d="M93.5,10.7c-11.9,2.6-20.9,10.7-24.9,22.4l-1.3,3.8l-0.1,74L67.1,185H38.5H10v4c0,15.2,8.8,27.6,23.1,32.5l3.8,1.3l62,0.1l62,0.1l1.7,2.5c2.7,4,10.4,11.3,14.6,13.7c13.9,8.1,29,8.7,42.8,1.8c5-2.5,7.4-4.1,11.5-8c17.9-17,19.2-43.6,3.1-62.5c-3.1-3.7-8.6-8.1-12.4-10.2l-2.8-1.5v-19.3v-19.2h3.8h3.8v-3.8v-3.8h-19h-19V80.4V48.1h28.6H246l-0.3-5.6c-0.4-9.5-3.3-16.3-9.7-22.6c-3.9-3.9-7.9-6.5-13.3-8.3l-3.8-1.3l-61.3-0.1C108,10.1,95.8,10.2,93.5,10.7z M190.2,20.4c-3.3,3.6-5.8,7.8-7.5,12.7l-1.3,3.8l-0.1,37.9l-0.1,37.9h-3.8h-3.8v3.8v3.8h3.8h3.8v19.3v19.3L179,160c-1.3,0.7-3,1.7-3.8,2.2l-1.6,1v-2.4v-2.4h-45.7H82.3v3.8v3.8H126h43.7l-3.2,3.8c-8.9,10.4-13.1,22.9-11.7,35.1c0.3,2.6,1,6,1.5,7.6l0.9,2.9h-2c-8.5,0-17.3-5.7-21-13.4c-2-4.2-2.6-7.2-2.6-12.8V185h-28.5H74.7v-72.9c0-62.5,0.1-73.3,0.7-75.8c2.1-8.9,8.9-15.8,17.7-17.9c2.2-0.6,11.6-0.7,51.2-0.7l48.5,0L190.2,20.4z M218.8,18.1c9.8,1.9,17.6,10.1,19.2,20.3l0.3,2h-24.8c-28.1,0-25.3,0.5-24.1-4.4c2.3-8.7,8.8-15.4,17.5-17.7C210,17.6,215.3,17.4,218.8,18.1z M211.6,142.1v21.8l3.3,1.3c4,1.6,8.4,4.4,11.6,7.4c2.4,2.2,6.6,7.4,6.6,8.2c0,0.2-14,0.4-32.8,0.4c-18.8,0-32.8-0.2-32.8-0.4c0-0.8,4.1-6,6.6-8.2c3.2-3,7.5-5.8,11.6-7.4l3.3-1.3v-21.8v-21.7h11.4h11.4V142.1L211.6,142.1z M193.5,190.8c3.2,10.7,14.7,18.4,25,16.7c7.1-1.2,13.9-6.2,17.1-12.6c1.6-3.2,1.7-3.2,2-1.9c0.7,2.6,0.4,13.9-0.5,17.3c-3.5,13-13.9,23.4-26.9,26.9c-4.3,1.2-15.6,1.2-20,0c-13-3.5-23.4-13.9-26.9-26.9c-1.1-3.9-1.2-15.2-0.3-18.9l0.7-2.5h14.6h14.6L193.5,190.8z M230.2,189.3c0,1.2-2.2,5.1-3.8,6.7c-3.5,3.5-9.9,5.1-15.1,3.9c-4.7-1.2-9.4-5.6-10.4-9.7l-0.3-1.3h14.8C225,188.8,230.2,189,230.2,189.3z M124.1,192.9c0,1.7,1.9,8.3,3,10.9c1.7,3.6,5.2,8.5,7.5,10.5l1.5,1.2H87.7c-41,0-48.9-0.1-51.4-0.7c-9.7-2.3-16.9-10.1-18.4-20.1l-0.3-2h53.3C100.2,192.6,124.1,192.7,124.1,192.9z" /><path d="M158.8,41.1c-0.9,0.3-2.9,1.7-4.3,3.2c-4.4,4.4-5,9.1-1.6,13.6l1.1,1.5l-3.6,6l-3.6,6l-2.2-0.3c-2.6-0.3-5.2,0.4-7.5,2l-1.5,1.1l-4-2l-4.1-2l0.3-1.8c0.5-3.1-0.7-6-3.6-8.9c-5.1-5.1-10.2-5.1-15.3,0c-3.8,3.8-4.7,7.8-2.7,11.8c0.7,1.4,0.6,1.5-4,8.5c-4.5,6.8-4.8,7.1-5.9,6.7c-3.2-1.2-6.8,0-10.1,3.4c-5.1,5-5.1,10.2,0,15.2c5,5.1,10.2,5.1,15.3,0c3.8-3.8,4.7-7.8,2.7-11.9c-0.7-1.3-0.6-1.5,4-8.5l4.7-7.1l1.5,0.5c1.8,0.6,4.5,0.3,6.8-0.9l1.8-0.8l4.5,2.2c3.9,2,4.5,2.4,4.5,3.5c0,5.4,6.1,11.6,11.4,11.6c2.6,0,5-1.2,7.7-3.8c3.9-3.9,4.7-7.6,2.6-12l-0.8-1.6l3.9-6.5c3.6-6,4-6.5,5.3-6.5c5.6,0,11.7-6,11.7-11.4c0-2.6-1.2-5-3.8-7.6C166.3,40.7,163,39.8,158.8,41.1z M165,49c0.6,0.6,1,1.6,1,2.9c0,1.3-0.3,2.2-1,2.9c-0.6,0.6-1.6,1-2.9,1c-1.3,0-2.2-0.3-2.9-1c-0.6-0.6-1-1.6-1-2.9c0-1.3,0.3-2.2,1-2.9c0.6-0.6,1.6-1,2.9-1C163.5,48.1,164.4,48.4,165,49z M119.4,64.2c0.6,0.6,1,1.6,1,2.9c0,2.5-1.3,3.8-3.8,3.8s-3.8-1.3-3.8-3.8c0-1.3,0.3-2.2,1-2.9c0.6-0.6,1.6-1,2.9-1C117.8,63.3,118.8,63.6,119.4,64.2z M146,79.5c0.6,0.6,1,1.6,1,2.9c0,1.3-0.3,2.2-1,2.9c-0.6,0.6-1.6,1-2.9,1c-1.3,0-2.2-0.3-2.9-1c-0.6-0.6-1-1.6-1-2.9c0-1.3,0.3-2.2,1-2.9c0.6-0.6,1.6-1,2.9-1C144.4,78.5,145.4,78.8,146,79.5z M96.5,94.7c0.6,0.6,1,1.6,1,2.9c0,2.5-1.3,3.8-3.8,3.8c-2.5,0-3.8-1.3-3.8-3.8c0-1.3,0.3-2.2,1-2.9c0.6-0.6,1.6-1,2.9-1C95,93.7,95.9,94.1,96.5,94.7z" /><path d="M82.3,124.2v3.8h45.6h45.6v-3.8v-3.8h-45.6H82.3V124.2z" /><path d="M82.3,143.2v3.8h45.6h45.6v-3.8v-3.8h-45.6H82.3V143.2z" /><path d="M185.7,208.5c-4.5,1.7-8.3,6.6-8.3,10.7c0,5.3,6.1,11.5,11.4,11.5c5.2,0,11.4-6.2,11.4-11.4c0-2.6-1.2-5-3.8-7.6C192.9,208.1,189.4,207.1,185.7,208.5z M191.6,216.4c0.6,0.6,1,1.6,1,2.9c0,2.5-1.3,3.8-3.8,3.8s-3.8-1.3-3.8-3.8s1.3-3.8,3.8-3.8C190.1,215.5,191,215.8,191.6,216.4z" /></g></g></g>
                                </svg>
                                <Link className="link-memu-horizontal change-hamburguer-quit">  Resultados análisis </Link>
                            </li>
                        </ul>
                    </li>
                </ul>
                <div id="footerNav" className="footer-nav">
                    <ul>

                        <li onClick={darkMode} className=" hamburguer-centered">
                            <div className="content-1-footer-nav-horizontal">
                                <svg className="icon-li-dark-mode-nav-horizontal icon-moon-li-dark-mode-nav-horizontal" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 256 256"  >
                                    {valueDarkMode ? (<g><g><g><path d="M149.1,10.2c-8.3,0.8-20,3.3-27.8,5.8c-40,13-69.8,46.5-79.1,88.8c-2.1,9.8-2.1,36,0,46c8,37.7,31,67.3,65.7,84.2c15.3,7.4,31.9,11,50.8,11c18.5-0.1,33.6-3.4,50-11.1l6.6-3.1l-5.8-1.9c-8.1-2.7-22.3-10.2-29.4-15.4c-40.7-30.2-54.7-85.2-33.5-131.6c6.9-15.1,21.3-32.5,34.8-42c7.5-5.3,20-11.7,28.1-14.4l5.8-1.9l-6.6-3.2c-8.1-3.9-20.2-7.7-29.6-9.4C172,10.5,155,9.6,149.1,10.2z" /></g></g></g>
                                    ) : (<g><g><g><path d="M117.4,29.7v19.7H128h10.6V29.7V10H128h-10.6V29.7z" /><path d="M68.8,25.6c-4.9,2.8-8.8,5.3-8.8,5.7c0,0.3,4.4,8.2,9.7,17.3c9.1,15.6,9.8,16.5,11.9,15.4c1.3-0.7,5.5-3.2,9.5-5.4l7.1-4.3L94.9,49c-1.7-3.1-6.1-10.6-9.7-17c-3.6-6.3-6.9-11.4-7.2-11.4C77.7,20.6,73.6,22.9,68.8,25.6z" /><path d="M170.7,32c-3.6,6.4-8,13.9-9.8,17l-3.2,5.5l9.3,5.3c5.1,3,9.6,5,10,4.6c1.1-1.2,19-32.5,19-33.2c0-0.6-17.2-10.6-18.2-10.6C177.5,20.6,174.3,25.7,170.7,32z" /><path d="M25.5,69c-2.9,5-5,9.3-4.8,9.5c0.8,0.7,32.2,18.8,33.1,19c1.3,0.3,11.5-17.8,10.6-18.6C63.4,77.8,32.1,60,31.4,60C31,60,28.4,64,25.5,69z" /><path d="M207.2,69.6c-9.3,5.4-15.8,10-15.6,10.7c0.2,0.7,2.6,5.1,5.2,9.7l4.8,8.2l3.4-2c1.8-1.2,9.2-5.5,16.6-9.7s13.5-7.8,13.7-8.1c0.7-0.6-10-18.5-11.1-18.4C223.7,60.1,216,64.4,207.2,69.6z" /><path d="M112.2,67.9C91,73.9,73.5,91.6,68,112.7c-1,3.6-1.7,10.6-1.7,15.5c0,26.1,15.8,48.7,40.9,58.3c7.9,3,24.7,4,33.8,2.1c17.1-3.5,33.9-16.7,42-32.7c5.5-11.2,7-18.2,6.4-31.6c-0.6-11.9-3-19.6-9.1-29.2c-7.1-11.5-18.3-20.4-31.6-25.5C140.4,66.3,120.9,65.5,112.2,67.9z" /><path d="M10,128v10.6h19.7h19.7V128v-10.6H29.7H10V128z" /><path d="M206.7,128v10.6h19.7H246V128v-10.6h-19.7h-19.7L206.7,128L206.7,128z" /><path d="M38.7,166.9c-8.5,5-16.1,9.5-16.9,10c-1.3,0.6-0.6,2.6,3.5,9.7c2.9,4.9,5.3,9.1,5.5,9.4c0.4,0.4,32-17.3,33.6-18.9c0.7-0.6-7.4-16.1-9.7-18.4C54.4,158.3,47.2,162,38.7,166.9z" /><path d="M196.1,167c-3,5.1-5,9.6-4.6,10c1.6,1.6,33.2,19.3,33.6,18.9c1.3-1.5,10.4-18.2,10.1-18.5c-0.2-0.2-6.4-3.8-13.7-8s-14.8-8.5-16.7-9.7l-3.3-2L196.1,167z" /><path d="M74.7,198.4c-2.4,4.3-6.8,11.8-9.6,16.6c-2.9,4.9-5.2,9.3-5.2,9.6c0,0.9,18.1,11.3,18.5,10.7c0.2-0.2,3.8-6.4,8.1-13.7c4.1-7.3,8.6-14.8,9.7-16.6l2-3.4l-7.1-4.1C78.1,189.8,79.8,189.7,74.7,198.4z" /><path d="M167.3,195.9c-5,2.9-8.9,5.6-8.8,6.2c0.2,0.8,18.2,32.3,19,33.2c0.2,0.3,16.9-8.8,18.4-10.1c0.4-0.4-17.3-32-18.9-33.6C176.7,191.1,172.2,193.2,167.3,195.9z" /><path d="M117.4,226.3V246H128h10.6v-19.7v-19.7H128h-10.6V226.3z" /></g></g></g>)}

                                </svg>

                            </div>
                            <h4 className="change-hamburguer-quit">Dark Mode</h4>
                            <div className="change-hamburguer-quit toogle-footer-nav-horizontal">
                                <div style={{ marginLeft: !valueDarkMode ? "0%" : "calc(100% - 20px)" }} className="circle-footer-nav-horizontal"></div>
                            </div>
                        </li>

                    </ul>
                </div>
            </nav >
            <nav className="nav-main nav-vertical" style={{ backgroundColor: !valueDarkMode ? "green" : "" }}>
                {queryMenu ? <div className="header-nav hamburguer-centered">

                    <svg id="iconHamburguer" className="icon-hamburguer-li-nav-horizontal icon-li-nav-horizontal" version="1.0" viewBox="0 0 1024.000000 1024.000000" preserveAspectRatio="xMidYMid meet">

                        <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" stroke="none">
                            <path d="M1105 8301 c-222 -64 -392 -238 -449 -458 -21 -80 -21 -246 0 -327 43 -167 168 -325 320 -404 153 -79 -244 -72 4144 -72 4388 0 3991 -7 4144 72 109 57 207 155 263 263 55 107 73 181 73 305 0 124 -18 198 -73 305 -56 108 -154 206 -262 262 -156 80 262 73 -4151 72 -3726 0 -3952 -1 -4009 -18z" />
                            <path d="M1105 5741 c-222 -64 -392 -238 -449 -458 -21 -80 -21 -246 0 -327 43 -167 168 -325 320 -404 153 -79 -244 -72 4144 -72 4388 0 3991 -7 4144 72 109 57 207 155 263 263 55 107 73 181 73 305 0 124 -18 198 -73 305 -56 108 -154 206 -262 262 -156 80 262 73 -4151 72 -3726 0 -3952 -1 -4009 -18z" />
                            <path d="M1105 3181 c-222 -64 -392 -238 -449 -458 -21 -80 -21 -246 0 -327 43 -167 168 -325 320 -404 153 -79 -244 -72 4144 -72 4388 0 3991 -7 4144 72 109 57 207 155 263 263 55 107 73 181 73 305 0 124 -18 198 -73 305 -56 108 -154 206 -262 262 -156 80 262 73 -4151 72 -3726 0 -3952 -1 -4009 -18z" />
                        </g>
                    </svg>
                </div> : ""}
                <div></div>
                <div className="seccion-usuario-notificaciones">
                    {Object.keys(user).length > 0 ? user.rol == "catador" && user.cargo == "instructor" ?
                        <div className="notificaciones">
                            {asignaciones.length > 0 && asignaciones
                                .filter((notificacion) => notificacion.estado === "no_visto")
                                .length > 0 &&
                                <div className="cantidad-notificaciones">
                                    {asignaciones
                                        .filter((notificacion) => notificacion.estado === "no_visto")
                                        .length}
                                </div>
                            }
                            <div className="secccion-notificaciones">
                                <svg onClick={() => { obtenerNotificaciones(); verNotificaciones() }} className="h-6 w-6 icono-notificaciones" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"></path>
                                </svg>
                                <div style={{ display: !modalNotificaciones ? "none" : "" }}>
                                    <div className="esquina-notificaciones"></div>
                                    <div className="contenido-notificaciones">
                                        <div className="header-notificaciones">
                                            <h4 className="titulo-notififcaciones">Lista de análisis por registrar</h4>
                                            <div onClick={verNotificaciones} className="quit-notificaciones">
                                                X
                                            </div>
                                        </div>
                                        <div className="contenido-analisis">
                                            <div className="asignaciones-notificaciones">
                                                {asignaciones.length > 0 ? (

                                                    asignaciones.map((asignacion) => (
                                                        <div key={asignacion.id} className="notificacion-analisis">
                                                            <div className="informacion-analisis">
                                                                <div className="img-analisis">
                                                                    <img className="img-analisis" src="../../img/analisisPrueba.jpg" alt="" />
                                                                </div>
                                                                <h4 className="h4-informacion-notificacion-analisis">Tiene un análisis <span className={`${asignacion.tipo == "asignado" ? "asignado" : "pendiente"}`}>{asignacion.tipo}</span> por realizar</h4>
                                                            </div>
                                                            <button className="input-proceder-analisis">Proceder</button>
                                                        </div>
                                                    ))

                                                ) : <h4 className="h4-notificaciones-vacias">No hay análisis pendientes por realizar</h4>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div> : "" : ""}
                    {Object.keys(user).length > 0 ? (
                        <div className="div-info-usuario">
                            <div className="div-img-perfil-nav">
                                {Object.keys(user).length > 0 ? user.cargo == "administrador" ? <img className='img-perfil-usuario' src="/img/analisisPrueba.jpg" alt="" /> : user.cargo == "instructor" ? <img className='img-perfil-usuario' src="/img/img_instructor.jpg" alt="" /> : user.cargo == "aprendiz" ? <img className='img-perfil-usuario' src="/img/img_aprendiz.jpg" alt="" /> : user.cargo == "cliente" ? <img className='img-perfil-usuario' src="/img/img_client.jpg" alt="" /> : <img className='img-perfil-usuario' src="/img/analisisPrueba.jpg" alt="" />

                                    :
                                    <img className='img-perfil-usuario' src="/img/analisisPrueba.jpg" alt="" />}

                            </div>
                            <div className="info-usuario">
                                <h4 className="nombre-usuario">{Object.keys(user).length > 0 ? (user.nombre.replace(/(?:^|\s)\S/g, match => match.toUpperCase())) : ""}</h4>
                                <h4 className="rol-usuario">{Object.keys(user).length > 0 ? (user.rol.replace(/(?:^|\s)\S/g, match => match.toUpperCase())) : ""}</h4>

                            </div>
                            <div className="div-opciones-usuario">
                                <div className="section-opciones-usuario">
                                    <svg onClick={verOpcionesPerfil} className="icon-opciones-usuario" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 256 256"  >
                                        <g><g><path d="M240.2,64.9c-7.8-7.8-20.3-7.8-28.1,0L128,149.1L43.9,64.9c-7.8-7.8-20.3-7.8-28.1,0c-7.7,7.8-7.7,20.3,0,28.1l98.2,98.2c3.9,3.9,9,5.8,14,5.8c5.1,0,10.2-1.9,14-5.8L240.2,93C247.9,85.2,247.9,72.7,240.2,64.9z" /></g></g>
                                    </svg>
                                    <div style={{ display: !modalPerfil ? "none" : "" }}>
                                        <div className="esquina-opciones-usuario"></div>
                                        <div className="contenido-opciones-usuario">

                                            <div className="opciones-usuario">
                                                <Link to={"/dashboard/profile"} onClick={() => { selectedLi("/dashboard/profile") }} className={`link-memu-horizontal li-opciones-usuario  ${liSelected == "/dashboard/profile" ? "selected-li-perfil" : ""}`}>
                                                    <li className="li-content-usuarios">
                                                        <svg className="icon-li-opciones-usuario" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                                            <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                                            <g><g><g><path d="M39.6,10.3c-4.7,1.2-9.1,4.7-11.3,9.3l-1.3,2.6v105.8v105.8l1.3,2.6c1.6,3.4,4.8,6.5,8.2,8.2l2.6,1.3H128h88.9l2.6-1.3c3.4-1.6,6.5-4.8,8.2-8.2l1.3-2.6V128.1V22.2l-1.3-2.6c-1.6-3.4-4.8-6.5-8.2-8.2l-2.6-1.3L129.1,10C80.7,10,40.5,10.1,39.6,10.3z M212.4,128.1v101.3H128H43.6V128.1V26.7H128h84.4V128.1z" /><path d="M88.1,44.4c-5.5,1.5-10.5,5.1-13.9,10c-3.7,5.5-5,13.8-3,20.4c2.1,7,8.6,13.6,15.5,15.7c14.5,4.4,28.9-4.4,31.4-19.3c1.5-9.3-3.8-20.1-12.1-24.6C100.7,43.7,93.7,42.9,88.1,44.4z" /><path d="M149.9,61.2c-3.5,1.5-5.5,5.6-4.8,9.6c0.5,2.5,3.1,5.4,5.5,6.1c1.3,0.4,8.4,0.5,20.8,0.4c18-0.2,18.9-0.2,20.3-1.3c2.8-2.1,3.6-3.7,3.6-7.1c0-3.3-0.8-5-3.6-7.1c-1.4-1.1-2.2-1.1-20.8-1.2C155.5,60.6,151.2,60.7,149.9,61.2z" /><path d="M74.2,93.2c-7.1,5.7-12,13.1-15,22.7c-1.5,4.6-1.5,6.2,0,9.1c1.6,3.1,0.9,3.1,35,3.1c34.1,0,33.5,0.1,35-3.1c1.5-2.9,1.5-4.5,0-9.1c-2.7-8.5-6.4-14.6-12.5-20.4c-5.9-5.5-5.6-5.5-8.4-1.6C99,107,89.5,107,80.1,93.9c-1.3-1.8-2.4-3.3-2.5-3.3C77.5,90.6,76,91.7,74.2,93.2z" /><path d="M149.9,95c-3.5,1.5-5.5,5.6-4.8,9.6c0.5,2.5,3.1,5.4,5.5,6.1c1.3,0.4,8.4,0.5,20.8,0.4c18-0.2,18.9-0.2,20.3-1.3c2.8-2.1,3.6-3.7,3.6-7.1c0-3.3-0.8-5-3.6-7.1c-1.4-1.1-2.2-1.1-20.8-1.2C155.5,94.3,151.2,94.4,149.9,95z" /><path d="M65.5,145.7c-3.5,1.5-5.5,5.6-4.8,9.6c0.5,2.5,3.1,5.4,5.5,6.1c1.3,0.4,21.2,0.5,63,0.4c60.7-0.2,61.1-0.2,62.5-1.3c2.8-2.1,3.6-3.7,3.6-7.1c0-3.3-0.8-5-3.6-7.1c-1.4-1.1-1.7-1.1-63-1.2C78.2,145,66.7,145.1,65.5,145.7z" /><path d="M65.5,179.5c-3.5,1.5-5.5,5.6-4.8,9.6c0.5,2.5,3.1,5.4,5.5,6.1c1.3,0.4,21.2,0.5,63,0.4c60.7-0.2,61.1-0.2,62.5-1.3c2.8-2.1,3.6-3.7,3.6-7.1s-0.8-5-3.6-7.1c-1.4-1.1-1.7-1.1-63-1.2C78.2,178.8,66.7,178.9,65.5,179.5z" /></g></g></g>
                                                        </svg>
                                                        <h5 className="link-opciones-usuarios">Perfil</h5>
                                                    </li>
                                                </Link>

                                                <li className="li-opciones-usuario">
                                                    <svg className="icon-li-opciones-usuario" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                                                        <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                                        <g><g><path d="M207.1,163.3c5.9-12.6,23.5-6.9,34.7-16.5c5.8-4.9,5.5-25.1,0-30.3c-10.6-10-28.1-6.5-32.8-19.5c-4.7-13.1,11.7-21.5,12.8-36.2c0.6-7.5-13.8-21.7-21.4-21.4c-14.6,0.5-24.5,15.3-37,9.4c-12.6-5.9-7-23.5-16.5-34.6c-4.9-5.8-25.1-5.5-30.2,0c-10,10.6-6.5,28.1-19.5,32.8C84,51.8,75.3,37,60.9,34.3c-7.4-1.4-21.7,13.8-21.4,21.4c0.5,14.6,15.3,24.5,9.4,37c-5.9,12.6-23.5,6.9-34.7,16.5c-5.8,4.9-5.6,25.1,0,30.3c10.6,10,28.1,6.5,32.9,19.5c4.7,13.1-11.7,21.5-12.9,36.1c-0.6,7.6,13.8,21.7,21.4,21.4c14.6-0.5,24.5-15.3,37-9.4c12.6,5.9,6.9,23.5,16.5,34.7c4.9,5.8,25.1,5.5,30.3,0c10-10.7,6.5-28.2,19.5-32.9c13.1-4.7,21.5,11.7,36.1,12.9c7.6,0.6,21.7-13.8,21.4-21.4C216.1,185.7,201.3,175.9,207.1,163.3L207.1,163.3z M128,181.5c-29.6,0-53.5-24-53.5-53.5c0-29.6,24-53.6,53.5-53.6s53.5,24,53.5,53.5C181.5,157.6,157.6,181.5,128,181.5z" /></g></g>
                                                    </svg>
                                                    <Link className="link-opciones-usuarios ">Configuracion</Link>
                                                </li>
                                                <button onClick={() => LogoutSesion()} className="li-opciones-usuario btn-cerrar-sesion">
                                                    <svg className="icon-li-opciones-usuario" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 256 256">
                                                        <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                                        <g><g><path d="M175.3,64V24.2c0-6.4-5.2-11.5-11.5-11.5H21.5c-6.3,0-11.5,5.2-11.5,11.5v163c0,4.2,2.5,8.3,6.1,10.2l87.7,45.4c3.9,1.9,8.5-0.8,8.5-5.2v-44.2h51.5c6.4,0,11.5-5.2,11.5-11.5v-63h-23.1v45.8c0,3.3-2.5,5.8-5.8,5.8h-34V72.4c0-4.2-2.5-8.3-6.2-10.2L54.6,35.7h91.9c3.3,0,5.8,2.5,5.8,5.8v22.7h23.1V64L175.3,64z" /><path d="M204.9,45.1l37.5,37.5c4.8,4.8,4.8,11.9,0,16.7l-37.5,37.5c-4.8,4.8-12.1,5-16.9,0.2c-4.6-4.6-4-12.3,0.4-16.9l16.9-16.7h-65.5c-3.3,0-6.5-1.3-8.6-3.9c-5.4-5.8-4-16,2.9-19.8c1.7-1,3.9-1.5,5.8-1.5h65.5c0,0-16.7-16.7-16.9-16.7c-4.4-4.4-5-12.3-0.4-16.7C192.6,40.1,200.1,40.3,204.9,45.1" /></g></g>
                                                    </svg>
                                                    <div className="link-opciones-usuarios">  Cerrar sesión</div>
                                                </button>

                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    )
                        : ""}
                </div>
            </nav >
            <div id="contenidoComponent" className="contenido">
                <div className="component">
                    <Outlet></Outlet>

                </div>

            </div>

        </div >

    )
}
