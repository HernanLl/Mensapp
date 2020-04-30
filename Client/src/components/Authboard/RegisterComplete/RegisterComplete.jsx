import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import Input from "../../Common/Input/Input";
import Textarea from "../../Common/Textarea/Textarea";
import Icon from "../../Common/Icon/Icon";
import { Context } from "../../../context/Context";
import useWidget from "../../../hooks/useWidget";

function RegisterComplete(props) {
  const [location, setLocation] = useState("");
  const [state, setState] = useState("");
  const [urlprofile, setUrlprofile] = useState();
  const [urlbackground, setUrlbackground] = useState();

  const { setAuthenticated } = useContext(Context);

  const { selectedImage, setSelectedImage, images } = useWidget([
    "https://res.cloudinary.com/dqiahaymp/image/upload/v1588221691/bw0onoi5xarc0hazsalr.jpg",
    "https://images.unsplash.com/photo-1588106351529-6878ca466d1f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
  ]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const crd = position.coords;
      fetch(
        `https://geocode.xyz/${crd.latitude},${crd.longitude}?json=1&auth=183676455000933134518x5813`
      )
        .then((res) => res.json())
        .then((res) => setLocation(`${res.city}, ${res.country}`));
    });
  }, []);

  useEffect(() => {
    if (selectedImage === -1) {
      setUrlprofile(images[0]);
      setUrlbackground(images[1]);
    }
  }, [selectedImage]);

  const onFinish = (e) => {
    e.preventDefault();
    alert("Registro finalizado");
    localStorage.setItem("token", "randomtext");
    setAuthenticated(true);
  };

  return (
    <div className="FormContainer">
      <div className="FormContainer__brand">MENSAPP</div>
      <form className="FormContainer__form Form">
        <p className="Form__description">
          Para finalizar el registro, ingrese a su correo para verificar su
          cuenta. A continuación ingrese algunos datos mas para completar su
          registro
        </p>
        <div className="row">
          <p className="row__reference">Imagen de perfil</p>
          <div className="row__profile" onClick={() => setSelectedImage(0)}>
            <div className="filter">
              <Icon name="CAMERA" size={75} color="white" />
            </div>
            <img src={urlprofile} />
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
          value=""
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

RegisterComplete.propTypes = {};

export default RegisterComplete;
