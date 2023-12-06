import React from 'react'
import '../../public/css/xd.css'

export const ModalFinca = () => {
    return (
        <>
            <div className='container-main'>
                <div className="modal-content">

                    <div className="modal-info">
                        <div className="container-block">
                            <div className="content">
                                <b>Dueño de la finca:</b>
                                <div className="container-data-user">
                                    <div className="container-profile">
                                        <img src="public/img/default_profile.jpg" alt="" />
                                    </div>
                                    <div className="items-data">
                                        <b>Nombre:</b>
                                        <p>Fabian Ramos</p>
                                        <b>Teléfono:</b>
                                        <p>3207851237</p>
                                    </div>
                                    <div className="items-data">
                                        <b>Apellido:</b>
                                        <p>Ramos Galindez</p>
                                        <b>Correo eléctronico:</b>
                                        <p>fabian@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                            <div className="content">
                                <div className="name-estate">
                                    <b>Nombre de la finca:</b>
                                    <div>Villa del prado</div>
                                </div>
                                <div className="container-data-user">
                                    <div className="container-profile">
                                        <img src="public/img/default_estate.png" alt="" />
                                    </div>
                                    <div className="items-data">
                                        <b>Municipio:</b>
                                        <p>Pitalito</p>
                                        <b>Logitud:</b>
                                        <p>3207851237</p>
                                    </div>
                                    <div className="items-data">
                                        <b>Vereda:</b>
                                        <p>Versalles</p>
                                        <b>Latitud:</b>
                                        <p>-123112</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container-grafic">
                        </div>
                    </div>
                    {/* Slider */}
                    <div className="container-slider">
                        <div className="container-arrow">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </div>

                        <div className=""></div>

                        <div className="container-arrow">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}