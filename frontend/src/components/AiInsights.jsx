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
            {!explanation && (
                <button
                    type="button"
                    className="ai-toggle-btn"
                    onClick={handleGenerate}
                    disabled={loading}
                >
                    {loading ? (
                        <span className="ai-icon ai-icon-loading" aria-hidden="true">✦</span>
                    ) : (
                        <span className="ai-icon" aria-hidden="true">✦</span>
                    )}
                    {loading ? 'Analyzing metrics via AI...' : 'Generate AI Performance Analysis'}
                </button>
            )}

            {loading && (
                <div className="ai-loading">Analyzing metrics via AI...</div>
            )}

            {!loading && explanation && (
                <div className="ai-hover-wrapper">
                    <div className="ai-hover-trigger">
                        <span className="ai-icon" aria-hidden="true">✦</span>
                        AI Engine Analysis
                    </div>
                    <div className="ai-result">
                        <p>{explanation}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
