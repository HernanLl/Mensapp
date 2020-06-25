import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";

function Loading(props) {
  const { hidden } = props;
  return !hidden ? (
    <div className="Loading">
      <div className="loader">Loading...</div>
    </div>
  ) : null;
}

Loading.propTypes = {
  hidden: PropTypes.bool,
};

export default Loading;
