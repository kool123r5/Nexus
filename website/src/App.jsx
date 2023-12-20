import { useState } from "react";
import "./App.css";
import Navbar from "./Navbar";

function App() {
    const [count, setCount] = useState(0);
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
