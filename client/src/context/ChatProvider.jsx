import { createContext, useContext, useEffect, useState } from "react";
// import { fetchAllChats, fetchAllChatsMessages, fetchAllUsers } from "../constants/apiCalls";
import { getCookie } from "../utils/cookiesApi";
import { useSelector } from "react-redux";
const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [allChats, setAllChats] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [latestMessage, setLatestMessage] = useState({});
  const [messages, setMessages] = useState([]);
  const [allChatsMessages, setAllChatsMessages] = useState([]);
  // const token = getCookie("user_token");
  // const currUser = useSelector((state) => state.user);

  //   const currSelectedChat = useRecoilState(accessedChat);
  const [chatsloading, setchatLoading] = useState(false);
  const [usersChatLoading, setUsersChatsLoading] = useState(false);
  const [currSelectedChat, setCurrSelectedChat] = useState(null);

  // console.log(messages)
  return (
    <ChatContext.Provider
      value={{
        allUsers,
        allChats,
        latestMessage,
        setLatestMessage,
        messages,
        setMessages,
        notifications,
        currSelectedChat,
        setCurrSelectedChat,
        setNotifications,
        setAllUsers,
        setAllChats,
        allChatsMessages,
        setAllChatsMessages,
        chatsloading,
        setchatLoading,
        usersChatLoading,
        setUsersChatsLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
