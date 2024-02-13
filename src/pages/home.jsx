import React, { useEffect, useState } from 'react';
import { Graficos } from '../componentes/Graficos';
import { GraficoCircular } from '../componentes/GraficoCircular';

export const Home = ({ userInfo }) => {
  const [user, setUser] = useState(userInfo);

  // Actualiza el estado user cada vez que userInfo cambia
  useEffect(() => {
    setUser(userInfo);
  }, [userInfo]);

  const UserId = user?.id;
  console.log(UserId,'USER INICIO')
  return (
    <>
      <link rel="stylesheet" href="src/css/graficas.css" />
      <link rel="stylesheet" href="../../public/css/graficos.css" />

      <div className='BoxMain'>
        <div className='BoxGraficas'>
          {/* Asegúrate de que Graficos y GraficoCircular reciban los datos correctamente */}
          <Graficos user={UserId} />
          <GraficoCircular user={user?.id} />
        </div>

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
    </>
  );
};
