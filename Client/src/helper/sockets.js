import io from "socket.io-client";
const socket = io(
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : "/"
);

export { socket };

export function emitIsAuthenticated(cookie) {
  socket.emit("isAuthenticated", {
    cookie: cookie,
  });
}
export function onIsAuthenticated(setAuthenticated, setLoading) {
  return new Promise((resolve, reject) => {
    socket.on("isAuthenticated", () => {
      resolve();
    });
  });
}
export function onErrorServer() {
  socket.on("error server", ({ status, message }) => {
    if (status === 401 || status === 403) {
      removeCookie();
      setAuthenticated(false);
      setDialog({
        type: "danger",
        title: "No autorizado",
        description: message,
        display: true,
        onClose: () => {
          setDialog({});
        },
      });
    }
  });
}
