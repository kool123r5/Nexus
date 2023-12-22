import { useState } from "react";
import "./App.css";
import Navbar from "./Navbar";
import { app } from "./firebase/config";

function App() {
    const [count, setCount] = useState(0);
    console.log(app);
    return (
        <>
            <Navbar />
            <div className="app">
                <p>{count}</p>
                <button onClick={() => setCount(count + 1)}>Click to update count</button>
            </div>
        </>
    );
}

export default App;
