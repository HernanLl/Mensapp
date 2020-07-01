import React, { useState, useContext, useEffect } from "react";
import { Context } from "context/Context";
import { setCookie } from "helper/helper";
import Login from "./Login";

function LoginContainer() {
  const { setAuthenticated, socket } = useContext(Context);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState("");

  const onLogin = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    socket.emit("login", { email, password });
  };

  const handlerLogin = ({ status, message, cookie }) => {
    if (status === 200) {
      const { token, refreshToken } = cookie;
      setCookie(token, refreshToken);
      setAuthenticated(true);
    } else {
      setError(message);
    }
  };

  useEffect(() => {
    socket.on("login", handlerLogin);
    return () => {
      socket.off("login", handlerLogin);
    };
  }, []);

  return (
    <Login
      error={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      onLogin={onLogin}
    />
  );
}

export default LoginContainer;
