
import { Route, Routes, useLocation } from 'react-router-dom';
import { Menu } from "./pages/Menu.jsx";
import { RegistrosUsuarios } from './pages/registrosUsuarios.jsx';
import { Home } from './pages/home.jsx';
import { Inicio } from './pages/inicio.jsx';
import { Profile } from './pages/profile.jsx';
import { Login } from './pages/Login.jsx';
import { ModalFinca } from './pages/xd.jsx';
import { RegistroFormatoSca } from './pages/registrosFormatoSCA.jsx';
import { Fincas } from './pages/fincas.jsx';
import { validateViews, ProtectedRoute } from './componentes/ValidateViews.jsx';
import { FormRegiser } from './componentes/FormRegister.jsx';
import { Loader } from './componentes/loader.jsx';
import { NotFound } from './pages/NotFound.jsx';
import { VerRegistros } from './pages/verRegistros.jsx';
import { Lotes } from './pages/lotes.jsx';
import { MenuInicio } from './pages/MenuInicio.jsx';
import { Alert } from './componentes/alert.jsx';
import { useEffect, useState } from 'react';
import Api from './componentes/Api.jsx';
import { Municipios } from './pages/municipios.jsx';
import { Departamentos } from './pages/departamentos.jsx';
import { Variedades } from './pages/variedades.jsx';
import { Muestras } from './pages/muestras.jsx';
import { Cafes } from './pages/cafes.jsx';
import { Analisis } from './pages/analisis.jsx';
import { io } from 'socket.io-client';

export default function App() {
  const [statusAlert, setStatusAlert] = useState(false);
  const [dataAlert, setdataAlert] = useState({});
  const responseValidateViews = validateViews();
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();
  const socket = io('http://localhost:3000', {
    withCredentials: true
  });

  useEffect(() => {

    if (!responseValidateViews) {

      return;
    }


    if (responseValidateViews.data !== undefined) {
      setUserInfo(responseValidateViews.data.user);
    } else {
      setStatusAlert(true);
      setdataAlert({
        status: "false",
        description: 'Intente acceder de nuevo más tarde.',
        "tittle": "Error interno del servidor! ",
      });
    }
  }, [responseValidateViews]);

  async function validateViewsxd() {
    let responseValidate;
    const authorized = async () => {
      try {
        const response = await Api.post('auth/protectViews', {});

        if (!response.data.authorized) {
          if (location.pathname !== '/' && location.pathname !== '/login') {
            window.location.href = '/login';
          }
        } else {
          if (location.pathname === '/login') {
            window.history.go(-1);
          }
        }
        responseValidate = response
        return responseValidate;
      } catch (error) {
        responseValidate = error

      }
    };
    authorized();


  };
  useEffect(() => {
    validateViewsxd();
  }, [location.pathname])
  return (
    <>
      <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />

      <Routes>
        
        <Route path='/' element={<Loader />}>
          <Route path='/modalfinca' element={<ModalFinca />}></Route>
          <Route path='/' element={<MenuInicio userInfo={userInfo} />}>
            <Route path='/' element={<Inicio />} />
            <Route path='login' element={<Login />} />
          </Route>



          <Route path='/dashboard' element={<Menu socket={socket} />}>
            <Route path='' element={<Home />} />
            <Route path='profile' element={<Profile />} />
            <Route path="usuarios/registros" element={userInfo ? <ProtectedRoute allowRoles={'administrador'} userInfo={userInfo} Element={RegistrosUsuarios} /> : ""} />
            <Route path='formulario' element={<FormRegiser />} />
            <Route path='formatoSCA/registros' element={<RegistroFormatoSca />} />
            <Route path='fincas/registros' element={<Fincas />} />
            <Route path='analisis/registros' element={<Analisis socket={socket} userInfo={userInfo} />} />
            <Route path='cafes/registros' element={<Cafes />} />
            <Route path='departamentos/registros' element={userInfo ? <ProtectedRoute allowRoles={'administrador'} userInfo={userInfo} Element={Departamentos} /> : ""} />
            <Route path='municipios/registros' element={userInfo ? <ProtectedRoute allowRoles={'administrador'} userInfo={userInfo} Element={Municipios} /> : ""} />
            <Route path='variedades/registros' element={userInfo ? <ProtectedRoute allowRoles={'administrador'} userInfo={userInfo} Element={Variedades} /> : ""} />
            <Route path='muestras/registros' element={<Muestras />} />
            <Route path='lotes/registros' element={<Lotes />} />
            <Route path='muestras/verRegistros' element={<VerRegistros />} />
          </Route>
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
      
    </>
  )
}

