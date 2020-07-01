import React from "react";
import PropTypes from "prop-types";
import { convertUrlProfile } from "helper/helper";

import Input from "Common/Input";
import Textarea from "Common/Textarea";
import Icon from "Common/Icon";

function RegisterComplete(props) {
  const {
    urlprofile,
    urlbackground,
    location,
    state,
    setSelectedImage,
    setLocation,
    setState,
    onFinish,
  } = props;
  const profile = convertUrlProfile(urlprofile);
  return (
    <div className="FormContainer scroll">
      <div className="FormContainer__brand">MENSAPP</div>
      <form className="Form">
        <p className="Form__description">
          Ingrese algunos datos mas para completar su registro
        </p>
        <div className="row">
          <p className="font-1 mx-1">Imagen de perfil</p>
          <div className="row__profile" onClick={() => setSelectedImage(0)}>
            <div className="filter">
              <Icon name="CAMERA" size={75} color="white" />
            </div>
            <img className="img" src={profile} />
          </div>
        </div>
        <div className="row">
          <p className="font-1 mx-1">Imagen de fondo</p>
          <div className="row__background" onClick={() => setSelectedImage(1)}>
            <div className="filter">
              <Icon name="CAMERA" size={75} color="white" />
            </div>
            <img className="img" src={urlbackground} />
          </div>
        </div>
        <Input
          icon="LOCATION"
          color="#ccc"
          type="text"
          value={location}
          onChange={(value) => setLocation(value)}
          onPressEnter={onFinish}
          placeholder="Lugar de origen"
          helper="(ej.: Paraná, Entre Ríos)"
        />
        <Textarea
          color="#ccc"
          width="100%"
          height="200px"
          value={state}
          onChange={(value) => setState(value)}
          placeholder="Estado"
          helper="(ej.: una frase, cancion o lo que quieras)"
        />
        <button className="Form__button" onClick={onFinish}>
          Finalizar registro
        </button>
      </form>
    </div>
  );
}

RegisterComplete.propTypes = {
  urlprofile: PropTypes.string,
  profile: PropTypes.string,
  urlbackground: PropTypes.string,
  location: PropTypes.string,
  state: PropTypes.string,
  setSelectedImage: PropTypes.func,
  setLocation: PropTypes.func,
  setState: PropTypes.func,
  onFinish: PropTypes.func,
};

export default RegisterComplete;
