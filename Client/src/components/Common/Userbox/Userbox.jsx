import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import {
  filterTextByWords,
  filterTextByCharacters,
  showDatetime,
} from "../../../helper/helper";

function Userbox(props) {
  const { id, urlprofile, name, latestmessage, onClick } = props;
  const { message, connected, countmessages, datetime } = latestmessage || {
    message: "",
    connected: false,
    countmessages: 0,
    datetime: "",
  };
  const styles = connected
    ? { background: "#007E33" }
    : { background: "#CC0000" };
  return (
    <div className="Userbox" onClick={() => onClick(id)}>
      <div className="Userbox__img">
        <img src={urlprofile} />
      </div>
      <div className="Userbox__data">
        <div className="Userbox__userinfo">
          <p className="Userbox__username">{filterTextByWords(name, 2)}</p>
          <div className="Userbox__connected" style={styles}></div>
        </div>
        <p className="Userbox__latestmessage">
          {message && filterTextByCharacters(message, 15)}
        </p>
      </div>
      {latestmessage && (
        <div className="Userbox__info">
          {countmessages && (
            <p className="Userbox__countmessages">{countmessages}</p>
          )}
          <p className="Userbox__datetime">{showDatetime(datetime)}</p>
        </div>
      )}
    </div>
  );
}

Userbox.propTypes = {
  id: PropTypes.number,
  urlprofile: PropTypes.string,
  name: PropTypes.string,
  latestmessages: PropTypes.shape({
    message: PropTypes.string,
    connected: PropTypes.bool,
    countMessages: PropTypes.number,
    datetime: PropTypes.string,
  }),
  onClick: PropTypes.func,
};

export default Userbox;
