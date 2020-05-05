import React, { Fragment } from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import Icon from "../Icon/Icon";

function Dialog(props) {
  const {
    type,
    options,
    title,
    description,
    display,
    onClose,
    onSuccess,
  } = props;
  let color = "";
  let iconName = "";
  switch (type) {
    case "success":
      color = "#00c851";
      iconName = "CHECK";
      break;
    case "danger":
      color = "#ff4444";
      iconName = "CANCEL";
      break;
    case "info":
      color = "#33b5e5";
      iconName = "INFO";
      break;
  }
  return display ? (
    <div className="Dialog">
      <div className="Dialog__state" style={{ background: color }}>
        <Icon name={iconName} size={70} color="white" />
      </div>
      <div className="Dialog__info">
        <p className="Info__title">{title}</p>
        <p className="Info__subtitle">{description}</p>
      </div>
      <div className="Dialog__options">
        {options && (
          <Fragment>
            <button
              onClick={onClose}
              className="Options__button Options__button--cancel"
            >
              Cancelar
            </button>
            <button
              onClick={onSuccess}
              className="Options__button Options__button--accept"
            >
              Aceptar
            </button>
          </Fragment>
        )}
        {!options && (
          <button
            onClick={onClose}
            className="button"
            style={{ background: color }}
          >
            OK
          </button>
        )}
      </div>
    </div>
  ) : null;
}

Dialog.propTypes = {
  type: PropTypes.oneOf(["success", "danger", "info"]),
  options: PropTypes.bool,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  display: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
};

export default Dialog;
