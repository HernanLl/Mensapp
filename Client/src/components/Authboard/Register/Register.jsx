import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import Input from "../../Common/Input/Input";
import { Link } from "react-router-dom";

function Register(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const onRegister = (e) => {
    e.preventDefault();
    props.history.push("/signup/finish");
  };

  return (
    <div className="FormContainer">
      <div className="FormContainer__brand">MENSAPP</div>
      <form className="FormContainer__form Form">
        <p className="FormContainer__title">Crear cuenta</p>
        <Input
          icon="USER"
          color="#ccc"
          type="text"
          value={name}
          onChange={(value) => setName(value)}
          onPressEnter={() => {}}
          placeholder="Nombre completo"
        />
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
        <Input
          icon="KEY"
          color="#ccc"
          type="password"
          value={repeat}
          onChange={(value) => setRepeat(value)}
          onPressEnter={() => {}}
          placeholder="Repetir contraseña"
        />

        <button className="Form__button" onClick={onRegister}>
          Registrarse
        </button>
        <p className="Form__reference">
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

Register.propTypes = {};

export default Register;
