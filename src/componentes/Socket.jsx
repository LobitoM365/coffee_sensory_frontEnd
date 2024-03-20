import React, { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export const Socket = (event, excute) => {
    useEffect(() => {
        // Escuchar el evento desde el backend
        const handleEvent = (data) => {
            console.log('Funcion ejecutada');
            excute();
        }

        socket.on(event, handleEvent);

        // Limpiar el efecto al desmontar el componente
        return () => {
            socket.off(event, handleEvent);
        };

    }, [event, excute]);

    return (
        <></>
    );
};

