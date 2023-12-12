import React from 'react'



export const Tablas = (array) => {


    let data = [];
    let print = []
    let keysData = [];
    let keysPrint = [];

    if (array.data) {
        data = array.data
        keysData = Object.keys(data[0])

    }
    if (array.keys) {
        print = array.keys
        keysPrint = Object.keys(print)

    }

    return (
        <>
            <link rel="stylesheet" href="../../public/css/tableComponent.css" />

            <h2>Fincas</h2>
            <table className='table-component' cellSpacing={0}>
                <thead>
                    <tr>
                        {keysPrint.map((keys, index) => {
                            if (keysData.includes(keys)) {
                                return <th key={index}>{print[keys]["referencia"]}</th>;
                            }
                        })}
                    </tr>
                </thead >
                <tbody>

                    {data.map((keysD, valuesD) => ( 
                        <tr>  
                            {
                                keysPrint.map((keys, index) => {
                                    if (keysData.includes(keys)) {
                                        if (keys == "estado") {
                                            if (data[valuesD][keys] == 0) {
                                                return <td key={index}><h4 onClick={()=>updateEstado()} className='estado-0'>Inactivo</h4></td>;
                                            } else {
                                                return <td key={index}><h4 className='estado-1'>Activo</h4></td>;
                                            }
                                        } else {
                                            return <td key={index}><h4>{data[valuesD][keys]}</h4></td>;
                                        }
                                    }
                                })
                            }
                        </tr>
                    ))}


                </tbody>

            </table >
        </>
    )
}