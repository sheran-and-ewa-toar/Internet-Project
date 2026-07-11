import { useState } from 'react';
import { fetchJobExplanation } from '../services/aiInsights';
import '../styles/aiInsights.css';

export default function AiInsights({ job }) {
    const [loading, setLoading] = useState(false);
    const [explanation, setExplanation] = useState('');

    const handleGenerate = async () => {
        if (explanation || loading) return;

        setLoading(true);
        setExplanation('');

        const result = await fetchJobExplanation(job);

        if (result?.explanation) {
            setExplanation(result.explanation);
        }

        setLoading(false);
    };

    return (
        <div className="ai-insights">
            <button
                type="button"
                className="ai-toggle-btn"
                onClick={handleGenerate}
                disabled={loading || !!explanation}
            >
                <span className="ai-icon" aria-hidden="true">✦</span>
                {loading ? 'Analyzing metrics via AI...' : explanation ? 'AI Analysis Ready' : ''}
            </button>

            {loading && (
                <div className="ai-loading">Analyzing metrics via AI...</div>
            )}

            {!loading && explanation && (
                <div className="ai-result">
                    <h4>AI Engine Analysis</h4>
                    <p>{explanation}</p>
                </div>
            )}
        </div>
    );
}
