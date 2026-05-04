import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import NewsDetails from './pages/NewsDetails.jsx';
import Readlist from './pages/Readlist.jsx';
import { ReadlistProvider } from './context/ReadlistContext.jsx';

function App() {
  return (
    <ReadlistProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/noticias/:id" element={<NewsDetails />} />
          <Route path="/readlist" element={<Readlist />} />
        </Routes>
        <Footer />
      </Router>
    </ReadlistProvider>
  );
}

export default App;
