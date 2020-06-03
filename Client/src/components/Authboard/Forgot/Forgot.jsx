import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../../context/Context";
import { getCookie } from "../../../helper/helper";
import Input from "../../Common/Input";

function Forgot(props) {
  const [verified, setVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatpassword, setRepeatpassword] = useState("");

  const { socket, setDialog } = useContext(Context);

  useEffect(() => {
    if (getCookie()) {
      setVerified(true);
    }
    socket.on("forgot password", ({ status, message }) => {
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
    e.preventDefault();
    alert(email);
    //socket.emit('forgotpassword')
  };

  return !verified ? (
    <div className="FormContainer">
      <div className="FormContainer__brand">MENSAPP</div>
      <form className="Form">
        <p className="font-2 m-1">Recuperar contraseña</p>
        <p>
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
          onPressEnter={() => {}}
          placeholder="Email"
          autocomplete="new-password"
        />
        <button className="Form__button" onClick={onSendEmail}>
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
          onPressEnter={() => {}}
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
          onPressEnter={() => {}}
          placeholder="Repetir contraseña"
          autocomplete="new-password"
        />
        <button className="Form__button" onClick={() => {}}>
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

export default Forgot;
