import React, { useEffect, useState } from 'react';
import { Graficos } from '../componentes/Graficos';
import { GraficoCircular } from '../componentes/GraficoCircular';
import { SelectComponent } from '../componentes/SelectComponent';


export const Home = ({ userInfo }) => {

  if (!userInfo) {
    console.log(userInfo,"no llega nada");
  }

  const [user, setUser] = useState(userInfo);
  const [inputValue, setInputValue] = useState({
    muestras_id: '',
    fecha: '',
    anio: '',
    limite: '',
  });
  const [dataUpdate, setDataUpdate] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal
  const [selectComponentUrl, setSelectComponentUrl] = useState('');
  const [urlId,setUrl]=useState()
 
  const [urlIdReady, setUrlIdReady] = useState(false);
  const [muestrasId, setMuestrasId] = useState(null);
  
  
  
  useEffect(() => {
    setUser(userInfo);
  }, [userInfo]);

  useEffect(() => {
    const IdUsuario = async () => {
      if (user?.id !== null && user?.id !== undefined) {
        
          setUrl(`/analisis/total/${user.id}`);
          
          setMuestrasId(inputValue.muestras_id); // Establece muestrasId
          setUrlIdReady(true);
          console.log(muestrasId,"opcion 2")
        
       
      }
    };
  
    IdUsuario();
  }, [user, inputValue.muestras_id]);
  

  useEffect(() => {
    if (inputValue.muestras_id) {
      setUrlIdReady(true);
    }
  }, [inputValue.muestras_id]);
  

    console.log(urlId,"url")
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const num = '';

    const newValue =
      name === 'limite' && (!isNaN(value) || value === null)
        ? parseFloat(value) || num
        : value || num;

    setInputValue((prevInputValue) => ({
      ...prevInputValue,
      [name]: newValue,
    }));
  };

   // Actualiza el estado user con userInfo directamente
  
  console.log(inputValue,"valores del input")
  // Actualiza la URL de SelectComponent cuando cambia el usuario
  

  

 

 
  return (
    <>
      <link rel="stylesheet" href="src/css/graficas.css" />
      <link rel="stylesheet" href="../../public/css/graficos.css" />

      <div id='graficos' className="BoxMain">
        <div  className="BoxGraficas">
           
          <div className="formulario">

            
             {urlIdReady && (
        <SelectComponent
          metodos="post"
          name="fecha"
          id="fecha"
          placeholder="Mes"
          onChange={(selectedOption) =>
            handleInputChange({
              target: { name: 'fecha', value: selectedOption.value },
            })
          }
          url={urlId}
          opcion="fecha"
         
        />
      )}
            <SelectComponent
              metodos="post"
              name="muestras_id"
              id="muestras_id"
              placeholder="Muestra"
              onChange={(selectedOption) =>
                handleInputChange({
                  target: { name: 'muestras_id', value: selectedOption.value },
                })
              }
              url="muestra/listar"
              opcion="codigo_muestra"
              
            /> 
            <input
              type="number"
              className="input"
              min="1900"
              max="2900"
              onChange={handleInputChange}
              name="anio"
              id="anio"
              placeholder="Año"
              value={inputValue.anio}
            />
            <input
              type="number"
              className="input limit"
              min="1"
              max="12"
              step="1"
              onChange={handleInputChange}
              name="limite"
              id="limite"
              placeholder="Cantidad"
              value={inputValue.limite}
            />
          </div>

          {/* Asegúrate de que Graficos y GraficoCircular reciban los datos correctamente */}
          <Graficos user={user?.id} inputData={inputValue} />
          <GraficoCircular user={user?.id} inputData={inputValue} />
        </div>

        <div className="Tablecolors">
          <div className="BoxOptions">
            <div className="colors extraordinario"></div>
            <h3>Extraordinario</h3>
          </div>
          <div className="BoxOptions">
            <div className="colors excelente"></div>
            <h3>Excelente</h3>
          </div>
          <div className="BoxOptions">
            <div className="colors MyBueno"></div>
            <h3>Muy Bueno</h3>
          </div>
          <div className="BoxOptions">
            <div className="colors bueno"></div>
            <h3>Bueno</h3>
          </div>
        </div>

        
      </div>
    </>
  );
};
