import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Context } from "../../../context/Context";
import useWidget from "../../../HOC/useWidget";
import { convertUrlProfile, getCookie } from "../../../helper/helper";
import Input from "../../Common/Input";
import Textarea from "../../Common/Textarea";
import Icon from "../../Common/Icon";

function RegisterComplete(props) {
  const { setSelectedImage, images, history } = props;
  //context
  const { setAuthenticated, socket, setDialog } = useContext(Context);
  //form values
  const [urlprofile, setUrlprofile] = useState();
  const [urlbackground, setUrlbackground] = useState();
  const [location, setLocation] = useState("");
  const [state, setState] = useState("");

  useEffect(() => {
    if (!getCookie()) {
      history.push("/");
      setDialog({
        type: "danger",
        title: "No autorizado",
        description: "Debe proporcionar credenciales",
        display: true,
        onClose: () => {
          setDialog({});
        },
      });
    }
  }, []);

  const onFinish = (e) => {
    e.preventDefault();
    socket.emit("register complete", {
      cookie: getCookie(),
      urlprofile,
      urlbackground,
      state,
      location,
    });
    history.push("/");
    setAuthenticated(true);
  };

  useEffect(() => {
    const abortController = new AbortController();
    navigator.geolocation.getCurrentPosition((position) => {
      const crd = position.coords;
      fetch(
        `https://us1.locationiq.com/v1/reverse.php?key=pk.532b9c5eb60f602ee56fbd2bf8df58af&lat=${crd.latitude}&lon=${crd.longitude}&format=json`,
        {
          signal: abortController.signal,
        }
      )
        .then((res) => res.json())
        .then((res) =>
          setLocation(`${res.address.city}, ${res.address.country}`)
        );
    });
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    setUrlprofile(images[0]);
    setUrlbackground(images[1]);
  }, [images]);

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
  setSelectedImage: PropTypes.func,
  images: PropTypes.array,
  history: PropTypes.object,
};

export default useWidget(RegisterComplete);
