import { io } from "socket.io-client";

const socket = ref(null);

export const useSocket = () => {
  const config = useRuntimeConfig();

  const connect = () => {
    if (socket.value) return;

    socket.value = io(config.public.apiBase.replace("/api", ""), {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.value.on("connect", () => {
      console.log("🔌 Connected to WebSocket server");
    });

    socket.value.on("disconnect", () => {
      console.log("🔌 Disconnected from WebSocket server");
    });
  };

  const joinConversation = (id) => {
    if (!socket.value) connect();
    socket.value.emit("join-conversation", id);
  };

  const leaveConversation = (id) => {
    if (socket.value) {
      socket.value.emit("leave-conversation", id);
    }
  };

  const onNewMessage = (callback) => {
    if (!socket.value) connect();
    socket.value.on("new-message", callback);
  };

  const onConversationUpdated = (callback) => {
    if (!socket.value) connect();
    socket.value.on("conversation-updated", callback);
  };

  const onOrderCreated = (callback) => {
    if (!socket.value) connect();
    socket.value.on("order-created", callback);
  };

  const off = (event) => {
    if (socket.value) {
      socket.value.off(event);
    }
  };

  return {
    socket,
    connect,
    joinConversation,
    leaveConversation,
    onNewMessage,
    onConversationUpdated,
    onOrderCreated,
    off,
  };
};
