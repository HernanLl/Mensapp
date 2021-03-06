import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import { showDatetime, convertUrlProfile } from "helper/helper.js";
import { useState } from "react";
import cancelFile from "assets/close.svg";

function Message(props) {
  const { my, message, datetime, urlprofile, urlimage, mainref } = props;
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
    <div className="Message" ref={mainref} style={styles.container}>
      {activepreview && (
        <div
          className="Message__preview"
          tabIndex="1"
          ref={myref}
          onKeyDown={(e) => {
            if (e.keyCode === 27) setActivepreview(false);
          }}
        >
          <div
            className="Preview__cancel"
            onClick={() => setActivepreview(false)}
          >
            <img src={cancelFile} className="Preview__handlerClick" />
          </div>
          <img alt="message" src={urlimage} />
        </div>
      )}
      <div className="Message__profile">
        <img alt="profile" src={convertUrlProfile(urlprofile, 50, true)} />
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
  message: PropTypes.string,
  datetime: PropTypes.string,
  urlprofile: PropTypes.string,
  urlimage: PropTypes.string,
  mainref: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
};

export default Message;
