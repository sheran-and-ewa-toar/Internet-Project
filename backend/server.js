const express = require('express');
const cors = require('cors');

const app = express();

const usersRoutes = require('./routes/usersRoutes');
const jobsRoutes = require('./routes/jobsRoutes');
const modelTypesRoutes = require('./routes/modelTypesRoutes');
const featureSetsRoutes = require('./routes/featureSetsRoutes');
const featureFiltersRoutes = require('./routes/featureFiltersRoutes');
const authRoutes = require('./routes/authRoutes');

const loggerMiddleware = require('./middleware/loggerMiddleware');
const authMiddleware = require('./middleware/authMiddleware');

app.use(express.json());
app.use(cors());

app.use(loggerMiddleware);
app.use(authMiddleware.attachUserContext);

app.use('/api/users', usersRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/model-types', modelTypesRoutes);
app.use('/api/feature-sets', featureSetsRoutes);
app.use('/api/feature-filters', featureFiltersRoutes);
app.use('/api/auth', authRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});