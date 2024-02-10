import React, { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom';


export const MenuInicio = ({ userInfo }) => {
    const [locationName, setLocation] = useState(location.pathname);


    return (
        <>
            <link rel="stylesheet" href="css/menuInicio.css" />

            <div className="menu-horizontal-inicio">
                <div className="logo">
                    <img className='logo-menu' src="../../public/img/logo-coffee-sensory.png" alt="" />
                </div>
                <nav>
                    <ul>
                        <li>
                            {locationName === "/" ? (
                                userInfo ? (
                                    <Link onClick={() => { setLocation(location.pathname) }} to="/dashboard">
                                        Menú Principal
                                    </Link>
                                ) : (
                                    <Link onClick={() => { setLocation(location.pathname) }} to="/login">
                                        Iniciar Sesión
                                    </Link>
                                )
                            ) : (
                                <Link onClick={() => { setLocation(location.pathname) }} to="">
                                    Mapa
                                </Link>
                            )}
                        </li>
                    </ul>
                </nav>

            </div>
            <Outlet />
        </>
    )
}