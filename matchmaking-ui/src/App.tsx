import { BrowserRouter, NavLink, Route, Routes, useLocation } from "react-router-dom";
import Compare from "./pages/Compare";
import Dashboard from "./pages/Dashboard";
import DesignLab from "./pages/DesignLab";
import GraphBuilder from "./pages/GraphBuilder";
import Visualise from "./pages/Visualise";

function AppFrame() {
  const location = useLocation();
  const isDesignLab = location.pathname === "/design-lab";

  return (
    <div className={isDesignLab ? "min-h-screen bg-gray-50" : "broadcast-theme"}>
      <nav className={isDesignLab ? "bg-white shadow" : "theme-nav"}>
        <div className={isDesignLab ? "max-w-7xl mx-auto px-4 flex gap-6 h-14 items-center" : "theme-nav-inner max-w-7xl mx-auto px-4 flex gap-6 h-16 items-center"}>
          <span className={isDesignLab ? "font-bold text-lg text-gray-900" : "theme-brand"}>
            Matchmaking
          </span>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isDesignLab
                ? isActive ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"
                : isActive ? "theme-nav-link theme-nav-link--active" : "theme-nav-link"
            }
          >
            Graph Builder
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isDesignLab
                ? isActive ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"
                : isActive ? "theme-nav-link theme-nav-link--active" : "theme-nav-link"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/compare"
            className={({ isActive }) =>
              isDesignLab
                ? isActive ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"
                : isActive ? "theme-nav-link theme-nav-link--active" : "theme-nav-link"
            }
          >
            Compare
          </NavLink>
          <NavLink
            to="/visualise"
            className={({ isActive }) =>
              isDesignLab
                ? isActive ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"
                : isActive ? "theme-nav-link theme-nav-link--active" : "theme-nav-link"
            }
          >
            Visualise
          </NavLink>
          <NavLink
            to="/design-lab"
            className={({ isActive }) =>
              isDesignLab
                ? isActive ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"
                : isActive ? "theme-nav-link theme-nav-link--active" : "theme-nav-link"
            }
          >
            Design Lab
          </NavLink>
        </div>
      </nav>

      <main className={isDesignLab ? "max-w-7xl mx-auto" : "max-w-7xl mx-auto theme-main"}>
        <Routes>
          <Route path="/" element={<GraphBuilder />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/visualise" element={<Visualise />} />
          <Route path="/design-lab" element={<DesignLab />} />
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
