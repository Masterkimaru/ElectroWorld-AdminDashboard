import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../api/products";
import { Link } from "react-router-dom";
import "./ProductList.css";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; product: Product | null }>({
    show: false,
    product: null
  });
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setDeleteModal({ show: true, product });
  };

  const confirmDelete = async () => {
    if (!deleteModal.product) return;
    
    setDeleting(deleteModal.product._id);
    try {
      await deleteProduct(deleteModal.product._id);
      await loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setDeleting(null);
      setDeleteModal({ show: false, product: null });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ show: false, product: null });
  };

  const LoadingSkeleton = () => (
    <div className="loading-container">
      <div className="skeleton-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-button"></div>
      </div>
      <div className="skeleton-table">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton-row">
            <div className="skeleton-cell"></div>
            <div className="skeleton-cell"></div>
            <div className="skeleton-cell"></div>
            <div className="skeleton-cell skeleton-image"></div>
            <div className="skeleton-cell"></div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="product-list-container">
      <div className="header-section">
        <h1 className="page-title">Product Management</h1>
        <Link to="/create" className="create-btn">
          <span className="plus-icon">+</span>
          Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No Products Found</h3>
          <p>Start by creating your first product</p>
          <Link to="/create" className="create-btn">
            Create Product
          </Link>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="product-row">
                    <td className="product-name">
                      <span>{product.name}</span>
                    </td>
                    <td className="product-category">
                      <span className="category-badge">{product.category}</span>
                    </td>
                    <td className="product-price">
                      <span className="price-value">Ksh {product.price.toLocaleString()}</span>
                    </td>
                    <td className="product-image">
                      <div className="image-wrapper">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiAxNkgyOFYyNEgxMlYxNloiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTE2IDE4SDE4VjIwSDE2VjE4WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                          }}
                        />
                      </div>
                    </td>
                    <td className="product-actions">
                      <Link to={`/edit/${product._id}`} className="edit-btn">
                        Edit
                      </Link>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteClick(product)}
                        disabled={deleting === product._id}
                      >
                        {deleting === product._id ? (
                          <span className="delete-spinner"></span>
                        ) : (
                          'Delete'
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="mobile-cards">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <div className="card-image">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCA0MEg3MFY2MEgzMFY0MFoiIGZpbGw9IiNEMUQ1REIiLz4KPHA+dGggZD0iTTQwIDQ1SDQ1VjUwSDQwVjQ1WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                    }}
                  />
                </div>
                <div className="card-content">
                  <h3 className="card-title">{product.name}</h3>
                  <span className="card-category">{product.category}</span>
                  <div className="card-price">Ksh {product.price.toLocaleString()}</div>
                  <div className="card-actions">
                    <Link to={`/edit/${product._id}`} className="edit-btn">
                      Edit
                    </Link>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteClick(product)}
                      disabled={deleting === product._id}
                    >
                      {deleting === product._id ? (
                        <span className="delete-spinner"></span>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete "{deleteModal.product?.name}"?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="cancel-modal-btn" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="confirm-delete-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
