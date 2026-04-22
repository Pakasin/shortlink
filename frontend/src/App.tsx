import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import LandingPage from './pages/LandingPage';
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { CreateLinkPage } from "./pages/CreateLinkPage";
import { CallbackPage } from "./pages/CallbackPage";

function App() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        {!isLandingPage && <Navbar />}
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/callback" element={<CallbackPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/create" element={<CreateLinkPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Route>
          </Routes>
        </main>
        {!isLandingPage && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;
