import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import GraphBuilder from "./pages/GraphBuilder";
import Dashboard from "./pages/Dashboard";
import Compare from "./pages/Compare";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation bar */}
        <nav className="bg-white shadow">
          <div className="max-w-5xl mx-auto px-4 flex gap-6 h-14 items-center">
            <span className="font-bold text-lg text-gray-900">Matchmaking</span>
            <NavLink
              to="/"
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
          </div>
        </nav>

        {/* Page content */}
        <main className="max-w-5xl mx-auto">
          <Routes>
            <Route path="/" element={<GraphBuilder />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/compare" element={<Compare />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
