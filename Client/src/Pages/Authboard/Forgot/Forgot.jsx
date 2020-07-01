import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Input from "Common/Input";

function Forgot(props) {
  const {
    verified,
    email,
    setEmail,
    onSendEmail,
    password,
    setPassword,
    repeatpassword,
    setRepeatpassword,
    onChangePassword,
    disable,
  } = props;
  return !verified ? (
    <div className="FormContainer">
      <div className="FormContainer__brand">MENSAPP</div>
      <form className="Form">
        <p className="font-2 m-1">Recuperar contraseña</p>
        <p className="Form__forgot-reference">
          Ingrese su correo electrónico asociado a la cuenta. Luego ingrese a su
          correo para poder continuar
        </p>
        <Input
          icon="EMAIL"
          color="#ccc"
          name="email-login"
          type="email"
          value={email}
          onChange={(value) => {
            setEmail(value);
          }}
          onPressEnter={onSendEmail}
          placeholder="Email"
          autocomplete="new-password"
        />
        <button
          disabled={disable}
          className="Form__button"
          onClick={onSendEmail}
        >
          Enviar correo
        </button>
        <p className="font-1">
          <Link className="Form__link" to="/">
            Volver a inicio
          </Link>
        </p>
      </form>
    </div>
  ) : (
    <div className="FormContainer">
      <div className="FormContainer__brand">MENSAPP</div>
      <form className="Form">
        <p className="font-2 m-1">Recuperar contraseña</p>
        <Input
          icon="KEY"
          color="#ccc"
          name="password-login"
          type="password"
          value={password}
          onChange={(value) => setPassword(value)}
          onPressEnter={onChangePassword}
          placeholder="Contraseña"
          autocomplete="new-password"
        />
        <Input
          icon="KEY"
          color="#ccc"
          name="password-login"
          type="password"
          value={repeatpassword}
          onChange={(value) => setRepeatpassword(value)}
          onPressEnter={onChangePassword}
          placeholder="Repetir contraseña"
          autocomplete="new-password"
        />
        <button className="Form__button" onClick={onChangePassword}>
          Cambiar contraseña
        </button>
        <p className="font-1">
          <Link className="Form__link" to="/">
            Volver a inicio
          </Link>
        </p>
      </form>
    </div>
  );
}

Forgot.propTypes = {
  verified: PropTypes.bool,
  email: PropTypes.string,
  password: PropTypes.string,
  repeatpassword: PropTypes.string,
  setEmail: PropTypes.func,
  setPassword: PropTypes.func,
  setRepeatpassword: PropTypes.func,
  onSendEmail: PropTypes.func,
  onChangePassword: PropTypes.func,
  disable: PropTypes.bool,
};

export default Forgot;
