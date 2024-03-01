import Select from 'react-select';
import axios from "axios";
import Api from './Api.jsx';
import { useState, useEffect } from 'react';



export const SelectComponent = () => {
    const data = [
        {value:'Opcion1',label: 'Opción 1' },
        {value:'Opcion2',label: 'Opción 2' },
        {value:'Opcion3',label: 'Opción 3' },
        {value:'Opcion4',label: 'Opción 4' },
        {value:'Opcion5',label: 'Opción 5' },
        {value:'Opcion6',label: 'Opción 6' },
      ];
    
      return (
        <div>
          
          <Select
            options={data}
            placeholder="Seleccione Una Opcion"
            
          />
        </div>
      );
 
};





 /* const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState({label: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.post(`muestra/listar`);
        setData(response.data.data[0]); // Asegúrate de que data[0] sea un objeto
        console.log(data, "desde select");

        const option = {
          label: data, // Ajusta según la propiedad que desees mostrar como etiqueta
        };

        setSelectedOption(option);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []); // Dependencia vacía para que se ejecute solo una vez al montar el componente

  return (
    <div>
      <label>Selecciona una opción:</label>
      <Select
        options={[selectedOption]}  // Debe ser un array de opciones
        value={selectedOption.id}
        
      />
    </div>
  ); */