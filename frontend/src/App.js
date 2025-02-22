import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./UserContext";
import Navigation from "./components/Nav";
import Pages from "./components/Pages";
import Footer from "./components/footer/footer";



function App() {
  return (
    <UserProvider>
    <Router>
      <div className="App">
        <Navigation />
        <Pages />
        <Footer/>
      </div>
    </Router>
    </UserProvider>
  );
}

export default App;
