import Navbar from "../Navbar/Navbar";
import "./Home.css";

export default function Home() {
    return (
        <>
            <Navbar />
            <div className="section">
                <h2 className="sectionTitle">Chess</h2>
                <br />
                <div className="card">
                    <h4>Tournament</h4>
                    <p>Come to my tournament</p>
                </div>
            </div>
        </>
    );
}
