import React, { useEffect, useRef, useState } from 'react'
import Api from "../componentes/Api"
import { Menu } from './Menu.jsx'
import { Loader } from '../componentes/loader.jsx'
import { Alert } from '../componentes/alert.jsx'
import { GlobalModal } from '../componentes/globalModal.jsx'
import { host } from '../componentes/Api'
import "../../public/css/profile.css";

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
    const [eyes, setEyes] = useState({ "new_password": false, "confirm_password": false })

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
            console.log("listaaaaaaaaaaaa", response, "reee")

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
            input.setAttribute("accept", ".png, .jpg, .jpeg, .gif, .webp")
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
        <div id='mainProfile'>
            <div>
                <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />
                <div className="header-profile">
                    <div>

                    </div>
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
                                                    <div className='div-input-password'>
                                                        <input id="nombre" ref={nombre} className='input-update-profile' type="text" name="" />
                                                    </div>
                                                    <div className='div-input-error'>
                                                        <h5 className='input-error'>{errors.nombre ? errors.nombre : ""}</h5>
                                                    </div>
                                                </div>
                                                <div className='element-form'>
                                                    <label htmlFor="apellido">Apellido</label>
                                                    <div className='div-input-password'>
                                                        <input ref={apellido} className='input-update-profile' type="text" name="" id="apellido" />
                                                    </div>
                                                    <div className='div-input-error'>
                                                        <h5 className='input-error'>{errors.apellido ? errors.apellido : ""}</h5>
                                                    </div>
                                                </div>
                                                <div className='element-form'>
                                                    <label htmlFor="telefono">Telefono</label>
                                                    <div className='div-input-password'>
                                                        <input ref={telefono} className='input-update-profile' type="text" name="" id="telefono" />
                                                    </div>
                                                    <div className='div-input-error'>
                                                        <h5 className='input-error'>{errors.telefono ? errors.telefono : ""}</h5>
                                                    </div>
                                                </div>
                                                <div className='element-form'>
                                                    <label htmlFor="correo_electronico">Correo electronico</label>
                                                    <div className='div-input-password'>
                                                        <input ref={correo_electronico} className='input-update-profile' type="text" name="" id="correo_electronico" />
                                                    </div>
                                                    <div className='div-input-error'>
                                                        <h5 className='input-error'>{errors.correo_electronico ? errors.correo_electronico : ""}</h5>
                                                    </div>
                                                </div>
                                                <div className='element-form'>
                                                    <label htmlFor="numero_de_documento">Numero de documento</label>
                                                    {data.userInfo != null ?
                                                        (data.userInfo.rol === 'administrador' ?
                                                            <div className='div-input-password'>
                                                                <input ref={numero_documento} className='input-update-profile' type="text" name="" id="numero_de_documento" />
                                                            </div>
                                                            : <div ref={numero_documento}>{dni}</div>)
                                                        :
                                                        <div className='div-input-password'>
                                                            <input ref={numero_documento} className='input-update-profile' type="text" name="" id="numero_de_documento" />
                                                        </div>
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
                                                    <div className='div-input-password'>
                                                        <input ref={user_password} className='input-update-profile' type="text" name="" id="contrasena_actual" />
                                                    </div>
                                                    <div className='div-input-error'>
                                                        <h5 className='input-error'>{errors.user_password ? errors.user_password : ""}</h5>
                                                    </div>
                                                </div>

                                                <div className='element-form'>
                                                    <label htmlFor="nueva_contrasena">Nueva contraseña</label>
                                                    <div className='div-eyes div-input-password'>
                                                        <div className="container-input">
                                                            <input
                                                                ref={new_password}
                                                                className='input-update-profile'
                                                                type={eyes["new_password"] ? 'text' : 'password'}
                                                                placeholder='Contraseña'
                                                                name="password"
                                                                data-place="Contraseña"
                                                            />
                                                        </div>
                                                        <div className="eyes-container" onClick={() => {
                                                            const cloneEyesStatus = { ...eyes }
                                                            cloneEyesStatus["new_password"] = !cloneEyesStatus["new_password"]
                                                            setEyes(cloneEyesStatus)
                                                        }}>
                                                            {!eyes["new_password"] ? <div className="svg-eyes-two" ><svg version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enableBackground="new 0 0 256 256">
                                                                <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                                                <g><g><path fill="#292929" d="M128,104.1c-27.4,0-49.6,22.2-49.6,49.6c0,27.4,22.2,49.6,49.6,49.6c27.4,0,49.6-22.2,49.6-49.6C177.6,126.3,155.4,104.1,128,104.1z M128,167.9c-7.8,0-14.1-6.3-14.1-14.2s6.3-14.1,14.1-14.1c7.8,0,14.1,6.3,14.1,14.2C142.1,161.6,135.8,167.9,128,167.9z" /><path fill="#292929" d="M128,93.1c-63.6,0-115.2,59.8-115.2,59.8s51.6,58.6,115.2,58.6c63.6,0,115.2-58.7,115.2-58.7S191.6,93.1,128,93.1z M128,206.9c-59.4,0-107.5-54-107.5-54s48.3-51.5,107.7-51.5c59.4,0,107.2,51.5,107.2,51.5S187.4,206.9,128,206.9z" /><path fill="#292929" d="M215,111.3c1.2-0.2,2.3-0.5,3.4-1c2.1-0.8,4-2,5.6-3.4c3.3-2.9,5.6-6.7,7.2-10.6c-1.9,3.8-4.5,7.3-7.9,9.7c-1.7,1.2-3.5,2.2-5.5,2.7c-1.9,0.6-4,0.8-5.9,0.5v0c-6.1-4.1-12.5-8-19.1-11.5c-0.2-0.1-0.4-0.2-0.5-0.3c1.6-0.7,3.1-1.5,4.5-2.4c2.4-1.6,4.5-3.7,6.1-6c3.3-4.7,4.7-10.3,5-15.8c-0.7,5.4-2.7,10.7-6.2,14.8c-1.7,2-3.8,3.7-6.1,4.9c-2.3,1.3-4.8,2.2-7.2,2.5v0c-8.4-4.1-17.2-7.5-26.3-10c1.4-1.1,2.7-2.4,3.9-3.8c2.5-2.8,4.3-6.1,5.5-9.6c2.4-7,2.2-14.3,1-21.2c0.5,7-0.2,14.2-3.2,20.3c-1.5,3-3.5,5.8-5.9,8c-2.2,2.1-5,3.8-7.6,4.7c-8.5-1.9-17.2-3-25.9-3.2c-0.8-2-1.5-4.3-2-6.5c-0.8-3.2-1.3-6.5-1.5-9.8c-0.5-6.6,0.1-13.4,1.7-20.1c-2.7,6.3-4.4,13.1-5,20c-0.3,3.5-0.3,7,0,10.5c0.2,2,0.4,3.9,0.8,5.8c-7.7,0.3-15.3,1.2-22.8,2.8c-2.6-0.9-5.3-2.6-7.6-4.6c-2.5-2.2-4.5-4.9-6-7.9c-3.1-6.1-3.9-13.2-3.5-20.2c-1.2,6.9-1.2,14.3,1.3,21.2c1.3,3.4,3.2,6.7,5.7,9.5c1.2,1.3,2.4,2.5,3.8,3.5c-8.7,2.3-17.2,5.5-25.4,9.3v0c-2.5-0.1-5.2-0.7-7.6-1.7c-2.5-1-4.8-2.4-6.8-4.3c-4.1-3.6-6.9-8.6-8.5-14c1.1,5.5,3.4,10.9,7.4,15.1c2,2.1,4.3,3.9,6.9,5.3c1.3,0.7,2.7,1.3,4.2,1.8c-0.6,0.3-1.3,0.6-1.9,0.9c-5.5,2.9-10.8,6.1-16,9.4c-1.8,0.2-3.8,0-5.6-0.6c-2-0.6-3.8-1.5-5.5-2.7c-3.3-2.4-5.9-5.9-7.9-9.7c1.6,3.9,3.9,7.7,7.2,10.6c1.6,1.4,3.5,2.6,5.6,3.4c1.1,0.4,2.1,0.7,3.2,0.9C31.5,117.4,20,127.3,10,138.4c8.1-7.7,16.8-14.6,25.9-20.9c9.1-6.3,18.6-12,28.6-16.7c19-9,39.6-14.9,60.5-15.3c0,0.1,0,0.1,0,0.2l0.5-0.2c0.8,0,1.6-0.1,2.4-0.1c21.9,0,43.5,6.1,63.4,15.6c10,4.7,19.5,10.4,28.6,16.7c9.2,6.2,17.9,13.1,26.1,20.7C236.8,128.3,226.3,119.2,215,111.3z" /></g></g>
                                                            </svg>
                                                                <svg version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enableBackground="new 0 0 256 256">
                                                                    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                                                    <g><g><path fill="#292929" d="M128,104.1c-27.4,0-49.6,22.2-49.6,49.6c0,27.4,22.2,49.6,49.6,49.6c27.4,0,49.6-22.2,49.6-49.6C177.6,126.3,155.4,104.1,128,104.1z M128,167.9c-7.8,0-14.1-6.3-14.1-14.2s6.3-14.1,14.1-14.1c7.8,0,14.1,6.3,14.1,14.2C142.1,161.6,135.8,167.9,128,167.9z" /><path fill="#292929" d="M128,93.1c-63.6,0-115.2,59.8-115.2,59.8s51.6,58.6,115.2,58.6c63.6,0,115.2-58.7,115.2-58.7S191.6,93.1,128,93.1z M128,206.9c-59.4,0-107.5-54-107.5-54s48.3-51.5,107.7-51.5c59.4,0,107.2,51.5,107.2,51.5S187.4,206.9,128,206.9z" /><path fill="#292929" d="M215,111.3c1.2-0.2,2.3-0.5,3.4-1c2.1-0.8,4-2,5.6-3.4c3.3-2.9,5.6-6.7,7.2-10.6c-1.9,3.8-4.5,7.3-7.9,9.7c-1.7,1.2-3.5,2.2-5.5,2.7c-1.9,0.6-4,0.8-5.9,0.5v0c-6.1-4.1-12.5-8-19.1-11.5c-0.2-0.1-0.4-0.2-0.5-0.3c1.6-0.7,3.1-1.5,4.5-2.4c2.4-1.6,4.5-3.7,6.1-6c3.3-4.7,4.7-10.3,5-15.8c-0.7,5.4-2.7,10.7-6.2,14.8c-1.7,2-3.8,3.7-6.1,4.9c-2.3,1.3-4.8,2.2-7.2,2.5v0c-8.4-4.1-17.2-7.5-26.3-10c1.4-1.1,2.7-2.4,3.9-3.8c2.5-2.8,4.3-6.1,5.5-9.6c2.4-7,2.2-14.3,1-21.2c0.5,7-0.2,14.2-3.2,20.3c-1.5,3-3.5,5.8-5.9,8c-2.2,2.1-5,3.8-7.6,4.7c-8.5-1.9-17.2-3-25.9-3.2c-0.8-2-1.5-4.3-2-6.5c-0.8-3.2-1.3-6.5-1.5-9.8c-0.5-6.6,0.1-13.4,1.7-20.1c-2.7,6.3-4.4,13.1-5,20c-0.3,3.5-0.3,7,0,10.5c0.2,2,0.4,3.9,0.8,5.8c-7.7,0.3-15.3,1.2-22.8,2.8c-2.6-0.9-5.3-2.6-7.6-4.6c-2.5-2.2-4.5-4.9-6-7.9c-3.1-6.1-3.9-13.2-3.5-20.2c-1.2,6.9-1.2,14.3,1.3,21.2c1.3,3.4,3.2,6.7,5.7,9.5c1.2,1.3,2.4,2.5,3.8,3.5c-8.7,2.3-17.2,5.5-25.4,9.3v0c-2.5-0.1-5.2-0.7-7.6-1.7c-2.5-1-4.8-2.4-6.8-4.3c-4.1-3.6-6.9-8.6-8.5-14c1.1,5.5,3.4,10.9,7.4,15.1c2,2.1,4.3,3.9,6.9,5.3c1.3,0.7,2.7,1.3,4.2,1.8c-0.6,0.3-1.3,0.6-1.9,0.9c-5.5,2.9-10.8,6.1-16,9.4c-1.8,0.2-3.8,0-5.6-0.6c-2-0.6-3.8-1.5-5.5-2.7c-3.3-2.4-5.9-5.9-7.9-9.7c1.6,3.9,3.9,7.7,7.2,10.6c1.6,1.4,3.5,2.6,5.6,3.4c1.1,0.4,2.1,0.7,3.2,0.9C31.5,117.4,20,127.3,10,138.4c8.1-7.7,16.8-14.6,25.9-20.9c9.1-6.3,18.6-12,28.6-16.7c19-9,39.6-14.9,60.5-15.3c0,0.1,0,0.1,0,0.2l0.5-0.2c0.8,0,1.6-0.1,2.4-0.1c21.9,0,43.5,6.1,63.4,15.6c10,4.7,19.5,10.4,28.6,16.7c9.2,6.2,17.9,13.1,26.1,20.7C236.8,128.3,226.3,119.2,215,111.3z" /></g></g>
                                                                </svg>
                                                            </div> :


                                                                <svg onClick={() => {
                                                                    const cloneEyesStatus = { ...eyes }
                                                                    cloneEyesStatus["new_password"] = !cloneEyesStatus["new_password"]
                                                                    setEyes(cloneEyesStatus)
                                                                }} className="eyes-closed svg-eyes" version="1.0" viewBox="0 0 167.000000 39.000000" preserveAspectRatio="xMidYMid meet">
                                                                    <g transform="translate(0.000000,39.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                                        <path d="M37 352 c-15 -16 -15 -21 -1 -47 14 -27 13 -30 -12 -56 -51 -53 0 -101 59 -56 l33 25 27 -20 c25 -18 27 -24 21 -68 -6 -47 -6 -49 21 -56 28 -7 39 0 70 49 8 13 18 14 45 9 31 -7 35 -11 38 -44 4 -48 24 -65 57 -50 20 9 25 19 25 47 0 36 3 38 52 49 22 5 29 1 47 -29 20 -35 43 -43 71 -25 12 7 12 16 4 50 -11 38 -10 42 14 60 31 25 54 25 77 0 22 -24 38 -25 59 -4 21 21 20 27 -9 62 -22 26 -23 33 -13 60 9 24 9 34 -1 46 -22 27 -44 18 -100 -39 -80 -81 -125 -100 -241 -100 -116 0 -158 17 -247 98 -33 32 -65 57 -70 57 -6 0 -17 -8 -26 -18z" />
                                                                        <path d="M942 358 c-15 -15 -15 -51 0 -66 9 -9 6 -18 -16 -41 -20 -21 -26 -35 -21 -50 9 -31 43 -37 69 -12 27 25 44 26 74 5 20 -14 22 -21 16 -64 -6 -47 -6 -49 21 -56 28 -7 39 0 70 49 8 13 18 14 45 9 32 -7 35 -11 38 -45 2 -29 9 -41 27 -49 33 -15 55 4 55 48 0 37 2 39 46 48 28 6 33 4 52 -28 37 -62 89 -40 77 32 -6 36 -4 42 25 62 l31 22 29 -27 c28 -27 30 -27 55 -11 32 21 32 33 -2 68 -21 22 -24 31 -15 40 26 26 7 78 -28 78 -9 0 -38 -23 -65 -51 -28 -28 -72 -63 -100 -77 -43 -23 -62 -27 -140 -27 -82 0 -97 3 -156 32 -38 19 -83 51 -107 78 -42 46 -59 54 -80 33z" />
                                                                    </g>
                                                                </svg>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className='div-input-error'>
                                                        <h5 className='input-error'>{errors.new_password ? errors.new_password : errors.confirm_password ? errors.confirm_password : ""}</h5>
                                                    </div>
                                                </div>
                                                <div className='element-form'>
                                                    <label htmlFor="confirmar_contrasena">Confirmar Contraseña</label>
                                                    <div className='div-eyes div-input-password'>
                                                        <div className="container-input">
                                                            <input
                                                                ref={confirm_password}
                                                                className='input-update-profile'
                                                                type={eyes["confirm_password"] ? 'text' : 'password'}
                                                                placeholder='Contraseña'
                                                                name="password"
                                                                data-place="Contraseña"
                                                            />
                                                        </div>
                                                        <div className="eyes-container" onClick={() => {
                                                            const cloneEyesStatus = { ...eyes }
                                                            cloneEyesStatus["confirm_password"] = !cloneEyesStatus["confirm_password"]
                                                            setEyes(cloneEyesStatus)
                                                        }}>
                                                            {!eyes["confirm_password"] ? <div className="svg-eyes-two" ><svg version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enableBackground="new 0 0 256 256">
                                                                <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                                                <g><g><path fill="#292929" d="M128,104.1c-27.4,0-49.6,22.2-49.6,49.6c0,27.4,22.2,49.6,49.6,49.6c27.4,0,49.6-22.2,49.6-49.6C177.6,126.3,155.4,104.1,128,104.1z M128,167.9c-7.8,0-14.1-6.3-14.1-14.2s6.3-14.1,14.1-14.1c7.8,0,14.1,6.3,14.1,14.2C142.1,161.6,135.8,167.9,128,167.9z" /><path fill="#292929" d="M128,93.1c-63.6,0-115.2,59.8-115.2,59.8s51.6,58.6,115.2,58.6c63.6,0,115.2-58.7,115.2-58.7S191.6,93.1,128,93.1z M128,206.9c-59.4,0-107.5-54-107.5-54s48.3-51.5,107.7-51.5c59.4,0,107.2,51.5,107.2,51.5S187.4,206.9,128,206.9z" /><path fill="#292929" d="M215,111.3c1.2-0.2,2.3-0.5,3.4-1c2.1-0.8,4-2,5.6-3.4c3.3-2.9,5.6-6.7,7.2-10.6c-1.9,3.8-4.5,7.3-7.9,9.7c-1.7,1.2-3.5,2.2-5.5,2.7c-1.9,0.6-4,0.8-5.9,0.5v0c-6.1-4.1-12.5-8-19.1-11.5c-0.2-0.1-0.4-0.2-0.5-0.3c1.6-0.7,3.1-1.5,4.5-2.4c2.4-1.6,4.5-3.7,6.1-6c3.3-4.7,4.7-10.3,5-15.8c-0.7,5.4-2.7,10.7-6.2,14.8c-1.7,2-3.8,3.7-6.1,4.9c-2.3,1.3-4.8,2.2-7.2,2.5v0c-8.4-4.1-17.2-7.5-26.3-10c1.4-1.1,2.7-2.4,3.9-3.8c2.5-2.8,4.3-6.1,5.5-9.6c2.4-7,2.2-14.3,1-21.2c0.5,7-0.2,14.2-3.2,20.3c-1.5,3-3.5,5.8-5.9,8c-2.2,2.1-5,3.8-7.6,4.7c-8.5-1.9-17.2-3-25.9-3.2c-0.8-2-1.5-4.3-2-6.5c-0.8-3.2-1.3-6.5-1.5-9.8c-0.5-6.6,0.1-13.4,1.7-20.1c-2.7,6.3-4.4,13.1-5,20c-0.3,3.5-0.3,7,0,10.5c0.2,2,0.4,3.9,0.8,5.8c-7.7,0.3-15.3,1.2-22.8,2.8c-2.6-0.9-5.3-2.6-7.6-4.6c-2.5-2.2-4.5-4.9-6-7.9c-3.1-6.1-3.9-13.2-3.5-20.2c-1.2,6.9-1.2,14.3,1.3,21.2c1.3,3.4,3.2,6.7,5.7,9.5c1.2,1.3,2.4,2.5,3.8,3.5c-8.7,2.3-17.2,5.5-25.4,9.3v0c-2.5-0.1-5.2-0.7-7.6-1.7c-2.5-1-4.8-2.4-6.8-4.3c-4.1-3.6-6.9-8.6-8.5-14c1.1,5.5,3.4,10.9,7.4,15.1c2,2.1,4.3,3.9,6.9,5.3c1.3,0.7,2.7,1.3,4.2,1.8c-0.6,0.3-1.3,0.6-1.9,0.9c-5.5,2.9-10.8,6.1-16,9.4c-1.8,0.2-3.8,0-5.6-0.6c-2-0.6-3.8-1.5-5.5-2.7c-3.3-2.4-5.9-5.9-7.9-9.7c1.6,3.9,3.9,7.7,7.2,10.6c1.6,1.4,3.5,2.6,5.6,3.4c1.1,0.4,2.1,0.7,3.2,0.9C31.5,117.4,20,127.3,10,138.4c8.1-7.7,16.8-14.6,25.9-20.9c9.1-6.3,18.6-12,28.6-16.7c19-9,39.6-14.9,60.5-15.3c0,0.1,0,0.1,0,0.2l0.5-0.2c0.8,0,1.6-0.1,2.4-0.1c21.9,0,43.5,6.1,63.4,15.6c10,4.7,19.5,10.4,28.6,16.7c9.2,6.2,17.9,13.1,26.1,20.7C236.8,128.3,226.3,119.2,215,111.3z" /></g></g>
                                                            </svg>
                                                                <svg version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enableBackground="new 0 0 256 256">
                                                                    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                                                    <g><g><path fill="#292929" d="M128,104.1c-27.4,0-49.6,22.2-49.6,49.6c0,27.4,22.2,49.6,49.6,49.6c27.4,0,49.6-22.2,49.6-49.6C177.6,126.3,155.4,104.1,128,104.1z M128,167.9c-7.8,0-14.1-6.3-14.1-14.2s6.3-14.1,14.1-14.1c7.8,0,14.1,6.3,14.1,14.2C142.1,161.6,135.8,167.9,128,167.9z" /><path fill="#292929" d="M128,93.1c-63.6,0-115.2,59.8-115.2,59.8s51.6,58.6,115.2,58.6c63.6,0,115.2-58.7,115.2-58.7S191.6,93.1,128,93.1z M128,206.9c-59.4,0-107.5-54-107.5-54s48.3-51.5,107.7-51.5c59.4,0,107.2,51.5,107.2,51.5S187.4,206.9,128,206.9z" /><path fill="#292929" d="M215,111.3c1.2-0.2,2.3-0.5,3.4-1c2.1-0.8,4-2,5.6-3.4c3.3-2.9,5.6-6.7,7.2-10.6c-1.9,3.8-4.5,7.3-7.9,9.7c-1.7,1.2-3.5,2.2-5.5,2.7c-1.9,0.6-4,0.8-5.9,0.5v0c-6.1-4.1-12.5-8-19.1-11.5c-0.2-0.1-0.4-0.2-0.5-0.3c1.6-0.7,3.1-1.5,4.5-2.4c2.4-1.6,4.5-3.7,6.1-6c3.3-4.7,4.7-10.3,5-15.8c-0.7,5.4-2.7,10.7-6.2,14.8c-1.7,2-3.8,3.7-6.1,4.9c-2.3,1.3-4.8,2.2-7.2,2.5v0c-8.4-4.1-17.2-7.5-26.3-10c1.4-1.1,2.7-2.4,3.9-3.8c2.5-2.8,4.3-6.1,5.5-9.6c2.4-7,2.2-14.3,1-21.2c0.5,7-0.2,14.2-3.2,20.3c-1.5,3-3.5,5.8-5.9,8c-2.2,2.1-5,3.8-7.6,4.7c-8.5-1.9-17.2-3-25.9-3.2c-0.8-2-1.5-4.3-2-6.5c-0.8-3.2-1.3-6.5-1.5-9.8c-0.5-6.6,0.1-13.4,1.7-20.1c-2.7,6.3-4.4,13.1-5,20c-0.3,3.5-0.3,7,0,10.5c0.2,2,0.4,3.9,0.8,5.8c-7.7,0.3-15.3,1.2-22.8,2.8c-2.6-0.9-5.3-2.6-7.6-4.6c-2.5-2.2-4.5-4.9-6-7.9c-3.1-6.1-3.9-13.2-3.5-20.2c-1.2,6.9-1.2,14.3,1.3,21.2c1.3,3.4,3.2,6.7,5.7,9.5c1.2,1.3,2.4,2.5,3.8,3.5c-8.7,2.3-17.2,5.5-25.4,9.3v0c-2.5-0.1-5.2-0.7-7.6-1.7c-2.5-1-4.8-2.4-6.8-4.3c-4.1-3.6-6.9-8.6-8.5-14c1.1,5.5,3.4,10.9,7.4,15.1c2,2.1,4.3,3.9,6.9,5.3c1.3,0.7,2.7,1.3,4.2,1.8c-0.6,0.3-1.3,0.6-1.9,0.9c-5.5,2.9-10.8,6.1-16,9.4c-1.8,0.2-3.8,0-5.6-0.6c-2-0.6-3.8-1.5-5.5-2.7c-3.3-2.4-5.9-5.9-7.9-9.7c1.6,3.9,3.9,7.7,7.2,10.6c1.6,1.4,3.5,2.6,5.6,3.4c1.1,0.4,2.1,0.7,3.2,0.9C31.5,117.4,20,127.3,10,138.4c8.1-7.7,16.8-14.6,25.9-20.9c9.1-6.3,18.6-12,28.6-16.7c19-9,39.6-14.9,60.5-15.3c0,0.1,0,0.1,0,0.2l0.5-0.2c0.8,0,1.6-0.1,2.4-0.1c21.9,0,43.5,6.1,63.4,15.6c10,4.7,19.5,10.4,28.6,16.7c9.2,6.2,17.9,13.1,26.1,20.7C236.8,128.3,226.3,119.2,215,111.3z" /></g></g>
                                                                </svg>
                                                            </div> :


                                                                <svg onClick={() => {
                                                                    const cloneEyesStatus = { ...eyes }
                                                                    cloneEyesStatus["confirm_password"] = !cloneEyesStatus["confirm_password"]
                                                                    setEyes(cloneEyesStatus)
                                                                }} className="eyes-closed svg-eyes" version="1.0" viewBox="0 0 167.000000 39.000000" preserveAspectRatio="xMidYMid meet">
                                                                    <g transform="translate(0.000000,39.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                                                        <path d="M37 352 c-15 -16 -15 -21 -1 -47 14 -27 13 -30 -12 -56 -51 -53 0 -101 59 -56 l33 25 27 -20 c25 -18 27 -24 21 -68 -6 -47 -6 -49 21 -56 28 -7 39 0 70 49 8 13 18 14 45 9 31 -7 35 -11 38 -44 4 -48 24 -65 57 -50 20 9 25 19 25 47 0 36 3 38 52 49 22 5 29 1 47 -29 20 -35 43 -43 71 -25 12 7 12 16 4 50 -11 38 -10 42 14 60 31 25 54 25 77 0 22 -24 38 -25 59 -4 21 21 20 27 -9 62 -22 26 -23 33 -13 60 9 24 9 34 -1 46 -22 27 -44 18 -100 -39 -80 -81 -125 -100 -241 -100 -116 0 -158 17 -247 98 -33 32 -65 57 -70 57 -6 0 -17 -8 -26 -18z" />
                                                                        <path d="M942 358 c-15 -15 -15 -51 0 -66 9 -9 6 -18 -16 -41 -20 -21 -26 -35 -21 -50 9 -31 43 -37 69 -12 27 25 44 26 74 5 20 -14 22 -21 16 -64 -6 -47 -6 -49 21 -56 28 -7 39 0 70 49 8 13 18 14 45 9 32 -7 35 -11 38 -45 2 -29 9 -41 27 -49 33 -15 55 4 55 48 0 37 2 39 46 48 28 6 33 4 52 -28 37 -62 89 -40 77 32 -6 36 -4 42 25 62 l31 22 29 -27 c28 -27 30 -27 55 -11 32 21 32 33 -2 68 -21 22 -24 31 -15 40 26 26 7 78 -28 78 -9 0 -38 -23 -65 -51 -28 -28 -72 -63 -100 -77 -43 -23 -62 -27 -140 -27 -82 0 -97 3 -156 32 -38 19 -83 51 -107 78 -42 46 -59 54 -80 33z" />
                                                                    </g>
                                                                </svg>
                                                            }
                                                        </div>
                                                    </div>
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
            </div>
        </div >
    )
}