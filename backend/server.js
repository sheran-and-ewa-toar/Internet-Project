const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

const usersRoutes = require('./routes/usersRoutes');
const jobsRoutes = require('./routes/jobsRoutes');
const modelTypesRoutes = require('./routes/modelTypesRoutes');
const featureSetsRoutes = require('./routes/featureSetsRoutes');
const featureFiltersRoutes = require('./routes/featureFiltersRoutes');
const authRoutes = require('./routes/authRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const loggerMiddleware = require('./middleware/loggerMiddleware');
const authMiddleware = require('./middleware/authMiddleware');

app.use(express.json());

const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
};

app.use(cors(corsOptions));

const server = http.createServer(app);
const io = new Server(server, {
    cors: corsOptions
});

app.set("io", io);

io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.emit("connected", {
        message: "Connected to job updates"
    });

    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

app.use(loggerMiddleware);
app.use(authMiddleware.attachUserContext);

app.use('/api/users', usersRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/model-types', modelTypesRoutes);
app.use('/api/feature-sets', featureSetsRoutes);
app.use('/api/feature-filters', featureFiltersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});