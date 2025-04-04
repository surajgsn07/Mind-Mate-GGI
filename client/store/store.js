import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import chatReducer from "./chatSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
  },
});

// Selectors
export const selectUser = (state) => state.user;
export const selectAccessedChat = (state) => state.chat.accessedChat;
export const selectAllChatsMessages = (state) => state.chat.allChatsMessages;
export const selectOnlineUsers = (state) => state.chat.onlineUsers;

// Typed hooks
export const useAppDispatch = () => store.dispatch;

export default store;