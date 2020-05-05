import React, { useEffect, useState, useRef, useContext } from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import useList from "../../../Hooks/useList";
import Message from "../../Common/Message/Message";
import Icon from "../../Common/Icon/Icon";
import { Context } from "../../../context/Context";
import Cookie from "js-cookie";
import { newDate } from "../../../helper/helper";

function Chat(props) {
  const { my, other, active, setActive } = props;
  const { name, state, connected } = other || {
    name: "",
    state: "",
    connected: false,
  };
  const { socket } = useContext(Context);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const myref = useRef(null);
  useEffect(() => {
    myref.current && myref.current.scrollIntoView();
  }, [messages]);

  const onPressEnter = (e) => {
    if (e.keyCode === 13) {
      onSendMessage();
    }
  };

  const onSendMessage = () => {
    //setear bien el tiempo
    const newmessage = {
      message,
      datetime: newDate(),
      urlprofile: my.urlprofile,
    };
    let arr = messages.slice();
    arr.push({ ...newmessage, my: true });
    setMessages(arr);
    setMessage("");
    //enviar al servidor para que refresque al otro usuario
    const { token = "", refreshToken = "", id = -1 } = JSON.parse(
      Cookie.get("Auth")
    );
    socket.emit("new message", {
      token,
      refreshToken,
      id,
      newmessage,
      other: other.id,
    });
  };

  const handlerGetMessages = ({ messages }) => {
    const filteredmessages = messages.map((message) => {
      return message.from === my.id ? { ...message, my: true } : message;
    });
    setMessages(filteredmessages);
  };

  useEffect(() => {
    if (other) {
      const { token = "", refreshToken = "", id = "" } = JSON.parse(
        Cookie.get("Auth")
      );
      socket.emit("get messages", { token, refreshToken, id, other: other.id });
      socket.on("get messages", handlerGetMessages);
      return () => {
        socket.off("get messages", handlerGetMessages);
      };
    }
  }, [other]);

  let styles = {};
  styles.container = active
    ? { width: "calc(100% - 775px)" }
    : { width: "calc(100% - 425px)" };
  styles.connected = connected
    ? { background: "#007E33" }
    : { background: "#CC0000" };
  return other ? (
    <div className="Chat" style={styles.container}>
      <div className="Chat__info" onClick={() => setActive(true)}>
        <div className="Info__user">
          <p className="Info__name">{name}</p>
          <div className="Info__connect" style={styles.connected}></div>
        </div>
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
        />
        <Icon name="PLANE" size={50} pointer={true} onClick={onSendMessage} />
      </div>
    </div>
  ) : null;
}

Chat.propTypes = {};

export default Chat;
