import Navbar from "../Navbar/Navbar";
import "./School.css";
import { useLogout } from "../hooks/useLogout";

export default function School() {
    const { logout } = useLogout();

    return (
        <>
            <Navbar />
            <div>
                School
                <button onClick={logout}>Logout</button>
            </div>
        </>
    );
}
