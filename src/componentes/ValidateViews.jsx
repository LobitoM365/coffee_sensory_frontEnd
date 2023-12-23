import Api from './Api';
import { useEffect, useState } from 'react';

export const validateViews = () => {
    const [responseValidate, setResponse] = useState(null);

    useEffect(() => {
        const authorized = async () => {
            try {
                const response = await Api.post('auth/protectViews', {});
                console.log('ok: ', response.data.authorized);

                if (!response.data.authorized) {
                    if (location.pathname !== '/' && location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                } else {
                    if (location.pathname === '/login') {
                        window.history.go(-1);
                    }
                }
                setResponse(response);
            } catch (error) {
                console.log('error: ', error);
            }
        };

        authorized();
    }, []);

    return responseValidate;
}

export const ProtectedRoute = ({ Element, allowRoles, userInfo }) => {
    const rol = userInfo ? userInfo.rol : null;
    console.log('ROL: ', allowRoles + ' ---- ' + rol);
    console.log('Element: ', Element);
    if (rol && allowRoles.includes(rol)) {
        return <Element />
    } else {
        if (window.history && window.history.length > 1) {
            window.history.go(-1);
          } else {
            window.location.href = '/dashboard';
          }
    }
}