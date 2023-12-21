import React from "react";

export const NotFound = () => {
    return (
        <>
            <link rel="stylesheet" href="../../public/css/pageNotFound.css" />

            <div style={{ position: "fixed", width: "calc(100% - 40px)", height: "calc(100% - 40px)", backgroundColor: "rgb(18,38,75)", display: "flex", justifyContent: "center", alignItems: "center", padding : "20px" }} className="div-content">
                <div style={{width : "max-content", maxWidth : "calc(100% - 40px)",display : "flex" , justifyContent:"center" , alignItems : "center", flexDirection : "column", gap : "20px"}} className="page-not-found">
                    <div style={{display : "flex" , justifyContent : "center" , alignItems : "center"}} className="div-404-not-found">
                        <h2 style={{ position :"relative", top : "35px", fontSize: "15em", color: "rgb(100,170,223)", display: "flex", gap: "4px", justifyContent: "center", alignItems: "end", textAlign: "end" }}>4</h2> <img style={{ flex: "none", width: "44%" }} src="/img/imgPageNotFound.png" alt="" /> <h2 style={{ position :"relative",top : "35px",fontSize: "15em", color: "rgb(100,170,223)", display: "flex", gap: "4px", justifyContent: "center", alignItems: "end", textAlign: "end" }}>4</h2>
                    </div>
                   <div style={{display : "flex" , alignItems : "center" , flexDirection : "column", gap : "10px"}} className="text-page-not-found">
                   <h4 style={{ textAlign : "center",fontSize : "2em", fontWeight : "900", color : "rgb(193,129,89)"}}>PAGE NOT FOUND</h4>
                    <h4 style={{ textAlign : "center",fontSize : "1.1em", fontWeight : "100", color : "rgb(131,199,241)"}}>This page are looking is not available</h4>
                   </div>
                   <div className="div-return-to-">
                    <button onClick={()=>{location.href = "/dashboard"}} style={{padding : "20px", borderRadius : "100px" , fontSize : "1.2em", fontWeight : "600", color : "white", backgroundColor : "rgb(100,170,223)" , border : "unset", cursor : "pointer" , }}> Back to home</button>
                   </div>
                </div>
            </div>
        </>
    )
}