import Api from './Api';
import { useEffect } from 'react';

export const validateViews = () => {

    useEffect(() => {
        authorized();
    }, []);

    async function authorized() {
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
            })
            .catch((error) => {
                console.log('error: ', error);
            })
    }
}
