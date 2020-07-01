import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import { getCookie } from "helper/helper";
import { Context } from "context/Context";
import useWidget from "Hooks/useWidget";

import Editprofile from "./Editprofile";

function EditprofileContainer(props) {
  const { active, setActive, data } = props;
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

  const [images, setSelectedImage, setImages] = useWidget();

  const forgotPassword = ({ status, message }) => {
    if (status === 200) {
      alert(200);
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
      alert(400);

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
  };

  useEffect(() => {
    socket.on("forgot password with old", forgotPassword);
    return () => socket.off("forgot password with old", forgotPassword);
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

  return (
    <Editprofile
      urlprofile={urlprofile}
      name={name}
      datalocal={datalocal}
      location={location}
      state={state}
      oldpassword={oldpassword}
      password={password}
      repeatpassword={repeatpassword}
      active={active}
      setDatalocal={setDatalocal}
      urlbackground={urlbackground}
      onFinish={onFinish}
      setOldpassword={setOldpassword}
      setPassword={setPassword}
      setRepeatpassword={setRepeatpassword}
      onChangePassword={onChangePassword}
      setSelectedImage={setSelectedImage}
    />
  );
}

EditprofileContainer.propTypes = {
  active: PropTypes.bool,
  setActive: PropTypes.func,
  data: PropTypes.object,
};

export default EditprofileContainer;
