import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductForm from "./pages/ProductForm";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/">Products</Link> |{" "}
          <Link to="/create">Add Product</Link>
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
