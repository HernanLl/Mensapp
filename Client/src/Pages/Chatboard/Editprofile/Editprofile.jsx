import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import { convertUrlProfile } from "helper/helper";

import Input from "Common/Input";
import Icon from "Common/Icon";
import Textarea from "Common/Textarea";

function Editprofile(props) {
  const {
    urlprofile,
    name,
    datalocal,
    location,
    state,
    oldpassword,
    password,
    repeatpassword,
    active,
  } = props; //data
  const {
    setDatalocal,
    urlbackground,
    onFinish,
    setOldpassword,
    setPassword,
    setRepeatpassword,
    onChangePassword,
    setSelectedImage,
  } = props; //functions

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
          helper="(ej.: una frase, canción o lo que quieras)"
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
          Finalizar edición
        </button>
      </div>
      <form
        className="Form"
        onSubmit={(e) => {
          e.preventDefault();
          onChangePassword();
        }}
      >
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
          placeholder="Repetir contraseña"
          autocomplete="new-password"
        />
        <button className="Form__button">Cambiar contraseña</button>
      </form>
    </div>
  );
}

Editprofile.propTypes = {
  urlprofile: PropTypes.string,
  urlbackground: PropTypes.string,
  name: PropTypes.string,
  datalocal: PropTypes.object,
  location: PropTypes.string,
  state: PropTypes.string,
  oldpassword: PropTypes.string,
  password: PropTypes.string,
  repeatpassword: PropTypes.string,
  active: PropTypes.bool,
  setDatalocal: PropTypes.func,
  onFinish: PropTypes.func,
  setOldpassword: PropTypes.func,
  setPassword: PropTypes.func,
  setRepeatpassword: PropTypes.func,
  onChangePassword: PropTypes.func,
  setSelectedImage: PropTypes.func,
};

export default Editprofile;
