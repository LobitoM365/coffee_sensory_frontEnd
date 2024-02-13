import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const GraficoCircular = ({ user }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const VariableIdUser = user;

        const dataToSend = {
          fecha: "2",
          muestras_id: '1'
        };

        const response = await axios.post(`http://localhost:3000/api/analisis/Mes/${VariableIdUser}`, dataToSend);
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

  }, [user]);

  const color = data.map(element => {
    if (element.promedio >= 8 && element.promedio < 11) {
      return "rgb(244, 50, 50)";
    } else if (element.promedio >= 4 && element.promedio < 8) {
      return "#4ec74e";
    } else {
      return "rgba(0, 0, 0, 0)";
    }
  });

  const chartData = {
    labels: data.map(element => element.fecha),
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
      setStyleCharts({ width: '1000px', height: '200px' });
    }
  }, [windowSize]);

  return (
    <div>
      <link rel="stylesheet" href="../../public/css/graficos.css" />
      {data && data.length > 0 ?
        <div style={styleCharts}>
          <Pie data={chartData} />
        </div>
        :
        ""
      }
    </div>
  );
};
