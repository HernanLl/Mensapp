import React, { useEffect, useState, useRef, useContext } from "react";
import PropTypes from "prop-types";
import { Context } from "context/Context";
import { newDate, getCookie } from "helper/helper";
import Chat from "./Chat";
import useObserver from "../../../Hooks/useObserver";

/*eslint-disable no-undef*/
const mode = process.env.NODE_ENV;
/*eslint-enable no-undef*/

function ChatContainer(props) {
  const { my, other, active, onNewMessage, onClickInfo } = props;

  const [inputmessage, setInputmessage] = useState(""); //the actual message in input
  const [messages, setMessages] = useState([]); //list messages
  const [loadfile, setLoadfile] = useState(false); //used to render container to drop images
  const [urlload, setUrlload] = useState(""); //contains the url of the dropped image
  const [file, setFile] = useState(); //contains File element js result of drop image
  const [quantity, setQuantity] = useState(1); // used to reduce the number of messages

  //context and refs for handler focus and scrolls
  const { socket, setDialog } = useContext(Context);
  const bottomScrollRef = useRef(null);
  const previewRef = useRef(null);
  const inputRef = useRef(null);
  const latestMessageRef = useRef(null);

  const [scrollinfinity, setScrollInfinity] = useState(false);

  const onObserveRef = (entry) => {
    if (entry.isIntersecting && scrollinfinity) {
      bottomScrollRef.current && bottomScrollRef.current.scrollIntoView();
      onMostMessages();
    } else setScrollInfinity(true);
  };

  const [mostMessagesRef] = useObserver({ threshold: 0.5 }, onObserveRef, [
    other,
    scrollinfinity,
    quantity,
  ]);

  const onPressEnter = (e) => {
    if (e.keyCode === 13) {
      onSendMessage();
    }
  };
  const onPressEsc = (e) => {
    if (e.keyCode === 27) cleanFileLoader();
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
        inputRef.current.focus();
      }
    }
  };
  const onMostMessages = () => {
    setQuantity(quantity + 1);
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
          await fetch(
            mode === "development"
              ? "http://localhost:3000/loadfile"
              : "/loadfile",
            options
          )
        ).json();
        newmessage.urlimage = url;
        setFile(null);
      }
      socket.emit("new message", {
        cookie: getCookie(),
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
        await fetch(
          mode === "development"
            ? "http://localhost:3000/generateSignature"
            : "/generateSignature",
          options
        )
      ).json();
      cb(res);
    }
  };
  const openWidget = () => {
    window.cloudinary.openUploadWidget(
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
          inputRef.current.focus();
          socket.emit("new pending", {
            url: result.info.url,
            cookie: getCookie(),
          });
        }
      }
    );
  };
  const cleanFileLoader = () => {
    setLoadfile(false);
    setFile(null);
    setUrlload("");
  };
  const onDragEnter = () => {
    setLoadfile(true);
    previewRef.current.focus();
  };
  const onDragLeave = () => {
    setLoadfile(false);
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
    if (from === other.id) {
      const newmessage = {
        from,
        message,
        datetime,
        urlprofile: from === my.id ? my.urlprofile : other.urlprofile,
        to: my.id,
        urlimage,
      };
      setMessages([...messages, newmessage]);
    }
  };
  //useeffect to socket events
  useEffect(() => {
    if (my) {
      socket.on("new message", handlerNewMessage);
    }
    return () => {
      socket.off("new message", handlerNewMessage);
    };
  }, [my, messages, other]);
  useEffect(() => {
    if (other) {
      socket.emit("get messages", { cookie: getCookie(), other: other.id });
      socket.on("get messages", handlerGetMessages);
    }
    return () => {
      socket.off("get messages", handlerGetMessages);
    };
  }, [other, my]);
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
    if (messages.length !== 0) {
      bottomScrollRef.current && bottomScrollRef.current.scrollIntoView();
    }
  }, [messages]);
  useEffect(() => {
    latestMessageRef.current && latestMessageRef.current.scrollIntoView();
  }, [quantity]);

  return (
    <Chat
      other={other}
      active={active}
      onClickInfo={onClickInfo}
      onDragEnter={onDragEnter}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
      loadfile={loadfile}
      urlload={urlload}
      quantity={quantity}
      messages={messages}
      previewRef={previewRef}
      inputRef={inputRef}
      bottomScrollRef={bottomScrollRef}
      latestMessageRef={latestMessageRef}
      mostMessagesRef={mostMessagesRef}
      onPressEnter={onPressEnter}
      onPressEsc={onPressEsc}
      openWidget={openWidget}
      onSendMessage={onSendMessage}
      onMostMessages={onMostMessages}
      inputmessage={inputmessage}
      setInputmessage={setInputmessage}
    />
  );
}

ChatContainer.propTypes = {
  my: PropTypes.object, //my and other contain the information of the users in the actual chat
  other: PropTypes.object,
  active: PropTypes.bool, //used to show or hide
  onNewMessage: PropTypes.func, //update list users with new latest message
  onClickInfo: PropTypes.func,
};

export default ChatContainer;
