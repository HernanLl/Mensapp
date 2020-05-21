import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import { showDatetime } from "../../../helper/helper";
import { useState } from "react";

function Message(props) {
  const { my, message, datetime, urlprofile, urlimage } = props;
  const [activepreview, setActivepreview] = useState(true);
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
  styles.message = message
    ? { ...styles.message, padding: "16px" }
    : { ...styles.message };
  return (
    <div className="Message" style={styles.container}>
      <div className="Message__profile">
        <img alt="profile" src={urlprofile} />
      </div>
      <div className="Message__container">
        {activepreview && (
          <div className="Message__preview">
            <div className="Preview__cancel">
              <div
                className="Preview__handlerClick"
                onClick={() => setActivepreview(false)}
              ></div>
              X
            </div>
            <img alt="profile" src={urlimage} />
          </div>
        )}
        {urlimage && (
          <div className="Message__img" onClick={() => setActivepreview(true)}>
            <img alt="profile" src={urlimage} />
          </div>
        )}
        <div className="Message__message" style={styles.message}>
          <p>{message}</p>
          <div className="Message__info" style={styles.info}>
            <p>{showDatetime(datetime)}</p>
          </div>
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
