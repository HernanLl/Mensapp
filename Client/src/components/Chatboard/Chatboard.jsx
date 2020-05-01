import React, { useEffect } from "react";
import "./styles.scss";
import Navbar from "./Navbar/Navbar";
import Chat from "./Chat/Chat";
import Profile from "./Profile/Profile";

function Chatboard() {
  return (
    <div className="Chatboard">
      <Navbar />
      <div className="Chatboard__1"></div>
      <Chat
        name={"Maria Evans"}
        state={
          "No pierdas nunca el sentido del humor y aprende a reírte de tus propios defectos."
        }
        connected={true}
      />
      <Profile />
    </div>
  );
}

Chatboard.propTypes = {};

export default Chatboard;
