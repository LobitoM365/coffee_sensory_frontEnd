import axios from "axios";
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { element } from "prop-types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const Graficos = () => {
  const [data, setData] = useState([]);
  const [todo, setToo] = useState([]);
  const [key, setKey] = useState(0);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/analisis/total/1');
        const responseData = response.data;
        if (responseData.status == true) {
          setData(responseData.data);          
        }else{
          setData([
           
          ]);          
        }
        setToo(response);
        // console.log(responseData,"DATA RESPONSE")
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
    window.addEventListener("resize", function(){
      setKey(key + 1)
      console.log(key + 1)
    })
  }, []);
 
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "GRAFICA DE BARRAS",
        fontSize: 20, // Tamaño de fuente
        fontColor: 'blue', // Color del texto
        fontStyle: 'italic', 
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
    barThickness: 60, // Ajusta este valor según tus necesidades
    responsive: true,
    maintainAspectRatio: false,
  
  };

  const color = [];

  data.forEach(element=>{
    if (element.promedio>=8 && element.promedio < 11) {
      color.push ("rgb(244, 50, 50)")
    }else if (element.promedio>=4 && element.promedio < 8) {
      color.push("#4ec74e")
    }

    console.log(color, "colores")
  })
  
   const chartData={
    
      labels: data.map(element => element.fecha),
      datasets: [
        {
          label: data.map(element=>element.fecha),
          data: data.map(element => element.promedio),
          backgroundColor: color.map(element=>element),
          borderRadius:5,
          datalabels: {
           display:false,
          },
        },
      ],
    };

  
  
    return ( 
      <div key={key}>
        <link rel="stylesheet" href="../../public/css/graficos.css" />
          {data ? data.length > 0 ? 
        <div style={{ width: '1000px', height: '500px' }}>

          <Bar options={options} data={chartData} /> 
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
          :   
          "No hay nada para mostrar" 
          : "No hay nada para mostrar" }
          
      
        
      </div>
    );
  
  
  
  
};
