import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import Compare from "./pages/Compare";
import Dashboard from "./pages/Dashboard";
import DesignLab from "./pages/DesignLab";
import GraphBuilder from "./pages/GraphBuilder";
import Visualise from "./pages/Visualise";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 flex gap-6 h-14 items-center">
            <span className="font-bold text-lg text-gray-900">Matchmaking</span>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"
              }
            >
              Graph Builder
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/compare"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"
              }
            >
              Compare
            </NavLink>
            <NavLink
              to="/visualise"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"
              }
            >
              Visualise
            </NavLink>
            <NavLink
              to="/design-lab"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"
              }
            >
              Design Lab
            </NavLink>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<GraphBuilder />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/visualise" element={<Visualise />} />
            <Route path="/design-lab" element={<DesignLab />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
