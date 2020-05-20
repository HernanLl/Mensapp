import React, { useState } from "react";
import PropTypes from "prop-types";
import "./styles.scss";

function Textarea(props) {
  const {
    color,
    value,
    width,
    height,
    onChange,
    placeholder,
    helper,
    textcolor,
  } = props;
  const [focus, setFocus] = useState(false);
  const styles =
    focus || value
      ? {
          container: { border: "2px solid #79C7F9" },
          label: {
            top: "-25px",
            left: "0",
            color: "#79C7F9",
            fontSize: "16px",
            letterSpacing: "2px",
          },
        }
      : {
          container: { border: `2px solid ${color}` },
          label: { color, fontSize: "20px" },
        };
  return (
    <div className="Textarea" style={{ width, height, ...styles.container }}>
      <label className="Textarea__label" style={styles.label}>
        {`${placeholder} ${!helper || focus || value ? "" : helper}`}
      </label>
      <textarea
        className="Textarea__textarea"
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={(e) => onChange(e.target.value)}
        value={value || ""}
        spellCheck={false}
        style={{ color: textcolor }}
      />
    </div>
  );
}

Textarea.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  color: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  placeholder: PropTypes.string,
  helper: PropTypes.string,
  textcolor: PropTypes.string,
};

export default Textarea;
