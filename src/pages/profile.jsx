import React, { useEffect, useRef, useState } from 'react'
import Api from "../componentes/Api"
import { Menu } from './Menu.jsx'
import { Loader } from '../componentes/loader.jsx'
import { Alert } from '../componentes/alert.jsx'
import { GlobalModal } from '../componentes/globalModal.jsx'
import { host } from '../componentes/Api'

export const Profile = (data) => {
    console.log('data: ', data.userInfo != null ? data.userInfo.rol : '');
    const [user, setUser] = useState({ "nombre": "" });
    const [form, changeForm] = useState(0);
    const [errors, setErrors] = useState({});
    const [countUser, changeCount] = useState(1);
    const heightForm = useRef();
    const [maxHeightForm, changeHeightForm] = useState(0);
    const nombre = useRef();
    const apellido = useRef();
    const telefono = useRef();
    const correo_electronico = useRef();
    const numero_documento = useRef();
    const user_password = useRef();
    const new_password = useRef();
    const confirm_password = useRef();
    const [mensaje, setMensaje] = useState({});
    const [statusAlert, setStatusAlert] = useState(false);
    const [dataAlert, setdataAlert] = useState({});
    const [dni, setDni] = useState('');
    const [imgs, setImgs] = useState([])
    const [modalImg, setModaImgs] = useState(false)
    const [modalImgChange, setModalImgChange] = useState(false)
    const [focusImgChange, setFocusImgChange] = useState({})

    async function fetchUser() {


        try {
            const response = await Api.get("usuarios/perfil");
            changeCount(1)

            if (response.data.status == true) {
                let data = response.data.data
                setUser(response.data.data)
                function getInfoInputs() {
                    if (heightForm.current) {
                        nombre.current.value = data.nombre.replace(/(?:^|\s)\S/g, match => match.toUpperCase());
                        apellido.current.value = data.apellido.replace(/(?:^|\s)\S/g, match => match.toUpperCase());
                        telefono.current.value = data.telefono;
                        correo_electronico.current.value = data.correo_electronico;
                        numero_documento.current.value = data.numero_documento;
                        setDni(data.numero_documento);
                    } else {
                        user_password.current.value = "";
                        new_password.current.value = "";
                        confirm_password.current.value = "";
                    }
                }
                getInfoInputs()
            } else if (response.errors) {

                setMensaje(response.data.errors)
                setUser({})
                changeCount(0)
            } else {

                setMensaje({ "find_error": "Error interno del servidor" })

            }

        } catch (e) {
            setUser({})
            console.error("Error" + e)
            setMensaje({ "find_error": "Error interno del servidor" })
        }
    }

    async function listarIconos() {
        try {
            console.log("listaaaaaaaaaaaa")
            const response = await Api.post("/img/icono/listar");
            if (response.data.status == true) {
                setImgs(response.data.data)
            } else {
                setImgs([])
            }

        } catch (e) {
            console.log("Error: " + e)
        }
    }
    useEffect(() => {
        window.addEventListener("load", function () {
            if (heightForm.current) {
                const height = heightForm.current.scrollHeight

                changeHeightForm(height);
            }
        })
        listarIconos()
        fetchUser();
        console.log(data.userInfo, "ahahha")
    }, [])

    async function fecthUpdateUser() {
        try {
            let data = {
                "nombre": nombre.current.value,
                "apellido": apellido.current.value,
                "telefono": telefono.current.value,
                "correo_electronico": correo_electronico.current.value,
                "numero_documento": numero_documento.current.value
            }

            const response = await Api.put("usuarios/actualizarPerfil", data);
            if (response.data.errors) {
                setErrors(response.data.errors)

            } else if (response.data.status == false) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "false",
                        description: response.data.message,
                        "tittle": "Inténtalo de nuevo.",
                    }
                )
            } else if (response.data.status == true) {
                setStatusAlert(true)
                setdataAlert(
                    {
                        status: "true",
                        description: response.data.message,
                        "tittle": "Excelente",
                        "continue": {
                            "function": fetchUser,
                        }
                    }
                )
                setMensaje(response.data.errors)
                setErrors({})

            }
            else {

            }


        } catch (e) {
            console.error("Error" + e)
        }
    }
    async function fecthUpdatePassword() {
        try {
            let data = {
                "user_password": user_password.current.value,
                "new_password": new_password.current.value,
                "confirm_password": confirm_password.current.value,
                "id": 1
            }
            const response = await Api.post("/auth/updatePassword", data);
            if (response.data.status == false && response.data.errors) {
                setErrors(response.data.errors)
            } else if (response.data.status == true) {
                setErrors({})
                user_password.current.value = "";
                new_password.current.value = "";
                confirm_password.current.value = "";

                setStatusAlert(true);
                setdataAlert({
                    status: "true",
                    description: response.data.message,
                    "tittle": "Contraseña Actualizada Correctamente!",
                });
            }


        } catch (e) {

            console.error("Error" + e)
        }
    }
    function updateForm() {
        setErrors({})
        changeForm(form == 0 ? 1 : 0)
        fetchUser()
    }
    async function updateUser() {
        await fecthUpdateUser()
    }

    async function uploadImg() {
        let value = document.getElementById("imgUpload")


    }
    async function loadImg(e, tipo) {
        try {
            const father = e.target;
            const input = document.createElement("input")
            input.setAttribute("type", "file")
            input.style.display = "none"
            document.body.append(input)
            input.click()
            input.addEventListener("cancel", function () {
                input.remove()
            })
            input.addEventListener("change", async function () {
                let file = ""
                if (input) {
                    if (input.files[0]) {
                        file = input.files[0]
                        const formData = new FormData();
                        formData.append("img", file)
                        formData.forEach((input, key) => {
                            console.log(`${key}: ${input}`);
                        });
                        let route = "cargar"
                        let method = "post"
                        if (tipo == "editar") {
                            route = "actualizar/" + focusImgChange.id
                            method = "put"
                        }
                        const response = await Api[method]("/img/icono/" + route, formData);
                        if (response.data.status == true) {
                            fetchUser()
                            listarIconos();
                            setModalImgChange();
                        } else if (response.data.register_error) {
                            setStatusAlert(true);
                            setdataAlert({
                                status: "false",
                                description: response.data.register_error,
                                "tittle": "Error de validación.",
                            });
                        }
                        console.log(response, "ressssssss")
                    }
                }
                input.remove()
            })
        } catch (e) {
            console.log("Error:" + e)
        }
    }

    async function predeterminarImg(id) {
        try {
            const response = await Api.post("/img/icono/predeterminar/" + id)
            if (response.data.status == true) {
                fetchUser()
                listarIconos()
                setModalImgChange()
            }
            console.log(response, "siuuuuuuu")
        } catch (e) {
            console.log("Error: " + e)
        }
    }
    async function eliminarImg(id) {
        try {
            const response = await Api.delete("/img/icono/eliminar/" + id)
            if (response.data.status == true) {
                fetchUser()
                listarIconos()
                setModalImgChange()
            }
            console.log(response, "siuuuuuuu")
        } catch (e) {
            console.log("Error: " + e)
        }
    }
    async function cambiarImg(id) {

    }
    return (
        <>
            <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />
            <link rel="stylesheet" href="../../public/css/profile.css" />
            <div className="header-profile">
                <img className='img-head-profile' src={!data.valueDarkMode ? "/public/img/imgLightModeProfile.jpg" : "/public/img/imgDarkProfile.jpg"} alt="" />


                <div className="contenido-profile">
                    <div className="info-profile head-info-profile">
                        <div className="div-img-perfil-usuario">
                            <div onClick={() => { setModaImgs(true) }} className='div-ver-iconos'>
                                <h4>Ver</h4>
                            </div>
                            {Object.keys(user).length > 0 ? user.img ? <img className='img-icono' src={"http://" + host + ":3000/img/usuarios/" + (user.id ? user.id : "") + "/iconos/" + (user.img ? user.img : "")} /> : user.cargo == "administrador" ? <img className='img-perfil-usuario' src="../img/analisisPrueba.jpg" alt="" /> : user.cargo == "instructor" ? <img className='img-perfil-usuario' src="../img/img_instructor.jpg" alt="" /> : user.cargo == "aprendiz" ? <img className='img-perfil-usuario' src="../img/img_aprendiz.jpg" alt="" /> : user.cargo == "cliente" ? <img className='img-perfil-usuario' src="../img/img_client.jpg" alt="" /> : <img className='img-perfil-usuario' src="../img/analisisPrueba.jpg" alt="" /> : <img className='img-perfil-usuario' src="../img/analisisPrueba.jpg" alt="" />}
                        </div>
                        <div className="opciones-formulario">
                            <button onClick={updateForm} className='button-opcion-formulario' type='button'>{form == 0 ? "Cambiar Contraseña" : "Actualizar Perfil"}</button>

                        </div>
                        <div className="tex-info-usuario">
                            <h5>{user.nombre ? (user.nombre.replace(/(?:^|\s)\S/g, match => match.toUpperCase()) + " " + user.apellido.replace(/(?:^|\s)\S/g, match => match.toUpperCase())) : mensaje.find_error} </h5>
                            <h5>{user.cargo ? (user.cargo.replace(/(?:^|\s)\S/g, match => match.toUpperCase()) + ", " + user.rol.replace(/(?:^|\s)\S/g, match => match.toUpperCase())) : ""} </h5>
                        </div>
                    </div>
                    {form == 0 ?
                        <div style={{ height: maxHeightForm > 0 ? maxHeightForm : "", display: countUser == 0 ? "unset" : "" }} className='div-form-profile'>
                            <div ref={heightForm} className="form-profile" >
                                {Object.keys(user).length > 0 ?
                                    <form className='form-update' action="" >
                                        <div className='form-update-profile'>
                                            <div className='element-form'>
                                                <label htmlFor="nombre">Nombre</label>
                                                <input id="nombre" ref={nombre} className='input-update-profile' type="text" name="" />
                                                <div className='div-input-error'>
                                                    <h5 className='input-error'>{errors.nombre ? errors.nombre : ""}</h5>
                                                </div>
                                            </div>
                                            <div className='element-form'>
                                                <label htmlFor="apellido">Apellido</label>
                                                <input ref={apellido} className='input-update-profile' type="text" name="" id="apellido" />
                                                <div className='div-input-error'>
                                                    <h5 className='input-error'>{errors.apellido ? errors.apellido : ""}</h5>
                                                </div>
                                            </div>
                                            <div className='element-form'>
                                                <label htmlFor="telefono">Telefono</label>
                                                <input ref={telefono} className='input-update-profile' type="text" name="" id="telefono" />
                                                <div className='div-input-error'>
                                                    <h5 className='input-error'>{errors.telefono ? errors.telefono : ""}</h5>
                                                </div>
                                            </div>
                                            <div className='element-form'>
                                                <label htmlFor="correo_electronico">Correo electronico</label>
                                                <input ref={correo_electronico} className='input-update-profile' type="text" name="" id="correo_electronico" />
                                                <div className='div-input-error'>
                                                    <h5 className='input-error'>{errors.correo_electronico ? errors.correo_electronico : ""}</h5>
                                                </div>
                                            </div>
                                            <div className='element-form'>
                                                <label htmlFor="numero_de_documento">Numero de documento</label>
                                                {data.userInfo != null ?
                                                    (data.userInfo.rol === 'administrador' ?
                                                        <input ref={numero_documento} className='input-update-profile' type="text" name="" id="numero_de_documento" />
                                                        : <div ref={numero_documento}>{dni}</div>)
                                                    : <input ref={numero_documento} className='input-update-profile' type="text" name="" id="numero_de_documento" />
                                                }
                                                <div className='div-input-error'>
                                                    <h5 className='input-error'>{errors.numero_documento ? errors.numero_documento : ""}</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={updateUser} className='button-update-user' type='button'>Guardar</button>
                                    </form>
                                    : mensaje.find_error ? mensaje.find_error : "error interno"}
                            </div>
                        </div>
                        :
                        <div style={{ height: maxHeightForm > 0 ? maxHeightForm : "", display: countUser == 0 ? "unset" : "" }} className='div-form-profile'>
                            <div className="form-profile" >
                                {Object.keys(user).length > 0 ?
                                    <form action="" className='form-update' style={{ height: maxHeightForm > 0 ? maxHeightForm - 40 : "" }}>
                                        <div className='form-update-profile'>
                                            <div className='element-form'>
                                                <label htmlFor="contrasena_actual">Contraseña actual</label>
                                                <input ref={user_password} className='input-update-profile' type="text" name="" id="contrasena_actual" />
                                                <div className='div-input-error'>
                                                    <h5 className='input-error'>{errors.user_password ? errors.user_password : ""}</h5>
                                                </div>
                                            </div>
                                            <div className='element-form'>
                                                <label htmlFor="nueva_contrasena">Nueva contraseña</label>
                                                <input ref={new_password} className='input-update-profile' type="text" name="" id="nueva_contrasena" />
                                                <div className='div-input-error'>
                                                    <h5 className='input-error'>{errors.new_password ? errors.new_password : errors.confirm_password ? errors.confirm_password : ""}</h5>
                                                </div>
                                            </div>
                                            <div className='element-form'>
                                                <label htmlFor="confirmar_contrasena">Confirmar Contraseña</label>
                                                <input ref={confirm_password} className='input-update-profile' type="text" name="" id="confirmar_contrasena" />
                                                <div className='div-input-error'>
                                                    <h5 className='input-error'>{errors.confirm_password ? errors.confirm_password : ""}</h5>
                                                </div>
                                            </div>

                                        </div>
                                        <button onClick={() => fecthUpdatePassword()} className='button-update-user' type='button'>Guardar</button>

                                    </form>
                                    : mensaje.find_error ? mensaje.find_error : "error interno"}
                            </div>
                        </div>}
                </div>
                {modalImg ? <GlobalModal statusModal={setModaImgs} key={"icons-img"} class="modal-img" content={
                    <div className='div-icons-img' key={"div-icons-img"} >
                        {imgs.length >= 5 ? "" :
                            <div className='load-icono' onClick={(e) => { loadImg(e, "cargar") }}>
                                <svg viewBox="0 0 182.000000 164.000000" preserveAspectRatio="xMidYMid meet">

                                    <g transform="translate(0.000000,164.000000) scale(0.100000,-0.100000)" stroke="none">
                                        <path d="M87 1619 c-10 -6 -26 -9 -36 -6 -41 10 -41 4 -41 -651 0 -475 3 -631 12 -640 9 -9 131 -12 488 -12 l476 0 29 -62 c37 -77 113 -154 190 -192 250 -122 546 28 596 302 21 110 -10 238 -76 321 l-35 44 0 441 c0 331 -3 445 -12 454 -16 16 -1564 17 -1591 1z m1423 -479 l0 -309 -32 7 c-18 4 -65 7 -105 6 -79 -1 -144 -21 -211 -65 -24 -16 -45 -29 -47 -29 -2 0 -33 36 -69 80 -37 44 -71 80 -76 80 -6 0 -20 -11 -32 -25 -12 -14 -25 -25 -28 -25 -4 0 -64 65 -134 145 -69 80 -130 145 -135 145 -14 0 -36 -29 -230 -315 l-191 -280 383 -3 384 -2 -5 -30 -4 -30 -392 2 -391 3 -3 478 -2 477 660 0 660 0 0 -310z m32 -384 c73 -35 139 -100 175 -174 25 -50 28 -68 28 -152 0 -84 -3 -102 -28 -152 -35 -71 -104 -140 -176 -176 -49 -24 -68 -27 -151 -27 -83 0 -102 3 -150 27 -293 144 -272 556 33 669 76 28 192 22 269 -15z" />
                                        <path d="M1220 1317 c-13 -7 -35 -28 -48 -47 -57 -83 21 -195 122 -176 36 7 79 48 91 87 29 89 -80 179 -165 136z" />
                                        <path d="M1372 598 c-7 -7 -12 -39 -12 -75 l0 -63 -64 0 c-71 0 -99 -17 -76 -45 9 -10 32 -15 76 -15 l64 0 0 -64 c0 -44 5 -67 15 -76 28 -23 45 5 45 76 l0 64 64 0 c44 0 67 5 76 15 23 28 -5 45 -76 45 l-64 0 0 63 c0 56 -11 87 -30 87 -3 0 -11 -5 -18 -12z" />
                                    </g>
                                </svg>
                            </div>}

                        {
                            imgs.length > 0 ?
                                <div className='div-imgs-iconos'>

                                    {
                                        imgs.map((value, key) => {
                                            return <div key={key} className='div-imgs-iconos-add'>
                                                <img className='img-icono' src={"http://" + host + ":3000/img/usuarios/" + (value.usuarios_id ? value.usuarios_id : "") + "/iconos/" + (value.nombre ? value.nombre : "")} />
                                                <div onClick={(e) => { setFocusImgChange({ id: value.id, src: "http://" + host + ":3000/img/usuarios/" + (value.usuarios_id ? value.usuarios_id : "") + "/iconos/" + (value.nombre ? value.nombre : ""), estado: value.estado }); setModalImgChange(true) }} className='div-ver-iconos'>
                                                    <h4>Ver</h4>
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>
                                : ""
                        }
                    </div>
                } /> : ""}
                {modalImgChange ?
                    <GlobalModal statusModal={setModalImgChange} key={"div-img-focus"} class="modal-img" content={
                        <div >
                            <div className='div-img-focus'>
                                <img className='img-focus' src={focusImgChange.src} alt="" />
                                <div onClick={(e) => { loadImg(e, "editar") }} className='div-ver-iconos'>
                                    <h4>Cambiar</h4>
                                </div>
                            </div>
                            <div className='div-buttons-img-focus'>
                                {/* <button className='button-cambiar-img-focus'>Cambiar</button> */}
                                <button onClick={() => { predeterminarImg(focusImgChange.id) }} className='button-predeterminar-img-focus'>{focusImgChange.estado == 0 ? "Predeterminar" : "Quitar"}</button>
                                <button onClick={() => { eliminarImg(focusImgChange.id) }} className='button-eliminar-img-focus'>Eliminar</button>
                            </div>
                        </div>
                    } />
                    : ""}

            </div>
        </>
    )
}