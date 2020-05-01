import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";

function Message(props) {
  const { my, message, datetime, urlprofile } = props;
  let styles = {};
  if (my) {
    styles = {
      container: {
        flexDirection: "row-reverse",
      },
      message: {
        background: "#79C7F9",
        color: "white",
      },
      info: {
        justifyContent: "flex-start",
        left: "-15px",
      },
    };
  } else {
    styles = {
      container: {
        flexDirection: "row",
      },
      message: {
        background: "#EEF0F2",
      },
      info: {
        justifyContent: "flex-end",
        right: "-15px",
      },
    };
  }
  return (
    <div className="Message" style={styles.container}>
      <div className="Message__img">
        <img src={urlprofile} />
      </div>
      <div className="Message__message" style={styles.message}>
        <p>{message}</p>
        <div className="Message__info" style={styles.info}>
          <p>{datetime}</p>
        </div>
      </div>
    </div>
  );
}

Message.propTypes = {};

export default Message;
