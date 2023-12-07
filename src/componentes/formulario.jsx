import React, { useState } from 'react';

export const Formulario = () => {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [documento, setDocumento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [rol, setRol] = useState('');
  const [cargo, setCargo] = useState('');
  const [password, setPassword] = useState('');

  const handleTextChange = (event, setState) => {
    const value = event.target.value.replace(/[^a-zA-Z\s]/g, '');
    setState(value);
  };

  const handleNumberChange = (event, setState) => {
    const value = event.target.value.replace(/\D/g, '');
    setState(value);
  };

  return (
    <>
      <link rel="stylesheet" href="../../public/css/formulario.css" />
      <section className="form-register">
        <h4>Formulario Registro</h4>
        <input
          className="controls"
          type="text"
          name="nombres"
          id="nombres"
          placeholder="Ingrese su Nombre"
          value={nombres}
          onChange={(e) => handleTextChange(e, setNombres)}
        />
        <input
          className="controls"
          type="text"
          name="apellidos"
          id="apellidos"
          placeholder="Ingrese su Apellido"
          value={apellidos}
          onChange={(e) => handleTextChange(e, setApellidos)}
        />
        <input
          className="controls"
          type="number"
          name="documento"
          id="documento"
          placeholder="Ingrese Numero Documento"
          value={documento}
          onChange={(e) => handleNumberChange(e, setDocumento)}
        />
        <input
          className="controls"
          type="number"
          name="telefono"
          id="telefono"
          placeholder="Ingrese Telefono"
          value={telefono}
          onChange={(e) => handleNumberChange(e, setTelefono)}
        />
        <input
          className="controls"
          type="email"
          name="correo"
          id="correo"
          placeholder="Ingrese su Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <form>
          <select
            className="option"
            type="select"
            name="tipo_documento"
            id="num_documeto"
            value={tipoDocumento}
            onChange={(e) => setTipoDocumento(e.target.value)}
          >
            <option value="" disabled selected>
              Selecciona una opción
            </option>
            <option value="opcion1">Targeta Identidad</option>
            <option value="opcion2">Cedula de Ciudadania</option>
          </select>
        </form>
        <form>
          <select
            className="option"
            type="select"
            name="rol"
            id="rol-user"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
          >
            <option className="selec_null" value="" disabled selected>
              Selecciona una opción
            </option>
            <option value="opcion1">Catador</option>
            <option value="opcion2">Cafetero</option>
          </select>
        </form>
        <form>
          <select
            className="option"
            type="select"
            name="cargo"
            id="cargo-user"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
          >
            <option className="selec_null" value="" disabled selected>
              Selecciona una opción
            </option>
            <option value="opcion1">Instructor</option>
            <option value="opcion2">Aprendiz</option>
            <option value="opcion3">Cliente</option>
          </select>
        </form>
        <input
          className="controls"
          type="password"
          name="password"
          id="correo"
          placeholder="Ingrese su Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p>
          Estoy de acuerdo con{' '}
          <a className="" href="#">
            Terminos y Condiciones
          </a>
        </p>
        <input className="botons" type="submit" value="Registrar" />
        <p>
          <a href="#">¿Ya tengo Cuenta?</a>
        </p>
      </section>
    </>
  );
};

