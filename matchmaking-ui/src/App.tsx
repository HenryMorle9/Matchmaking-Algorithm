import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import Compare from "./pages/Compare";
import Dashboard from "./pages/Dashboard";
import GraphBuilder from "./pages/GraphBuilder";
import Landing from "./pages/Landing";
import Sandbox from "./pages/Sandbox";
import Visualise from "./pages/Visualise";

function AppFrame() {
  return (
    <div className="broadcast-theme">
      <nav className="theme-nav">
        <div className="theme-nav-inner max-w-7xl mx-auto px-4 flex gap-6 h-16 items-center">
          <NavLink to="/" end className="theme-brand">
            MatchMatrix
          </NavLink>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "theme-nav-link theme-nav-link--active" : "theme-nav-link"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/graph-builder"
            className={({ isActive }) =>
              isActive ? "theme-nav-link theme-nav-link--active" : "theme-nav-link"
            }
          >
            Graph Builder
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "theme-nav-link theme-nav-link--active" : "theme-nav-link"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/compare"
            className={({ isActive }) =>
              isActive ? "theme-nav-link theme-nav-link--active" : "theme-nav-link"
            }
          >
            Compare
          </NavLink>
          <NavLink
            to="/visualise"
            className={({ isActive }) =>
              isActive ? "theme-nav-link theme-nav-link--active" : "theme-nav-link"
            }
          >
            Visualise
          </NavLink>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto theme-main">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/graph-builder" element={<GraphBuilder />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/visualise" element={<Visualise />} />
          <Route path="/sandbox" element={<Sandbox />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppFrame />
    </BrowserRouter>
  );
}

export default App;
