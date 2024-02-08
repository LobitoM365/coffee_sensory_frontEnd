import React, { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom';


export const MenuInicio = ({ userInfo }) => {
    const [locationName, setLocation] = useState(location.pathname);
    console.log('MENU INCIO: ', userInfo);

    return (
        <>
            <link rel="stylesheet" href="css/menuInicio.css" />

            <div className="menu-horizontal-inicio">
                <div className="logo">
                    <img className='logo-menu' src="/img/logoCoffeeSensory.png" alt="" />
                </div>
                <nav>
                    <ul>
                        <li>
                            {locationName === "/" ? (
                                userInfo ? (
                                    <Link onClick={() => { locationName = location.pathname }} to="/dashboard">
                                        Menú Principal
                                    </Link>
                                ) : (
                                    <Link onClick={() => { locationName = location.pathname }} to="/login">
                                        Iniciar Sesión
                                    </Link>
                                )
                            ) : (
                                <Link onClick={() => { locationName = location.pathname }} to="">
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