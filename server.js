const express = require('express');

const app = express();

const usersRoutes = require('./routes/usersRoutes');
const modelsRoutes = require('./routes/modelsRoutes');
const modelTypesRoutes = require('./routes/modelTypesRoutes');
const featureSetsRoutes = require('./routes/featureSetsRoutes');
const featureFiltersRoutes = require('./routes/featureFiltersRoutes');

const loggerMiddleware = require('./middleware/loggerMiddleware');

app.use(express.json());

app.use(loggerMiddleware);

app.use('/users', usersRoutes);
app.use('/models', modelsRoutes);
app.use('/model-types', modelTypesRoutes);
app.use('/feature-sets', featureSetsRoutes);
app.use('/feature-filters', featureFiltersRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});