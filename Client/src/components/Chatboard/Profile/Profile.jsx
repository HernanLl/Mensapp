import React, { useState } from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import Icon from "../../Common/Icon/Icon";
import { convertUrlProfile } from "../../../helper/helper";

function Profile(props) {
  const { user, active, setActive } = props;
  const { name, location, state, urlprofile, urlbackground } = user;
  const styles = active ? {} : { transform: "scale(0.5)", opacity: "0" };
  const profile = convertUrlProfile(urlprofile);
  return (
    <div className="Profile" style={styles}>
      <div className="Profile__background">
        <img src={urlbackground} />
      </div>
      <div className="Profile__filter"></div>
      <div className="Profile__icon">
        <Icon
          name="BOTTOM_ARROW"
          size={30}
          pointer={true}
          viewBox="0 0 615 615"
          color="white"
          onClick={() => setActive(false)}
        />
      </div>
      <div className="Profile__profile">
        <img src={profile} />
      </div>
      <div className="Profile__Info">
        <p className="Info__title">{name}</p>
        <div className="Info__location">
          <Icon name="LOCATION" size={20} color="white" />
          <p>{location}</p>
        </div>
        <p>{state}</p>
      </div>
    </div>
  );
}

Profile.propTypes = {};

export default Profile;
