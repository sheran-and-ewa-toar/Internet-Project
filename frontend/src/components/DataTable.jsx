export default function DataTable({ data }) {

    if (!data || data.length === 0) {
        return <p>No data available</p>;
    }

    return (
        <table border="1">
            <thead>
                <tr>
                    {Object.keys(data[0]).map((header) => (
                        <th key={header}>{header}</th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {data.map((row, i) => {
                    const rowKey = row.id ?? row.jobId ?? `row-${i}`;

                    return (
                        <tr key={rowKey}>
                            {Object.entries(row).map(([columnKey, value]) => (
                                <td key={columnKey}>{value}</td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}