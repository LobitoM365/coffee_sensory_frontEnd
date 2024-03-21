import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import io from 'socket.io-client';
import { host } from './componentes/Api.jsx';

const socket = io('http://' + host + ':3000', {
  withCredentials: true
});
socket.on('connect_error', (error) => {

});
const Root = () => {
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <BrowserRouter>
      <App socket={socket} />
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
