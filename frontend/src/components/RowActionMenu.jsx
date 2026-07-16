import { useState, useRef, useEffect } from 'react';
import { fetchJobExplanation } from '../services/aiInsights';
import '../styles/aiInsights.css';

export default function RowActionMenu({ job, onDeleteClick }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [explanation, setExplanation] = useState('');
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
        setLoading(true);
        setExplanation('');

        const result = await fetchJobExplanation(job);

        if (result?.explanation) {
            setExplanation(result.explanation);
        }
        else {
            alert("The AI helper is currently busy. Please try generating the performance analysis again in a later time.");
        }

        setLoading(false);
    };

    return (
        <div className="row-action-menu" ref={menuRef}>
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
