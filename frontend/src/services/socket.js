import { io } from "socket.io-client";

const socket = io(process.env.NODE_BACKEND_URL || 'http://localhost:3000', {
    transports: ["websocket"]
});

export default socket;