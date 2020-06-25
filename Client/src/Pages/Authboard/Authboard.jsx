import React from "react";
import "./styles.scss";
import file from "../../assets/Board.svg";
import { Switch, Route, Redirect } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import RegisterComplete from "./RegisterComplete";
import Forgot from "./Forgot";

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
