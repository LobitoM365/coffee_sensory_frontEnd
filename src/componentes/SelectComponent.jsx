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
        const response = await Api[props.metodos](props.url);
        
        console.log("llego metodos ", props.metodos, "llego la url ", props.url)
        const muestraData = response.data.data;

        console.log(muestraData,"si consume desde select")
          if (response.data.data && response.data.data.length > 0) {
            
            let valorOption = props.opcion
            console.log(props.opcion, "esto es una opcion")
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
            styles={{
              control: (provided) => ({
                ...provided,
                margin: '10px',
                border: 'none',
                borderBottom:'1px solid gray',
                transition: 'border 0.3s linear',
                textAlign:"center",
                '&:hover': {
                  borderBottom: '1px solid blue', // Cambiar el color del borde en hover
                  backgroundColor: 'rgb(239, 245, 245)', // Cambiar el color de fondo en hover
                  border: '2px solid linear', // Agregar el borde en hover
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderTop: 'none',
                  animation: 'colores 10s infinite', // Agregar la animación en hover
                },
                '@keyframes colores': {
                  '0%': {
                    borderBottom: '2px solid red',
                  },
                  '25%': {
                    borderBottom: '2px solid green',
                  },
                  '50%': {
                    borderBottom: '2px solid blue',
                  },
                  '75%': {
                    borderBottom: '2px solid yellow',
                  },
                  '100%': {
                    borderBottom: '2px solid grey',
                  },
                },
              }),
            }}
            
          />
        </div>
      );
 
};





