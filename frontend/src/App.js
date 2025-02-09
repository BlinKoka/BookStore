import { BrowserRouter as Router } from "react-router-dom";
import Navigation from "./components/Nav";
import Pages from "./components/Pages";
import Footer from "./components/footer/footer";


function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Pages />
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
