import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Input from "Common/Input";

function Login(props) {
  const { error, email, setEmail, password, setPassword, onLogin } = props;
  return (
    <div className="FormContainer">
      <div className="FormContainer__brand">MENSAPP</div>
      <form className="Form">
        <p className="font-2 m-1">Bienvenido</p>
        {error && (
          <div className="Form__message Form__message-error">
            <p>{error}</p>
          </div>
        )}

        <Input
          icon="EMAIL"
          color="#ccc"
          name="email-login"
          type="email"
          value={email}
          onChange={(value) => setEmail(value)}
          onPressEnter={onLogin}
          placeholder="Email"
          autocomplete="new-password"
        />
        <Input
          icon="KEY"
          color="#ccc"
          name="password-login"
          type="password"
          value={password}
          onChange={(value) => setPassword(value)}
          onPressEnter={onLogin}
          placeholder="Contraseña"
          autocomplete="new-password"
        />
        <Link className="Form__link Form__forgot" to="/forgot">
          ¿Olvidaste la contraseña?
        </Link>
        <button className="Form__button" onClick={onLogin}>
          Ingresar
        </button>
        <p className="font-1">
          ¿No tienes cuenta?,{" "}
          <Link className="Form__link" to="/signup">
            Regístrate
          </Link>
        </p>
      </form>
    </div>
  );
}
Login.propTypes = {
  error: PropTypes.string,
  email: PropTypes.string,
  password: PropTypes.string,
  setEmail: PropTypes.func,
  setPassword: PropTypes.func,
  onLogin: PropTypes.func,
};

export default Login;
