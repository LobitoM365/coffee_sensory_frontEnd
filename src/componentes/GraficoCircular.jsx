import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Api from './Api';

ChartJS.register(ArcElement, Tooltip, Legend);

export const GraficoCircular = ({ user }) => {
  const [data, setData] = useState([]);

  const [inputValue, setInputValue] = useState({
    muestras_id: '',
    fecha: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };


  console.log(inputValue.muestras_id,' valores de los inputs siiiiiiiii')
  useEffect(() => {
    const fetchData = async () => {
      try {
        const VariableIdUser = user;

        const dataToSend = {
          muestras_id: inputValue.muestras_id ,
          fecha: inputValue.fecha

        };
        console.log(inputValue,' valores de los inputs siiiiiiiii')
        const response = await Api.post(`analisis/Mes/${VariableIdUser}`, inputValue);
        const responseData = response.data;
        console.log(responseData,"No tiene Porque llegar")
        console.log(VariableIdUser,'USER')
        console.log(dataToSend,'info')
        if (responseData.status === true) {
          setData(responseData.data);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();

  }, [user,inputValue]);

  const color = data.map(element => {
    if (element.promedio >= 8 && element.promedio < 11) {
      return "rgb(244, 50, 50)";
    } else if (element.promedio >= 4 && element.promedio < 8) {
      return "#4ec74e";
    } else {
      return "rgba(0, 0, 0, 0)";
    }
  });
  const ResultLabel=[]
  data.map(element => ResultLabel.push(element.fecha.substring(0,3)))

  console.log(ResultLabel,"lo logreeeeeeeeeeeeeeee")
const ejemplo=['Feb', 'Feb', 'Feb', 'Feb', 'Feb'];
  const chartData = {
    labels:ResultLabel,
    datasets: [
      {
        label: 'Calidad',
        data: data.map(element => element.promedio),
        backgroundColor: color,
        borderWidth: 1,
      },
    ],
  };

  
  

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const [styleCharts, setStyleCharts] = useState({
    width: '1000px',
    height: '200px'
  });

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (windowSize.width >= 768 && windowSize.width <= 1244) {
      setStyleCharts({ width: '400px', height: '200px', margin: '10px' });
    } else if (windowSize.width >= 320 && windowSize.width <= 480) {
      setStyleCharts({ width: '100px', height: '50px' });
    } else {
      setStyleCharts({ width: '1500px', height: '320px',display:"flex", justifyContent:"center",alignItems:"center",margin:"auto",marginTop:"50px"});
    }
  }, [windowSize]);

  return (
    <div>

      <link rel="stylesheet" href="../../public/css/graficos.css" />

      <input type="text" onChange={handleInputChange} name="fecha" id="fecha" placeholder='Escribe algo para fecha...' value={inputValue.fecha} />
        <input type="text" onChange={handleInputChange} name="muestras_id" id="muestras_id" placeholder='Escribe algo para muestras...' value={inputValue.muestras_id} />
  
      {data && data.length > 0 ?
        <div style={styleCharts}>
        

          <Pie data={chartData}/>
        </div>
        :
        "No hay Datos por Mostrar "
      }
    </div>
  );
};
