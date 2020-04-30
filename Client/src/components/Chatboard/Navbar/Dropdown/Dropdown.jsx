import React, { useEffect, useState, useRef, useContext } from "react";
import "./styles.scss";
import Icon from "../../../Common/Icon/Icon";
import { Context } from "../../../../context/Context";

export default function Dropdown(props) {
  const [active, setActive] = useState(false);
  const myref = useRef(null);
  const { setAuthenticated } = useContext(Context);
  useEffect(() => {
    if (active) {
      myref.current.focus();
    }
  }, [active]);

  const onSignout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
  };

  const displayOptions = active ? "Dropdown__options--active" : "";
  const style = {
    left: "50px",
    bottom: "50px",
    background: "white",
  };

  return (
    <div
      id="Dropdown"
      className="Dropdown"
      tabIndex={1}
      onBlur={() => setActive(false)}
    >
      <Icon
        name="CONFIG"
        size={40}
        color="white"
        pointer={true}
        onClick={() => setActive(!active)}
      />
      <div
        className={`Dropdown__options ${displayOptions}`}
        ref={myref}
        style={style}
      >
        <div className="Dropdown__item" onClick={onSignout}>
          <p>Cerrar sesión</p>
        </div>
        <div className="Dropdown__item" onClick={() => {}}>
          <p>Borrar cuenta</p>
        </div>
      </div>
    </div>
  );
}
