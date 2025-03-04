
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "./pages/Index";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "@/providers/theme-provider";
import "./App.css";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <AuthProvider>
        <Router>
          <Toaster 
            position="top-center" 
            dir="rtl" 
            theme="system"
            closeButton
            richColors
          />
          <Index />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

