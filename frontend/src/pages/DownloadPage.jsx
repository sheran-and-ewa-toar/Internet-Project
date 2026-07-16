import { useState } from "react";
import api from "../services/api";
import "../styles/Download.css";

export default function Download() {

    const [loading, setLoading] = useState(false);

    const downloadDataset = async () => {
        try {
            setLoading(true);

            const response =
                await api.get("/api/download/dataset");
            
            const csvData = response.data.data.csvData;
            const fileName = response.data.data.fileName;

            const url =
                window.URL.createObjectURL(
                    new Blob(
                        [csvData],
                        { 
                            type: "text/csv;charset=utf-8;"
                        }
                    )
                );

            const link = document.createElement("a");

            link.href = url;
            link.download = fileName;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error(
                "Dataset download failed:",
                err
            );
            alert(
                "Failed to download dataset."
            );

        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="download-page">

            <div className="download-header">
                <h1>
                    📥 Download Sample Dataset
                </h1>

                <p>
                    Download a sample dataset used
                    for machine learning experiments.
                </p>
            </div>


            <div className="download-card">

                <h2>
                    Sample miRNA Dataset
                </h2>

                <p>
                    This download contains a sample of miRNA
                    labels, identifiers,
                    and extracted biological features.
                </p>


                {loading && (
                    <div className="download-loading">

                        <div className="spinner"></div>

                        <p>
                            Preparing dataset...
                            <br />
                            This may take a few moments.
                        </p>

                    </div>
                )}


                <button
                    className="download-btn"
                    onClick={downloadDataset}
                    disabled={loading}
                >
                    {loading
                        ? "Generating CSV..."
                        : "Download CSV"
                    }
                </button>

            </div>

        </div>
    );
}