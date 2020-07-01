import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Input from "Common/Input";

function Register(props) {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    repeat,
    setRepeat,
    onRegister,
    error,
  } = props;
  return (
    <div className="FormContainer">
      <div className="FormContainer__brand">MENSAPP</div>
      <form className="Form">
        <p className="font-2 m-1">Crear cuenta</p>
        {error && (
          <div className="Form__message Form__message-error">
            <p>{error}</p>
          </div>
        )}
        <Input
          icon="USER"
          color="#ccc"
          type="text"
          name="name-register"
          value={name}
          onChange={(value) => setName(value)}
          onPressEnter={() => {}}
          placeholder="Nombre completo"
        />
        <Input
          icon="EMAIL"
          color="#ccc"
          name="email-register"
          type="email"
          value={email}
          onChange={(value) => setEmail(value)}
          onPressEnter={() => {}}
          placeholder="Email"
          autocomplete={false}
        />
        <Input
          icon="KEY"
          color="#ccc"
          name="password-register"
          type="password"
          value={password}
          onChange={(value) => setPassword(value)}
          onPressEnter={() => {}}
          placeholder="Contraseña"
        />
        <Input
          icon="KEY"
          color="#ccc"
          name="repeat-register"
          type="password"
          value={repeat}
          onChange={(value) => setRepeat(value)}
          onPressEnter={() => {}}
          placeholder="Repetir contraseña"
        />

        <button className="Form__button" onClick={onRegister}>
          Registrarse
        </button>
        <p className="font-1">
          ¿Ya tienes cuenta?,
          <Link className="Form__link" to="/">
            {" "}
            Iniciar sesión{" "}
          </Link>
        </p>
      </form>
    </div>
  );
}

Register.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
  password: PropTypes.string,
  repeat: PropTypes.string,
  error: PropTypes.string,
  setName: PropTypes.func,
  setEmail: PropTypes.func,
  setPassword: PropTypes.func,
  setRepeat: PropTypes.func,
  onRegister: PropTypes.func,
};

export default Register;
