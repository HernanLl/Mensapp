import React, { useEffect, useState } from "react";
import "babel-polyfill";
import "./styles.scss";
import { Context } from "./context/Context";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import io from "socket.io-client";
import { getCookie, removeCookie, setCookie, isHome } from "./helper/helper";

//react components
import Dialog from "./Common/Dialog";
import Loading from "./Common/Loading";
import Authboard from "./Pages/Authboard";
import Chatboard from "./Pages/ChatBoard";
import NotFound from "./Pages/NotFound";

const socket = io(
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : "/"
);

function App() {
  const [authenticated, setAuthenticated] = useState();
  const [isPhone, setIsPhone] = useState(window.innerWidth < 992);
  const [dialog, setDialog] = useState({});
  const [loading, setLoading] = useState(true);
  const {
    type,
    options,
    title,
    description,
    display,
    onClose,
    onSuccess,
  } = dialog;

  const handlerError = ({ status, message }) => {
    if (status === 401 || status === 403) {
      removeCookie();
      setAuthenticated(false);
      setDialog({
        type: "danger",
        title: "No autorizado",
        description: message,
        display: true,
        onClose: () => {
          setDialog({});
        },
      });
    }
  };
  const handlerNewToken = ({ newtoken }) => {
    const { refreshToken } = getCookie();
    setCookie(newtoken, refreshToken);
  };
  const handlerResize = () => {
    setIsPhone(window.innerWidth < 992);
  };
  const handlerAuthenticated = () => {
    setAuthenticated(true);
    setLoading(false);
  };
  useEffect(() => {
    const location = window.location.protocol + "//" + window.location.host;
    if (getCookie() && isHome()) {
      socket.emit("isAuthenticated", {
        cookie: getCookie(),
      });
      socket.on("isAuthenticated", handlerAuthenticated);
      return () => socket.off("isAuthenticated", handlerAuthenticated);
    } else {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    socket.on("error server", handlerError);
    socket.on("new token", handlerNewToken);
    window.addEventListener("resize", handlerResize);
    return () => {
      socket.off("error server", handlerError);
      socket.off("new token", handlerNewToken);
      window.removeEventListener("resize", handlerResize);
    };
  }, []);
  return !isPhone ? (
    <Context.Provider
      value={{ authenticated, setAuthenticated, socket, dialog, setDialog }}
    >
      {loading ? (
        <Loading />
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => e.preventDefault()}
        >
          <Dialog
            type={type}
            title={title}
            display={display}
            options={options}
            description={description}
            onClose={onClose}
            onSuccess={onSuccess}
          />
          <Router>
            <Switch>
              <Route
                path="/"
                render={() => (authenticated ? <Chatboard /> : <Authboard />)}
                exact={authenticated}
              />
              <Route path="*" render={() => <NotFound />} />
            </Switch>
          </Router>
        </div>
      )}
    </Context.Provider>
  ) : (
    //TODO - poner una pagina para mobile info
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "2rem",
        textAlign: "center",
      }}
    >
      La pagina no se encuentra disponible para su dispositivo
    </div>
  );
}

export default App;
