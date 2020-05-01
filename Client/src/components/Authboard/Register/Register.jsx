import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import Cookie from "js-cookie";
import Input from "../../Common/Input/Input";
import { Link } from "react-router-dom";
import { Context } from "../../../context/Context";

function Register(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");

  const { socket } = useContext(Context);

  const handlerRegister = ({ status, message, token, refreshToken, id }) => {
    if (status === 200) {
      Cookie.set("Auth", { token, refreshToken, id });
      props.history.push("/signup/finish");
    } else {
      //poner el dialog
      alert(message);
    }
  };

  const onRegister = (e) => {
    e.preventDefault();
    socket.emit("register", { name, email, password });
    socket.on("register", handlerRegister);
    return () => {
      socket.off("register", handlerRegister);
    };
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
