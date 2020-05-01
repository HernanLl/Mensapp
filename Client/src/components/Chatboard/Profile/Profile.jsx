import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";

function Profile(props) {
  return (
    <div className="Profile">
      <div className="Profile__background"></div>
      <div className="Profile__filter"></div>
      <div className="Profile__icon"></div>
    </div>
  );
}

Profile.propTypes = {};

export default Profile;
