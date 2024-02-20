import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom';


export const MenuInicio = ({ userInfo }) => {
    const location = useLocation()

    console.log(location.pathname)
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
                            {location.pathname === "/" ? (
                                userInfo ? (
                                    <Link onClick={() => { location.pathname }} to="/dashboard">
                                        Menú Principal
                                    </Link>
                                ) : (
                                    <Link onClick={() => { location.pathname }} to="/login">
                                        Iniciar Sesión
                                    </Link>
                                )
                            ) : (
                                <Link onClick={() => { location.pathname }} to="">
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