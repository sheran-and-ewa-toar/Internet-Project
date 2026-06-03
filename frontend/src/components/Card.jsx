export default function Card({ title, value }) {
    return (
        <div
            style={{
                border: "1px solid #ccc",
                padding: "16px",
                margin: "10px",
                borderRadius: "8px",
                minWidth: "180px"
            }}
        >
            <h3>{title}</h3>
            <h2>{value}</h2>
        </div>
    );
}