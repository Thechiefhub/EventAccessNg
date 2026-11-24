import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { runBrandStorageMigration } from "./lib/storageMigration";

runBrandStorageMigration();

createRoot(document.getElementById("root")!).render(<App />);
