import Navbar from "../Navbar/Navbar";
import "./Counsellor.css";
import { useLogout } from "../hooks/useLogout";

export default function Counsellor() {
    const { logout } = useLogout();

    return (
        <>
            <Navbar />
            <div className="chatDiv">
                Chat
            </div>
        </>
    );
}
