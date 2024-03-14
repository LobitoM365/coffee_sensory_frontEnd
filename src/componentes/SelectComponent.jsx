import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Api from './Api.jsx';

export const SelectComponent = (props) => {
  const [error, setError] = useState(null);
  const [opciones, setOpciones] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api[props.metodos](props.url);
        console.log(response.data.data, "Aquí van las muestras");

        if (response.data.data && response.data.data.length > 0) {
          const valorOption = props.opcion;

          const nuevosDatos = response.data.data.map((item) => ({
            value: item.id,
            label: `${item.id}. ${item[valorOption]}`,
          }));

          setOpciones(nuevosDatos);
        } else {
          console.error("No se encontraron datos válidos en la respuesta");
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setError('Error al obtener datos. Inténtalo de nuevo más tarde.');
      }
    };
    
    fetchData();
  }, [props.metodos, props.url, props.opcion]);

  // Seleccciones toma las opciones pasadas como props o las opciones obtenidas de la API
  const Seleccciones = !props.inputValueMuestras ? opciones : props.options;
  console.log(Seleccciones, "Estas son las opciones");

  return (
    <div>
      <Select
        options={Seleccciones}
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
            borderBottom: '1px solid gray',
            transition: 'border 0.3s linear',
            textAlign: 'center',
            '&:hover': {
              borderBottom: '1px solid blue',
              backgroundColor: 'rgb(239, 245, 245)',
              border: '2px solid linear',
              borderLeft: 'none',
              borderRight: 'none',
              borderTop: 'none',
              animation: 'colores 10s infinite',
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
