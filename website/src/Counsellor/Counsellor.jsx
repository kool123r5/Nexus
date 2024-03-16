import Navbar from "../Navbar/Navbar";
import "./Counsellor.css";
import { useLogout } from "../hooks/useLogout";
import nexusLogo from "../assets/NEXUS_LOGO-nobackground.png";


export default function Counsellor() {
    const { logout } = useLogout();

    return (
        <>
            <Navbar />
            <div className="counsellor_div">
                <div className = "coming_soon_filler_block">
                    <img src={nexusLogo} alt="Nexus Logo" id="Home_Logo_Img" />                    
                    <p className="coming_soon_filler_text">Work in Progress!</p>
                </div>
            </div>
        </>
    );
}
