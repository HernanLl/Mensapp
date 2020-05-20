import React, { useState, useContext, useEffect } from "react";
import Cookie from "js-cookie";
import { Link } from "react-router-dom";
import { Context } from "../../../context/Context";
import Input from "../../Common/Input/Input";

function Login(props) {
  const { message, setMessage } = props;
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
      Cookie.set("Auth", { token, refreshToken, id });
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

export default Login;
