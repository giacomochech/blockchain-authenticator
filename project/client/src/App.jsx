import { EthProvider } from "./contexts/EthContext";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import "./style/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Project from "./pages/Project";
import Info from "./pages/Info";

function App() {
  return (
    <EthProvider>
      <div className="app-wrapper">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/project" element={<Project />} />
            <Route path="/info" element={<Info />} />
          </Routes>
        </BrowserRouter>
      </div>
    </EthProvider>
  );
}

export default App;
