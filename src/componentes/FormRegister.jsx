import React from "react";

export const FormRegiser = (data) => {
    return (
        <>
            <link rel="stylesheet" href="../../public/css/formRegister.css" />

            <div className="container-form">
                <form action="" className="formRegister">
                    <h3 className="title">Formulario Registro</h3>
                    <div className="grid-column">
                        <div className="column-left column-grid">
                            <div className="">
                                <label htmlFor="">Nombre: </label>
                                <input type="text" />
                            </div>
                            <div className="">
                                <label htmlFor="">Tipo de documento: </label>
                                <select name="" id="">
                                    <option value="">Elija una opción:</option>
                                </select>
                            </div>
                            <div className="">
                                <label htmlFor="">Télefono: </label>
                                <input type="text" />
                            </div>
                            <div className="">
                                <label htmlFor="">Cargo: </label>
                                <select name="" id="">
                                    <option value="">Elija una opción:</option>
                                </select>
                            </div>
                        </div>
                        <div className="column-rigth column-grid">
                            <div className="">
                                <label htmlFor="">Apellido: </label>
                                <input type="text" />
                            </div>
                            <div className="">
                                <label htmlFor="">Documento: </label>
                                <input type="text" />
                            </div>
                            <div className="">
                                <label htmlFor="">Correo: </label>
                                <input type="text" />
                            </div>
                            <div className="">
                                <label htmlFor="">Rol: </label>
                                <select name="" id="">
                                    <option value="">Elija una opción:</option>
                                </select>
                            </div>
                        </div>

                    </div>
                    <button type="submit">Registrar</button>
                </form>
            </div>
        </>
    )
}
