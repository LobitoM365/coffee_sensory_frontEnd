import axios from "axios";
import Api from '../componentes/Api.jsx';
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

export const Graficos = ({user,inputData}) => {
  const [data, setData] = useState([]);
  const [key, setKey] = useState(0);
  const [nuevoDato, setNuevoDato] = useState([]);

  // Esta función se llamará cuando los datos se actualicen
  const updateData = (newData) => {
    // Actualiza el gráfico con los nuevos datos
    // Utiliza la referencia al gráfico o cualquier método que utilices para actualizar el gráfico
    console.log('Actualizando gráfico con nuevos datos:', newData);
    setNuevoDato(newData);
  };
  
  // Actualiza el gráfico cuando los datos cambian
  useEffect(() => {
    if (inputData) {
      updateData(inputData);
    }
  }, [inputData]);
  
  // Utiliza un useEffect adicional para observar cambios en el estado nuevoDato
  useEffect(() => {
    // Acciones que deseas realizar después de que nuevoDato se haya actualizado
    console.log(nuevoDato, "aquiiiiiiiiiiiiiiii");
    // Puedes realizar otras acciones aquí
  }, [nuevoDato]);
  
  useEffect(() => {
    console.log(nuevoDato,"desde graficos siii")
    const fetchData = async () => {
      try {
        let VariableIdUser=user;
        console.log(VariableIdUser,'Hola desde graficos')
       /*  let UserIdSesion = user?.user?.userInfo || 0;
        console.log(UserIdSesion,"Inicio Sesion");
        if (!UserIdSesion) {
          console.log('UserIdSesion es nulo');
          return;
        }  */
        const dataToSend ={
          muestras_id: nuevoDato.muestras_id,
          anio:nuevoDato.anio
        };
        const response = await Api.post(`analisis/total/${VariableIdUser}`,dataToSend);
        const responseData = response.data;
       /*  console.log(dataToSend,'Data Body', UserIdSesion.id , 'User')
        console.log(responseData,'responseData') */

        console.log(responseData,'ResponseData')
        if (responseData.status === true) {
          setData(responseData.data);          
        }else{
          setData([
           
          ]);          
        }
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
  }, [user,nuevoDato ]);
 
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
  console.log(data,'')
  data.forEach(element=>{
    if (element.promedio>=8 && element.promedio < 11) {
      color.push ("rgb(244, 50, 50)")
    }else if (element.promedio>=6 && element.promedio < 8) {
      color.push("#4ec74e")
    }else if(element.promedio>=4 && element.promedio < 6){
      color.push("rgb(39, 11, 174)")
    }else{
      color.push("rgb(255, 174, 0)")
    }

    console.log(color, "colores")
  })
  const ResultLabel=[]
  data.map(element => ResultLabel.push(element.fecha.substring(0,3)))
   const chartData={
    
      labels: data.map(element => element.fecha),
      datasets: [
        {
          label: "Calidad",
          data: data.map(element => element.promedio),
          backgroundColor: color.map(element=>element),
          borderRadius:5,
          datalabels: {
           display:true,
          },
        },
      ],
    };


    
      const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
      });
    
      const [StilyCharts, setStilyCharts] = useState({
        width: '1000px',
        height: '200px',
        display:'flex',
        justifyContent: "center",
        alignItems:"center",
        marginLeft:"100px"
      });
    
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };
    
      useEffect(() => {
        // Suscribirse al evento de cambio de tamaño de la ventana
        window.addEventListener('resize', handleResize);
    
        // Limpieza: Desuscribirse al desmontar el componente
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);
    
      useEffect(() => {
        // Actualizar el estado de StilyCharts según el tamaño de la pantalla
        if (windowSize.width >= 768 && windowSize.width <= 1244) {
          setStilyCharts({ width: '400px', height: '200px' ,margin:'10px'});
        } else if (windowSize.width >= 320 && windowSize.width <= 480) {
          setStilyCharts({ width: '100px', height: '50px' });
        }else{
          setStilyCharts({ width: '1200px', height: '300px' ,marginLeft:'50px', marginTop:'20px'});
        }
      }, [windowSize]);

     

  //==============================================

    return ( 
      <div key={key}>
        <link rel="stylesheet" href="../../public/css/graficos.css" />
          {data ? data.length > 0 ? 
        <div  style={StilyCharts} >

          <Bar options={options} data={chartData} /> 
          
        </div>
          :   
          "No hay nada para mostrar" 
          : "No hay nada para mostrar" }
          
      </div>
    );
};
