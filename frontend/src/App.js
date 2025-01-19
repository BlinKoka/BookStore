import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Nav";
import Pages from "./components/Pages";


function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Pages />
      </div>
    </Router>
  );
}

export default App;
