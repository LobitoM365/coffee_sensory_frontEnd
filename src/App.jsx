
import { Route, Routes } from 'react-router-dom';
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

export default function App() {
  const [statusAlert, setStatusAlert] = useState(false);
  const [dataAlert, setdataAlert] = useState({});
  const responseValidateViews = validateViews();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!responseValidateViews) {
      console.log('VALIDATE VIEWS !: ', responseValidateViews);
      return;
    }

    console.log('VALIDATE VIEWS: ', responseValidateViews);
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

  return (
    <>
      <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />

      <Routes>
        <Route path='*' element={<NotFound />} />
        <Route path='/' element={<Loader />}>
          <Route path='/modalfinca' element={<ModalFinca />}></Route>
          <Route path='/' element={<MenuInicio userInfo={userInfo} />}>
            <Route path='/' element={<Inicio />} />
            <Route path='login' element={<Login />} />
          </Route>



          <Route path='/dashboard' element={<Menu />}>
            <Route path='' element={<Home />} />
            <Route path='profile' element={<Profile />} />
            <Route path="usuarios/registros" element={<ProtectedRoute allowRoles={'administrador'} userInfo={userInfo} Element={RegistrosUsuarios} />} />
            <Route path='formulario' element={<FormRegiser />} />
            <Route path='formatoSCA/registros' element={<RegistroFormatoSca />} />
            <Route path='fincas/registros' element={<Fincas />} />
            <Route path='lotes/registros' element={<Lotes />} />
            <Route path='muestras/verRegistros' element={<VerRegistros />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

