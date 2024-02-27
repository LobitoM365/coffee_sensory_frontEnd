import Api from "../componentes/Api"
import React, { useEffect, useState } from 'react';
import { Alert } from "../componentes/alert";
import { useLocation } from 'react-router-dom';

export const RecoveryPassword = () => {
    const [email, setEmail] = useState({});
    const [eyeTop, setEyeTop] = useState(false);
    const [eyeBottom, setEyeBottom] = useState(false);
    const [validationError, setValidationError] = useState({});
    const [statusAlert, setStatusAlert] = useState(false);
    const [dataAlert, setdataAlert] = useState({});
    const location = useLocation();

    const updatePassword = async (event) => {
        event.preventDefault();
        try {
            let dataForm = new FormData(event.target);
            let data = Object.fromEntries(dataForm);

            // Obtener el token de la url
            const searchParams = new URLSearchParams(location.search);
            const token = searchParams.get('key');

            // Setear el valor del token
            data.token = token;

            const response = await Api.put('auth/recoverPassword', data);
            console.log('DATA FORM: ', data);
            console.log('RESPONSE: ', response);

            if (response.data.errors) {
                const credentialsError = response.data.errors;
                setValidationError(credentialsError);
            } else {
                setValidationError('');

                setStatusAlert(true);
                setdataAlert({
                    status: response.data.status.toString(),
                    description: response.data.message,
                    "tittle": response.data.title,
                });
            }
            console.log('VALIDATION : ', validationError);

        } catch (error) {
            console.log('ERROR EMAIL: ', error);
        }
    }

    return (
        <div className="main-container">
            <link rel="stylesheet" href="../../public/css/login.css" />
            <link rel="stylesheet" href="../../public/css/recover.css" />
            <div className="bg-img">

            </div>
            <div className="login-container">
                <div className="login-form-container" >
                    <form className="login-form bots-form" onSubmit={updatePassword}>
                        <h3 className='title-login text-recover'>Restablezca su Contraseña</h3>
                        <div className="container-inputs">
                            {/* <span className='span-input'>Contraseña</span> */}
                            <div className="container-input">
                                <input
                                    className='input-password input-text'
                                    type={eyeTop ? 'text' : 'password'}
                                    placeholder='Nueva Contraseña'
                                    name="new_password"
                                />
                            </div>

                            <div className="eyes-container">
                                {!eyeTop ? <div className="" onClick={() => { setEyeTop(!eyeTop) }}><svg version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enableBackground="new 0 0 256 256">
                                    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                    <g><g><path fill="#292929" d="M128,104.1c-27.4,0-49.6,22.2-49.6,49.6c0,27.4,22.2,49.6,49.6,49.6c27.4,0,49.6-22.2,49.6-49.6C177.6,126.3,155.4,104.1,128,104.1z M128,167.9c-7.8,0-14.1-6.3-14.1-14.2s6.3-14.1,14.1-14.1c7.8,0,14.1,6.3,14.1,14.2C142.1,161.6,135.8,167.9,128,167.9z" /><path fill="#292929" d="M128,93.1c-63.6,0-115.2,59.8-115.2,59.8s51.6,58.6,115.2,58.6c63.6,0,115.2-58.7,115.2-58.7S191.6,93.1,128,93.1z M128,206.9c-59.4,0-107.5-54-107.5-54s48.3-51.5,107.7-51.5c59.4,0,107.2,51.5,107.2,51.5S187.4,206.9,128,206.9z" /><path fill="#292929" d="M215,111.3c1.2-0.2,2.3-0.5,3.4-1c2.1-0.8,4-2,5.6-3.4c3.3-2.9,5.6-6.7,7.2-10.6c-1.9,3.8-4.5,7.3-7.9,9.7c-1.7,1.2-3.5,2.2-5.5,2.7c-1.9,0.6-4,0.8-5.9,0.5v0c-6.1-4.1-12.5-8-19.1-11.5c-0.2-0.1-0.4-0.2-0.5-0.3c1.6-0.7,3.1-1.5,4.5-2.4c2.4-1.6,4.5-3.7,6.1-6c3.3-4.7,4.7-10.3,5-15.8c-0.7,5.4-2.7,10.7-6.2,14.8c-1.7,2-3.8,3.7-6.1,4.9c-2.3,1.3-4.8,2.2-7.2,2.5v0c-8.4-4.1-17.2-7.5-26.3-10c1.4-1.1,2.7-2.4,3.9-3.8c2.5-2.8,4.3-6.1,5.5-9.6c2.4-7,2.2-14.3,1-21.2c0.5,7-0.2,14.2-3.2,20.3c-1.5,3-3.5,5.8-5.9,8c-2.2,2.1-5,3.8-7.6,4.7c-8.5-1.9-17.2-3-25.9-3.2c-0.8-2-1.5-4.3-2-6.5c-0.8-3.2-1.3-6.5-1.5-9.8c-0.5-6.6,0.1-13.4,1.7-20.1c-2.7,6.3-4.4,13.1-5,20c-0.3,3.5-0.3,7,0,10.5c0.2,2,0.4,3.9,0.8,5.8c-7.7,0.3-15.3,1.2-22.8,2.8c-2.6-0.9-5.3-2.6-7.6-4.6c-2.5-2.2-4.5-4.9-6-7.9c-3.1-6.1-3.9-13.2-3.5-20.2c-1.2,6.9-1.2,14.3,1.3,21.2c1.3,3.4,3.2,6.7,5.7,9.5c1.2,1.3,2.4,2.5,3.8,3.5c-8.7,2.3-17.2,5.5-25.4,9.3v0c-2.5-0.1-5.2-0.7-7.6-1.7c-2.5-1-4.8-2.4-6.8-4.3c-4.1-3.6-6.9-8.6-8.5-14c1.1,5.5,3.4,10.9,7.4,15.1c2,2.1,4.3,3.9,6.9,5.3c1.3,0.7,2.7,1.3,4.2,1.8c-0.6,0.3-1.3,0.6-1.9,0.9c-5.5,2.9-10.8,6.1-16,9.4c-1.8,0.2-3.8,0-5.6-0.6c-2-0.6-3.8-1.5-5.5-2.7c-3.3-2.4-5.9-5.9-7.9-9.7c1.6,3.9,3.9,7.7,7.2,10.6c1.6,1.4,3.5,2.6,5.6,3.4c1.1,0.4,2.1,0.7,3.2,0.9C31.5,117.4,20,127.3,10,138.4c8.1-7.7,16.8-14.6,25.9-20.9c9.1-6.3,18.6-12,28.6-16.7c19-9,39.6-14.9,60.5-15.3c0,0.1,0,0.1,0,0.2l0.5-0.2c0.8,0,1.6-0.1,2.4-0.1c21.9,0,43.5,6.1,63.4,15.6c10,4.7,19.5,10.4,28.6,16.7c9.2,6.2,17.9,13.1,26.1,20.7C236.8,128.3,226.3,119.2,215,111.3z" /></g></g>
                                </svg>
                                    <svg version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enableBackground="new 0 0 256 256">
                                        <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                        <g><g><path fill="#292929" d="M128,104.1c-27.4,0-49.6,22.2-49.6,49.6c0,27.4,22.2,49.6,49.6,49.6c27.4,0,49.6-22.2,49.6-49.6C177.6,126.3,155.4,104.1,128,104.1z M128,167.9c-7.8,0-14.1-6.3-14.1-14.2s6.3-14.1,14.1-14.1c7.8,0,14.1,6.3,14.1,14.2C142.1,161.6,135.8,167.9,128,167.9z" /><path fill="#292929" d="M128,93.1c-63.6,0-115.2,59.8-115.2,59.8s51.6,58.6,115.2,58.6c63.6,0,115.2-58.7,115.2-58.7S191.6,93.1,128,93.1z M128,206.9c-59.4,0-107.5-54-107.5-54s48.3-51.5,107.7-51.5c59.4,0,107.2,51.5,107.2,51.5S187.4,206.9,128,206.9z" /><path fill="#292929" d="M215,111.3c1.2-0.2,2.3-0.5,3.4-1c2.1-0.8,4-2,5.6-3.4c3.3-2.9,5.6-6.7,7.2-10.6c-1.9,3.8-4.5,7.3-7.9,9.7c-1.7,1.2-3.5,2.2-5.5,2.7c-1.9,0.6-4,0.8-5.9,0.5v0c-6.1-4.1-12.5-8-19.1-11.5c-0.2-0.1-0.4-0.2-0.5-0.3c1.6-0.7,3.1-1.5,4.5-2.4c2.4-1.6,4.5-3.7,6.1-6c3.3-4.7,4.7-10.3,5-15.8c-0.7,5.4-2.7,10.7-6.2,14.8c-1.7,2-3.8,3.7-6.1,4.9c-2.3,1.3-4.8,2.2-7.2,2.5v0c-8.4-4.1-17.2-7.5-26.3-10c1.4-1.1,2.7-2.4,3.9-3.8c2.5-2.8,4.3-6.1,5.5-9.6c2.4-7,2.2-14.3,1-21.2c0.5,7-0.2,14.2-3.2,20.3c-1.5,3-3.5,5.8-5.9,8c-2.2,2.1-5,3.8-7.6,4.7c-8.5-1.9-17.2-3-25.9-3.2c-0.8-2-1.5-4.3-2-6.5c-0.8-3.2-1.3-6.5-1.5-9.8c-0.5-6.6,0.1-13.4,1.7-20.1c-2.7,6.3-4.4,13.1-5,20c-0.3,3.5-0.3,7,0,10.5c0.2,2,0.4,3.9,0.8,5.8c-7.7,0.3-15.3,1.2-22.8,2.8c-2.6-0.9-5.3-2.6-7.6-4.6c-2.5-2.2-4.5-4.9-6-7.9c-3.1-6.1-3.9-13.2-3.5-20.2c-1.2,6.9-1.2,14.3,1.3,21.2c1.3,3.4,3.2,6.7,5.7,9.5c1.2,1.3,2.4,2.5,3.8,3.5c-8.7,2.3-17.2,5.5-25.4,9.3v0c-2.5-0.1-5.2-0.7-7.6-1.7c-2.5-1-4.8-2.4-6.8-4.3c-4.1-3.6-6.9-8.6-8.5-14c1.1,5.5,3.4,10.9,7.4,15.1c2,2.1,4.3,3.9,6.9,5.3c1.3,0.7,2.7,1.3,4.2,1.8c-0.6,0.3-1.3,0.6-1.9,0.9c-5.5,2.9-10.8,6.1-16,9.4c-1.8,0.2-3.8,0-5.6-0.6c-2-0.6-3.8-1.5-5.5-2.7c-3.3-2.4-5.9-5.9-7.9-9.7c1.6,3.9,3.9,7.7,7.2,10.6c1.6,1.4,3.5,2.6,5.6,3.4c1.1,0.4,2.1,0.7,3.2,0.9C31.5,117.4,20,127.3,10,138.4c8.1-7.7,16.8-14.6,25.9-20.9c9.1-6.3,18.6-12,28.6-16.7c19-9,39.6-14.9,60.5-15.3c0,0.1,0,0.1,0,0.2l0.5-0.2c0.8,0,1.6-0.1,2.4-0.1c21.9,0,43.5,6.1,63.4,15.6c10,4.7,19.5,10.4,28.6,16.7c9.2,6.2,17.9,13.1,26.1,20.7C236.8,128.3,226.3,119.2,215,111.3z" /></g></g>
                                    </svg>
                                </div> : <svg onClick={() => { setEyeTop(!eyeTop) }} className="eyes-closed" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enableBackground="new 0 0 256 256">
                                    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                    <g><g><g><path fill="#292929" d="M15.9,104.9c-3.1,2.5-3.3,5.3-0.8,9.2l1.8,2.8l-3.2,3.4c-3.5,3.6-4.4,5.6-3.5,7.9c1,2.6,3,3.9,5.8,3.9c2.3,0,2.9-0.3,6-3.3l3.5-3.3l4.7,3.1c2.6,1.8,4.8,3.4,4.8,3.6c0,0.2-0.6,1.9-1.5,3.8c-2,4.5-1.9,6.9,0.2,9.1c1.4,1.3,2.3,1.7,4.1,1.7c3.1,0,5-1.6,6.6-5.7c0.8-1.9,1.5-3.6,1.8-3.9c0.2-0.3,2.9-0.1,6.1,0.6l5.6,1.1v4.3c0,4.6,0.9,7.3,2.9,8.4c2.1,1.1,5.2,0.7,6.9-0.8c1.5-1.3,1.6-1.8,1.9-6.6l0.3-5.2l5.1-1c2.8-0.5,5.4-1.2,5.6-1.4c0.3-0.2,1.4,1.6,2.5,4.1c1.1,2.4,2.5,4.8,3.2,5.3c2,1.4,5.8,1.1,7.6-0.6c2.2-2.2,2.3-4.1,0.4-9.1c-1.5-3.8-1.6-4.5-0.8-4.9c0.5-0.3,2.6-1.6,4.7-3.1c2.1-1.4,4-2.6,4.2-2.6c0.2,0,1.9,1.5,3.6,3.2c2.8,2.9,3.5,3.2,5.6,3.2c3.1,0,5.4-1.7,5.9-4.4c0.5-2.9-0.1-4.1-3.7-7.6l-3.3-3.2l1.8-2.5c2.5-3.4,2.6-6.4,0.2-8.8c-1.4-1.4-2.2-1.7-4.2-1.7c-2.2,0-2.8,0.3-4.6,2.4c-8.2,9.5-13.3,13.5-21.3,16.9c-8.2,3.4-18.9,4.6-27.3,3c-11.7-2.2-20.9-7.8-30.6-18.9c-2.7-3-3.2-3.4-5.3-3.4C18.1,103.9,16.6,104.3,15.9,104.9z" /><path fill="#292929" d="M143.2,105.6c-2.4,2.4-2.4,5.4,0.1,8.8l1.8,2.5l-3.6,3.8c-3.6,3.7-3.6,3.9-3.4,6.3c0.5,3.3,2.5,5.1,5.9,5.1c2.2,0,2.8-0.4,5.7-3.2c1.8-1.8,3.4-3.2,3.6-3.2c0.2,0,2.1,1.2,4.3,2.6c2.2,1.4,4.3,2.8,4.8,3.1c0.7,0.4,0.6,1.2-0.8,4.9c-1.9,5-1.9,6.9,0.4,9.1c1.8,1.7,5.6,2.1,7.6,0.6c0.7-0.5,2.1-2.9,3.1-5.3c1.5-3.4,2.2-4.3,2.9-4c0.5,0.2,3.1,0.8,5.6,1.3l4.8,0.9l0.3,5.2c0.3,4.8,0.4,5.3,1.9,6.6c1.8,1.5,4.9,1.9,6.9,0.8c1.9-1.1,2.9-3.8,2.9-8.4v-4.3l5.6-1.1c3.1-0.6,5.7-1,5.8-0.9c0.1,0.1,1,1.9,1.9,4.1c2,4.5,3.6,5.8,6.8,5.8c1.7,0,2.7-0.4,4-1.7c2.2-2.2,2.2-4.1,0.2-9.2c-0.9-2.1-1.5-3.9-1.4-4.1c0.1-0.1,2.3-1.6,4.8-3.3l4.6-3.1l3.5,3.3c3.1,3,3.7,3.3,6,3.3c2.8,0,4.8-1.4,5.8-3.9c0.9-2.3,0-4.4-3.5-7.9l-3.2-3.4l1.8-2.8c2.5-3.9,2.3-6.7-0.8-9.2c-1.4-1.1-4.5-1.4-6.2-0.5c-0.5,0.3-2.6,2.5-4.6,4.9c-6,7.2-13.4,12.3-22.5,15.3c-5.2,1.8-6.1,1.9-14.4,1.9c-7.5,0.1-9.5-0.1-13.4-1.3c-8.9-2.6-17.1-7.6-22.8-14.2c-6.1-7.1-6.2-7.1-8.8-7.1C145.5,103.9,144.6,104.2,143.2,105.6z" /></g></g></g>
                                </svg>}
                            </div>
                            {validationError.new_password && <div className="credentials-error"> {validationError.new_password}</div>}
                        </div>

                        <div className="container-inputs">
                            {/* <span className='span-input'>Confirmar Contraseña</span> */}
                            <div className="container-input">
                                <input
                                    className='input-password input-text'
                                    type={eyeBottom ? 'text' : 'password'}
                                    placeholder='Confirmar Contraseña'
                                    name="confirm_password"
                                />
                            </div>

                            <div className="eyes-container">
                                {!eyeBottom ? <div className="" onClick={() => { setEyeBottom(!eyeBottom) }}><svg version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enableBackground="new 0 0 256 256">
                                    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                    <g><g><path fill="#292929" d="M128,104.1c-27.4,0-49.6,22.2-49.6,49.6c0,27.4,22.2,49.6,49.6,49.6c27.4,0,49.6-22.2,49.6-49.6C177.6,126.3,155.4,104.1,128,104.1z M128,167.9c-7.8,0-14.1-6.3-14.1-14.2s6.3-14.1,14.1-14.1c7.8,0,14.1,6.3,14.1,14.2C142.1,161.6,135.8,167.9,128,167.9z" /><path fill="#292929" d="M128,93.1c-63.6,0-115.2,59.8-115.2,59.8s51.6,58.6,115.2,58.6c63.6,0,115.2-58.7,115.2-58.7S191.6,93.1,128,93.1z M128,206.9c-59.4,0-107.5-54-107.5-54s48.3-51.5,107.7-51.5c59.4,0,107.2,51.5,107.2,51.5S187.4,206.9,128,206.9z" /><path fill="#292929" d="M215,111.3c1.2-0.2,2.3-0.5,3.4-1c2.1-0.8,4-2,5.6-3.4c3.3-2.9,5.6-6.7,7.2-10.6c-1.9,3.8-4.5,7.3-7.9,9.7c-1.7,1.2-3.5,2.2-5.5,2.7c-1.9,0.6-4,0.8-5.9,0.5v0c-6.1-4.1-12.5-8-19.1-11.5c-0.2-0.1-0.4-0.2-0.5-0.3c1.6-0.7,3.1-1.5,4.5-2.4c2.4-1.6,4.5-3.7,6.1-6c3.3-4.7,4.7-10.3,5-15.8c-0.7,5.4-2.7,10.7-6.2,14.8c-1.7,2-3.8,3.7-6.1,4.9c-2.3,1.3-4.8,2.2-7.2,2.5v0c-8.4-4.1-17.2-7.5-26.3-10c1.4-1.1,2.7-2.4,3.9-3.8c2.5-2.8,4.3-6.1,5.5-9.6c2.4-7,2.2-14.3,1-21.2c0.5,7-0.2,14.2-3.2,20.3c-1.5,3-3.5,5.8-5.9,8c-2.2,2.1-5,3.8-7.6,4.7c-8.5-1.9-17.2-3-25.9-3.2c-0.8-2-1.5-4.3-2-6.5c-0.8-3.2-1.3-6.5-1.5-9.8c-0.5-6.6,0.1-13.4,1.7-20.1c-2.7,6.3-4.4,13.1-5,20c-0.3,3.5-0.3,7,0,10.5c0.2,2,0.4,3.9,0.8,5.8c-7.7,0.3-15.3,1.2-22.8,2.8c-2.6-0.9-5.3-2.6-7.6-4.6c-2.5-2.2-4.5-4.9-6-7.9c-3.1-6.1-3.9-13.2-3.5-20.2c-1.2,6.9-1.2,14.3,1.3,21.2c1.3,3.4,3.2,6.7,5.7,9.5c1.2,1.3,2.4,2.5,3.8,3.5c-8.7,2.3-17.2,5.5-25.4,9.3v0c-2.5-0.1-5.2-0.7-7.6-1.7c-2.5-1-4.8-2.4-6.8-4.3c-4.1-3.6-6.9-8.6-8.5-14c1.1,5.5,3.4,10.9,7.4,15.1c2,2.1,4.3,3.9,6.9,5.3c1.3,0.7,2.7,1.3,4.2,1.8c-0.6,0.3-1.3,0.6-1.9,0.9c-5.5,2.9-10.8,6.1-16,9.4c-1.8,0.2-3.8,0-5.6-0.6c-2-0.6-3.8-1.5-5.5-2.7c-3.3-2.4-5.9-5.9-7.9-9.7c1.6,3.9,3.9,7.7,7.2,10.6c1.6,1.4,3.5,2.6,5.6,3.4c1.1,0.4,2.1,0.7,3.2,0.9C31.5,117.4,20,127.3,10,138.4c8.1-7.7,16.8-14.6,25.9-20.9c9.1-6.3,18.6-12,28.6-16.7c19-9,39.6-14.9,60.5-15.3c0,0.1,0,0.1,0,0.2l0.5-0.2c0.8,0,1.6-0.1,2.4-0.1c21.9,0,43.5,6.1,63.4,15.6c10,4.7,19.5,10.4,28.6,16.7c9.2,6.2,17.9,13.1,26.1,20.7C236.8,128.3,226.3,119.2,215,111.3z" /></g></g>
                                </svg>
                                    <svg version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enableBackground="new 0 0 256 256">
                                        <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                        <g><g><path fill="#292929" d="M128,104.1c-27.4,0-49.6,22.2-49.6,49.6c0,27.4,22.2,49.6,49.6,49.6c27.4,0,49.6-22.2,49.6-49.6C177.6,126.3,155.4,104.1,128,104.1z M128,167.9c-7.8,0-14.1-6.3-14.1-14.2s6.3-14.1,14.1-14.1c7.8,0,14.1,6.3,14.1,14.2C142.1,161.6,135.8,167.9,128,167.9z" /><path fill="#292929" d="M128,93.1c-63.6,0-115.2,59.8-115.2,59.8s51.6,58.6,115.2,58.6c63.6,0,115.2-58.7,115.2-58.7S191.6,93.1,128,93.1z M128,206.9c-59.4,0-107.5-54-107.5-54s48.3-51.5,107.7-51.5c59.4,0,107.2,51.5,107.2,51.5S187.4,206.9,128,206.9z" /><path fill="#292929" d="M215,111.3c1.2-0.2,2.3-0.5,3.4-1c2.1-0.8,4-2,5.6-3.4c3.3-2.9,5.6-6.7,7.2-10.6c-1.9,3.8-4.5,7.3-7.9,9.7c-1.7,1.2-3.5,2.2-5.5,2.7c-1.9,0.6-4,0.8-5.9,0.5v0c-6.1-4.1-12.5-8-19.1-11.5c-0.2-0.1-0.4-0.2-0.5-0.3c1.6-0.7,3.1-1.5,4.5-2.4c2.4-1.6,4.5-3.7,6.1-6c3.3-4.7,4.7-10.3,5-15.8c-0.7,5.4-2.7,10.7-6.2,14.8c-1.7,2-3.8,3.7-6.1,4.9c-2.3,1.3-4.8,2.2-7.2,2.5v0c-8.4-4.1-17.2-7.5-26.3-10c1.4-1.1,2.7-2.4,3.9-3.8c2.5-2.8,4.3-6.1,5.5-9.6c2.4-7,2.2-14.3,1-21.2c0.5,7-0.2,14.2-3.2,20.3c-1.5,3-3.5,5.8-5.9,8c-2.2,2.1-5,3.8-7.6,4.7c-8.5-1.9-17.2-3-25.9-3.2c-0.8-2-1.5-4.3-2-6.5c-0.8-3.2-1.3-6.5-1.5-9.8c-0.5-6.6,0.1-13.4,1.7-20.1c-2.7,6.3-4.4,13.1-5,20c-0.3,3.5-0.3,7,0,10.5c0.2,2,0.4,3.9,0.8,5.8c-7.7,0.3-15.3,1.2-22.8,2.8c-2.6-0.9-5.3-2.6-7.6-4.6c-2.5-2.2-4.5-4.9-6-7.9c-3.1-6.1-3.9-13.2-3.5-20.2c-1.2,6.9-1.2,14.3,1.3,21.2c1.3,3.4,3.2,6.7,5.7,9.5c1.2,1.3,2.4,2.5,3.8,3.5c-8.7,2.3-17.2,5.5-25.4,9.3v0c-2.5-0.1-5.2-0.7-7.6-1.7c-2.5-1-4.8-2.4-6.8-4.3c-4.1-3.6-6.9-8.6-8.5-14c1.1,5.5,3.4,10.9,7.4,15.1c2,2.1,4.3,3.9,6.9,5.3c1.3,0.7,2.7,1.3,4.2,1.8c-0.6,0.3-1.3,0.6-1.9,0.9c-5.5,2.9-10.8,6.1-16,9.4c-1.8,0.2-3.8,0-5.6-0.6c-2-0.6-3.8-1.5-5.5-2.7c-3.3-2.4-5.9-5.9-7.9-9.7c1.6,3.9,3.9,7.7,7.2,10.6c1.6,1.4,3.5,2.6,5.6,3.4c1.1,0.4,2.1,0.7,3.2,0.9C31.5,117.4,20,127.3,10,138.4c8.1-7.7,16.8-14.6,25.9-20.9c9.1-6.3,18.6-12,28.6-16.7c19-9,39.6-14.9,60.5-15.3c0,0.1,0,0.1,0,0.2l0.5-0.2c0.8,0,1.6-0.1,2.4-0.1c21.9,0,43.5,6.1,63.4,15.6c10,4.7,19.5,10.4,28.6,16.7c9.2,6.2,17.9,13.1,26.1,20.7C236.8,128.3,226.3,119.2,215,111.3z" /></g></g>
                                    </svg>
                                </div> : <svg onClick={() => { setEyeBottom(!eyeBottom) }} className="eyes-closed" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enableBackground="new 0 0 256 256">
                                    <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                    <g><g><g><path fill="#292929" d="M15.9,104.9c-3.1,2.5-3.3,5.3-0.8,9.2l1.8,2.8l-3.2,3.4c-3.5,3.6-4.4,5.6-3.5,7.9c1,2.6,3,3.9,5.8,3.9c2.3,0,2.9-0.3,6-3.3l3.5-3.3l4.7,3.1c2.6,1.8,4.8,3.4,4.8,3.6c0,0.2-0.6,1.9-1.5,3.8c-2,4.5-1.9,6.9,0.2,9.1c1.4,1.3,2.3,1.7,4.1,1.7c3.1,0,5-1.6,6.6-5.7c0.8-1.9,1.5-3.6,1.8-3.9c0.2-0.3,2.9-0.1,6.1,0.6l5.6,1.1v4.3c0,4.6,0.9,7.3,2.9,8.4c2.1,1.1,5.2,0.7,6.9-0.8c1.5-1.3,1.6-1.8,1.9-6.6l0.3-5.2l5.1-1c2.8-0.5,5.4-1.2,5.6-1.4c0.3-0.2,1.4,1.6,2.5,4.1c1.1,2.4,2.5,4.8,3.2,5.3c2,1.4,5.8,1.1,7.6-0.6c2.2-2.2,2.3-4.1,0.4-9.1c-1.5-3.8-1.6-4.5-0.8-4.9c0.5-0.3,2.6-1.6,4.7-3.1c2.1-1.4,4-2.6,4.2-2.6c0.2,0,1.9,1.5,3.6,3.2c2.8,2.9,3.5,3.2,5.6,3.2c3.1,0,5.4-1.7,5.9-4.4c0.5-2.9-0.1-4.1-3.7-7.6l-3.3-3.2l1.8-2.5c2.5-3.4,2.6-6.4,0.2-8.8c-1.4-1.4-2.2-1.7-4.2-1.7c-2.2,0-2.8,0.3-4.6,2.4c-8.2,9.5-13.3,13.5-21.3,16.9c-8.2,3.4-18.9,4.6-27.3,3c-11.7-2.2-20.9-7.8-30.6-18.9c-2.7-3-3.2-3.4-5.3-3.4C18.1,103.9,16.6,104.3,15.9,104.9z" /><path fill="#292929" d="M143.2,105.6c-2.4,2.4-2.4,5.4,0.1,8.8l1.8,2.5l-3.6,3.8c-3.6,3.7-3.6,3.9-3.4,6.3c0.5,3.3,2.5,5.1,5.9,5.1c2.2,0,2.8-0.4,5.7-3.2c1.8-1.8,3.4-3.2,3.6-3.2c0.2,0,2.1,1.2,4.3,2.6c2.2,1.4,4.3,2.8,4.8,3.1c0.7,0.4,0.6,1.2-0.8,4.9c-1.9,5-1.9,6.9,0.4,9.1c1.8,1.7,5.6,2.1,7.6,0.6c0.7-0.5,2.1-2.9,3.1-5.3c1.5-3.4,2.2-4.3,2.9-4c0.5,0.2,3.1,0.8,5.6,1.3l4.8,0.9l0.3,5.2c0.3,4.8,0.4,5.3,1.9,6.6c1.8,1.5,4.9,1.9,6.9,0.8c1.9-1.1,2.9-3.8,2.9-8.4v-4.3l5.6-1.1c3.1-0.6,5.7-1,5.8-0.9c0.1,0.1,1,1.9,1.9,4.1c2,4.5,3.6,5.8,6.8,5.8c1.7,0,2.7-0.4,4-1.7c2.2-2.2,2.2-4.1,0.2-9.2c-0.9-2.1-1.5-3.9-1.4-4.1c0.1-0.1,2.3-1.6,4.8-3.3l4.6-3.1l3.5,3.3c3.1,3,3.7,3.3,6,3.3c2.8,0,4.8-1.4,5.8-3.9c0.9-2.3,0-4.4-3.5-7.9l-3.2-3.4l1.8-2.8c2.5-3.9,2.3-6.7-0.8-9.2c-1.4-1.1-4.5-1.4-6.2-0.5c-0.5,0.3-2.6,2.5-4.6,4.9c-6,7.2-13.4,12.3-22.5,15.3c-5.2,1.8-6.1,1.9-14.4,1.9c-7.5,0.1-9.5-0.1-13.4-1.3c-8.9-2.6-17.1-7.6-22.8-14.2c-6.1-7.1-6.2-7.1-8.8-7.1C145.5,103.9,144.6,104.2,143.2,105.6z" /></g></g></g>
                                </svg>}
                            </div>
                            {validationError.confirm_password && <div className="credentials-error"> {validationError.confirm_password}</div>}
                        </div>
                        <button type="submit">Restablecer</button>


                    </form>
                </div>
                <div className="login-image-container">
                    <img src="../../public/img/recover/middle-recover.jpg" className='login-image' alt="Imagen de inicio de sesión" />
                </div>
            </div>
            <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />
        </div >
    );
}