import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import NewsDetails from './pages/NewsDetails.jsx';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/noticias/:id" element={<NewsDetails />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
