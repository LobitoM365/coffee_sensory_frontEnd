
import { Route, Routes } from 'react-router-dom';
import { Menu } from "./pages/Menu.jsx";
import { RegistrosUsuarios } from './pages/registrosUsuarios.jsx';
import { Home } from './pages/home.jsx';
import { Inicio } from './pages/inicio.jsx';
import { Profile } from './pages/profile.jsx';
import Login from './pages/Login.jsx';
import { Graficos } from './componentes/graficos.jsx';

export default function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Inicio />}>
        </Route>
        <Route path='/login' element={<Login />} />
        
        
        <Route path='/dashboard' element={<Menu />}>
          <Route path='' element={<Home />} />
          <Route path='profile' element={<Profile />} />
          <Route path='usuarios/registros' element={<RegistrosUsuarios />} />
          
        </Route>
      </Routes>
    </>
  )
}   