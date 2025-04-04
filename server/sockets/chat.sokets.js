export const chatSockets = (io) => {
  const onlineUsers = new Map();
  const activeCalls = new Map();

  io.on("connection", (socket) => {
    console.log("A user connected");

    // USER ONLINE
    socket.on("setup", (data) => {
      socket.join(data?._id);
      console.log(data);
      onlineUsers.set(data._id, socket.id);
      io.emit("user online", Array.from(onlineUsers.keys()));
      socket.emit("connected");
      console.log(onlineUsers);
    });

    socket.on("join chat", (room) => {
      // console.log(room, 22);
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });

    // NEW MESSAGE
    socket.on("new message", (newMessageReceived) => {
      console.log(newMessageReceived)
      const chat = newMessageReceived.chat;
      chat.members.forEach((user) => {
        if (user._id !== newMessageReceived.sender._id) {
          socket
            .to(user._id)
            .emit("messageReceived", { newMessageReceived, chat });
        }
      });
    });

    // LEAVE CHAT
    socket.on("leave chat", (room) => {
      socket.leave(room);
      console.log(`User left room: ${room}`);
    });

    // TYPING
    socket.on("typing", (data) => {
      const { roomId, user } = data;
      if (socket.rooms.has(roomId)) {
        console.log(roomId, "is TYPING");
        socket.to(roomId).emit("typing", user);
      }
    });

    socket.on("stop typing", (roomId) => {
      if (socket.rooms.has(roomId)) {
        socket.to(roomId).emit("stop typing");
      }
    });

    // OFFLINE
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          io.emit("user offline", Array.from(onlineUsers.keys()));
          break;
        }
      }
    });

    // CALLS LOGIC
    // -============================= ChatId used to make rooms for the chats ===============================================-
    const activeCalls = new Map(); // Track active calls

    socket.on(
      "startCall",
      ({
        roomId,
        targetChatId,
        targetId,
        user,
        offer,
        peerId,
        myMicStatus,
        myCamStatus,
      }) => {
        if (activeCalls.has(targetId)) {
          socket.emit("userBusy", {
            targetId,
            message: "User is already on another call",
          });
          return;
        }
        activeCalls.set(user._id, roomId);
        activeCalls.set(targetId, roomId);

        socket.join(roomId);

        const targetSocketId = onlineUsers.get(targetId);
        if (targetSocketId) {
          io.to(targetSocketId).emit("incomingCall", {
            roomId,
            caller: user,
            peerId,
            targetChatId,
            offer,
            targetId,
            callerCamStatus: myCamStatus,
            callerMicStatus: myMicStatus,
          });
        } else {
          socket.emit("notavailable", { message: "User is not online" });
        }
      }
    );

    // ACCEPT CALL
    socket.on(
      "acceptCall",
      ({ roomId, user, accepterPeerId, callerPeerId }) => {
        socket.join(roomId);
        console.log(
          `User ${user.fullName} accepted the call and joined room: ${roomId}`
        );

        // console.log('first', ans)
        // console.log(ans)
        io.to(roomId).emit("callActive", {
          accepterPeerId,
          callerPeerId,
          roomId,
          user,
        });
      }
    );

    // DECLINE CALL
    socket.on("declineCall", ({ roomId, user, targetId }) => {
      console.log(
        `User ${user.fullName} declined the call for room: ${roomId}`
      );
      activeCalls.delete(user._id);

      io.to(roomId).emit("callDeclined", {
        targetId: targetId,
        message: "Call was declined",
      });
    });

    // END CALL
    socket.on("endCall", ({ roomId }) => {
      io.to(roomId).emit("callTerminated", { roomId });
      activeCalls.delete(roomId);
      console.log(`Call ended in room: ${roomId}`);
    });

    // TOGGLE AUDIO
    socket.on("toggleAudio", ({ roomId, micStatus }) => {
      io.to(roomId).emit("toggleAudio", { roomId, micStatus });
    });
    // TOGGLE VIDEO
    socket.on("toggleVideo", ({ roomId, camStatus }) => {
      io.to(roomId).emit("toggleVideo", { roomId, camStatus });
    });
  });
};
