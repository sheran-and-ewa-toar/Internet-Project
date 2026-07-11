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
const downloadRoutes = require('./routes/downloadRoutes');
const aiRoutes = require('./routes/aiRoutes');
const { connectDatabase } = require('./models');
const loggerMiddleware = require('./middleware/loggerMiddleware');
const authMiddleware = require('./middleware/authMiddleware');

app.use(express.json());

const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
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
app.use('/api/download', downloadRoutes);
app.use('/api/ai', aiRoutes);
const PORT = 3000;

const startServer = async () => {
    try {
        await connectDatabase();

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err.message);
        process.exit(1);
    }
};

startServer();