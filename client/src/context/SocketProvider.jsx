import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const currUser = useSelector((state) => state.user);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    // const newSocket = io('https://gappe.onrender.com');
    setSocket(newSocket);

    if (!newSocket) return;
    if (currUser) {
      newSocket.emit("setup", currUser);
    }
    newSocket.on("connect", () => {
      // console.log('Socket connected:', newSocket.id);
    });

    return () => newSocket.disconnect();
  }, [currUser]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
export const useSocket = () => useContext(SocketContext);
