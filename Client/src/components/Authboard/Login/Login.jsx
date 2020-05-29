import React, { useState, useContext, useEffect } from "react";
import { PropTypes } from "prop-types";
import { Link } from "react-router-dom";
import { Context } from "../../../context/Context";
import Input from "../../Common/Input/";
import { setCookie } from "../../../helper/helper";

function Login(props) {
  const { message } = props;
  //context
  const { setAuthenticated, socket } = useContext(Context);
  //form values and error
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState("");

  const onLogin = (e) => {
    e.preventDefault();
    socket.emit("login", { email, password });
  };

  const handlerLogin = ({ status, message, token, refreshToken, id }) => {
    if (status === 200) {
      setCookie(token, refreshToken, id);
      setAuthenticated(true);
    } else {
      setError(message);
    }
  };

  useEffect(() => {
    socket.on("login", handlerLogin);
    return () => {
      socket.off("login", handlerLogin);
    };
  }, []);

  return (
    <div className="FormContainer">
      <div className="FormContainer__brand">MENSAPP</div>
      <form className="Form">
        <p className="font-2 m-1">Bienvenido</p>
        {message && !error && (
          <div className="Form__message Form__message-success">
            <p>{message}</p>
          </div>
        )}
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
          onPressEnter={() => {}}
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
          onPressEnter={() => {}}
          placeholder="Contraseña"
          autocomplete="new-password"
        />

        <button className="Form__button" onClick={onLogin}>
          Ingresar
        </button>
        <p className="font-1">
          ¿No tienes cuenta?,{" "}
          <Link className="Form__link" to="/signup">
            Registrate
          </Link>
        </p>
      </form>
    </div>
  );
}

Login.propTypes = {
  message: PropTypes.string,
};

export default Login;
