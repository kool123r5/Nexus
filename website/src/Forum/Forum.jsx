import Navbar from "../Navbar/Navbar";
import "./Forum.css";
import { useLogout } from "../hooks/useLogout";
export default function Forum() {
  const {logout}=useLogout()
  return (
    <>
      <Navbar />
      <div>Forum

        <button onClick={logout}>Logout</button>
      </div>
    </>
  );
}
