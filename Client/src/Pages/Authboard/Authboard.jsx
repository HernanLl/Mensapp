import React from "react";
import "./styles.scss";
import file from "../../assets/Board.svg";
import { Switch, Route, Redirect } from "react-router-dom";

import RegisterComplete from "./RegisterComplete/RegisterCompleteContainer";
import Login from "./Login/LoginContainer";
import Register from "./Register/RegisterContainer";
import Forgot from "./Forgot/ForgotContainer";

function Authboard() {
  return (
    <div id="tuvieja" className="Authboard">
      <div className="Authboard__image">
        <img src={file} />
      </div>
      <div className="Authboard__form">
        <Switch>
          <Route path="/" component={Login} exact />
          <Route path="/signup" component={Register} exact />
          <Route path="/signup/finish" component={RegisterComplete} exact />
          <Route path="/forgot" component={Forgot} exact />
          <Route path="*" render={() => <Redirect to="/" />} />
        </Switch>
      </div>
    </div>
  );
}

Authboard.propTypes = {};

export default Authboard;
