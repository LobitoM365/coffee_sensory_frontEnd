import React, { useEffect, useState } from 'react';
import { Graficos } from '../componentes/Graficos';
import { GraficoCircular } from '../componentes/GraficoCircular';
import { SelectComponent } from '../componentes/SelectComponent';
import Api from '../componentes/Api';
/* import SinGraficosSVG from '../assets/svg/SinGraficos.svg'; */
import Logo from '../assets/SinGraficos.svg';

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
  const [Data,setData]=useState([])
  const[urlData,SetUrlData]=useState(false)
  const [urlId,setUrl]=useState()
 
  const [urlIdReady, setUrlIdReady] = useState(false);
  const [muestrasId, setMuestrasId] = useState(null);
  const [fechas,setFechas]=useState([])
  const [fechas2,setFechas2]=useState([])
  
  useEffect(() => {
    setUser(userInfo);
  }, [userInfo]);


  useEffect(() => {
    const IdUsuario = async () => {
      if (user?.id !== null && user?.id !== undefined) {
        const response = await Api.post(`analisis/total/${user.id}`, inputValue);
  
        setData(response.data.data);
        SetUrlData(true);
        console.log(Data, "hola no tienes registros disponibles");
  
        setUrl(`/analisis/total/${user.id}`,inputValue);
        setMuestrasId(inputValue.muestras_id); // Establece muestrasId
        setUrlIdReady(true);
        console.log(muestrasId, "opcion 2");
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
  
  console.log(Data,"sin datos")

  useEffect(() => {
   /*  if (inputValue.muestras_id) { */
      // Llamada a la API para obtener las fechas asociadas al muestras_id
      const obtenerFechas = async () => {
        try {
         
          const response = await Api.post(
            `/analisis/total/${user.id}`,inputValue
          );
          console.log(response,"si se consume")
  
          if (response.data.data && response.data.data.length > 0) {
            // Mapear los datos de fechas para el SelectComponent
            const nuevasFechas = response.data.data.map((fecha) => ({
              value: fecha.id,
              label: fecha.fecha,
            }));
  
            // Actualizar el estado para que SelectComponent muestre las nuevas fechas
            setFechas(nuevasFechas);
          } else {
            console.log(Data,"data de error12345")
            return(
              <>
                <Graficos user={user?.id} inputData={inputValue} />
                <GraficoCircular user={user?.id} inputData={inputValue} />
              </>
              
            )
          }
        } catch (error) {
          console.error("Error al obtener fechas:", error.message);
        }
      };
  
      obtenerFechas();
   /*  }else{
      setFechas2([
        {"value":"",
        "label":""}
      ]);
      console.log(fechas,"fechas")
    } */

  }, [inputValue.muestras_id]);
  useEffect(() => {
    const cargarFechas = async () => {
      try {
        if (urlIdReady) {
          const response = await Api.post(urlId)
          const nuevasFechas = response.data.data.map((item) => item.fecha);
          setFechas(nuevasFechas);
        }
      } catch (error) {
        console.error('Error al cargar las fechas:', error.message);
      }
    };

    cargarFechas();
  }, [urlId, urlIdReady]);

  
  if (Data === undefined||Data.length === 0 ) {
    
    console.log(Data,"aqui va un componente")
    return(
    <>
      <link rel="stylesheet" href="src/css/graficas.css" />
      <link rel="stylesheet" href="../../public/css/graficos.css" />
      <div id='graficos' >
      <div className='Graphic-none'>
        <div className="formulario">
            
                        
            {urlIdReady && (
          <SelectComponent
          metodos="post"
          name="fecha"
          id="fecha2"
          placeholder="Mes"
          onChange={(selectedOption) =>
          handleInputChange({
            target: { name: 'fecha', value: selectedOption.value },
          })
          }
          url={urlId}
          opcion="fecha"
          /* options={fechas && fechas.length > 0 ? fechas.map(fecha => ({ value: fecha.value, label: fecha.label })) : []} */
          options={fechas && fechas.length > 0 ? fechas.map(fecha => ({ value: fecha.value, label: fecha.label })) : null} 

          inputValueMuestras={inputValue.muestras_id}
          readonly

          />
          )}
          <SelectComponent
            metodos="post"
            name="muestras_id"
            id="muestras_id2"
            placeholder="Muestra"
            onChange={(selectedOption) =>
              handleInputChange({
                target: { name: 'muestras_id', value: selectedOption.value },
              })
            }
            url="muestra/listar"
            opcion="codigo_muestra"
            readonly
          /> 
          <input
            type="number"
            className="input"
            min="1900"
            max="2900"
            onChange={handleInputChange}
            name="anio"
            id="anio2"
            placeholder="Año"
            value={inputValue.anio}
            readonly
          />
          <input
            type="number"
            className="input limit"
            min="1"
            max="12"
            step="1"
            onChange={handleInputChange}
            name="limite"
            id="limite2"
            placeholder="Cantidad"
            value={inputValue.limite}
            readonly
          />
          </div>
           
              <Graficos user={user?.id} inputData={inputValue} />
              <GraficoCircular user={user?.id} inputData={inputValue} />
           </div>
           
        </div>
       
  
        
      </>
    )
  }else{
    return (
      <>
        <link rel="stylesheet" href="src/css/graficas.css" />
        <link rel="stylesheet" href="../../public/css/graficos.css" />
  
        <div  className="BoxMain">
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
            /* options={fechas && fechas.length > 0 ? fechas.map(fecha => ({ value: fecha.value, label: fecha.label })) : []} */
            options={fechas && fechas.length > 0 ? fechas.map(fecha => ({ value: fecha.value, label: fecha.label })) : null} 
 
            inputValueMuestras={inputValue.muestras_id}


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
            <div className="BoxOptions one">
              <div className="colors extraordinario"></div>
              <h3>Extraordinario</h3>
            </div>
            <div className="BoxOptions two">
              <div className="colors excelente"></div>
              <h3>Excelente</h3>
            </div>
            <div className="BoxOptions three">
              <div className="colors MyBueno"></div>
              <h3>Muy Bueno</h3>
            </div>
            <div className="BoxOptions for">
              <div className="colors bueno"></div>
              <h3>Bueno</h3>
            </div>
          </div>
  
          
        </div>
      </>
    );
  }
 

 
  
};
