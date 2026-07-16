import { useState, useRef, useEffect } from 'react';
import { fetchJobExplanation } from '../services/aiInsights';
import '../styles/aiInsights.css';

export default function RowActionMenu({ job, onDeleteClick }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [explanation, setExplanation] = useState(() => {
        return sessionStorage.getItem(`ai_explain_${job.jobId}`) || '';
        });
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleGenerateAI = async () => {
        setOpen(false);

        if (job.status !== "completed") {
        alert("AI analysis is only available for successfully completed jobs.");
        return;
        }

        /* if we already cached results for this job, use them instead of making a new request */
        const cachedExplanation = sessionStorage.getItem(`ai_explain_${job.jobId}`);
        if (cachedExplanation) {
            setExplanation(cachedExplanation);
            return;
        }

        setLoading(true);
        setExplanation('');

        try {
            const result = await fetchJobExplanation(job);

            if (result?.explanation) {
                setExplanation(result.explanation);
                sessionStorage.setItem(`ai_explain_${job.jobId}`, result.explanation);
            }
            else {
            alert("The AI helper is currently busy. Please try generating the performance analysis again in a later time.");
            }
        } catch (error) {
            console.error("Error fetching job explanation:", error);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="row-action-menu-overlay" ref={menuRef}>
            {!open && explanation && (
            <div className="ai-hover-wrapper">
                <span className="ai-hover-trigger" title="AI Insight Available">✦</span>
                <div className="ai-result">
                    <p>{explanation}</p>
                </div>
            </div>
            )}
            
            <button
                className="row-action-trigger"
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
                aria-label="Open row actions"
                type="button"
            >
                <span className="row-action-dots">⋮</span>
            </button>

            {open && (
                <div className="row-action-dropdown">
                <button
                    className="row-action-button"
                    type="button"
                    onClick={() => {
                        setOpen(false);
                        onDeleteClick(job);
                    }}
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        style={{ width: '14px', height: '14px', stroke: 'currentColor' }}
                    >
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                    Delete
                </button>
                    <button
                        className="row-action-button"
                        type="button"
                        disabled={loading || job.status !== "completed"}
                        onClick={handleGenerateAI}
                        disabled={loading}
                    >   
                        <span className="row-action-icon" aria-hidden="true">✦</span>
                        {loading ? 'Generating AI...' : 'Generate AI'}
                    </button>
                </div>
            )}
        </div>
    );
}
