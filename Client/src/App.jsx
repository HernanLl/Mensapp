import React, { useContext, useEffect, useState, createContext } from "react";
import "./styles.scss";
import Authboard from "./components/Authboard/Authboard";
import Chatboard from "./components/ChatBoard/Chatboard";
import { Context } from "./context/Context";

function App(props) {
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("token")) setAuthenticated(true);
  }, []);
  return (
    <Context.Provider value={{ authenticated, setAuthenticated }}>
      {authenticated ? <Chatboard /> : <Authboard />}
    </Context.Provider>
  );
}

App.propTypes = {};

export default App;
