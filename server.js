const express = require('express');

const app = express();

const usersRoutes = require('./routes/usersRoutes');
const modelsRoutes = require('./routes/modelsRoutes');

const loggerMiddleware = require('./middleware/loggerMiddleware');

app.use(express.json());

app.use(loggerMiddleware);

app.use('/users', usersRoutes);
app.use('/models', modelsRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});