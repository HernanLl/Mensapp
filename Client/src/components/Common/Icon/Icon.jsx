import React from "react";
import PropTypes from "prop-types";
import { svg } from "../../../svg";
function Icon(props) {
  const { name, size, color, pointer, hidden, onClick } = props;
  return !hidden ? (
    <svg
      className="Icon"
      viewBox="0 0 512 512"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fill: color,
        cursor: pointer && "pointer",
      }}
      onClick={onClick}
    >
      {svg[name].map((elem, index) => (
        <path key={index} d={elem} />
      ))}
    </svg>
  ) : null;
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  color: PropTypes.string,
  pointer: PropTypes.bool,
  hidden: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Icon;
