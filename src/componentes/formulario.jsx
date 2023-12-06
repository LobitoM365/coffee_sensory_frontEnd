import React, { useEffect } from 'react'
import "../../public/css/formulario.css"
export const Formulario = () => {
    
    return (
        <>
        <section class="form-register">
            <h4>Formulario Registro</h4>
                <input className="controls" type="text" name="nombres" id="nombres" placeholder="Ingrese su Nombre"/>
                    <input className="controls" type="text" name="apellidos" id="apellidos" placeholder="Ingrese su Apellido"/>
                    <input className="controls" type="number" name="documento" id="documento" placeholder="Ingrese Numero Documento"/>
                    <input className="controls" type="number" name="telefono" id="telefono" placeholder="Ingrese Telefono"/>
                    <input className="controls" type="email" name="correo" id="correo" placeholder="Ingrese su Correo"/>
                    <form>
                    <select className="controls" type="select" name="tipo_documento" id="num_documeto">
                    <option value="opcion1">Targeta Identidad</option>
                    <option value="opcion2">Cedula de Ciudadania</option>
                    </select>
                    </form>
                    <form>
                    <select className="controls" type="select" name="rol" id="rol-user">
                    <option value="opcion1">Catador</option>
                    <option value="opcion2">Cafetero</option>
                    </select>
                    </form>
                    <form>
                    <select className="controls" type="select" name="cargo" id="cargo-user">
                    <option value="opcion1">Intructor</option>
                    <option value="opcion2">Aprendíz</option>
                    <option value="opcion2">Cliente</option>
                    </select>
                    </form>
                    <input className="controls" type="password" name="password" id="correo" placeholder="Ingrese su Contraseña"/>
                    <p>Estoy de acuerdo con <a className='' href="#">Terminos y Condiciones</a></p>
                <input className="botons" type="submit" value="Registrar"/>
            <p><a href="#">¿Ya tengo Cuenta?</a></p>
     </section>
        </>
    )
}