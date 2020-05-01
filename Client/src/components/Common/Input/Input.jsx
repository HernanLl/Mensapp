import React, { useState } from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import Icon from "../Icon/Icon";

function Input(props) {
  const {
    icon,
    color,
    type,
    value,
    onChange,
    onPressEnter,
    placeholder,
    helper,
  } = props;
  const [focus, setFocus] = useState(false);
  let style = {};
  if (focus || value) {
    style = {
      container: { borderBottom: "2px solid #79C7F9" },
      label: {
        left: "30px",
        top: "-10px",
        color: "#79C7F9",
        fontSize: "16px",
        letterSpacing: "2px",
      },
    };
  } else {
    style = {
      container: { borderBottom: `2px solid ${color}` },
      label: { color, fontSize: "20px" },
    };
  }
  const onKeyDown = (e) => {
    if (e.keyCode === 13 && onPressEnter) {
      onPressEnter();
    }
  };
  return (
    <div className="Input" style={style.container}>
      {icon && (
        <Icon
          name={icon}
          size={30}
          color={focus || value ? "#79C7F9" : color}
        />
      )}
      <label className="Input__label" style={style.label}>
        {`${placeholder} ${!helper || focus || value ? "" : helper}`}
      </label>
      <input
        className="Input__input"
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onKeyDown={onKeyDown}
        spellCheck={false}
      />
    </div>
  );
}

Input.propTypes = {
  icon: PropTypes.string,
  color: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onPressEnter: PropTypes.func,
  placeholder: PropTypes.string,
};

export default Input;
