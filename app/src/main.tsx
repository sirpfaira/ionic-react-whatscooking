import { createRoot } from "react-dom/client";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import { StatusBar } from "@capacitor/status-bar";

import App from "./App";
import "./index.css";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

createRoot(document.getElementById("root")!).render(<App />);

defineCustomElements(window);

// Display content under transparent status bar
StatusBar.setOverlaysWebView({ overlay: false });
