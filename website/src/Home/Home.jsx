import Navbar from "../Navbar/Navbar";
import "./Home.css";
import { useAuthContext } from "../hooks/useAuthContext";
export default function Home() {

    const {user}=useAuthContext()
    

    return (
        <>
            <Navbar />
            <div>Home</div>
            {user && <p>Welcome:  {user.displayName} </p>}
        </>
    );
}
