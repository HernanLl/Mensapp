import React from "react";
import PropTypes from "prop-types";
import Input from "../../Common/Input/Input";
import Textarea from "../../Common/Textarea/Textarea";

function RegisterComplete(props) {
  return (
    <div className="FormContainer">
      <div className="FormContainer__brand">MENSAPP</div>
      <form className="FormContainer__form Form">
        <p className="Form__description">
          Para finalizar el registro, ingrese a su correo para verificar su
          cuenta. A continuación ingrese algunos datos mas para completar su
          registro
        </p>
        <div className="row">
          <p className="row__reference">Imagen de perfil</p>
          <div className="row__profile">
            <img src="https://images.unsplash.com/photo-1588104203467-9b85b14a1307?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80" />
          </div>
        </div>
        <div className="row">
          <p className="row__reference">Imagen de fondo</p>
          <div className="row__background">
            <img src="https://images.unsplash.com/photo-1588104203467-9b85b14a1307?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80" />
          </div>
        </div>
        <Input
          icon="LOCATION"
          color="#ccc"
          type="text"
          value={""}
          onChange={() => {}}
          onPressEnter={() => {}}
          placeholder="Localidad"
        />
        <Textarea
          color="#ccc"
          value=""
          width="100%"
          height="200px"
          onChange={() => {}}
          placeholder="Estado"
        />
        <button className="Form__button">Finalizar registro</button>
      </form>
    </div>
  );
}

RegisterComplete.propTypes = {};

export default RegisterComplete;
