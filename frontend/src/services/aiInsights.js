import api from './api';

export const fetchJobExplanation = async (jobData) => {
    try {
        const response = await api.post('/api/ai/explain-job', {
            metrics: {
                accuracy: jobData?.accuracy,
                precision: jobData?.precision,
                recall: jobData?.recall,
                f1Score: jobData?.f1Score,
                cv_mean: jobData?.cv_mean
            },
            configuration: {
                modelName: jobData?.modelName,
                featureSetName: jobData?.featureSetName
            }
        });

        return response?.data?.data || null;
    } catch (error) {
        console.error('AI explanation failed:', error);
        return null;
    }
};
