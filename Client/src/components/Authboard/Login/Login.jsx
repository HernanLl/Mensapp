import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import Input from "../../Common/Input/Input";
import { Link } from "react-router-dom";
import { Context } from "../../../context/Context";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthenticated } = useContext(Context);
  const onLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("token", "cualquiercosa");
    setAuthenticated(true);
  };

  return (
    <div className="FormContainer">
      <div className="FormContainer__brand">MENSAPP</div>
      <form className="FormContainer__form Form">
        <p className="FormContainer__title">Bienvenido</p>
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
        <p className="Form__reference">
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
