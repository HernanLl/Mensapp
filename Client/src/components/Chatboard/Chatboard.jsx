import React, { useEffect, useState, useContext } from "react";
import "./styles.scss";
import { Context } from "../../context/Context";
import { getCookie } from "../../helper/helper";

//components
import Navbar from "./Navbar/Navbar";
import Chat from "./Chat/Chat";
import Profile from "./Profile/Profile";
import Userslist from "./Userslist/Userslist";
import Editprofile from "./Editprofile/Editprofile";

function Chatboard() {
  const { socket } = useContext(Context);
  //using to show or hide component edit profile
  const [edit, setEdit] = useState(false);

  // using to show or hide component profile and handle animation
  const [activeprofile, setActiveprofile] = useState(true);
  const [views, setViews] = useState(["user"]);

  //users information(users), my information(user) and information for other user(other)
  const [user, setUser] = useState({});
  const [other, setOther] = useState({});
  const [users, setUsers] = useState([]);

  //local event handlers
  const onClickUser = (user_id) => {
    const index = users.findIndex((elem) => elem.id === user_id);
    setOther(users[index]);
    users[index].countmessages = 0;
  };
  const onNewMessage = (message) => {
    let arr = users.slice();
    const index = arr.findIndex(
      (e) => e.id === message.from || e.id === message.to
    );
    if (index !== -1) {
      arr[index].latestmessage = message;
      if (other.id !== arr[index].id) {
        arr[index].countmessages = parseInt(arr[index].countmessages) + 1;
      } else {
        handlerCheckAllMessages();
      }
      setUsers(arr);
    }
  };
  const handlerActiveProfile = () => {
    if (views.length !== 1) {
      let arr = views.slice();
      arr.splice(1);
      setViews(arr);
    } else {
      setActiveprofile(false);
      setTimeout(() => {
        let arr = views.slice();
        arr.splice(0);
        setViews(arr);
      }, 1000);
    }
  };
  const handlerClickInfo = (view) => {
    const index = views.findIndex((e) => e === view);
    if (index === -1) {
      let arr = views.slice();
      arr.push(view);
      setViews(arr);
      setActiveprofile(true);
    }
  };
  const handlerCheckAllMessages = () => {
    if (other) {
      const { token, refreshToken, id } = getCookie();
      socket.emit("check all messages", {
        token,
        refreshToken,
        id,
        other: other.id,
      });
    }
  };

  //socket event handlers
  const handlerUserInfo = ({ user }) => {
    setUser(user);
  };
  const handlerGetUsers = ({ users }) => {
    setUsers(users);
  };
  const handlerNewMessage = (message) => {
    onNewMessage(message);
  };
  const handlerUserConnected = (id) => {
    const index = users.findIndex((e) => e.id === id);
    if (index !== -1) {
      setUsers(
        users.map((e) => {
          if (e.id === id)
            return {
              ...e,
              connected: true,
            };
          else return e;
        })
      );
    } else if (users) {
      const { token = "", refreshToken = "", id = -1 } = getCookie();
      socket.emit("get users", { token, refreshToken, id });
    }
  };

  //use effects
  useEffect(() => {
    socket.on("new message", handlerNewMessage);
    socket.on("user connected", handlerUserConnected);
    return () => {
      socket.off("new message", handlerNewMessage);
      socket.off("user connected", handlerUserConnected);
    };
  }, [users, other]);

  useEffect(() => {
    handlerCheckAllMessages();
  }, [other]);

  useEffect(() => {
    const { token = "", refreshToken = "", id = "" } = getCookie();
    socket.emit("user info", { token, refreshToken, id });
    socket.emit("get users", { token, refreshToken, id });
    socket.on("user info", handlerUserInfo);
    socket.on("get users", handlerGetUsers);
    return () => {
      socket.off("user info", handlerUserInfo);
      socket.off("get users", handlerGetUsers);
    };
  }, []);

  const actual_data = views[views.length - 1] === "user" ? user : other;
  return (
    <div className="Chatboard">
      <Editprofile active={edit} setActive={setEdit} data={user} />
      <Navbar setEdit={setEdit} openProfile={() => handlerClickInfo("user")} />
      <Userslist users={users} onClickUser={onClickUser} />
      <Chat
        other={other}
        my={user}
        active={activeprofile}
        onNewMessage={onNewMessage}
        onClickInfo={() => handlerClickInfo("other")}
      />
      <Profile
        active={activeprofile}
        setActive={handlerActiveProfile}
        id={actual_data.id}
        name={actual_data.name}
        state={actual_data.state}
        location={actual_data.location}
        urlprofile={actual_data.urlprofile}
        urlbackground={actual_data.urlbackground}
      />
    </div>
  );
}

Chatboard.propTypes = {};

export default Chatboard;
