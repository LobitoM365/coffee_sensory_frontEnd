import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import io from 'socket.io-client';
import { host } from './componentes/Api.jsx';
import { Alert } from './componentes/alert.jsx'


const socket = io('http://' + host + ':3000', {
  withCredentials: true
});


const Root = () => {
  const [serverStatus, setServerStatus] = useState(true)
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Conectado al servidor');
      setServerStatus(true);
    });

    socket.on('connect_error', (error) => {
      console.error('Error de conexión:', error);
      setServerStatus(false);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <BrowserRouter>
      <App socket={socket} serverStatus={serverStatus} />
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
