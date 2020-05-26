import React, { useEffect, useContext } from "react";
import "./styles.scss";
import file from "../../assets/Board.svg";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "./Login/Login";
import Register from "./Register/Register";
import RegisterComplete from "./RegisterComplete/RegisterComplete";
import { useState } from "react";
import NotFound from "../NotFound/NotFound";

function Authboard(props) {
  const [message, setMessage] = useState("");
  return (
    <div id="tuvieja" className="Authboard">
      <div className="Authboard__image">
        <img src={file} />
      </div>
      <div className="Authboard__form">
        <Switch>
          <Route
            path="/"
            render={(routeProps) => <Login {...routeProps} message={message} />}
            exact
          />
          <Route
            path="/signup"
            render={(routeProps) => (
              <Register {...routeProps} setMessage={setMessage} />
            )}
            exact
          />
          <Route path="/signup/finish" component={RegisterComplete} exact />
          <Route path="*" render={() => <Redirect to="/" />} />
        </Switch>
      </div>
    </div>
  );
}

Authboard.propTypes = {};

export default Authboard;
