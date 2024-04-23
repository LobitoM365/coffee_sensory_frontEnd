
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
import { PruebaPdf } from './pages/PruebaPdf.jsx';
import { GeneratePdfTable } from './pages/generatePdfTable.jsx';
import { RecoveryPassword } from './pages/recoveryPassword.jsx';
import { GenerateReporteAnalisis } from './pages/generateReporteAnalisis.jsx';
import { Formatos } from './pages/formatos.jsx';
import { contains } from 'jquery';
import { Cell } from 'recharts';
import "../public/css/internalServerError.css"
import { Veredas } from './pages/veredas.jsx';

export default function App(data) {
  const [statusAlert, setStatusAlert] = useState(false);
  const [dataAlert, setdataAlert] = useState({});
  const responseValidateViews = validateViews({});
  const [userInfo, setUserInfo] = useState(null);
  const locationPath = useLocation();
  const [valueDarkMode, changeDarkMode] = useState(JSON.parse(localStorage.getItem("darkMode")));

  useEffect(() => {

    if (!responseValidateViews) {
      return
    }

    async function LogoutSesion() {
      // alert('?xd')
      // const navigate = useNavigate();
      try {
        const response = await Api.post("/auth/close");
        location.href = '/Login'

      } catch (e) {
        location.href = '/Login'

      }

    };
    if (responseValidateViews) {
      if (responseValidateViews.data) {
        if (responseValidateViews.data.permission == false) {
          setStatusAlert(true);
          setdataAlert({
            buttonDefault: "Continuar",
            backGroundColor: "rgb(4 22 37)",
            icon: <img className="icon-ban-alert" src="../../public/img/imgBan.png" alt="" />,
            status: "false",
            description: responseValidateViews.data.message,
            continue: {
              "function": LogoutSesion,
            },
            tittle: "No tienes acceso!",
          });
        } else if (responseValidateViews.data !== undefined) {
          setUserInfo(responseValidateViews.data.user);
        } else {
          setStatusAlert(true);
          setdataAlert({
            status: "false",
            description: 'Intente acceder de nuevo más tarde.',
            "tittle": "Error interno del servidor! ",
          });
        }
      }
    }
  }, [responseValidateViews]);

  async function validateViewsxd() {
    let responseValidate;
    const authorized = async () => {
      try {
        const response = await Api.post('auth/protectViews', {});

        if (response.data.permission == false) {
        } else if (!response.data.authorized) {
          /* if (locationPath.pathname.includes('dashboard')) {
            window.location.href = '/login';
          } */
        } else {
          if (locationPath.pathname.toLocaleLowerCase() === '/login') {
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
  }, [locationPath.pathname])
  useEffect(() => {
    // setTimeout(() => {
    //   const imgLoad = document.querySelectorAll("img")


    //   for (let x = 0; x < imgLoad.length; x++) {
    //     if (imgLoad[x]) {
    //       if (imgLoad[x].parentNode) {
    //         const divsImgLoad = imgLoad[x].parentNode.querySelectorAll(".div-load-img")
    //         if (divsImgLoad.length == 0) {
    //           const bboxImg = imgLoad[x].getBoundingClientRect()
    //           const styles = window.getComputedStyle(imgLoad[x])
    //           const div = document.createElement("div")
    //           /*   for (var i = 0; i < styles.length; i++) {
    //               var estilo = styles[i]; 
    //               div.style.setProperty(estilo, styles.getPropertyValue(estilo));  
    //             } */
    //           let zIndex = styles.getPropertyValue("z-index")
    //           zIndex = (!isNaN(parseFloat(zIndex)) ? parseFloat(zIndex) : 0)
    //           const widthImg = styles.getPropertyValue("width");
    //           const heihtImg = styles.getPropertyValue("height");
    //           div.style.zIndex = (zIndex < 0 ? zIndex * -1 : zIndex)
    //           div.classList.add("div-load-img")
    //           div.style.position = "absolute"
    //           div.style.width = imgLoad[x].parentNode.scrollWidth + "px"
    //           div.style.height = imgLoad[x].parentNode.scrollHeight + "px"
    //           div.style.top = styles.getPropertyValue("width") + "px"
    //           div.style.left = styles.getPropertyValue("left") + "px"
    //           div.style.right = styles.getPropertyValue("right") + "px"
    //           div.style.bottom = styles.getPropertyValue("bottom") + "px"
    //           div.style.background = "black"
    //           console.log(imgLoad[x], "loaddd")

    //           imgLoad[x].parentNode.appendChild(div)

    //           window.addEventListener("resize", function () {
    //             const bboxImg = imgLoad[x].getBoundingClientRect()
    //             div.style.width = imgLoad[x].scrollWidth + "px"
    //             div.style.height = imgLoad[x].scrollHeight + "px"
    //             div.style.top = bboxImg.top + "px"
    //             div.style.left = bboxImg.left + "px"
    //           })
    //         }
    //       }
    //     }
    //   }
    // }, [100])

  }, [<Route></Route>])
  return (
    <>
      {data.serverStatus == false ?
        <div className='main-div-internal-server-error'>
          <div className='div-internal-server-error'>
            <div className='div-internal-server-error-visual'>
              <h4 className='h4-internal-server-error'>5</h4>
              <img src="../../public/img/InternalServerError.png" alt="" />
              <h4 className='h4-internal-server-error'>0</h4>
            </div>
            <div>
              <p>An error ocurred and your request couldn't be completed.</p>
              <p className='p-report'>Please report this problem.</p>
            </div>
          </div>
        </div>
        :
        <>
          <Alert setStatusAlert={setStatusAlert} statusAlert={statusAlert} dataAlert={dataAlert} />
          <Routes>

            {/* Rutas Públicas */}
            <Route path='/recover' element={<RecoveryPassword />} />
            <Route path='pruebaPdf' element={<PruebaPdf />} />
            <Route path='/dashboard/generatePdfTable/' element={<GeneratePdfTable />} />
            <Route path='/dashboard/generateReporteAnalisis/:id' element={<GenerateReporteAnalisis userInfo={userInfo} />} />
            <Route path='/'>
              <Route path='/' element={<MenuInicio userInfo={userInfo} />}>
                <Route path='/' element={<Inicio />} />
                <Route path='login' element={<Login socket={data.socket} />} />
              </Route>

              {/* Rutas privadas */}
              {console.log(responseValidateViews)}
              {responseValidateViews ? responseValidateViews.data ? responseValidateViews.data["authorized"] == false ? "" :
                <Route path='/dashboard' element={<Menu userInfo={userInfo} socket={data.socket} valueDarkMode={valueDarkMode} changeDarkMode={changeDarkMode} />}>
                  <Route path='' element={<Home userInfo={userInfo} />} />
                  <Route path='profile' element={<Profile userInfo={userInfo} valueDarkMode={valueDarkMode} />} />
                  <Route path="usuarios/registros" element={userInfo ? <ProtectedRoute allowRoles={'administrador'} userInfo={userInfo} Element={RegistrosUsuarios} /> : ""} />
                  <Route path='formulario' element={<FormRegiser userInfo={userInfo} />} />
                  <Route path='formatoSCA/registros' element={<RegistroFormatoSca userInfo={userInfo} />} />
                  <Route path='fincas/registros' element={<Fincas userInfo={userInfo} />} />
                  <Route path='analisis/registros' element={<Analisis socket={data.socket} userInfo={userInfo} />} />
                  <Route path='formatos/registros' element={<Formatos socket={data.socket} userInfo={userInfo} />} />
                  <Route path='cafes/registros' element={<Cafes userInfo={userInfo} />} />
                  <Route path='departamentos/registros' element={userInfo ? <ProtectedRoute allowRoles={'administrador'} userInfo={userInfo} Element={Departamentos} /> : ""} />
                  <Route path='municipios/registros' element={userInfo ? <ProtectedRoute allowRoles={'administrador'} userInfo={userInfo} Element={Municipios} /> : ""} />
                  <Route path='variedades/registros' element={userInfo ? <ProtectedRoute allowRoles={'administrador'} userInfo={userInfo} Element={Variedades} /> : ""} />
                  <Route path='veredas/registros' element={userInfo ? <ProtectedRoute allowRoles={'administrador'} userInfo={userInfo} Element={Veredas} /> : ""} />
                  <Route path='muestras/registros' element={<Muestras userInfo={userInfo} />} />
                  <Route path='lotes/registros' element={<Lotes userInfo={userInfo} />} />
                  <Route path='muestras/verRegistros' element={<VerRegistros userInfo={userInfo} />} />
                </Route>
                : "" : ""}
              {responseValidateViews ?
                <Route path='*' element={<NotFound responseValidate={responseValidateViews} />} />
                : ""}
            </Route>

          </Routes>
        </>
      }



    </>
  )
}

