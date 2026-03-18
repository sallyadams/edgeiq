import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const PROD_URL = "millionaire-mindset-growth--sallyadams.replit.app";
if (window.location.hostname.includes(".replit.dev")) {
  window.location.replace(
    "https://" + PROD_URL + window.location.pathname + window.location.search + window.location.hash
  );
} else {
  createRoot(document.getElementById("root")!).render(<App />);
}
