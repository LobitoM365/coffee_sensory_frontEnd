// LoginForm.js
import Api from "../componentes/Api"
import React, { useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validationError, setValidationError] = useState(null);
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
                console.log('ok:', response);
                if (response.data.errors) {
                    const credentialsError =response.data.errors['credentials_error'];
                    console.log(response.data.errors['credentials_error']);
                    setValidationError(credentialsError);
                } else {
                 navigate('/dashboard')
                }
            })
            .catch((error) => {
                console.log('ERROR: ', error);
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
                            {validationError && <div className="credentials-error"> {validationError}</div>}
                        </div>
                        <button type="submit">Iniciar sesión</button>
                    </form>
                </div>
                <div className="login-image-container">
                    <img src="../../public/img/login/login_size.jpg" className='login-image' alt="Imagen de inicio de sesión" />
                </div>
            </div>
        </div>
    );
};

export default Login;
