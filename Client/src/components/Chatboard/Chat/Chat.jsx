import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import useList from "../../../Hooks/useList";
import Message from "../../Common/Message/Message";
import Icon from "../../Common/Icon/Icon";

function Chat(props) {
  const { name, state, connected } = props;
  const messages = [
    {
      message: "Hola como andas wachin!!",
      datetime: "Jueves 13.30",
      my: true,
      urlprofile:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80",
    },
    {
      message: "Hola como andas wachin!!",
      datetime: "Jueves 13.30",
      my: false,
      urlprofile:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80",
    },
    {
      message:
        "Hola como andas wachin!! Hola como andas wachin!! Hola como andas wachin!! Hola como andas wachin!! Hola como andas wachin!! Hola como andas wachin!! Hola como andas wachin!! Hola como andas wachin!! Hola como andas wachin!!",
      datetime: "Jueves 13.30",
      my: false,
      urlprofile:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80",
    },
    {
      message:
        "Hola como andas wachin!! Hola como andas wachin!!Hola como andas wachin!!Hola como andas wachin!! Hola como andas wachin!! Hola como andas wachin!! Hola como andas wachin!!",
      datetime: "Jueves 13.30",
      my: true,
      urlprofile:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80",
    },
    {
      message: "Hola como andas wachin!!",
      datetime: "Jueves 13.30",
      my: false,
      urlprofile:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80",
    },
  ];
  return (
    <div className="Chat">
      <div className="Chat__info">
        <div className="Info__user">
          <p className="Info__name">{name}</p>
          {connected && <div className="Info__connect"></div>}
        </div>
        <p className="Info__state">{state}</p>
      </div>
      <div className="Chat__listMessages scroll">
        {useList(messages, Message)}
      </div>
      <div className="Chat__input">
        <input type="text" placeholder="Escriba un mensaje" />
        <Icon name="PLANE" size={50} pointer={true} />
      </div>
    </div>
  );
}

Chat.propTypes = {};

export default Chat;
