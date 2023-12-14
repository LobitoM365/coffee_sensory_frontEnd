import Api from './Api';
import { useEffect, useState } from 'react';

export const validateViews = (loadValidateViews) => {
    // const [responseValidate, setResponse] = useState(null);

    useEffect(() => {
        authorized(loadValidateViews);
    }, []);

    async function authorized(loadValidateViews) {
        await Api.post('auth/protectViews', {})
            .then((response) => {
                console.log('ok: ', response.data.authorized);
                if (!response.data.authorized) {
                    if (location.pathname != '/Login') {
                        location.href = '/Login'
                    }
                } else {
                    if (location.pathname == '/login') {
                        window.history.go(-1)
                    }
                }
                loadValidateViews(response)
                // setResponse(response);
            })
            .catch((error) => {
                // loadValidateViews()
                console.log('error: ', error);
                // setResponse(error);
            })
    }

    // return responseValidate;
}
