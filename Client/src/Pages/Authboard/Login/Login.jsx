import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "context/Context";
import { setCookie } from "helper/helper";
import Input from "Common/Input";

function Login() {
  //context
  const { setAuthenticated, socket } = useContext(Context);
  //form values and error
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState("");

  const onLogin = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    socket.emit("login", { email, password });
  };

  const handlerLogin = ({ status, message, cookie }) => {
    if (status === 200) {
      const { token, refreshToken } = cookie;
      setCookie(token, refreshToken);
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
        <a className="Form__link Form__forgot" href="/#/forgot">
          ¿Olvidaste la contraseña?
        </a>
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
