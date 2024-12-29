import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChartAnalyzer } from "./components/ChartAnalyzer";
import { Toaster } from "./components/ui/sonner";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<ChartAnalyzer />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;