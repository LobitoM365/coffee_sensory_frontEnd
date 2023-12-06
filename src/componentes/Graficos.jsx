import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import Api from "./Api";
import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";
import "../../public/css/graficos.css";

export function Graficos (datos,titulo)  {
  /* let {id}=useParams()
    const [data,setdatos]=useState([]);
    useEffect(()=>{
        const buscar= async ()=>{
            try {
                const response = await Api.get(`${url}/${id}`);
                setdatos(response.data)
            } catch (error) {
                console.error("error fetching tasks:" , error)
            }
        };
        buscar();
    },[]); */

    useEffect(()=>{

    },[])
    
    let data = datos.datos

    console.log(data)

 
let colors =[];


data.map((fecha)=>{

  
  let mes = new Date(fecha.fecha);

  let nombreMes = mes.toLocaleString('default', { month: 'long' })
  fecha['fecha']=nombreMes
  console.log(fecha['fecha'])
})
data.map((items)=>{
    if (items.promedio>=9 && items.promedio<=10) {
        colors.push('rgb(244, 50, 50)')
    }else if(items.promedio>=8 && items.promedio<9){
        colors.push(' #4ec74e')
    }else if(items.promedio>=7 && items.promedio<8){
        colors.push('rgb(39, 11, 174)')
    }else if(items.promedio>=6 && items.promedio<7){
        colors.push('rgb(255, 174, 0)')
    }else{
        colors.push('gray')
    }
})
console.log(colors)
console.log (titulo)

return (
    <div className="graphicBox">
      <h3>{titulo.mensaje}</h3>
      <ResponsiveContainer width="70%" aspect={2}>
        <BarChart
          data={data}
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
          <Bar
            dataKey="promedio"
           
            label={{ position: "top" }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % 20]} />
            ))}
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
  );
};
