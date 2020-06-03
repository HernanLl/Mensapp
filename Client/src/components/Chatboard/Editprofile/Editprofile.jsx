import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import { convertUrlProfile, getCookie } from "../../../helper/helper";
import { Context } from "../../../context/Context";
import useWidget from "../../../HOC/useWidget";
import Input from "../../Common/Input";
import Icon from "../../Common/Icon";
import Textarea from "../../Common/Textarea";

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

  const { socket } = useContext(Context);

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
    const { token, refreshToken, id } = getCookie();
    socket.emit("edit user", {
      token,
      refreshToken,
      id,
      name,
      location,
      state,
      urlprofile,
      urlbackground,
    });
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
          color="#ccc"
          name="password-login"
          type="password"
          value={""}
          onChange={(value) => {}}
          onPressEnter={() => {}}
          placeholder="Contraseña actual"
          autocomplete="new-password"
        />
        <Input
          icon="KEY"
          color="#ccc"
          name="password-login"
          type="password"
          value={""}
          onChange={(value) => {}}
          onPressEnter={() => {}}
          placeholder="Nueva Contraseña"
          autocomplete="new-password"
        />
        <Input
          icon="KEY"
          color="#ccc"
          name="password-login"
          type="password"
          value={""}
          onChange={(value) => {}}
          onPressEnter={() => {}}
          placeholder="Repetir contraseña"
          autocomplete="new-password"
        />
        <button className="Form__button" onClick={() => {}}>
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
