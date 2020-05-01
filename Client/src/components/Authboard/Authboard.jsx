import React, { useEffect, useContext } from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import file from "../../assets/Board.svg";
import { Switch, Route } from "react-router-dom";
import Login from "./Login/Login";
import Register from "./Register/Register";
import RegisterComplete from "./RegisterComplete/RegisterComplete";

function Authboard(props) {
  return (
    <div className="Authboard">
      <div className="Authboard__image">
        <img src={file} />
      </div>
      <div className="Authboard__form">
        <Switch>
          <Route path="/" component={Login} exact />
          <Route path="/signup" component={Register} exact />
          <Route path="/signup/finish" component={RegisterComplete} exact />
        </Switch>
      </div>
    </div>
  );
}

Authboard.propTypes = {};

export default Authboard;
