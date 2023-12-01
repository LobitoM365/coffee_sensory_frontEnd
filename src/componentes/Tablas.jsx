import{ useReactTable} from'@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import Api from './Api';

function Tablas() {
  const [info,setInfo]=useState();
  useEffect(()=>{
    const buscarInfo=async()=>{
      try {
        const response=await Api.get("/usuarios/listar");
        setInfo(response.data)
      } catch (error) {
        console.error('Se encontro un error al listar el usuario: ',error);
      }
    }
    buscarInfo();
  })
  const  columns=[
    {
      header:"ID",
      accessorKey:'id'
    },
    { 
      header:"Nombre",
      accessorKey:'nombre'
    },
    {
      header:"Apellido",
      accessorKey:'apellido'
    },
    {
      header:"Numero de documento",
      accessorKey:'numero_documentos'
    },
    {
      header:"Telefono",
      accessorKey:'telefono'
    },
    {
      header:"Email",
      accessorKey:'correo_electronico'
    },
    {
    header:"Tipo de documento",
    accessorKey:'tipo_documento'
    },
    {
      header:"Rol",
      accessorKey:'rol'
    },
    {
      header:"Cargo",
      accessorKey:'cargo'
    },
    {
      header:"Estado",
      accessorKey:'estado'
    }
  ]
   const table = useReactTable({ Api,columns})
  return (
    <div>
      <table>
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
          
        </tbody>
      </table>
    </div>
  )
}

export default Tablas
