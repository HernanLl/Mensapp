import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import { showDatetime } from "../../../helper/helper";

function Message(props) {
  const { my, message, datetime, urlprofile } = props;
  const styles = my
    ? {
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
      }
    : {
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
  return (
    <div className="Message" style={styles.container}>
      <div className="Message__img">
        <img alt="profile" src={urlprofile} />
      </div>
      <div className="Message__message" style={styles.message}>
        <p>{message}</p>
        <div className="Message__info" style={styles.info}>
          <p>{showDatetime(datetime)}</p>
        </div>
      </div>
    </div>
  );
}

Message.propTypes = {
  my: PropTypes.bool,
  datetime: PropTypes.string,
  message: PropTypes.string.isRequired,
  urlprofile: PropTypes.string.isRequired,
};

export default Message;
