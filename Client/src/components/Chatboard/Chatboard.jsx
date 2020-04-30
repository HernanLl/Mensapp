import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import Navbar from "./Navbar/Navbar";

function Chatboard(props) {
  return (
    <div className="Chatboard">
      <Navbar />
      <div className="Chatboard__1"></div>
      <div className="Chatboard__2"></div>
      <div className="Chatboard__3"></div>
    </div>
  );
}

Chatboard.propTypes = {};

export default Chatboard;
