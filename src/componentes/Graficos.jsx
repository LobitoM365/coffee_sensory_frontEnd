import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import Api from "./Api";
import { useParams } from "react-router-dom";
import {ResponsiveContainer,BarChart,CartesianGrid,XAxis,YAxis,Tooltip,Legend,Bar}from "recharts";
import '../../public/css/graficos.css';

export const Graficos= ()=>{
   /*  let {id}=useParams()
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


    const data =[
        {nombre:"Enero",calidad:8,color:"yellow"},
        {nombre:"Febrero",calidad:6},
        {nombre:"Marzo",calidad:4},
        {nombre:"Abril",calidad:10},
        {nombre:"Mayo",calidad:8},
    ];
    let color = data.map(item => item.calidad === 8 ? "white" : "black");
    
    console.log(color)

   
    return(
        <div className="graphicBox">
            <ResponsiveContainer width="50%" aspect={2}>
            <BarChart
            data={data}
            width={100}
            height={500}
            margin={{
                top:5,
                right:30,
                left:20,
                bottom:5
            }}>
                <CartesianGrid strokeDasharray="4" />
                <XAxis dataKey="nombre"/>
                <YAxis/>
                
                <Legend/>
                <Bar dataKey="calidad" maxBarSize={30} fill={color[i]}/>
            </BarChart>
        </ResponsiveContainer>
        </div>
        
    )
    
}