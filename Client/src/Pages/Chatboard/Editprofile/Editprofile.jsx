import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import { convertUrlProfile, getCookie } from "helper/helper";
import { Context } from "context/Context";
import useWidget from "HOC/useWidget";

import Input from "Common/Input";
import Icon from "Common/Icon";
import Textarea from "Common/Textarea";

function Editprofile(props) {
  const {
    active,
    setActive,
    images,
    setImages,
    setSelectedImage,
    data,
  } = props;
  const [datalocal, setDatalocal] = useState();
  const { name, state, location, urlprofile, urlbackground } = datalocal || {
    name: "",
    state: "",
    location: "",
    urlprofile: "",
    urlbackground: "",
  };
  const [oldpassword, setOldpassword] = useState("");
  const [password, setPassword] = useState("");
  const [repeatpassword, setRepeatpassword] = useState("");

  const { socket, setDialog } = useContext(Context);

  useEffect(() => {
    socket.on("forgot password with old", ({ status, message }) => {
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
        setPassword("");
        setRepeatpassword("");
        setOldpassword("");
      } else if (status === 400) {
        setDialog({
          type: "danger",
          title: "Error al cambiar contraseña",
          description: message,
          display: true,
          onClose: () => {
            setDialog({});
          },
        });
      }
    });
  }, []);

  useEffect(() => {
    if (data) {
      setDatalocal(data);
      setImages([
        data.urlprofile || images[0],
        data.urlbackground || images[1],
      ]);
    }
  }, [data]);
  useEffect(() => {
    setDatalocal({ ...datalocal, urlprofile: images[0] });
  }, [images[0]]);
  useEffect(() => {
    setDatalocal({ ...datalocal, urlbackground: images[1] });
  }, [images[1]]);

  const onFinish = () => {
    setActive(false);
    socket.emit("edit user", {
      cookie: getCookie(),
      name,
      location,
      state,
      urlprofile,
      urlbackground,
    });
  };

  const onChangePassword = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!password || !repeatpassword || !oldpassword) {
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
      socket.emit("forgot password with old", {
        old: oldpassword,
        password,
        cookie: getCookie(),
      });
    }
  };

  const style = active ? { left: "75px" } : { left: "-100%" };
  const profile = convertUrlProfile(urlprofile);
  return (
    <div className="Editprofile scroll" style={style}>
      <div className="Form">
        <p className="Form__title">Editar usuario</p>
        <Input
          icon="USER"
          color="white"
          value={name}
          onChange={(name) => setDatalocal({ ...datalocal, name })}
          type="text"
          placeholder="Nombre completo"
          textcolor="white"
        />
        <Input
          icon="LOCATION"
          color="white"
          value={location}
          onChange={(location) => setDatalocal({ ...datalocal, location })}
          type="text"
          placeholder="Localidad"
          helper="(ej.: Paraná, Argentina)"
          textcolor="white"
        />
        <Textarea
          color="white"
          value={state}
          onChange={(state) => setDatalocal({ ...datalocal, state })}
          width="100%"
          height="200px"
          placeholder="Estado"
          helper="(ej.: una frase, cancion o lo que quieras)"
          textcolor="white"
        />
        <div className="row">
          <p className="row__reference">Imagen de perfil</p>
          <div className="row__profile" onClick={() => setSelectedImage(0)}>
            <div className="filter">
              <Icon name="CAMERA" size={75} color="white" />
            </div>
            <img src={profile} />
          </div>
        </div>
        <div className="row">
          <p className="row__reference">Imagen de fondo</p>
          <div className="row__background" onClick={() => setSelectedImage(1)}>
            <div className="filter">
              <Icon name="CAMERA" size={75} color="white" />
            </div>
            <img src={urlbackground} />
          </div>
        </div>
        <button className="Form__button" onClick={onFinish}>
          Finalizar edicion
        </button>
      </div>
      <form className="Form">
        <p className="font-2 m-1">Cambiar contraseña</p>
        <Input
          icon="KEY"
          color="white"
          name="password-login"
          type="password"
          value={oldpassword}
          onChange={(value) => setOldpassword(value)}
          onPressEnter={onChangePassword}
          placeholder="Contraseña actual"
          autocomplete="new-password"
        />
        <Input
          icon="KEY"
          color="white"
          name="password-login"
          type="password"
          value={password}
          onChange={(value) => setPassword(value)}
          onPressEnter={onChangePassword}
          placeholder="Nueva Contraseña"
          autocomplete="new-password"
        />
        <Input
          icon="KEY"
          color="white"
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
      </form>
    </div>
  );
}

Editprofile.propTypes = {
  active: PropTypes.bool,
  setActive: PropTypes.func,
  images: PropTypes.array,
  setImages: PropTypes.func,
  setSelectedImage: PropTypes.func,
  data: PropTypes.object,
};

export default useWidget(Editprofile);
