import { useState, useEffect } from "react";
import { createProduct, getProduct, updateProduct } from "../api/products";
import { useNavigate, useParams } from "react-router-dom";
import "./ProductForm.css";

export default function ProductForm() {
  const [form, setForm] = useState({ name: "", category: "", price: "", image: "" });
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) loadProduct(id);
  }, [id]);

  const loadProduct = async (id: string) => {
    setLoading(true);
    try {
      const res = await getProduct(id);
      setForm(res.data);
    } catch (error) {
      setMessage({ text: "Error loading product", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (message.text) setMessage({ text: "", type: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage({ text: "", type: "" });

    try {
      if (id) {
        await updateProduct(id, form);
        setMessage({ text: "Product updated successfully!", type: "success" });
      } else {
        await createProduct(form);
        setMessage({ text: "Product created successfully!", type: "success" });
      }
      
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setMessage({ text: "Error saving product. Please try again.", type: "error" });
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="form-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <h2 className="form-title">
          {id ? "Edit Product" : "Create New Product"}
        </h2>
        
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
              disabled={formLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              disabled={formLoading}
            >
              <option value="">Select Category</option>
              <option value="Phones">Phones</option>
              <option value="Covers & Protectors">Covers & Protectors</option>
              <option value="Laptops">Laptops</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (Ksh)</label>
            <input
              id="price"
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Enter price"
              min="0"
              step="0.01"
              required
              disabled={formLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              id="image"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Enter image URL"
              required
              disabled={formLoading}
            />
            {form.image && (
              <div className="image-preview">
                <img src={form.image} alt="Preview" onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }} />
              </div>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={formLoading}>
            {formLoading ? (
              <>
                <div className="button-spinner"></div>
                {id ? "Updating..." : "Creating..."}
              </>
            ) : (
              id ? "Update Product" : "Create Product"
            )}
          </button>

          <button 
            type="button" 
            className="cancel-btn" 
            onClick={() => navigate("/")}
            disabled={formLoading}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
