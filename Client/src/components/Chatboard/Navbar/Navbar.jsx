import React from "react";
import "./styles.scss";
import Icon from "../../Common/Icon/Icon";
import Dropdown from "./Dropdown/Dropdown";
export default function Navbar(props) {
  const { urlprofile, setEdit, openProfile } = props;
  return (
    <div className="Navbar">
      <div className="Navbar__user">
        <img className="Navbar__userimage" src={urlprofile} alt="user" />
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
