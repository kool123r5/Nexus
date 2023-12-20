import { useState } from "react";
import "./App.css";

function App() {
    const [count, setCount] = useState(0);
    return (
        <>
            <div className="app">
                <p>{count}</p>
                <button onClick={() => setCount(count + 1)}>Click to update count</button>
            </div>
        </>
    );
}

export default App;
