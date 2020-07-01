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
