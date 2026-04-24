import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import CategoryProjects from "./pages/CategoryProjects";
import ProjectSection from "./pages/ProjectSection";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import AuthProvider from "./auth/AuthProvider";
import { useAuth } from "./auth/AuthContext";
import LoginModal from "./pages/LoginModal";
import WelcomeOverlay from "./components/WelcomeOverlay";

function Protected({ children }) {
  const { session } = useAuth();
  // Redirect to /login when no session (no Home flash)
  if (!session) return <Navigate to="/login" replace />;
  return children;
}

function CatchAll() {
  const { session } = useAuth();
  return <Navigate to={session ? "/" : "/login"} replace />;
}

function LoginRoute() {
  const { session } = useAuth();
  if (session) return <Navigate to="/" replace />;
  return <LoginModal open={true} />;
}

function Layout({ children }) {
  const location = useLocation();
  const { session } = useAuth();
  const isLogin = location.pathname === "/login" || !session;
  return (
    <>
      {!isLogin && <Navbar />}
      <div className={!isLogin ? "pt-20" : ""}>{children}</div>
      {!isLogin && <Footer />}
      {!isLogin && <WelcomeOverlay />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginRoute />} />

            <Route
              path="/"
              element={
                <Protected>
                  <Home />
                </Protected>
              }
            />

            <Route
              path="/projects"
              element={
                <Protected>
                  <Projects />
                </Protected>
              }
            />

            <Route
              path="/projects/:category"
              element={
                <Protected>
                  <CategoryProjects />
                </Protected>
              }
            />

            <Route
              path="/projects/:category/:id/:section"
              element={
                <Protected>
                  <ProjectSection />
                </Protected>
              }
            />

            <Route path="*" element={<CatchAll />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
