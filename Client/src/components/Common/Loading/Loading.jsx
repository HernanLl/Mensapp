import React from "react";
import "./styles.scss";

function Loading(props) {
  const { hidden } = props;
  return !hidden ? (
    <div className="Loading">
      <div className="loader">Loading...</div>
    </div>
  ) : null;
}

export default Loading;
