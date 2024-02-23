import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

ReactDOM.createRoot(document.getElementById('root')).render(

      <BrowserRouter>
        <App />
      </BrowserRouter>
   
)
