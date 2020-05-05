//React and js-cookie
import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import Cookie from "js-cookie";

//components
import Input from "../../Common/Input/Input";
import Textarea from "../../Common/Textarea/Textarea";
import Icon from "../../Common/Icon/Icon";

//HOC and context
import { Context } from "../../../context/Context";
import useWidget from "../../../HOC/useWidget";
import { convertUrlProfile } from "../../../helper/helper";

function RegisterComplete(props) {
  const { setSelectedImage, images } = props;
  const [urlprofile, setUrlprofile] = useState();
  const [urlbackground, setUrlbackground] = useState();
  const [location, setLocation] = useState("");
  const [state, setState] = useState("");

  const { setAuthenticated, socket } = useContext(Context);

  useEffect(() => {
    const abortController = new AbortController();
    navigator.geolocation.getCurrentPosition((position) => {
      const crd = position.coords;
      fetch(
        `https://geocode.xyz/${crd.latitude},${crd.longitude}?json=1&auth=183676455000933134518x5813`,
        {
          signal: abortController.signal,
        }
      )
        .then((res) => res.json())
        .then((res) => setLocation(`${res.city}, ${res.country}`));
    });
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    setUrlprofile(images[0]);
    setUrlbackground(images[1]);
  }, [images]);

  const onFinish = (e) => {
    e.preventDefault();
    if (Cookie.get("Auth")) {
      const { token, refreshToken, id } = JSON.parse(Cookie.get("Auth"));
      socket.emit("register complete", {
        token,
        refreshToken,
        id,
        urlprofile,
        urlbackground,
        state,
        location,
      });
      props.history.push("/");
      setAuthenticated(true);
    }
  };

  const profile = convertUrlProfile(images[0]);
  return (
    <div className="FormContainer scroll">
      <div className="FormContainer__brand">MENSAPP</div>
      <form className="Form">
        <p className="Form__description">
          Para finalizar el registro, ingrese a su correo para verificar su
          cuenta. A continuación ingrese algunos datos mas para completar su
          registro
        </p>
        <div className="row">
          <p className="font-1 mx-1">Imagen de perfil</p>
          <div className="row__profile" onClick={() => setSelectedImage(0)}>
            <div className="filter">
              <Icon name="CAMERA" size={75} color="white" />
            </div>
            <img className="img" alt="profile" src={profile} />
          </div>
        </div>
        <div className="row">
          <p className="font-1 mx-1">Imagen de fondo</p>
          <div className="row__background" onClick={() => setSelectedImage(1)}>
            <div className="filter">
              <Icon name="CAMERA" size={75} color="white" />
            </div>
            <img className="img" alt="background" src={urlbackground} />
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

export default useWidget(RegisterComplete);
