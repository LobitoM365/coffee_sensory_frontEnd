import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import Api from './Api.jsx';

export const SelectComponent = (props) => {
  const [error, setError] = useState(null);
  const [opciones, setOpciones] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api[props.metodos](props.url);


        if (response.data.data && response.data.data.length > 0) {
          let valorOption = props.opcion;
          console.log(props.opcion, 'esto es una opción');

          const nuevosDatos = response.data.data.map((item) => ({
            value: item.id,
            label: `${item.id} . ${item[valorOption]}`,
          }));

          
          setOpciones(nuevosDatos);
        } else {
          setError('No se encontraron datos válidos en la respuesta de la API.');
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setError('Error al obtener datos. Inténtalo de nuevo más tarde.');
      }
    };

    console.log(opciones, 'estas son las opciones');
    fetchData();
  }, [props.metodos, props.url, props.opcion]);

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
