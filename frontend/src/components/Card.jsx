export default function Card({ title, description }) {
    return (
        <div style={{ border: "1px solid black", margin: 10 }}>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}