import React, { useState, useEffect ,useRef} from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Api from './Api';

ChartJS.register(ArcElement, Tooltip, Legend);

export const GraficoCircular = ({ user , inputData}) => {
  const [data, setData] = useState([]);
  const chartRef = useRef(null);
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
    const fetchData = async () => {
      try {

        console.log(nuevoDato,"todos los datos 111111111111111111112222222222")
        const VariableIdUser = user;
        const SetDataInput={
          "muestras_id":inputData.muestras_id,
          "fecha":inputData.fecha,
          "anio":inputData.anio,
          "limite":inputData.limite
        }
        
        const response = await Api.post(`analisis/Mes/${VariableIdUser}`, SetDataInput);
        const responseData = response.data;
        console.log(responseData,"No tiene Porque llegar")
        console.log(VariableIdUser,'USER')
        
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

  }, [user,nuevoDato]);

  const color = data.map(element => {
    if (element.promedio >= 8 && element.promedio < 11) {
      return "rgb(244, 50, 50)";
    } else if (element.promedio >= 6 && element.promedio < 8) {
      return "#4ec74e";
    } else if(element.promedio >= 4 && element.promedio < 6) {
      return "rgb(39, 11, 174)";
    }else{
      return "rgb(255, 174, 0)";
    }
  });
  const ResultLabel=[]
  data.map(element => ResultLabel.push(element.fecha.substring(0,3)))


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
    /* if (windowSize.width >= 768 && windowSize.width <= 1366 ) {
      setStyleCharts({ width: '10px', height: '25vh',display:"flex", justifyContent:"center",alignItems:"center",margin:"auto",marginTop:"1%"});
    } if (windowSize.width >= 768 && windowSize.width <= 920) {
      setStyleCharts({ width: '40vh', height: '20vh',display:"flex", justifyContent:"center",alignItems:"center",margin:"auto",marginTop:"0%"});
    } */ if (windowSize.width >= 720 && windowSize.width <= 1280) {
      setStyleCharts({ width: '50vh', height: '23vh',display:"flex", justifyContent:"center",alignItems:"center",margin:"auto",marginTop:"1%"});
    } // Portatil
    
    else if ( windowSize.width <= 768) {
      setStyleCharts({ width: '20vh', height: '20vh' ,display:"flex", justifyContent:"center",alignItems:"center",margin:"auto",marginTop:"1%" });
    } // celular
     else {
      setStyleCharts({ width: '100vh', height: '28vh',display:"flex", justifyContent:"center",alignItems:"center",margin:"auto",marginTop:"1%"});
    }//tamaño grande 
  }, [windowSize]);

  return (
    <div id='graficos'>

      <link rel="stylesheet" href="../../public/css/graficos.css" />
      
        
  
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
