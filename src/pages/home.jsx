import React, { useEffect, useState } from 'react';
import { Graficos } from '../componentes/Graficos';

export const Home = (userInfo) => {
    const [user,setUser] = useState(userInfo)
    useEffect(()=>{

            setUser(userInfo)
        
    },[userInfo])

    return (

        <>
            <link rel="stylesheet" href="src\css\graficas.css" />
            
            <div className='BoxMain'>
             <Graficos user={user}/>
            </div>
                
            
        </>
    );
};
