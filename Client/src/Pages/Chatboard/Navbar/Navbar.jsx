import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import { convertUrlProfile } from "../../../helper/helper";

import Dropdown from "./Dropdown";
import Icon from "Common/Icon";

function Navbar(props) {
  const { urlprofile, setEdit, openProfile } = props;
  return (
    <div className="Navbar">
      <div className="Navbar__user">
        <img
          className="Navbar__userimage"
          src={convertUrlProfile(urlprofile, 75)}
          alt="user"
        />
      </div>
      <div className="Navbar__Icons">
        <Icon
          name="PLANE"
          size={40}
          color="white"
          pointer={true}
          onClick={() => setEdit(false)}
        />
        <Icon
          name="PROFILE"
          size={40}
          color="white"
          pointer={true}
          onClick={() => setEdit(true)}
        />
        <Dropdown openProfile={openProfile} />
      </div>
    </div>
  );
}

Navbar.propTypes = {
  urlprofile: PropTypes.string,
  setEdit: PropTypes.func,
  openProfile: PropTypes.func,
};

export default Navbar;
