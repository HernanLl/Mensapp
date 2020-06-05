import React, { useState, useContext, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { Context } from "../../../context/Context";
import { getCookie } from "../../../helper/helper";
import Input from "../../Common/Input";

function Forgot(props) {
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

  return !verified ? (
    <div className="FormContainer">
      <div className="FormContainer__brand">MENSAPP</div>
      <form className="Form">
        <p className="font-2 m-1">Recuperar contraseña</p>
        <p className="Form__forgot-reference">
          Ingrese su correo electrónico asociado a la cuenta. Luego ingrese a su
          correo para poder continuar
        </p>
        <Input
          icon="EMAIL"
          color="#ccc"
          name="email-login"
          type="email"
          value={email}
          onChange={(value) => {
            setEmail(value);
          }}
          onPressEnter={onSendEmail}
          placeholder="Email"
          autocomplete="new-password"
        />
        <button
          disabled={disable}
          className="Form__button"
          onClick={onSendEmail}
        >
          Enviar correo
        </button>
        <p className="font-1">
          <Link className="Form__link" to="/">
            Volver a inicio
          </Link>
        </p>
      </form>
    </div>
  ) : (
    <div className="FormContainer">
      <div className="FormContainer__brand">MENSAPP</div>
      <form className="Form">
        <p className="font-2 m-1">Recuperar contraseña</p>
        <Input
          icon="KEY"
          color="#ccc"
          name="password-login"
          type="password"
          value={password}
          onChange={(value) => setPassword(value)}
          onPressEnter={onChangePassword}
          placeholder="Contraseña"
          autocomplete="new-password"
        />
        <Input
          icon="KEY"
          color="#ccc"
          name="password-login"
          type="password"
          value={repeatpassword}
          onChange={(value) => setRepeatpassword(value)}
          onPressEnter={onChangePassword}
          placeholder="Repetir contraseña"
          autocomplete="new-password"
        />
        <button className="Form__button" onClick={onChangePassword}>
          Cambiar contraseña
        </button>
        <p className="font-1">
          <Link className="Form__link" to="/">
            Volver a inicio
          </Link>
        </p>
      </form>
    </div>
  );
}

export default withRouter(Forgot);
