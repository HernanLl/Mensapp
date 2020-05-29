import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import { showDatetime, convertUrlProfile } from "../../../helper/helper";
import { useState } from "react";

function Message(props) {
  const { my, message, datetime, urlprofile, urlimage } = props;
  const [activepreview, setActivepreview] = useState(false);
  const myref = useRef(null);

  useEffect(() => {
    if (activepreview) myref.current.focus();
  }, [activepreview]);

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
    : { ...styles.message, padding: "0" };
  styles.img = my ? { marginLeft: "auto" } : {};
  return (
    <div className="Message" style={styles.container}>
      {activepreview && (
        <div
          className="Message__preview"
          tabIndex="1"
          ref={myref}
          onKeyDown={(e) => {
            if (e.keyCode === 27) setActivepreview(false);
          }}
        >
          <div className="Preview__cancel">
            <div
              className="Preview__handlerClick"
              onClick={() => setActivepreview(false)}
            ></div>
            X
          </div>
          <img alt="message" src={urlimage} />
        </div>
      )}
      <div className="Message__profile">
        <img alt="profile" src={urlprofile} />
      </div>
      <div className="Message__container">
        {urlimage && (
          <div
            className="Message__img"
            onClick={() => setActivepreview(true)}
            style={styles.img}
          >
            <img alt="message" src={convertUrlProfile(urlimage, 250, false)} />
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
  message: PropTypes.string,
  urlprofile: PropTypes.string,
  urlimage: PropTypes.string,
};

export default Message;
