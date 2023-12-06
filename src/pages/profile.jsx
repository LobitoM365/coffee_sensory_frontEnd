import React, { useEffect, useRef, useState } from 'react'
import Api from "../componentes/Api"
import { Menu } from './Menu.jsx'


export const Profile = () => {

    const [user, setUser] = useState({"nombre" : ""});
    const [form, changeForm] = useState(0);
    const [errors, setErrors] = useState({});
    const [countUser, changeCount] = useState(1);
    const heightForm = useRef();
    const [maxHeightForm, changeHeightForm] = useState(0);
    const nombre = useRef();
    const apellido = useRef();
    const telefono = useRef();
    const correo_electronico = useRef();
    const numero_documentos = useRef();
    const user_password = useRef();
    const new_password = useRef();
    const confirm_password = useRef();
    const [mensaje, setMensaje] = useState({});
    async function fetchUser() {
        try {
            const response = await Api.get("usuarios/buscar/1");
            changeCount(1)

            if (response.data.status == true) {
                setUser(response.data.data)
                function getInfoInputs() {
                    if (heightForm.current) {
                        console.log(nombre)
                        nombre.current.value = response.data.data.nombre.replace(/(?:^|\s)\S/g, match => match.toUpperCase());
                        apellido.current.value = response.data.data.apellido.replace(/(?:^|\s)\S/g, match => match.toUpperCase());
                        telefono.current.value = response.data.data.telefono;
                        correo_electronico.current.value = response.data.data.correo_electronico;
                        numero_documentos.current.value = response.data.data.numero_documentos;
                    } else {
                        user_password.current.value = "";
                        new_password.current.value = "";
                        confirm_password.current.value = "";
                    }
                }
                getInfoInputs()
            } else {
                console.log(response)
                setMensaje(response.data.errors)
                setUser({})
                changeCount(0)
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
                console.log(heightForm.current.paddingTop, height, getComputedStyle(heightForm.current).paddingTop, "xdaqewq")
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
                "numero_documentos": numero_documentos.current.value
            }
            const response = await Api.put("usuarios/actualizar/1", data);
            if (response.data.status == false && response.data.errors) {
                setErrors(response.data.errors)
            } else {
                setMensaje(response.data.errors)
                setErrors({})
                await fetchUser()
            }
            console.log(response)

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
            }
            console.log(response.data)

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
            <link rel="stylesheet" href="../../public/css/profile.css" />
            <div className="header-profile">
                <img className='img-head-profile' src="https://static.vecteezy.com/system/resources/previews/008/277/939/non_2x/background-with-mountains-nature-mountain-in-green-color-free-vector.jpg" alt="" />
                <div className="contenido-profile">
                    <div className="info-profile head-info-profile">
                        <div className="div-img-perfil-usuario">
                            <img className='img-perfil-usuario' src="../img/analisisPrueba.jpg" alt="" />
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
                                                <label htmlFor="">Nombre</label>
                                                <input ref={nombre} className='input-update-profile' type="text" name="" id="" />
                                                <div className='div-input-error'>
                                                    <h5 className='input-error'>{errors.nombre ? errors.nombre : ""}</h5>
                                                </div>
                                            </div>
                                            <div className='element-form'>
                                                <label htmlFor="">Apellido</label>
                                                <input ref={apellido} className='input-update-profile' type="text" name="" id="" />
                                                <div className='div-input-error'>
                                                    <h5 className='input-error'>{errors.apellido ? errors.apellido : ""}</h5>
                                                </div>
                                            </div>
                                            <div className='element-form'>
                                                <label htmlFor="">Telefono</label>
                                                <input ref={telefono} className='input-update-profile' type="text" name="" id="" />
                                                <div className='div-input-error'>
                                                    <h5 className='input-error'>{errors.telefono ? errors.telefono : ""}</h5>
                                                </div>
                                            </div>
                                            <div className='element-form'>
                                                <label htmlFor="">Correo electronico</label>
                                                <input ref={correo_electronico} className='input-update-profile' type="text" name="" id="" />
                                                <div className='div-input-error'>
                                                    <h5 className='input-error'>{errors.correo_electronico ? errors.correo_electronico : ""}</h5>
                                                </div>
                                            </div>
                                            <div className='element-form'>
                                                <label htmlFor="">Numero de documento</label>
                                                <input ref={numero_documentos} className='input-update-profile' type="text" name="" id="" />
                                                <div className='div-input-error'>
                                                    <h5 className='input-error'>{errors.numero_documentos ? errors.numero_documentos : ""}</h5>
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
                                                <label htmlFor="">Contraseña actual</label>
                                                <input ref={user_password} className='input-update-profile' type="text" name="" id="" />
                                                <div className='div-input-error'>
                                                    <h5 className='input-error'>{errors.user_password ? errors.user_password : ""}</h5>
                                                </div>
                                            </div>
                                            <div className='element-form'>
                                                <label htmlFor="">Nueva contraseña</label>
                                                <input ref={new_password} className='input-update-profile' type="text" name="" id="" />
                                                <div className='div-input-error'>
                                                    <h5 className='input-error'>{errors.new_password ? errors.new_password : errors.confirm_password ? errors.confirm_password : ""}</h5>
                                                </div>
                                            </div>
                                            <div className='element-form'>
                                                <label htmlFor="">Confirmar Contraseña</label>
                                                <input ref={confirm_password} className='input-update-profile' type="text" name="" id="123" />
                                                <div className='div-input-error'>
                                                    <h5 className='input-error'>{errors.confirm_password ? errors.confirm_password : ""}</h5>
                                                </div>
                                            </div>

                                        </div>
                                        <button onClick={() => fecthUpdatePassword()} className='button-update-user' type='button'>Guardar</button>

                                    </form>
                                    : mensaje.find_error ? mensaje.find_error    : "error interno"}
                            </div>
                        </div>}
                </div>

            </div>
        </>
    )
}