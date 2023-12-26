import Navbar from "../Navbar/Navbar";
import "./Profile.css";
import { useDocument } from "../hooks/useDocument";
import { useParams } from "react-router-dom";

export default function Profile() {
    const { id } = useParams();
    const { document, error } = useDocument("users", id);
    return (
        <>
            <Navbar />
            {error && <p>{error}</p>}
            <p>{id}</p>

            {document && (
                <div>
                    Profile
                    <p>Welcome: {document.displayName}</p>
                    <br></br>
                    <p>Your friends</p>
                    <p>Other info.....</p>
                </div>
            )}
        </>
    );
}
