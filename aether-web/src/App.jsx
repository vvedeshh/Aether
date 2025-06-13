import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Simulator from "./pages/Simulator";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulator" element={<Simulator />} />
      </Routes>
    </Router>
  );
}

export default App;
