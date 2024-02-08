import axios from "axios";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export const Graficos =  () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/analisis/total/1');
        const responseData = response.data;
        setData(responseData.data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, []);

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"]; // Colores para las barras

  const createChart = (datos) => {
    return (
      <div className="graphicBox">
        <link rel="stylesheet" href="../../public/css/graficos.css" />
        <h3 className="title-graphic">{datos.menssage}</h3>
        <div className="contentGraphic">
          <ResponsiveContainer width="70%" aspect={2}>
            <BarChart
              data={datos.data}
              width={100}
              height={500}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              
            >
              
              <CartesianGrid strokeDasharray="4" />
              <XAxis dataKey='fecha' />
              <YAxis />
              <Tooltip />
              <Bar dataKey="promedio" label={{ position: "top" }}>
                
              </Bar>
            </BarChart>
          </ResponsiveContainer>

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
      </div>
    );
  };

  return (
    <div>
      {data.map((element, index) => (
        <div key={`chart-${index}`}>
          {createChart(element)}
        </div>
      ))}
    </div>
  );
};


