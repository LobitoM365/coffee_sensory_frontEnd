import React, { useEffect, useState } from 'react';
import { Graficos } from '../componentes/Graficos';
import { GraficoCircular } from '../componentes/GraficoCircular';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {SelectComponent} from "../componentes/SelectComponent"


export const Home = ({ userInfo }) => {
  const [user, setUser] = useState(userInfo);
  const [inputValue, setInputValue] = useState({
    muestras_id: '',
    fecha: '',
    anio:'',
    limite:''
  });
  const [dataUpdate,setDataUpdate]= useState({})

  const handleInputChange = (event) => {
    const { name, value } = event.target;
  
    // Validar si el nombre es 'limite' y si el valor es un número
    const newValue = name === 'limite' && !isNaN(value) ? parseFloat(value) : value;
  
    setInputValue((prevInputValue) => ({
      ...prevInputValue,
      [name]: newValue
    }));
  };

  // Actualiza el estado user cada vez que userInfo cambia
  useEffect(() => {
    setUser(userInfo);
  }, [userInfo]);

  const UserId = user?.id;

  // Envia los datos actualizados a GraficoCircular cuando cambian
  useEffect(() => {
    // Asegúrate de que el componente GraficoCircular tenga una función updateData para actualizar sus datos
    
      const updatedData = {
        userId: UserId,
        inputData: inputValue
      };
      // Llama a una función en GraficoCircular para actualizar los datos en tiempo real
      // Ejemplo: updateData(updatedData);
      console.log("Datos actualizados:", updatedData);
      setDataUpdate(updatedData.inputData)

    // Llama a la función para enviar los datos actualizados
    
  }, [UserId,  inputValue]);

  console.log(dataUpdate, "se actualizan los datos")

  return (
    <>
      <link rel="stylesheet" href="src/css/graficas.css" />
      <link rel="stylesheet" href="../../public/css/graficos.css" />
      
      <div className='BoxMain'>
      
        <div className='BoxGraficas'>
        <div className='formulario'>
        <input type="number" className='input' min="1" max="12" step="1" onChange={handleInputChange} name="fecha" id="fecha" placeholder='Mes...' value={inputValue.fecha} />
        <input type="text" className='input' onChange={handleInputChange} name="muestras_id" id="muestras_id" placeholder='Muestra...' value={inputValue.muestras_id} />
        <input type="number" className='input' min="1900" max="2900" onChange={handleInputChange} name="anio" id="anio" placeholder='Año...' value={inputValue.anio} />
        <input type="number" className='input limit' min="1" max="12" step="1" onChange={handleInputChange} name="limite" id="limite" placeholder='Cantidad Resultados...' value={inputValue.limite} />
      </div>
          <SelectComponent/>
          {/* Asegúrate de que Graficos y GraficoCircular reciban los datos correctamente */}
          <Graficos user={user?.id} inputData={dataUpdate}/>
          <GraficoCircular user={user?.id} inputData={dataUpdate} />
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
