import React from "react";
import "./styles.scss";
import Icon from "../Common/Icon/Icon";
import sad from "../../assets/sad.png";
import { Link } from "react-router-dom";

function NotFound(props) {
  return (
    <div className="NotFound">
      <img className="NotFound__img" src={sad} />
      <p className="NotFound__description">
        La pagina a la que quiere acceder no existe. Pruebe volviendo a la
        pagina de <Link to="/">Inicio</Link>
      </p>
    </div>
  );
}

export default NotFound;
