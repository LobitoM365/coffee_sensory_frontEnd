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
    const [eyes, setEyes] = useState(false);

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
                                type= {eyes ? 'text' : 'password'}
                                value={password}
                                placeholder='Contraseña'
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {!eyes ? <svg onClick={()=> {setEyes(!eyes)}} xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enable-background="new 0 0 256 256" xml:space="preserve">
                                <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                <g><g><path fill="#000000" d="M128,104.1c-27.4,0-49.6,22.2-49.6,49.6c0,27.4,22.2,49.6,49.6,49.6c27.4,0,49.6-22.2,49.6-49.6C177.6,126.3,155.4,104.1,128,104.1z M128,167.9c-7.8,0-14.1-6.3-14.1-14.2s6.3-14.1,14.1-14.1c7.8,0,14.1,6.3,14.1,14.2C142.1,161.6,135.8,167.9,128,167.9z" /><path fill="#000000" d="M128,93.1c-63.6,0-115.2,59.8-115.2,59.8s51.6,58.6,115.2,58.6c63.6,0,115.2-58.7,115.2-58.7S191.6,93.1,128,93.1z M128,206.9c-59.4,0-107.5-54-107.5-54s48.3-51.5,107.7-51.5c59.4,0,107.2,51.5,107.2,51.5S187.4,206.9,128,206.9z" /><path fill="#000000" d="M215,111.3c1.2-0.2,2.3-0.5,3.4-1c2.1-0.8,4-2,5.6-3.4c3.3-2.9,5.6-6.7,7.2-10.6c-1.9,3.8-4.5,7.3-7.9,9.7c-1.7,1.2-3.5,2.2-5.5,2.7c-1.9,0.6-4,0.8-5.9,0.5v0c-6.1-4.1-12.5-8-19.1-11.5c-0.2-0.1-0.4-0.2-0.5-0.3c1.6-0.7,3.1-1.5,4.5-2.4c2.4-1.6,4.5-3.7,6.1-6c3.3-4.7,4.7-10.3,5-15.8c-0.7,5.4-2.7,10.7-6.2,14.8c-1.7,2-3.8,3.7-6.1,4.9c-2.3,1.3-4.8,2.2-7.2,2.5v0c-8.4-4.1-17.2-7.5-26.3-10c1.4-1.1,2.7-2.4,3.9-3.8c2.5-2.8,4.3-6.1,5.5-9.6c2.4-7,2.2-14.3,1-21.2c0.5,7-0.2,14.2-3.2,20.3c-1.5,3-3.5,5.8-5.9,8c-2.2,2.1-5,3.8-7.6,4.7c-8.5-1.9-17.2-3-25.9-3.2c-0.8-2-1.5-4.3-2-6.5c-0.8-3.2-1.3-6.5-1.5-9.8c-0.5-6.6,0.1-13.4,1.7-20.1c-2.7,6.3-4.4,13.1-5,20c-0.3,3.5-0.3,7,0,10.5c0.2,2,0.4,3.9,0.8,5.8c-7.7,0.3-15.3,1.2-22.8,2.8c-2.6-0.9-5.3-2.6-7.6-4.6c-2.5-2.2-4.5-4.9-6-7.9c-3.1-6.1-3.9-13.2-3.5-20.2c-1.2,6.9-1.2,14.3,1.3,21.2c1.3,3.4,3.2,6.7,5.7,9.5c1.2,1.3,2.4,2.5,3.8,3.5c-8.7,2.3-17.2,5.5-25.4,9.3v0c-2.5-0.1-5.2-0.7-7.6-1.7c-2.5-1-4.8-2.4-6.8-4.3c-4.1-3.6-6.9-8.6-8.5-14c1.1,5.5,3.4,10.9,7.4,15.1c2,2.1,4.3,3.9,6.9,5.3c1.3,0.7,2.7,1.3,4.2,1.8c-0.6,0.3-1.3,0.6-1.9,0.9c-5.5,2.9-10.8,6.1-16,9.4c-1.8,0.2-3.8,0-5.6-0.6c-2-0.6-3.8-1.5-5.5-2.7c-3.3-2.4-5.9-5.9-7.9-9.7c1.6,3.9,3.9,7.7,7.2,10.6c1.6,1.4,3.5,2.6,5.6,3.4c1.1,0.4,2.1,0.7,3.2,0.9C31.5,117.4,20,127.3,10,138.4c8.1-7.7,16.8-14.6,25.9-20.9c9.1-6.3,18.6-12,28.6-16.7c19-9,39.6-14.9,60.5-15.3c0,0.1,0,0.1,0,0.2l0.5-0.2c0.8,0,1.6-0.1,2.4-0.1c21.9,0,43.5,6.1,63.4,15.6c10,4.7,19.5,10.4,28.6,16.7c9.2,6.2,17.9,13.1,26.1,20.7C236.8,128.3,226.3,119.2,215,111.3z" /></g></g>
                            </svg> : <svg onClick={()=> {setEyes(!eyes)}} xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enable-background="new 0 0 256 256" xml:space="preserve">
                                <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                                <g><g><path fill="#000000" d="M10,131c0,0,116.6-152.7,236,4C246,135.1,137.2,265,10,131z" /><path fill="#000000" d="M19.2,130.8c0,0,107.5-140.7,217.6,3.7C236.8,134.5,136.5,254.3,19.2,130.8z" /><path fill="#000000" d="M102.6,131.8c0,16,13,29,29,29c16,0,29-13,29-29c0-16-13-29-29-29C115.6,102.8,102.6,115.8,102.6,131.8z" /><path fill="#000000" d="M107.3,131.8c0,13.5,10.9,24.4,24.4,24.4c13.5,0,24.4-10.9,24.4-24.4c0-13.5-10.9-24.4-24.4-24.4C118.2,107.4,107.3,118.3,107.3,131.8z" /></g></g>
                            </svg>}

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

