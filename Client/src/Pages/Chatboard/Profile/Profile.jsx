import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import { convertUrlProfile } from "helper/helper";

import Icon from "Common/Icon";
import Loading from "Common/Loading";

function Profile(props) {
  const {
    name,
    location,
    state,
    urlprofile,
    urlbackground,
    active,
    setActive,
    profileloaded,
    setProfile,
    backgroundloaded,
    setBackground,
  } = props;

  //styles
  let styles = {};
  styles.profile = active ? {} : { transform: "scale(0.5)", opacity: "0" };
  styles.container =
    profileloaded && backgroundloaded ? {} : { display: "none" };
  //convert url image to focus face
  const profile = convertUrlProfile(urlprofile, 600, true);
  return (
    <div className="Profile" style={styles.profile}>
      <div className="Profile__container" style={styles.container}>
        <div className="Profile__background">
          <img
            alt="background"
            onLoad={() => setBackground(true)}
            src={urlbackground}
          />
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
          <img alt="profile" src={profile} onLoad={() => setProfile(true)} />
        </div>
        <div className="Profile__Info">
          <p className="Info__title">{name}</p>
          <div className="Info__location">
            {location && <Icon name="LOCATION" size={20} color="white" />}
            <p>{location}</p>
          </div>
          <p>{state}</p>
        </div>
      </div>
      <Loading hidden={profileloaded && backgroundloaded} />
    </div>
  );
}

Profile.propTypes = {
  name: PropTypes.string,
  location: PropTypes.string,
  state: PropTypes.string,
  urlprofile: PropTypes.string,
  urlbackground: PropTypes.string,
  active: PropTypes.bool,
  setActive: PropTypes.func,
  profileloaded: PropTypes.bool,
  setProfile: PropTypes.func,
  backgroundloaded: PropTypes.bool,
  setBackground: PropTypes.func,
};

export default Profile;
