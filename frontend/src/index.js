import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

// Use lazy loading for the main component
const Index = lazy(() => import("./components/index.jsx"));

// Loading component for suspense fallback
const Loading = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-green-50">
    <div className="text-green-600 text-xl font-semibold">
      Loading GrievanceBox...
    </div>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Suspense fallback={<Loading />}>
        <Index />
      </Suspense>
    </HelmetProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
