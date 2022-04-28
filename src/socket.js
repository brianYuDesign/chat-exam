import io from "socket.io-client";
let socket;
export const initiateSocket = (chatId) => {
  socket = io("http://localhost:3000");
  console.log(`Connecting socket...`);
  if (socket && chatId) socket.emit("JOIN_ROOM", chatId);
};
export const disconnectSocket = () => {
  console.log("Disconnecting socket...");
  if (socket) socket.disconnect();
};
export const subscribeToChat = (cb) => {
  if (!socket) return true;
  socket.on("CHAT_MESSAGE", (msg) => {
    console.log("Websocket event received!");
    return cb(null, msg);
  });
};
export const sendMessage = (chatId, currentUserId, content) => {
  if (socket)
    socket.emit("SEND_MESSAGE", {
      chatId: chatId,
      userId: currentUserId,
      content: content,
    });
};
