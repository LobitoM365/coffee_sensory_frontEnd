import React, { useEffect, useRef, useState } from 'react'
import Api from "../componentes/Api"
import { Menu } from './Menu.jsx'
import { Loader } from '../componentes/loader.jsx'
import { Alert } from '../componentes/alert.jsx'

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
    useEffect(() => {
        window.addEventListener("load", function () {
            if (heightForm.current) {
                const height = heightForm.current.scrollHeight

                changeHeightForm(height);
            }
        })

        fetchUser();
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
    return (
        <>
            <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />
            <link rel="stylesheet" href="../../public/css/profile.css" />
            <div className="header-profile">
                <img className='img-head-profile' src={!data.valueDarkMode ? "/public/img/imgLightModeProfile.jpg" : "/public/img/imgDarkProfile.jpg"} alt="" />


                <div className="contenido-profile">
                    <div className="info-profile head-info-profile">
                        <div className="div-img-perfil-usuario">
                            {Object.keys(user).length > 0 ? user.cargo == "administrador" ? <img className='img-perfil-usuario' src="../img/analisisPrueba.jpg" alt="" /> : user.cargo == "instructor" ? <img className='img-perfil-usuario' src="../img/img_instructor.jpg" alt="" /> : user.cargo == "aprendiz" ? <img className='img-perfil-usuario' src="../img/img_aprendiz.jpg" alt="" /> : user.cargo == "cliente" ? <img className='img-perfil-usuario' src="../img/img_client.jpg" alt="" /> : <img className='img-perfil-usuario' src="../img/analisisPrueba.jpg" alt="" /> : <img className='img-perfil-usuario' src="../img/analisisPrueba.jpg" alt="" />}
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
                                                        : <div >{dni}</div>)
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

            </div>
        </>
    )
}