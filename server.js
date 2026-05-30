const express = require('express');

const app = express();

const usersRoutes = require('./routes/usersRoutes');
const jobsRoutes = require('./routes/jobsRoutes');
const modelTypesRoutes = require('./routes/modelTypesRoutes');
const featureSetsRoutes = require('./routes/featureSetsRoutes');
const featureFiltersRoutes = require('./routes/featureFiltersRoutes');

const loggerMiddleware = require('./middleware/loggerMiddleware');
const authMiddleware = require('./middleware/authMiddleware');

app.use(express.json());

app.use(loggerMiddleware);
app.use(authMiddleware.attachUserContext);

app.use('/users', usersRoutes);
app.use('/jobs', jobsRoutes);
app.use('/model-types', modelTypesRoutes);
app.use('/feature-sets', featureSetsRoutes);
app.use('/feature-filters', featureFiltersRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});