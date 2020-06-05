import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Context } from "../../../context/Context";
import Input from "../../Common/Input";

function Register(props) {
  const { history } = props;
  //context
  const { socket, setDialog } = useContext(Context);
  //form values and error
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    const reg = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    if (!name || !email || !password) {
      return "Todos los campos deben estar completos";
    } else if (!reg.test(email)) {
      return "Debe ingresar una cuenta de correo valida";
    } else if (password !== repeat) {
      return "Las contraseñas deben coincidir";
    }
  };

  const onRegister = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const err = validate();
    if (err) setError(err);
    else {
      socket.emit("register", { name, email, password });
    }
  };

  const handlerRegister = ({ status, message }) => {
    if (status === 200) {
      setDialog({
        type: "success",
        title: "Registrado exitosamente",
        description: message,
        display: true,
        onClose: () => {
          setDialog({});
        },
      });
      history.push("/");
    } else {
      setError(message);
    }
  };

  useEffect(() => {
    socket.on("register", handlerRegister);
    return () => {
      socket.off("register", handlerRegister);
    };
  }, []);

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
  setMessage: PropTypes.func,
  history: PropTypes.object,
};

export default Register;
