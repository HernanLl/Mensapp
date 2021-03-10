import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import { convertUrlProfile } from "../../../helper/helper";

import Dropdown from "./Dropdown";
import Icon from "Common/Icon";

function Navbar(props) {
  const { urlprofile, setEdit, openProfile, edit } = props;
  return (
    <div className="Navbar">
      <div className="Navbar__user">
        {urlprofile && (
          <img
            className="Navbar__userimage"
            src={convertUrlProfile(urlprofile, 75)}
            alt="user"
          />
        )}
      </div>
      <div className="Navbar__Icons">
        <div class={`Navbar__icon-ly ${!edit && "Navbar__icon-ly--active"}`}>
          <hr />
          <Icon
            name="PLANE"
            size={40}
            color="white"
            pointer={true}
            onClick={() => setEdit(false)}
          />
        </div>
        <div class={`Navbar__icon-ly ${edit && "Navbar__icon-ly--active"}`}>
          <hr />
          <Icon
            name="PROFILE"
            size={40}
            color="white"
            pointer={true}
            onClick={() => setEdit(true)}
          />
        </div>

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
