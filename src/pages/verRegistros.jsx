import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { TableFormatoSca } from "../componentes/tableFormatoSca";


export const VerRegistros = () => {


    return (
        <>
            <link rel="stylesheet" href="/css/formatoSca.css" />
            

            <TableFormatoSca/>
        </>
    )
}