import React, { useEffect, useState, useContext } from "react";
import "./styles.scss";
import Navbar from "./Navbar/Navbar";
import Chat from "./Chat/Chat";
import Profile from "./Profile/Profile";
import { Context } from "../../context/Context";
import Cookie from "js-cookie";
import Userbox from "../Common/Userbox/Userbox";
import Userslist from "./Userslist/Userslist";
import Editprofile from "./Editprofile/Editprofile";
function Chatboard() {
  //using for display or hide component
  const [profile, setProfile] = useState(true);
  const [edit, setEdit] = useState(false);
  //data
  const [user, setUser] = useState({});
  const [other, setOther] = useState();
  const [users, setUsers] = useState([]);

  const { socket } = useContext(Context);

  const onClickUser = (user_id) => {
    const finduser = users.find((elem) => elem.id === user_id);
    setOther(finduser);
  };

  const handlerUserInfo = ({ user }) => {
    setUser(user);
  };
  const handlerGetUsers = ({ users }) => {
    setUsers(users);
  };
  useEffect(() => {
    const { token = "", refreshToken = "", id = "" } = JSON.parse(
      Cookie.get("Auth")
    );
    socket.emit("user info", { token, refreshToken, id });
    socket.emit("get users", { token, refreshToken, id });
    socket.on("user info", handlerUserInfo);
    socket.on("get users", handlerGetUsers);
    return () => {
      socket.off("user info", handlerUserInfo);
      socket.off("get users", handlerGetUsers);
    };
  }, []);

  return (
    <div className="Chatboard">
      <Editprofile active={edit} setActive={setEdit} data={user} />
      <Navbar setEdit={setEdit} />
      <Userslist users={users} onClickUser={onClickUser} />
      <Chat other={other} my={user} active={profile} setActive={setProfile} />
      <Profile active={profile} setActive={setProfile} user={user} />
    </div>
  );
}

Chatboard.propTypes = {};

export default Chatboard;
