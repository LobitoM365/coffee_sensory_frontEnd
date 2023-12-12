import React from "react"


export const Slider = () => {
    return (

        <div className="contenido">
            <link rel="stylesheet" href="../../public/css/formatoSca.css" />

            <div className="formato-sca">
                <div className="notas1">
                    <h4 className="tittle-notas1">Sample#</h4>
                </div>
                <div className="nivel-tostion">
                    <h4 className="tittle-nivel-tostion">Nivel de tostion</h4>
                    <div className="range">
                        <div className="linea-centro"></div>
                        <div className="linea"></div>
                        <div className="linea"></div>
                        <div className="linea"></div>
                        <div className="linea"></div>
                        <div className="linea"></div>
                        <div className="input-range">
                            <input className="range-nivel-intensidad range-intensidad" type="range"  min="0" max="4"
                                step="1"/>
                        </div>
                        <div className="value value-range-intensidad">0</div>
                        <div className="range-color-inicial">
                        </div>
                        <div className="div-range-color">
                            <div className="range-color">
                                <div className="color color-1-nivel-tostion"></div>
                                <div className="color color-2-nivel-tostion"></div>
                                <div className="color color-3-nivel-tostion"></div>
                                <div className="color color-4-nivel-tostion"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="fragancia-aroma">
                    <div className="area-puntaje">
                        <h4 className="h4-puntaje"> Puntaje:</h4>
                        <h5 className="tittle"> Fragancia/Aroma</h5>
                        <div className="puntaje-range puntaje-item">0</div>

                        <div className="div-range">
                            <div className="guia-range-item">
                                <div className="linea6">
                                    <h6 className="numero-guia-range-item">6</h6>
                                </div>
                                <div className="linea-lado"></div>
                                <div className="linea-medio"></div>
                                <div className="linea-lado"></div>
                                <div className="linea7">
                                    <h6 className="numero-guia-range-item">7</h6>
                                </div>
                                <div className="linea-lado"></div>
                                <div className="linea-medio"></div>
                                <div className="linea-lado"></div>
                                <div className="linea8">
                                    <h6 className="numero-guia-range-item">8</h6>
                                </div>
                                <div className="linea-lado"></div>
                                <div className="linea-medio"></div>
                                <div className="linea-lado"></div>
                                <div className="linea9">
                                    <h6 className="numero-guia-range-item">9</h6>
                                </div>
                                <div className="linea-lado"></div>
                                <div className="linea-medio"></div>
                                <div className="linea-lado"></div>
                                <div className="linea10">
                                    <h6 className="numero-guia-range-item">10</h6>
                                </div>
                            </div>
                            <input className="range-puntaje input-range-puntaje" type="range" name="" id=""  min="6"
                                max="10" step="0.25"/>
                        </div>
                    </div>
                    <div className="area-intensidad">
                        <div className="range1-area-intensidad range">
                            <h6 className="seco-area-intensidad tittle-area-intensidad">Seco</h6>
                            <div className="linea-centro"></div>
                            <div className="linea"></div>
                            <div className="linea"></div>
                            <div className="linea"></div>
                            <div className="linea"></div>
                            <div className="linea"></div>
                            <div className="linea"></div>
                            <div className="input-range">
                                <input className="range-nivel-intensidad range-intensidad" type="range"  min="0"
                                    max="5" step="0.1"/>
                            </div>
                            <div className="value value-range-intensidad">0</div>
                            <div className="range-color-inicial">
                            </div>
                            <div className="div-range-color">
                 
                                <div className="div-range-color-intensidad">
                                    <div className="color-intensidad"></div>
                                </div>
                            </div>
                        </div>
                        <div className="calidad-area-intensidad">
                            <h6 className="tittle-calidad-area-intensidad">Calidad:</h6>
                            <div className="div-puntaje1-calidad-area-intensidad"></div>
                            <div className="div-puntaje2-calidad-area-intensidad"></div>
                        </div>
                        <div className="range2-area-intensidad range">
                            <h6 className="espuma-area-intensidad tittle-area-intensidad">Espuma</h6>
                            <div className="linea-centro"></div>
                            <div className="linea"></div>
                            <div className="linea"></div>
                            <div className="linea"></div>
                            <div className="linea"></div>
                            <div className="linea"></div>
                            <div className="linea"></div>
                            <div className="input-range">
                                <input className="range-nivel-intensidad range-intensidad" type="range"  min="0"
                                    max="5" step="0.1"/>
                            </div>
                            <div className="value value-range-intensidad">0</div>
                            <div className="range-color-inicial">
                            </div>
                            <div className="div-range-color">

                                <div className="div-range-color-intensidad">
                                    <div className="color-intensidad"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sabor">
                    <h4 className="h4-puntaje"> Puntaje:</h4>
                    <h5 className="tittle"> Sabor</h5>
                    <div className="puntaje-range puntaje-item">0</div>
                    <div className="div-range">
                        <div className="guia-range-item">
                            <div className="linea6">
                                <h6 className="numero-guia-range-item">6</h6>
                            </div>
                            <div className="linea-lado"></div>
                            <div className="linea-medio"></div>
                            <div className="linea-lado"></div>
                            <div className="linea7">
                                <h6 className="numero-guia-range-item">7</h6>
                            </div>
                            <div className="linea-lado"></div>
                            <div className="linea-medio"></div>
                            <div className="linea-lado"></div>
                            <div className="linea8">
                                <h6 className="numero-guia-range-item">8</h6>
                            </div>
                            <div className="linea-lado"></div>
                            <div className="linea-medio"></div>
                            <div className="linea-lado"></div>
                            <div className="linea9">
                                <h6 className="numero-guia-range-item">9</h6>
                            </div>
                            <div className="linea-lado"></div>
                            <div className="linea-medio"></div>
                            <div className="linea-lado"></div>
                            <div className="linea10">
                                <h6 className="numero-guia-range-item">10</h6>
                            </div>
                        </div>
                        <input className="range-puntaje input-range-puntaje" type="range" name="" id=""  min="6"
                            max="10" step="0.25"/>
                    </div>
                </div>
                <div className="sabor-residual">
                    <h4 className="h4-puntaje"> Puntaje:</h4>
                    <h5 className="tittle"> Sabor residual</h5>
                    <div className="puntaje-range puntaje-item">0</div>
                    <div className="div-range">
                        <div className="guia-range-item">
                            <div className="linea6">
                                <h6 className="numero-guia-range-item">6</h6>
                            </div>
                            <div className="linea-lado"></div>
                            <div className="linea-medio"></div>
                            <div className="linea-lado"></div>
                            <div className="linea7">
                                <h6 className="numero-guia-range-item">7</h6>
                            </div>
                            <div className="linea-lado"></div>
                            <div className="linea-medio"></div>
                            <div className="linea-lado"></div>
                            <div className="linea8">
                                <h6 className="numero-guia-range-item">8</h6>
                            </div>
                            <div className="linea-lado"></div>
                            <div className="linea-medio"></div>
                            <div className="linea-lado"></div>
                            <div className="linea9">
                                <h6 className="numero-guia-range-item">9</h6>
                            </div>
                            <div className="linea-lado"></div>
                            <div className="linea-medio"></div>
                            <div className="linea-lado"></div>
                            <div className="linea10">
                                <h6 className="numero-guia-range-item">10</h6>
                            </div>
                        </div>
                        <input className="range-puntaje input-range-puntaje" type="range" name="" id=""  min="6"
                            max="10" step="0.25"/>
                    </div>
                </div>
                <div className="acidez">
                    <div className="area-puntaje">
                        <h4 className="h4-puntaje"> Puntaje:</h4>
                        <h5 className="tittle"> Acidez</h5>
                        <div className="puntaje-range puntaje-item">0</div>

                        <div className="div-range">
                            <div className="guia-range-item">
                                <div className="linea6">
                                    <h6 className="numero-guia-range-item">6</h6>
                                </div>
                                <div className="linea-lado"></div>
                                <div className="linea-medio"></div>
                                <div className="linea-lado"></div>
                                <div className="linea7">
                                    <h6 className="numero-guia-range-item">7</h6>
                                </div>
                                <div className="linea-lado"></div>
                                <div className="linea-medio"></div>
                                <div className="linea-lado"></div>
                                <div className="linea8">
                                    <h6 className="numero-guia-range-item">8</h6>
                                </div>
                                <div className="linea-lado"></div>
                                <div className="linea-medio"></div>
                                <div className="linea-lado"></div>
                                <div className="linea9">
                                    <h6 className="numero-guia-range-item">9</h6>
                                </div>
                                <div className="linea-lado"></div>
                                <div className="linea-medio"></div>
                                <div className="linea-lado"></div>
                                <div className="linea10">
                                    <h6 className="numero-guia-range-item">10</h6>
                                </div>
                            </div>
                            <input className="range-puntaje input-range-puntaje" type="range" name="" id=""  min="6"
                                max="10" step="0.25"/>
                        </div>
                    </div>
                    <div className="area-intensidad">
                        <div className="range1-area-intensidad range">
                            <h6 className="seco-area-intensidad tittle-intensidad">Intensidad</h6>
                            <div className="linea-centro"></div>
                            <div className="linea"></div>
                            <div className="linea"></div>
                            <div className="linea"></div>
                            <div className="linea"></div>
                            <div className="linea"></div>
                            <div className="linea"></div>
                            <div className="input-range">
                                <input className="range-nivel-intensidad range-intensidad" type="range"  min="0"
                                    max="5" step="0.1"/>
                            </div>
                            <div className="value value-range-intensidad">0</div>
                            <div className="range-color-inicial">
                            </div>
                            <div className="div-range-color">

                                <div className="div-range-color-intensidad">
                                    <div className="color-intensidad"></div>
                                </div>
                            </div>
                        </div>
                        <div className="intensidad-area-intensidad">
                            <h6 className="tittle-alta-area-intensidad">Alta</h6>
                            <h6 className="tittle-baja-area-intensidad">Baja</h6>
                        </div>
                    </div>
                </div>
                <div className="cuerpo">
                    <div className="area-puntaje">
                        <h4 className="h4-puntaje"> Puntaje:</h4>
                        <h5 className="tittle"> Cuerpo</h5>
                        <div className="puntaje-range puntaje-item">0</div>

                        <div className="div-range">
                            <div className="guia-range-item">
                                <div className="linea6">
                                    <h6 className="numero-guia-range-item">6</h6>
                                </div>
                                <div className="linea-lado"></div>
                                <div className="linea-medio"></div>
                                <div className="linea-lado"></div>
                                <div className="linea7">
                                    <h6 className="numero-guia-range-item">7</h6>
                                </div>
                                <div className="linea-lado"></div>
                                <div className="linea-medio"></div>
                                <div className="linea-lado"></div>
                                <div className="linea8">
                                    <h6 className="numero-guia-range-item">8</h6>
                                </div>
                                <div className="linea-lado"></div>
                                <div className="linea-medio"></div>
                                <div className="linea-lado"></div>
                                <div className="linea9">
                                    <h6 className="numero-guia-range-item">9</h6>
                                </div>
                                <div className="linea-lado"></div>
                                <div className="linea-medio"></div>
                                <div className="linea-lado"></div>
                                <div className="linea10">
                                    <h6 className="numero-guia-range-item">10</h6>
                                </div>
                            </div>
                            <input className="range-puntaje input-range-puntaje" type="range" name="" id=""  min="6"
                                max="10" step="0.25"/>
                        </div>
                    </div>
                    <div className="area-intensidad">
                        <div className="range1-area-intensidad range">
                            <h6 className="seco-area-intensidad tittle-intensidad">Nivel</h6>
                            <div className="linea-centro"></div>
                            <div className="linea"></div>
                            <div className="linea"></div>
                            <div className="linea"></div>
                            <div className="linea"></div>
                            <div className="linea"></div>
                            <div className="linea"></div>
                            <div className="input-range">
                                <input className="range-nivel-intensidad range-intensidad" type="range"  min="0"
                                    max="5" step="0.1"/>
                            </div>
                            <div className="value value-range-intensidad">0</div>
                            <div className="range-color-inicial">
                            </div>
                            <div className="div-range-color">

                                <div className="div-range-color-intensidad">
                                    <div className="color-intensidad"></div>
                                </div>
                            </div>
                        </div>
                        <div className="intensidad-area-intensidad">
                            <h6 className="tittle-alta-area-intensidad">Pesado</h6>
                            <h6 className="tittle-baja-area-intensidad">Ligero</h6>
                        </div>
                    </div>
                </div>
                <div className="uniformidad">
                    <h4 className="h4-puntaje"> Puntaje:</h4>
                    <h5 className="tittle"> Uniformidad</h5>
                    <div className="puntaje-select puntaje-item">10</div>
                    <div className="select-cuadro">
                        <div className="cuadro-select focus-no-active"></div>
                        <div className="cuadro-select focus-no-active"></div>
                        <div className="cuadro-select focus-no-active"></div>
                        <div className="cuadro-select focus-no-active"></div>
                        <div className="cuadro-select focus-no-active"></div>
                    </div>
                </div>


                <div className="balance">
                    <h4 className="h4-puntaje"> Puntaje:</h4>
                    <h5 className="tittle"> Balance</h5>
                    <div className="puntaje-range puntaje-item">0</div>
                    <div className="div-range">
                        <div className="guia-range-item">
                            <div className="linea6">
                                <h6 className="numero-guia-range-item">6</h6>
                            </div>
                            <div className="linea-lado"></div>
                            <div className="linea-medio"></div>
                            <div className="linea-lado"></div>
                            <div className="linea7">
                                <h6 className="numero-guia-range-item">7</h6>
                            </div>
                            <div className="linea-lado"></div>
                            <div className="linea-medio"></div>
                            <div className="linea-lado"></div>
                            <div className="linea8">
                                <h6 className="numero-guia-range-item">8</h6>
                            </div>
                            <div className="linea-lado"></div>
                            <div className="linea-medio"></div>
                            <div className="linea-lado"></div>
                            <div className="linea9">
                                <h6 className="numero-guia-range-item">9</h6>
                            </div>
                            <div className="linea-lado"></div>
                            <div className="linea-medio"></div>
                            <div className="linea-lado"></div>
                            <div className="linea10">
                                <h6 className="numero-guia-range-item">10</h6>
                            </div>
                        </div>
                        <input className="range-puntaje input-range-puntaje" type="range" name="" id=""  min="6"
                            max="10" step="0.25"/>
                    </div>
                </div>
                <div className="taza-limpia">
                    <h4 className="h4-puntaje"> Puntaje:</h4>
                    <h5 className="tittle"> Taza limpia</h5>
                    <div className="puntaje-select puntaje-item">10</div>
                    <div className="select-cuadro">
                        <div className="cuadro-select focus-no-active"></div>
                        <div className="cuadro-select focus-no-active"></div>
                        <div className="cuadro-select focus-no-active"></div>
                        <div className="cuadro-select focus-no-active"></div>
                        <div className="cuadro-select focus-no-active"></div>
                    </div>
                </div>
                <div className="dulzor">
                    <h4 className="h4-puntaje"> Puntaje:</h4>
                    <h5 className="tittle"> Dulzor</h5>
                    <div className="puntaje-select puntaje-item">10</div>
                    <div className="select-cuadro">
                        <div className="cuadro-select focus-no-active"></div>
                        <div className="cuadro-select focus-no-active"></div>
                        <div className="cuadro-select focus-no-active"></div>
                        <div className="cuadro-select focus-no-active"></div>
                        <div className="cuadro-select focus-no-active"></div>
                    </div>
                </div>
                <div className="puntaje-catador">
                    <h4 className="h4-puntaje"> Puntaje:</h4>
                    <h5 className="tittle"> Puntaje catador</h5>
                    <div className="puntaje-range puntaje-item">0</div>
                    <div className="div-range">
                        <div className="guia-range-item">
                            <div className="linea6">
                                <h6 className="numero-guia-range-item">6</h6>
                            </div>
                            <div className="linea-lado"></div>
                            <div className="linea-medio"></div>
                            <div className="linea-lado"></div>
                            <div className="linea7">
                                <h6 className="numero-guia-range-item">7</h6>
                            </div>
                            <div className="linea-lado"></div>
                            <div className="linea-medio"></div>
                            <div className="linea-lado"></div>
                            <div className="linea8">
                                <h6 className="numero-guia-range-item">8</h6>
                            </div>
                            <div className="linea-lado"></div>
                            <div className="linea-medio"></div>
                            <div className="linea-lado"></div>
                            <div className="linea9">
                                <h6 className="numero-guia-range-item">9</h6>
                            </div>
                            <div className="linea-lado"></div>
                            <div className="linea-medio"></div>
                            <div className="linea-lado"></div>
                            <div className="linea10">
                                <h6 className="numero-guia-range-item">10</h6>
                            </div>
                        </div>
                        <input className="range-puntaje input-range-puntaje" type="range" name="" id=""  min="6"
                            max="10" step="0.25"/>
                    </div>
                </div>
                <div className="puntaje-total">
                    <h4 className="h4-puntaje-total"> <span>Puntaje</span><span>Total</span></h4>
                    <div id="puntajeTotal" className="puntaje-range puntaje-item">0</div>
                </div>
                <div className="defectos">
                    <div className="header-h4-defectos">
                        <h4 className="h4-defectos">Defectos</h4>
                        <h4 className="h4-defectos">(Sustraer)</h4>
                    </div>
                    <div className="items-h4-defectos">
                        <h6 className="h6-defectos">Ligero = 2</h6>
                        <h6 className="h6-defectos">Rechazo = 4</h6>
                    </div>
                    <div className="items-defectos">
                        <div className="items-titulos-defectos">
                            <h6 className="h6-defectos">#Tazas</h6>
                            <h6 className="h6-defectos">Intensidad</h6>
                        </div>
                        <div className="inputs-defectos">
                            <div className="tazas-defectos">
                                <input className="inputTazasIntensidad input-tazas-defectos" type="text" name="" id=""/>
                            </div>
                            <h2 className="h2-defectos">X</h2>
                            <div className="intensidad-defectos">
                                <input className="inputTazasIntensidad input-intensidad-defectos" type="text" name="" id=""/>
                            </div>
                            <h2 className="h2-defectos">=</h2>
                            <div id="resultadoTazasXIntensidad" className="resultado-tazas-x-intensidad-defectos puntaje-item"></div>
                        </div>
                    </div>
                </div>
                <div id="notasFinalDiv" className="notas-final">
                    <h4 className="h4-tittle-notas">Notas:</h4>
                    <textarea className="texarea-notas-final" name="" id="notasFinal" cols="30" rows="10"></textarea>
                    <input id="button" className="button" type="button" value="Ver mas..."/>

                </div>
                <div className="puntaje-final">
                    <h4 className="h4-puntaje-final">Puntaje final</h4>
                    <div id="puntajeFinal" className="item-puntaje-final">0</div>
                </div>
            </div>
        </div>

    )
}

