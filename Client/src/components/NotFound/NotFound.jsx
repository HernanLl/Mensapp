import React from "react";
import "./styles.scss";

function NotFound() {
  return (
    <div className="NotFound">
      <div className="central-body">
        <p style={{ fontSize: "10rem", color: "white" }}>404</p>
        <p style={{ fontSize: "3rem", color: "white" }}>Pagina no encontrada</p>
        <a href="/" className="btn-go-home" style={{ fontSize: "1.5rem" }}>
          Ir a inicio
        </a>
      </div>
      <div className="objects">
        <img
          className="object_rocket"
          src="http://salehriaz.com/404Page/img/rocket.svg"
          width="40px"
        />
        <div className="earth-moon">
          <img
            className="object_earth"
            src="http://salehriaz.com/404Page/img/earth.svg"
            width="100px"
          />
          <img
            className="object_moon"
            src="http://salehriaz.com/404Page/img/moon.svg"
            width="80px"
          />
        </div>
        <div className="box_astronaut">
          <img
            className="object_astronaut"
            src="http://salehriaz.com/404Page/img/astronaut.svg"
            width="140px"
          />
        </div>
      </div>
      <div className="glowing_stars">
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
      </div>
    </div>
  );
}

export default NotFound;
