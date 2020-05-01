import React, { useContext, useEffect, useState, createContext } from "react";
import "./styles.scss";
import Authboard from "./components/Authboard/Authboard";
import Chatboard from "./components/ChatBoard/Chatboard";
import { Context } from "./context/Context";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import Cookie from "js-cookie";
import io from "socket.io-client";
import NotFound from "./components/NotFound/NotFound";
const socket = io("http://localhost:3000/", { rejectUnauthorized: false });

function App(props) {
  const [authenticated, setAuthenticated] = useState(
    Cookie.get("Auth") ? true : false
  );

  const handlerError = ({ code, message }) => {
    alert(message);
  };
  useEffect(() => {
    socket.on("error server", handlerError);
    return () => {
      socket.off("error server", handlerError);
    };
  }, []);
  return (
    <Context.Provider value={{ authenticated, setAuthenticated, socket }}>
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
    </Context.Provider>
  );
}

App.propTypes = {};

export default App;
