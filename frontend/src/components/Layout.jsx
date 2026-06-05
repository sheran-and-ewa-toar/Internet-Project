import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ theme, setTheme, user, setUser }) {
    return (
        <div className="layout">
            <Navbar user={user} setUser={setUser} />

            <main className="layout-main">
                <Outlet context={{ theme, setTheme, user, setUser }} />
            </main>

            <Footer />
        </div>
    );
}