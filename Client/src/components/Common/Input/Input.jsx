import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import Icon from "../Icon/Icon";
import { useEffect } from "react";

function Input(props) {
  const {
    icon,
    color,
    type,
    name,
    value,
    onChange,
    onPressEnter,
    placeholder,
    helper,
    textcolor,
    autocomplete,
  } = props;
  const [focus, setFocus] = useState(false);

  const onKeyDown = (e) => {
    if (e.keyCode === 13 && onPressEnter) {
      onPressEnter();
    }
  };
  const styles =
    focus || value
      ? {
          container: { borderBottom: "2px solid #79C7F9" },
          label: {
            left: "30px",
            top: "-10px",
            color: "#79C7F9",
            fontSize: "16px",
            letterSpacing: "2px",
          },
          iconColor: "#79C7F9",
        }
      : {
          container: { borderBottom: `2px solid ${color}` },
          label: { color, fontSize: "20px" },
          iconColor: color,
        };
  return (
    <div className="Input" style={styles.container}>
      {icon && <Icon name={icon} size={30} color={styles.iconColor} />}
      <label className="Input__label" style={styles.label}>
        {`${placeholder} ${!helper || focus || value ? "" : helper}`}
      </label>
      <input
        className="Input__input"
        type={type}
        value={value || ""}
        name={name}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onKeyDown={onKeyDown}
        spellCheck={false}
        style={{ color: textcolor }}
        autoComplete="off"
      />
    </div>
  );
}

Input.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string.isRequired,
  icon: PropTypes.string,
  color: PropTypes.string,
  type: PropTypes.string,
  onPressEnter: PropTypes.func,
  helper: PropTypes.string,
  textcolor: PropTypes.string,
};

export default Input;
