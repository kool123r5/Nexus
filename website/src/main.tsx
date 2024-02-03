import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthContextProvider } from "./context/AuthContext";
import { UserDocContextProvider } from "./context/UserDocContext";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <AuthContextProvider>
            <UserDocContextProvider>
                <MantineProvider defaultColorScheme="dark">
                    <App />
                </MantineProvider>
            </UserDocContextProvider>
        </AuthContextProvider>
    </BrowserRouter>
);
