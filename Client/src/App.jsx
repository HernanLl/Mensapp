import React, { useContext, useEffect, useState, createContext } from "react";
import "./styles.scss";
import Authboard from "./components/Authboard/Authboard";
import Chatboard from "./components/ChatBoard/Chatboard";
import { Context } from "./context/Context";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Cookie from "js-cookie";
import io from "socket.io-client";
import NotFound from "./components/NotFound/NotFound";
import { getCookie } from "./helper/helper";
import Dialog from "./components/Common/Dialog/Dialog";
import Loading from "./components/Common/Loading/Loading";
const socket = io("http://localhost:3000/", { rejectUnauthorized: false });

function App(props) {
  const [authenticated, setAuthenticated] = useState();
  const [render, setRender] = useState(window.innerWidth >= 992);
  const [dialog, setDialog] = useState({ message: "Hola" });
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

  const handlerError = ({ code, message }) => {
    if (code === 401 || code === 403 || code === 500) {
      Cookie.remove("Auth");
      setAuthenticated(false);
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
  };
  const handlerNewToken = ({ newtoken, newrefreshtoken }) => {
    const { token, refreshToken, id } = getCookie();
    Cookie.set("Auth", {
      token: newtoken || token,
      refreshToken: newrefreshtoken || refreshToken,
      id,
    });
  };
  const handlerresize = () => {
    setRender(window.innerWidth >= 992);
  };

  const handlerAuthenticated = () => {
    setAuthenticated(true);
    setLoading(false);
  };
  useEffect(() => {
    const location = window.location.protocol + "//" + window.location.host;
    if (getCookie() && window.location.href === location + "/#/") {
      const { id, token, refreshToken } = getCookie();
      socket.emit("isAuthenticated", { id, token, refreshToken });
      socket.on("isAuthenticated", handlerAuthenticated);
      return () => socket.off("isAuthenticated", handlerAuthenticated);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    socket.on("error server", handlerError);
    socket.on("new token", handlerNewToken);
    window.addEventListener("resize", handlerresize);
    return () => {
      socket.off("error server", handlerError);
      socket.off("new token", handlerNewToken);
      window.removeEventListener("resize", handlerresize);
    };
  }, []);
  return render ? (
    <Context.Provider
      value={{ authenticated, setAuthenticated, socket, dialog, setDialog }}
    >
      {loading && <Loading />}
      {!loading && (
        <div>
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

App.propTypes = {};

export default App;
