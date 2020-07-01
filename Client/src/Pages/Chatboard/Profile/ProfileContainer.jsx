import React, { useState, useLayoutEffect } from "react";
import "./styles.scss";
import Profile from "./Profile";

function ProfileContainer(props) {
  const {
    name,
    location,
    state,
    urlprofile,
    urlbackground,
    active,
    setActive,
  } = props;
  const [profileloaded, setProfile] = useState(false);
  const [backgroundloaded, setBackground] = useState(false);

  useLayoutEffect(() => {
    setProfile(false);
  }, [urlprofile]);
  useLayoutEffect(() => {
    setBackground(false);
  }, [urlbackground]);

  return (
    <Profile
      name={name}
      location={location}
      state={state}
      urlprofile={urlprofile}
      urlbackground={urlbackground}
      active={active}
      setActive={setActive}
      profileloaded={profileloaded}
      setProfile={setProfile}
      backgroundloaded={backgroundloaded}
      setBackground={setBackground}
    />
  );
}

export default ProfileContainer;
