import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";

//components
import Message from "Common/Message";
import Icon from "Common/Icon";

function Chat(props) {
  const {
    previewRef,
    inputRef,
    bottomScrollRef,
    latestMessageRef,
    mostMessagesRef,
  } = props; //references
  const {
    other,
    active,
    loadfile,
    urlload,
    messages,
    quantity,
    inputmessage,
  } = props; //data
  const {
    onClickInfo,
    onDragEnter,
    onDrop,
    onDragLeave,
    onPressEnter,
    onPressEsc,
    openWidget,
    onSendMessage,
    onMostMessages,
    setInputmessage,
  } = props; //events

  const { id, name = "", state = "" } = other;

  const stylecontainer = active
    ? { width: "calc(100% - 775px)" }
    : { width: "calc(100% - 425px)" };

  let latest =
    quantity * 10 < messages.length
      ? 10
      : 10 - (quantity * 10 - messages.length);

  return id ? (
    <div className="Chat" style={stylecontainer} onKeyDown={onPressEsc}>
      <div className="Chat__info" onClick={onClickInfo}>
        <p className="Info__name">{name}</p>
        <p className="Info__state">{state}</p>
      </div>
      <div
        className="Chat__listMessages scroll"
        onDragEnter={onDragEnter}
        tabIndex="1"
        ref={previewRef}
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
        {quantity < messages.length / 10 && (
          <div ref={mostMessagesRef} className="Chat__mostmessages">
            <Icon
              name="ADD"
              size={30}
              color="black"
              pointer={true}
              onClick={onMostMessages}
            />
          </div>
        )}
        {messages
          .slice(quantity * -10)
          .map((message, index) =>
            index !== latest ? (
              <Message key={index} {...message} />
            ) : (
              <Message key={index} {...message} mainref={latestMessageRef} />
            )
          )}
        <div ref={bottomScrollRef}></div>
      </div>
      <div className="Chat__input">
        <input
          type="text"
          placeholder="Escriba un mensaje"
          value={inputmessage}
          onChange={(e) => setInputmessage(e.target.value)}
          onKeyDown={onPressEnter}
          disabled={other.erased}
          ref={inputRef}
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

const ref = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.shape({ current: PropTypes.object }),
]);

Chat.propTypes = {
  previewRef: ref,
  inputRef: ref,
  bottomScrollRef: ref,
  latestMessageRef: ref,
  mostMessagesRef: ref,
  other: PropTypes.object,
  active: PropTypes.bool,
  loadfile: PropTypes.bool,
  urlload: PropTypes.string,
  messages: PropTypes.array,
  quantity: PropTypes.number,
  inputmessage: PropTypes.string,
  onClickInfo: PropTypes.func,
  cleanFileLoader: PropTypes.func,
  onDragEnter: PropTypes.func,
  onDrop: PropTypes.func,
  onDragLeave: PropTypes.func,
  onPressEnter: PropTypes.func,
  onPressEsc: PropTypes.func,
  openWidget: PropTypes.func,
  onSendMessage: PropTypes.func,
  onMostMessages: PropTypes.func,
  setInputmessage: PropTypes.func,
};

export default Chat;
