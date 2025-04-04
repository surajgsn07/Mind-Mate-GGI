import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessedChat: null,
  allChatsMessages: [],
  onlineUsers: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setAccessedChat: (state, action) => {
      state.accessedChat = action.payload;
    },
    setAllChatsMessages: (state, action) => {
      state.allChatsMessages = action.payload;
    },
    addNewMessage: (state, action) => {
      const { chatId, message } = action.payload;
      const chatIndex = state.allChatsMessages.findIndex(
        (chat) => chat?.chat?._id === chatId
      );
      if (chatIndex !== -1) {
        state.allChatsMessages[chatIndex].messages.push(message);
      }
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    resetChatState: () => initialState,
  },
});

export const {
  setAccessedChat,
  setAllChatsMessages,
  addNewMessage,
  setOnlineUsers,
  resetChatState,
} = chatSlice.actions;

export const selectAccessedChat = (state) => state.chat.accessedChat;
export const selectAllChatsMessages = (state) => state.chat.allChatsMessages;
export const selectOnlineUsers = (state) => state.chat.onlineUsers;

export default chatSlice.reducer;