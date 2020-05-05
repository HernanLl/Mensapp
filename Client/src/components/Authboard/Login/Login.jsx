import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import Cookie from "js-cookie";
import Input from "../../Common/Input/Input";
import { Link } from "react-router-dom";
import { Context } from "../../../context/Context";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setAuthenticated, socket } = useContext(Context);

  const onLogin = (e) => {
    e.preventDefault();
    socket.emit("login", { email, password });
  };

  const handlerLogin = ({ status, message, token, refreshToken, id }) => {
    if (status === 200) {
      Cookie.set("Auth", { token, refreshToken, id });
      setAuthenticated(true);
    } else {
      //poner el dialog
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
        {error && (
          <div className="Form__error">
            <p>{error}</p>
          </div>
        )}

        <Input
          icon="USER"
          color="#ccc"
          type="email"
          value={email}
          onChange={(value) => setEmail(value)}
          onPressEnter={() => {}}
          placeholder="Email"
        />
        <Input
          icon="KEY"
          color="#ccc"
          type="password"
          value={password}
          onChange={(value) => setPassword(value)}
          onPressEnter={() => {}}
          placeholder="Contraseña"
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

Login.propTypes = {};

export default Login;
