import { object, string } from "prop-types";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import "/public/css/globalForm.css"


export const GlobalModal = forwardRef((data, ref) => {

    const modalRef = useRef(null);
    const divContentFormRef = useRef(null);

    useEffect(() => {

        if (modalRef.current != null) {
            let modalForm = modalRef.current;
            const divContentForm = modalRef.current.querySelector('#divContentForm');



            setTimeout(() => {
                resizeForm()
            }, 100);

            function resizeForm() {
                if (modalForm) {
                    let displayNone = false;
                    if (modalForm.style.display == "none") {
                        modalForm.style.display = "block"
                        displayNone = true
                    }


                    if (divContentForm.scrollHeight > document.body.clientHeight) {
                        modalForm.style.alignItems = "unset"
                        modalForm.style.padding = "20px 20px"
                        modalForm.style.height = "calc(100% - 40px)"
                        modalForm.style.width = "calc(100% - 40px)"
                    } else {
                        modalForm.style.alignItems = "center"
                        modalForm.style.padding = ""
                        modalForm.style.height = "100%"
                        modalForm.style.width = "100%"
                    }
                    if (displayNone) {
                        modalForm.style.display = "none"
                    }
                }

            }
            resizeForm()
            window.addEventListener("resize", function () {
                resizeForm()
            })
        }

    }, [modalRef.current])



    return (
        <>


            <div onClick={(e) => {
                if (divContentFormRef.current != null) {
                    console.log(e.target)
                    if (e.target != divContentFormRef.current && !divContentFormRef.current.contains(e.target)) {
                        if (data.statusModal) {
                            data.statusModal(false)
                        }
                    }
                }
            }} ref={modalRef} className={"modal-form " + (data.class ? data.class : "")} id="modalForm">
                <div ref={divContentFormRef} id="divContentForm" className="div-content-form">
                    <div onClick={() => { if (data.statusModal) { data.statusModal(false) } }} className="icon-quit-svg-form">
                        <svg version="1.1" x="0px" y="0px" viewBox="0 0 256 256" >
                            <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                            <g><g><path d="M150.7,128l90.6-90.7c6.3-6.3,6.3-16.4,0-22.7c-6.3-6.3-16.4-6.3-22.7,0L128,105.3L37.4,14.7c-6.3-6.3-16.4-6.3-22.7,0s-6.3,16.4,0,22.7l90.6,90.6l-90.6,90.6c-6.3,6.3-6.3,16.4,0,22.7c3.1,3.1,7.2,4.7,11.3,4.7c4.1,0,8.2-1.6,11.3-4.7l90.7-90.6l90.6,90.7c3.1,3.1,7.2,4.7,11.3,4.7c4.1,0,8.2-1.6,11.3-4.7c6.3-6.3,6.3-16.4,0-22.7L150.7,128z" /></g></g>
                        </svg>
                    </div>
                    {
                        data.content ? data.content : ""
                    }
                </div>

            </div >

        </>
    )
})