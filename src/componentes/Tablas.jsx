import React, { useEffect, useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';

import Api from './Api';

function Tablas() {
  const [info,setInfo]=useState();
  useEffect(()=>{
    const buscarInfo=async()=>{
      try {
        const response=await Api.get("/usuarios/listar");
        setInfo(response.data)
        /* console.log(response.data) */
      } catch (error) {
        console.error('Se encontro un error al listar el usuario: ',error);
      }
    }
    buscarInfo();
    const  columns=[
      {
        header:"ID",
        accessor:'id'
      },
      { 
        header:"Nombre",
        accessor:'nombre'
      },
      {
        header:"Apellido",
        accessor:'apellido'
      },
      {
        header:"Numero de documento",
        accessor:'numero_documentos'
      },
      {
        header:"Telefono",
        accessor:'telefono'
      },
      {
        header:"Email",
        accessor:'correo_electronico'
      },
      {
      header:"Tipo de documento",
      accessor:'tipo_documento'
      },
      {
        header:"Rol",
        accessor:'rol'
      },
      {
        header:"Cargo",
        accessor:'cargo'
      },
      {
        header:"Estado",
        accessor:'estado'
      }
    ] 

    console.log(info)
    console.log(columns)

    const table = useReactTable({ columns,data:info,getCoreRowModel:getCoreRowModel()})
    console.log(table)
  },[])

   /*  */
  return (
    <div>
      
      {/* <table>
        <thead>
          {
            table.getHeaderGroups().map(headerGroup=>(
              <tr key={headerGroup.id}>
                {
                  headerGroup.headers.map(header=>(
                    <th key={header.id}>
                      {header.column.columnDef.header}
                    </th>
                  ))
                }
              </tr>
            ))
          }
        </thead>
        <tbody>
          {
            table.getRowModel().rows.map(row=>{
              <tr key={row.id}>
                {row.getVisibleCells().map(cell=>{
                  <td>{flexRender(cell.column.columnDef.cell,cell.getContext())}</td>
                })}
              </tr>
            })
          }
        </tbody>
      </table> */}
    </div>
  )
}
export default Tablas
