import React from "react";
import "./styles.scss";
import sad from "../../assets/sad.png";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="NotFound">
      <img className="NotFound__img" src={sad} />
      <p className="NotFound__title">404</p>
      <p className="NotFound__description">Page not found</p>
      <p className="NotFound__reference">
        Ir a{" "}
        <Link className="link" to="/">
          Inicio
        </Link>
      </p>
    </div>
  );
}

export default NotFound;
