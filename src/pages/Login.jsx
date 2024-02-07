// LoginForm.js
import Api from "../componentes/Api"
import React, { useEffect, useState } from 'react';
import { Alert } from "../componentes/alert";
import { useNavigate } from "react-router-dom";


export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validationError, setValidationError] = useState(null);
    const [statusAlert, setStatusAlert] = useState(false);
    const [dataAlert, setdataAlert] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // Cargar el archivo JavaScript después de que el HTML esté completo
        const script = document.createElement('script');
        script.src = '../../public/js/login.js';
        script.async = true;

        document.body.appendChild(script);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Correo: ', email);
        console.log('Contraseña: ', password);
        const data = {
            correo_electronico: email,
            user_password: password
        }
        Api.post('/auth/credentials', data)
            .then((response) => {
                console.log('login response:', response);
                if (response.data.errors) {
                    const credentialsError = response.data.errors['credentials_error'];
                    console.log(response.data.errors['credentials_error']);
                    setValidationError(credentialsError);
                } else {
                    // navigate('/dashboard')
                    location.href = '/dashboard';
                }
            })
            .catch((error) => {
                // location.href = '/login';
                if (error) {
                    setStatusAlert(true);
                    setdataAlert({
                        status: "false",
                        description: 'Intente acceder de nuevo más tarde.',
                        "tittle": "Error interno del servidor! ",
                    });
                    // alert('ERROR LOGIN')
                } else {
                    console.log('ERROR: ', error.response.data.message);
                }

            })

    };

    return (
        <div className="main-container">
            <link rel="stylesheet" href="../../public/css/login.css" />
            <div className="bg-img">
                {/* <img className='' src="../img/login/bg-login-2.png" alt="" /> */}
                {/* <svg id="visual" viewBox="0 0 1000 600" width="900" height="600" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"><path d="M0 483L30 478.8C60 474.7 120 466.3 180 469.8C240 473.3 300 488.7 360 477.2C420 465.7 480 427.3 540 417.2C600 407 660 425 720 426.2C780 427.3 840 411.7 870 403.8L900 396" fill="none" stroke-linecap="round" stroke-linejoin="miter" stroke="#009473" stroke-width="40"></path></svg>
                <svg id="visualBottom" viewBox="0 0 1000 600" width="900" height="600" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"><path d="M0 483L30 478.8C60 474.7 120 466.3 180 469.8C240 473.3 300 488.7 360 477.2C420 465.7 480 427.3 540 417.2C600 407 660 425 720 426.2C780 427.3 840 411.7 870 403.8L900 396" fill="none" stroke-linecap="round" stroke-linejoin="miter" stroke="#009473" stroke-width="40"></path></svg> */}

            </div>
            <div className="login-container">
                <div className="login-form-container">
                    <form className="login-form" onSubmit={handleSubmit}>
                        <h3 className='title-login'>Inicio de Sesión</h3>
                        <div className="container-inputs">
                            <span className='span-input'>Correo Electronico</span>
                            <input
                                className='input-text'
                                type="text"
                                placeholder='Correo Electronico'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {validationError && <div className="credentials-error"> {validationError}</div>}
                        </div>

                        <div className="container-inputs">
                            <span className='span-input'>Contraseña</span>
                            <input
                                className='input-text'
                                type="password"
                                value={password}
                                placeholder='Contraseña'
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 show-password" id="hidePassword">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 show-password" id="showPassowrd">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>

                            {validationError && <div className="credentials-error"> {validationError}</div>}
                        </div>
                        <button type="submit">Iniciar sesión</button>
                    </form>
                </div>
                <div className="login-image-container">
                    <img src="../../public/img/login/login_size.jpg" className='login-image' alt="Imagen de inicio de sesión" />
                </div>
            </div>
            <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />
        </div>
    );
};

