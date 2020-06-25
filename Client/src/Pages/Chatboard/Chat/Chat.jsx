import React from "react";
import "./styles.scss";

//components
import Message from "Common/Message";
import Icon from "Common/Icon";

function Chat(props) {
  const {
    other,
    active,
    onClickInfo,
    cleanFileLoader,
    onDragEnter,
    onDrop,
    onDragLeave,
    loadfile,
    urlload,
    messages,
    preview_ref,
    input_ref,
    scroll_ref,
    mostmessages_ref,
    onPressEnter,
    openWidget,
    onSendMessage,
    quantity,
    onMostMessages,
    inputmessage,
    setInputmessage,
    latestmessage_ref,
  } = props;
  const { id, name = "", state = "" } = other;

  const stylecontainer = active
    ? { width: "calc(100% - 775px)" }
    : { width: "calc(100% - 425px)" };

  return id ? (
    <div
      className="Chat"
      style={stylecontainer}
      onKeyDown={(e) => {
        if (e.keyCode === 27) cleanFileLoader();
      }}
    >
      <div className="Chat__info" onClick={onClickInfo}>
        <p className="Info__name">{name}</p>
        <p className="Info__state">{state}</p>
      </div>
      <div
        className="Chat__listMessages scroll"
        onDragEnter={onDragEnter}
        tabIndex="1"
        ref={preview_ref}
      >
        {loadfile && (
          <div
            className="Chat__loadfile"
            style={stylecontainer}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <div className="Chat__loadfile__border">
              {urlload && <img src={urlload} alt="" />}
              {!urlload && <p>Suelte sus archivos aqui :)</p>}
            </div>
          </div>
        )}
        {quantity < messages.length / 10 ? (
          <div ref={mostmessages_ref} className="Chat__mostmessages">
            <Icon
              name="ADD"
              size={30}
              color="black"
              pointer={true}
              onClick={onMostMessages}
            />
          </div>
        ) : null}
        {messages.slice(quantity * -10).map((message, index) => {
          let cond =
            quantity * 10 > messages.length
              ? messages.length - (quantity - 1) * 10
              : (quantity - 1) * 10;
          if (index !== cond) {
            return <Message key={index} {...message} />;
          } else {
            return (
              <Message key={index} {...message} mainref={latestmessage_ref} />
            );
          }
        })}
        <div ref={scroll_ref}></div>
      </div>
      <div className="Chat__input">
        <input
          type="text"
          placeholder="Escriba un mensaje"
          value={inputmessage}
          onChange={(e) => setInputmessage(e.target.value)}
          onKeyDown={onPressEnter}
          disabled={other.erased}
          ref={input_ref}
        />
        <Icon
          hidden={other.erased}
          name="CAMERA"
          size={40}
          pointer={true}
          onClick={openWidget}
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

export default Chat;
