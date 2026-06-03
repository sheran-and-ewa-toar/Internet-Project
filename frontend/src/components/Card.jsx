export default function Card({
    title,
    featureSetId,
    accuracy,
    precision,
    recall,
    f1Score,
    date
}) {
    return (
        <div style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "12px",
            marginBottom: "10px"
        }}>
            <h3>{title}</h3>

            <p>Feature Set ID: {featureSetId}</p>

            <p>Accuracy: {accuracy}</p>
            <p>Precision: {precision}</p>
            <p>Recall: {recall}</p>
            <p>F1 Score: {f1Score}</p>

            <small>{date}</small>
        </div>
    );
}