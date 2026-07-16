import { io } from "socket.io-client";

const socket = io(process.env.NODE_BACKEND_URL, {
    transports: ["websocket"]
});

export default socket;