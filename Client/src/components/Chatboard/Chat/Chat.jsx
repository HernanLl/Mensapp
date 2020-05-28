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
  //local state
  const [inputmessage, setInputmessage] = useState(""); //the actual message in input
  const [messages, setMessages] = useState([]); //list messages
  const [loadfile, setLoadfile] = useState(false); //used to render container to drop images
  const [urlload, setUrlload] = useState(""); //contains the url of the dropped image
  const [file, setFile] = useState(); //contains File element js result of drop image
  const [quantity, setQuantity] = useState(1); // used to reduce the number of messages
  //context and refs for handler focus
  const { socket, setDialog } = useContext(Context);
  const scroll_ref = useRef(null);
  const preview_ref = useRef(null);
  const input_ref = useRef(null);

  const onPressEnter = (e) => {
    if (e.keyCode === 13) {
      onSendMessage();
    }
  };
  const onDrop = (e) => {
    if (e.dataTransfer.files && e.dataTransfer.files.length > 1) {
      setLoadfile(false);
      setDialog({
        type: "info",
        title: "Error al cargar",
        description: "No puede ingresar mas de una imagen a la vez",
        display: true,
        onClose: () => {
          setDialog({});
        },
      });
    } else if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const isimage = /(jpg|png|jpeg)/i.test(e.dataTransfer.files[0].name);
      if (!isimage) {
        setLoadfile(false);
        setDialog({
          type: "info",
          title: "Archivo no permitido",
          description:
            "Solo son compatibles archivos de imagen (jpg | jpeg | png)",
          display: true,
          onClose: () => {
            setDialog({});
          },
        });
      } else {
        setFile(e.dataTransfer.files[0]);
        input_ref.current.focus();
      }
    }
  };
  const onSendMessage = async () => {
    if (!file && !inputmessage && !urlload) {
      setDialog({
        type: "info",
        title: "Datos invalidos",
        description: "Debe ingresar un mensaje o una imagen",
        display: true,
        onClose: () => {
          setDialog({});
        },
      });
    } else {
      let newmessage = {
        to: other.id,
        from: my.id,
        my: true,
        message: inputmessage,
        datetime: newDate(),
        urlprofile: my.urlprofile,
        urlimage: urlload,
      };
      setMessages([...messages, newmessage]);
      setLoadfile(false);
      setInputmessage("");
      setUrlload("");
      if (file) {
        const formData = new FormData();
        formData.append("loadfile", file);
        const options = {
          method: "POST",
          credentials: "include",
          body: formData,
        };
        const { url } = await (
          await fetch("http://localhost:3000/loadfile", options)
        ).json();
        newmessage.urlimage = url;
        setFile(null);
      }
      const { token = "", refreshToken = "", id = -1 } = getCookie();
      socket.emit("new message", {
        token,
        refreshToken,
        id,
        newmessage,
        other: other.id,
      });
      onNewMessage(newmessage);
    }
  };

  const generateSignature = async (cb, params_to_sign) => {
    if (getCookie()) {
      const options = {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          params_to_sign,
        }),
      };
      const res = await (
        await fetch("http://localhost:3000/generateSignature", options)
      ).json();
      cb(res);
    }
  };
  const openWidget = () => {
    cloudinary.openUploadWidget(
      {
        cloudName: "dqiahaymp",
        apiKey: "459277451195346",
        uploadPreset: "tkn6pdch",
        uploadSignature: generateSignature,
        multiple: false,
        cropping: true,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setUrlload(result.info.url);
          setLoadfile(true);
          input_ref.current.focus();
          const { token, refreshToken, id } = getCookie();
          socket.emit("new pending", {
            url: result.info.url,
            token,
            refreshToken,
            id,
          });
        }
      }
    );
  };

  //handlers to socket events
  const handlerGetMessages = ({ messages }) => {
    const filteredmessages = messages.map((message) => {
      return message.from === my.id
        ? {
            ...message,
            my: true,
            urlprofile: my.urlprofile,
          }
        : {
            ...message,
            my: false,
            urlprofile: other.urlprofile,
          };
    });
    setMessages(filteredmessages);
  };
  const handlerNewMessage = ({ from, message, datetime, urlimage }) => {
    const newmessage = {
      from,
      message,
      datetime,
      urlprofile: from === my.id ? my.urlprofile : other.urlprofile,
      to: my.id,
      urlimage,
    };
    setMessages([...messages, newmessage]);
  };
  //useeffect to socket events
  useEffect(() => {
    if (my) {
      socket.on("new message", handlerNewMessage);
    }
    return () => {
      socket.off("get messages", handlerGetMessages);
      socket.off("new message", handlerNewMessage);
    };
  }, [my, messages, other]);
  useEffect(() => {
    if (other) {
      const { token = "", refreshToken = "", id = "" } = getCookie();
      socket.emit("get messages", { token, refreshToken, id, other: other.id });
      socket.on("get messages", handlerGetMessages);
    }
    return () => {
      socket.off("get messages", handlerGetMessages);
    };
  }, [other]);
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUrlload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);
  useEffect(() => {
    scroll_ref.current && scroll_ref.current.scrollIntoView();
  }, [messages]);

  const stylecontainer = active
    ? { width: "calc(100% - 775px)" }
    : { width: "calc(100% - 425px)" };
  return other.id ? (
    <div
      className="Chat"
      style={stylecontainer}
      onKeyDown={(e) => {
        if (e.keyCode === 27 && loadfile) {
          setLoadfile(false);
          setFile(null);
          setUrlload("");
        }
      }}
    >
      <div className="Chat__info" onClick={() => onClickInfo()}>
        <p className="Info__name">{name}</p>
        <p className="Info__state">{state}</p>
      </div>
      <div
        className="Chat__listMessages scroll"
        onDragEnter={() => {
          setLoadfile(true);
          preview_ref.current.focus();
        }}
        tabIndex="1"
        ref={preview_ref}
      >
        {loadfile && (
          <div
            className="Chat__loadfile"
            style={stylecontainer}
            onDragLeave={() => setLoadfile(false)}
            onDrop={onDrop}
          >
            <div className="Chat__loadfile__border">
              {urlload && <img src={urlload} alt="" />}
              {!urlload && <p>Suelte sus archivos aqui :)</p>}
            </div>
          </div>
        )}
        {quantity < messages.length / 10 ? (
          <div className="Chat__mostmessages">
            <Icon
              name="ADD"
              size={30}
              color="black"
              pointer={true}
              onClick={() => setQuantity(quantity + 1)}
            />
          </div>
        ) : null}
        {useList(messages.slice(quantity * -10), Message)}
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

Chat.propTypes = {
  my: PropTypes.object, //my and other contain the information of the users in the actual chat
  other: PropTypes.object,
  active: PropTypes.bool, //used to show or hide
  onNewMessage: PropTypes.func, //update list users with new latest message
  onClickInfo: PropTypes.func,
};

export default Chat;
