import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Context } from "context/Context";
import useWidget from "Hooks/useWidget";
import { getCookie } from "helper/helper";
import RegisterComplete from "./RegisterComplete";

function RegisterCompleteContainer(props) {
  const { history } = props;
  //context
  const { setAuthenticated, socket, setDialog } = useContext(Context);
  //form values
  const [urlprofile, setUrlprofile] = useState();
  const [urlbackground, setUrlbackground] = useState();
  const [location, setLocation] = useState("");
  const [state, setState] = useState("");

  const [images, setSelectedImage] = useWidget();

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
    if (e && e.preventDefault) e.preventDefault();
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
    setUrlprofile(images[0]);
    setUrlbackground(images[1]);
  }, [images]);

  return (
    <RegisterComplete
      urlprofile={urlprofile}
      urlbackground={urlbackground}
      location={location}
      state={state}
      setSelectedImage={setSelectedImage}
      setLocation={setLocation}
      setState={setState}
      onFinish={onFinish}
    />
  );
}

RegisterCompleteContainer.propTypes = {
  history: PropTypes.object,
};

export default RegisterCompleteContainer;
