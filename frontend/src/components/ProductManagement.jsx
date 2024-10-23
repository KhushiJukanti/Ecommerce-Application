import React, { useState, useEffect } from 'react';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchProductById,
} from '../api'; // Import API service
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'; // Import your custom CSS file

const ProductComponent = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Load products from backend
  const loadProducts = async () => {
    try {
      const response = await fetchProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handle form submit (Create or Update product)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = new FormData();
    productData.append('name', formData.name);
    productData.append('description', formData.description);
    productData.append('price', formData.price);
    productData.append('image', formData.image);

    try {
      if (isEditing) {
        await updateProduct(currentProductId, productData);
        setIsEditing(false);
        setCurrentProductId(null);
      } else {
        await createProduct(productData);
      }
      setFormData({ name: '', description: '', price: '', image: null });
      loadProducts();
    } catch (error) {
      console.error('Error submitting product:', error.message);
    }
  };

  // Handle Edit product
  const handleEditProduct = async (productId) => {
    try {
      const response = await fetchProductById(productId);
      setFormData({
        name: response.data.name,
        description: response.data.description,
        price: response.data.price,
        image: null,
      });
      setIsEditing(true);
      setCurrentProductId(productId);
    } catch (error) {
      console.error('Error fetching product:', error.message);
    }
  };

  // Handle Delete product
  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error.message);
    }
  };

  // Handle Product Click to Show Details in Modal
  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  // Handle Modal Close
  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="container">
      {/* Product Create/Update Form */}
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">{isEditing ? 'Update Product' : 'Create Product'}</h5>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Product Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">Price</label>
              <input
                type="number"
                className="form-control"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">Product Image</label>
              <input
                type="file"
                className="form-control"
                id="image"
                name="image"
                onChange={handleImageChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Update' : 'Create'}
            </button>
          </form>
        </div>
      </div>

      {/* Display Products */}
      <div className="row mt-5">
        {products.length === 0 ? (
          <p>No products available. Please add a product.</p>
        ) : (
          products.map((product) => (
            <div className="col-12 col-sm-6 col-md-4 mb-4" key={product._id}>
              <div
                className="card d-flex flex-row"
                style={{ width: '100%' }}
                onClick={() => handleProductClick(product)} // Trigger modal on card click
                role="button" // Make the card clickable
              >
                <img
                  src={product.image}
                  className="card-img-left"
                  alt={product.name}
                  style={{
                    maxHeight: '200px',
                    width: '150px',
                    objectFit: 'cover',
                    padding: '10px',
                  }}
                />
                <div className="card-body d-flex flex-column" style={{ height: '200px' }}>
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text mb-0" style={{ fontSize: '0.9rem' }}>
                    {product.description.length > 70
                      ? product.description.substring(0, 70) + '...'
                      : product.description}
                  </p>
                  <p className="card-text">
                    <strong>Price:</strong> ₹{product.price}
                  </p>
                  <div className="mt-auto d-flex justify-content-between">
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the card click
                        handleEditProduct(product._id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the card click
                        handleDeleteProduct(product._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Product Details */}
      {selectedProduct && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedProduct.name}</h5>
                <button type="button" className="close" onClick={handleCloseModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="img-fluid mb-3"
                />
                <p><strong>Description:</strong> {selectedProduct.description}</p>
                <p><strong>Price:</strong> ₹{selectedProduct.price}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductComponent;
