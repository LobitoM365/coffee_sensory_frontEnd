
import { Route, Routes } from 'react-router-dom';
import { Menu } from "./pages/Menu.jsx";
import { RegistrosUsuarios } from './pages/registrosUsuarios.jsx';
import { Home } from './pages/home.jsx';
import { Inicio } from './pages/inicio.jsx';
import { Profile } from './pages/profile.jsx';
import Login from './pages/Login.jsx';
import { ModalFinca } from './pages/xd.jsx';
import { RegistroFormatoSca } from './pages/registrosFormatoSCA.jsx';
import { Fincas } from './pages/fincas.jsx';
import { validateViews } from './componentes/ValidateViews.jsx';

import { FormRegiser } from './componentes/FormRegister.jsx';

export default function App() {
  validateViews()
  return (
    <>
      <Routes>
        <Route path='/modalfinca' element={<ModalFinca />}></Route>

        <Route path='/' element={<Inicio />}>
        </Route>

        <Route path='/login' element={<Login />} />


        <Route path='/dashboard' element={<Menu />}>
          <Route path='' element={<Home />} />
          <Route path='profile' element={<Profile />} />
          <Route path='usuarios/registros' element={<RegistrosUsuarios />} />
          <Route path='formulario' element={<FormRegiser />} />
          <Route path='formatoSCA/registros' element={<RegistroFormatoSca />} />
          <Route path='fincas/registros' element={<Fincas />} />
        </Route>
      </Routes>
    </>
  )
}

