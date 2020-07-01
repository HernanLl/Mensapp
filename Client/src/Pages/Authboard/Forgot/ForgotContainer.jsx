import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Context } from "context/Context";
import { getCookie } from "helper/helper";
import Forgot from "./Forgot";

function ForgotContainer(props) {
  const { history } = props;
  const [verified, setVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatpassword, setRepeatpassword] = useState("");
  const [disable, setDisable] = useState(false);
  const { socket, setDialog } = useContext(Context);

  useEffect(() => {
    if (getCookie()) {
      setVerified(true);
    }
    socket.on("forgot password", ({ status, message }) => {
      if (status === 200) {
        setDialog({
          type: "success",
          title: "Contraseña cambiada",
          description: message,
          display: true,
          onClose: () => {
            setDialog({});
          },
        });
        history.push("/");
      } else if (status === 400) {
        setDialog({
          type: "danger",
          title: "No se pudo cambiar la contraseña",
          description: message,
          display: true,
          onClose: () => {
            setDialog({});
          },
        });
      }
    });
    socket.on("forgot password email", ({ status, message }) => {
      setDisable(false);
      if (status === 200) {
        setDialog({
          type: "success",
          title: "Email enviado",
          description: message,
          display: true,
          onClose: () => {
            setDialog({});
          },
        });
      } else if (status === 400) {
        setDialog({
          type: "danger",
          title: "Error al enviar el correo",
          description: message,
          display: true,
          onClose: () => {
            setDialog({});
          },
        });
      }
    });
  }, []);

  const onSendEmail = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setDisable(true);
    socket.emit("forgot password email", { email });
  };
  const onChangePassword = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!password || !repeatpassword) {
      setDialog({
        type: "danger",
        title: "Error en los campos",
        description: "Los campos no pueden estar vacios",
        display: true,
        onClose: () => {
          setDialog({});
        },
      });
    } else if (password !== repeatpassword) {
      setDialog({
        type: "danger",
        title: "Error en los campos",
        description: "Las contraseñas deben coincidir",
        display: true,
        onClose: () => {
          setDialog({});
        },
      });
    } else {
      socket.emit("forgot password", { password, cookie: getCookie() });
    }
  };
  return (
    <Forgot
      verified={verified}
      email={email}
      setEmail={setEmail}
      onSendEmail={onSendEmail}
      password={password}
      setPassword={setPassword}
      repeatpassword={repeatpassword}
      setRepeatpassword={setRepeatpassword}
      onChangePassword={onChangePassword}
      disable={disable}
    />
  );
}

ForgotContainer.propTypes = {
  history: PropTypes.object,
};

export default withRouter(ForgotContainer);
