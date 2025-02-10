import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "./pages/Index";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" dir="rtl" />
        <Index />
      </Router>
    </AuthProvider>
  );
}

export default App;