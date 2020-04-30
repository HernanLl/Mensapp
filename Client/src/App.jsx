import React, { useContext, useEffect, useState } from "react";
import Authboard from "./components/Authboard/Authboard";

import { Context } from "./context/Context";
import Chatboard from "./components/ChatBoard/Chatboard";

function App(props) {
  const [authenticated, setAuthenticated] = useState(false);
  return (
    <Context.Provider value={{ authenticated, setAuthenticated }}>
      {authenticated ? <Chatboard /> : <Authboard />}
    </Context.Provider>
  );
}

App.propTypes = {};

export default App;
