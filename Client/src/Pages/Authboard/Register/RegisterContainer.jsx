import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Context } from "context/Context";
import Register from "./Register";

function RegisterContainer(props) {
  const { history } = props;
  const { socket, setDialog } = useContext(Context);
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
    <Register
      name={name}
      setName={setName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      repeat={repeat}
      setRepeat={setRepeat}
      onRegister={onRegister}
      error={error}
    />
  );
}

RegisterContainer.propTypes = {
  history: PropTypes.object,
};

export default RegisterContainer;
