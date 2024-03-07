import Select from 'react-select';
import axios from "axios";
import Api from './Api.jsx';
import { useState, useEffect } from 'react';



export const SelectComponent = (props) => {
  const [error, setError] = useState(null);
  const [opciones,setOpciones]=useState([])
  useEffect(()=>{
    const fechData= async ()=>{
      try {
        const response = await Api.post(props.url);
        const muestraData = response.data.data;
          if (response.data.data && response.data.data.length > 0) {
            
            let valorOption = props.opcion
            const nuevosDatos= muestraData.map(items=>({
              value:items.id,
              label:`${items.id} . ${items[valorOption]}`
            }))
            console.log(nuevosDatos,"estos tienen todos los datos")
            setOpciones(nuevosDatos);
          } else {
            setError("No se encontraron datos válidos en la respuesta de la API.");
          }
          
        
        
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setError("Error al obtener datos. Inténtalo de nuevo más tarde.");
      }
    }
    console.log(opciones,"estas son las opciones")


    fechData()
  },[])

      return (
        <div>
          
          <Select 
            options={opciones}
            name={props.name}
            id={props.id}
            placeholder={props.placeholder}
            onChange={props.onChange} 
            value={props.value}
            className={props.className}
          />
        </div>
      );
 
};





