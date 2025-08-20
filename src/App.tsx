import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductList from "./pages/ProductList";
import ProductForm from "./pages/ProductForm";
import Login from "./components/Login";
import "./App.css"; // Import the CSS

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuthenticated');
    setIsAuthenticated(authStatus === 'true');
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div style={{ padding: "20px", minHeight: "100vh", background: "#f8f9fa" }}>
        <nav className="app-nav">
          <div className="nav-left">
            <h2>Admin Dashboard</h2>
            <div className="nav-links">
              <Link to="/">Products</Link>
              <Link to="/create">Add Product</Link>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            🔓 Logout
          </button>
        </nav>

        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/create" element={<ProductForm />} />
          <Route path="/edit/:id" element={<ProductForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;