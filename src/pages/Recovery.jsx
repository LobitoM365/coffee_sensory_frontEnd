import { useState } from "react";
import Api from "../componentes/Api"

const [email, setEmail] = useState({});

export const RecoveryPassword = () => {
    try {
        const response = Api.post('auth/sendEmail');
        console.log('RESPONSE EMAIL: ', response);
    } catch (error) {
        console.log('ERROR EMAIL: ', error);
    }


    return (
        <>
            <form action="">
                <input type="text" />
                
            </form>

        </>
    )
}