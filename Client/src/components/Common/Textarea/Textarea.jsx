import React, { useState } from "react";
import PropTypes from "prop-types";
import "./styles.scss";

function Textarea(props) {
  const { color, value, width, height, onChange, placeholder, helper } = props;
  const [focus, setFocus] = useState(false);
  let style = {};
  if (focus || value) {
    style = {
      container: { border: "2px solid #79C7F9" },
      label: {
        top: "-25px",
        left: "0",
        color: "#79C7F9",
        fontSize: "16px",
        letterSpacing: "2px",
      },
    };
  } else {
    style = {
      container: { border: `2px solid ${color}` },
      label: { color, fontSize: "20px" },
    };
  }
  return (
    <div className="Textarea" style={{ width, height, ...style.container }}>
      <label className="Textarea__label" style={style.label}>
        {`${placeholder} ${!helper || focus || value ? "" : helper}`}
      </label>
      <textarea
        className="Textarea__textarea"
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        spellCheck={false}
      />
    </div>
  );
}

Textarea.propTypes = {
  color: PropTypes.string,
  value: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};

export default Textarea;
