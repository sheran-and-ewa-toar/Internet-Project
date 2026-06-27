import "../styles/About.css";

export default function About() {
    return (
        <div className="about-page">

            <div className="about-header">
                <h1>🧬 About This Project</h1>
                <p>
                    A machine learning system for miRNA classification using
                    structured biological features and feature selection strategies.
                </p>
            </div>

            <section className="about-section">
                <h2>What are microRNAs (miRNAs)?</h2>

                <p>
                    microRNAs (miRNAs) are small non-coding RNA molecules, typically
                    about 20–24 nucleotides long. They do not code for proteins, but
                    instead regulate gene expression by binding to messenger RNA (mRNA)
                    and preventing it from being translated into proteins.
                </p>

                <p>
                    Because they control when and how genes are expressed, miRNAs play
                    a critical role in many biological processes including cell development,
                    immune response, and disease progression such as cancer.
                </p>
            </section>

            <section className="about-section">
                <h2>Project Goal</h2>

                <p>
                    The goal of this project is to build and evaluate machine learning
                    models that can accurately classify RNA sequences as miRNA or non-miRNA,
                    based on biological and structural features.
                </p>

                <p>
                    A key focus of the project is understanding how different feature
                    engineering and filtering strategies affect classification performance.
                </p>
            </section>

            <section className="about-section">
                <h2>Pipeline Overview</h2>

                <ol className="pipeline-list">

                    <li>
                        <strong>Data Sources</strong>
                        <p>
                            Positive miRNA samples are taken from MirGeneDB, while negative
                            samples are taken from miRBase or similar RNA databases.
                        </p>
                    </li>

                    <li>
                        <strong>Secondary Structure Prediction</strong>
                        <p>
                            RNA sequences are processed using computational folding tools
                            to predict their secondary structure (base-pairing patterns).
                            This step captures biologically meaningful structural constraints.
                        </p>
                    </li>

                    <li>
                        <strong>3D Structure Modeling</strong>
                        <p>
                            Predicted secondary structures are further transformed into
                            3D representations to allow spatial and geometric feature extraction.
                        </p>
                    </li>

                    <li>
                        <strong>Feature Engineering</strong>
                        <p>
                            A full feature set is precomputed and stored in the system.
                            These include sequence-based, structural, and geometric features.
                        </p>
                    </li>

                    <li>
                        <strong>Feature Selection (Job Configuration)</strong>
                        <p>
                            The system does not recompute features per job. Instead,
                            each training job selects a subset of the existing feature
                            set based on user-defined settings and filtering strategies
                            (e.g. Pearson correlation, variance threshold).
                        </p>
                    </li>

                    <li>
                        <strong>Model Training</strong>
                        <p>
                            Selected features are passed into machine learning models
                            such as Random Forest and XGBoost for training.
                        </p>
                    </li>

                    <li>
                        <strong>Evaluation</strong>
                        <p>
                            Models are evaluated using accuracy, precision, recall,
                            F1-score, and cross-validation metrics.
                        </p>
                    </li>

                </ol>
            </section>

        </div>
    );
}