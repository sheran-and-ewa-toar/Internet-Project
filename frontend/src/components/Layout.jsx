import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Navbar />

            <main
                style={{
                    flex: 1,
                    padding: "24px",
                    maxWidth: "1200px",
                    width: "100%",
                    margin: "0 auto",
                }}
            >
                {children}
            </main>

            <Footer />
        </div>
    );
}
