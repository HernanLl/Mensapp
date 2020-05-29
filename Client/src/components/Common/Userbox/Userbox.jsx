import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import {
  filterTextByWords,
  filterTextByCharacters,
  showDatetime,
  convertUrlProfile,
} from "../../../helper/helper";

function Userbox(props) {
  const {
    id,
    urlprofile,
    name,
    connected,
    latestmessage,
    countmessages,
    onClick,
  } = props;
  const { message, datetime } = latestmessage || {
    message: "",
    connected: false,
    countmessages: 0,
    datetime: "",
  };
  let styles = {};
  styles.connected = connected
    ? { background: "#007E33" }
    : { background: "#CC0000" };
  styles.datetime = countmessages != 0 ? { bottom: "5px" } : {};
  const profile = convertUrlProfile(urlprofile);

  return (
    <div className="Userbox" onClick={() => onClick(id)}>
      <div className="Userbox__img">
        <img alt="profile" src={profile} />
      </div>
      <div className="Userbox__data">
        <div className="Userbox__userinfo">
          <p className="Userbox__username">{filterTextByWords(name, 2)}</p>
          <div className="Userbox__connected" style={styles.connected}></div>
        </div>
        <p className="Userbox__latestmessage">
          {message && filterTextByCharacters(message, 15)}
        </p>
      </div>
      <div className="Userbox__info">
        {countmessages != 0 && (
          <p className="Userbox__countmessages">{countmessages}</p>
        )}
        {datetime && (
          <p className="Userbox__datetime">{showDatetime(datetime)}</p>
        )}
      </div>
    </div>
  );
}

Userbox.propTypes = {
  id: PropTypes.number,
  urlprofile: PropTypes.string,
  name: PropTypes.string,
  latestmessage: PropTypes.shape({
    message: PropTypes.string,
    connected: PropTypes.bool,
    countMessages: PropTypes.number,
    datetime: PropTypes.string,
  }),
  onClick: PropTypes.func,
  connected: PropTypes.bool,
  countmessages: PropTypes.number,
};

export default Userbox;
