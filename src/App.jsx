
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


export default function App() {

  const responseValidateViews = validateViews();
  let userInfo;

  if (!responseValidateViews) {
    return <div className="">CARGANDO</div>
  } else {
    userInfo = responseValidateViews.data.user;
    console.log('VALIDATEVIEWS: ', userInfo ? userInfo.rol : null);
  }


  return (
    <>
      <Routes>
      <Route path='*' element={<NotFound/>} />

        <Route path='/' element={<Loader />}>
          <Route path='/modalfinca' element={<ModalFinca />}></Route>

          <Route path='/' element={<Inicio />}>
          </Route>

          <Route path='login' element={<Login />} />


          <Route path='/dashboard' element={<Menu />}>
            <Route path='' element={<Home />} />
            <Route path='profile' element={<Profile />} />

            <Route
              path="usuarios/registros"
              element={
                <ProtectedRoute
                  allowRoles={'administrador'}
                  userInfo={userInfo}
                  Element={RegistrosUsuarios}
                />
              }
            />

            <Route path='formulario' element={<FormRegiser />} />
            <Route path='formatoSCA/registros' element={<RegistroFormatoSca />} />
            <Route path='fincas/registros' element={<Fincas />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

