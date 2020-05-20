import React, { useEffect, useState, useRef, useContext } from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import { Context } from "../../../context/Context";
import { newDate, getCookie } from "../../../helper/helper";

//components
import useList from "../../../Hooks/useList";
import Message from "../../Common/Message/Message";
import Icon from "../../Common/Icon/Icon";

function Chat(props) {
  const { my, other, active, onNewMessage, onClickInfo } = props;
  const { name = "", state = "" } = other;
  //local state, actual message and list messages
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  //context and ref
  const { socket } = useContext(Context);
  const myref = useRef(null);

  //handlers to sending message
  const onPressEnter = (e) => {
    if (e.keyCode === 13) {
      onSendMessage();
    }
  };
  const onSendMessage = () => {
    //clearing input
    setMessage("");
    //update messages
    const newmessage = {
      to: other.id,
      from: my.id,
      my: true,
      message,
      datetime: newDate(),
      urlprofile: my.urlprofile,
    };
    setMessages([...messages, newmessage]);
    //emit event for update messages to "from"
    const { token = "", refreshToken = "", id = -1 } = getCookie();
    socket.emit("new message", {
      token,
      refreshToken,
      id,
      newmessage,
      other: other.id,
    });
    //update latestmessages in users
    onNewMessage(newmessage);
  };

  //handlers method for socket on events
  const handlerGetMessages = ({ messages }) => {
    const filteredmessages = messages.map((message) => {
      return message.from === my.id
        ? {
            ...message,
            my: true,
            urlprofile: my.urlprofile ? my.urlprofile : message.urlprofile,
          }
        : {
            ...message,
            my: false,
            urlprofile: other.urlprofile
              ? other.urlprofile
              : message.urlprofile,
          };
    });
    setMessages(filteredmessages);
  };
  const handlerNewMessage = ({ from, message, datetime, urlprofile }) => {
    const newmessage = {
      from,
      message,
      datetime,
      urlprofile,
      to: my.id,
    };
    setMessages([...messages, newmessage]);
  };

  //useeffects
  useEffect(() => {
    if (other) {
      const { token = "", refreshToken = "", id = "" } = getCookie();
      socket.emit("get messages", { token, refreshToken, id, other: other.id });
      socket.on("get messages", handlerGetMessages);
      return () => {
        socket.off("get messages", handlerGetMessages);
      };
    }
  }, [other]);

  useEffect(() => {
    myref.current && myref.current.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    if (my) {
      socket.on("new message", handlerNewMessage);
      return () => {
        socket.off("new message", handlerNewMessage);
      };
    }
  }, [my, messages]);

  const stylecontainer = active
    ? { width: "calc(100% - 775px)" }
    : { width: "calc(100% - 425px)" };
  return other.id ? (
    <div className="Chat" style={stylecontainer}>
      <div className="Chat__info" onClick={() => onClickInfo()}>
        <p className="Info__name">{name}</p>
        <p className="Info__state">{state}</p>
      </div>
      <div className="Chat__listMessages scroll">
        {useList(messages, Message)}
        <div ref={myref}></div>
      </div>
      <div className="Chat__input">
        <input
          type="text"
          placeholder="Escriba un mensaje"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={onPressEnter}
          disabled={other.erased}
        />
        <Icon
          hidden={other.erased}
          name="PLANE"
          size={50}
          pointer={true}
          onClick={onSendMessage}
        />
      </div>
    </div>
  ) : null;
}

Chat.propTypes = {
  my: PropTypes.object,
  other: PropTypes.object,
  active: PropTypes.bool,
  onNewMessage: PropTypes.func,
};

export default Chat;
