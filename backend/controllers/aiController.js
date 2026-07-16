const { success, error } = require('../utils/responseHelpers');

const explainJob = async (req, res) => {
    try {
        
        const { metrics, configuration } = req.body || {};

        if (!metrics || !configuration) {
            return res.status(400).json(
                error('INVALID_INPUT', 'Metrics and configuration are required.')
            );
        }

        const prompt = [
            'You are an expert bioinformatics assistant.',
            `A completed miRNA classification job used the model ${configuration.modelName || 'unknown model'} with the feature set ${configuration.featureSetName || 'unknown feature set'}.`,
            'Interpret the following performance metrics for a biological classification workflow:',
            `- Accuracy: ${metrics.accuracy ?? 'n/a'}`,
            `- Precision: ${metrics.precision ?? 'n/a'}`,
            `- Recall: ${metrics.recall ?? 'n/a'}`,
            `- F1 Score: ${metrics.f1Score ?? 'n/a'}`,
            `- Cross-validation Mean: ${metrics.cv_mean ?? 'n/a'}`,
            '',
            'Provide a structured, highly scannable analysis formatted EXACTLY like this:',
            'VERDICT: [One short sentence summarizing if the model is suitable/unsuitable for downstream genomic use]',
            'PROS: [One short sentence highlighting the strongest performance metric]',
            'CONS: [One short sentence explaining the main performance bottleneck or reliability risk]'
        ].join(' ');

        
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "x-goog-api-key": process.env.GEMINI_API_KEY
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (!response.ok || !data?.candidates?.length) {
            throw new Error(data?.error?.message || 'Gemini API connection error');
        }

        const explanation = data.candidates[0]?.content?.parts?.[0]?.text || 'No explanation was returned.';

        return res.status(200).json(success({ explanation }));
    } catch (err) {
        console.error('AI Feature Error:', err);
        return res.status(500).json(
            error('AI_INTEGRATION_ERROR', 'Failed to generate model insights.', {
                details: err.message
            })
        );
    }
};

module.exports = {
    explainJob
};
