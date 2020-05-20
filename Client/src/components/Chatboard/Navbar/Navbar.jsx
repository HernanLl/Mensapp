import React from "react";
import "./styles.scss";
import Icon from "../../Common/Icon/Icon";
import Dropdown from "./Dropdown/Dropdown";
export default function Navbar(props) {
  const { setEdit, openProfile } = props;
  return (
    <div className="Navbar">
      <div className="Navbar__user">
        <img
          className="Navbar__userimage"
          src="https://scontent.fpra1-1.fna.fbcdn.net/v/t31.0-8/p960x960/12484784_980430892031686_4558599259143966728_o.jpg?_nc_cat=106&_nc_sid=85a577&_nc_ohc=2jzYcoyzwDQAX-H-dxz&_nc_ht=scontent.fpra1-1.fna&_nc_tp=6&oh=90326e49588ba88d920eedf302ad3ec5&oe=5ECC9EB6"
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
