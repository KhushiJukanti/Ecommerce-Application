

import React, { useState, useEffect } from 'react';
import { fetchProducts, addItemToCart } from '../api'; // Import your API service

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartMessage, setCartMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product

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

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Product Click to Show Details in Modal
  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  // Handle Modal Close
  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  // Handle Add to Cart
  const handleAddToCart = async (product, quantity = 1) => {
    const userId = "67164e919966adae5ca99a0c" // Assuming userId is stored in localStorage after login

    if (!product || !product._id || !quantity) {
      setCartMessage('Error: Product ID and quantity must be provided.');
      return; // Exit if product ID or quantity is missing
    }

    const data = {
      product: product._id, // Ensure product ID is correctly referenced
      quantity,
      userId
    };
  

    try {
      // const data = { product: product._id, quantity, userId }; // Construct the data object
      const response = await addItemToCart(data); // Call API
      setCartMessage(response.message); // Show success message
      console.log(response.cart); // Log the updated cart for reference
    } catch (error) {
      setCartMessage('Error adding to cart: ' + error.message); // Show error message
    }
  };

  return (
    <div className="container mt-5">
      <h2>Dashboard</h2>
      <p>Welcome to your dashboard!</p>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Display Products */}
      <div className="row">
        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          filteredProducts.map((product) => (
            <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={product._id}>
              <div
                className="card"
                style={{ cursor: 'pointer' }}
                onClick={() => handleProductClick(product)} // Trigger modal on card click
              >
                <div className="row g-0">
                  <div className="col-12 col-md-6 mt-5">
                    <img
                      src={product.image}
                      className="card-img-top"
                      alt={product.name}
                      style={{ maxHeight: '200px', width: '150px', objectFit: 'cover', padding: '10px' }}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="card-body d-flex flex-column justify-content-between h-100">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">
                        {product.description.length > 70
                          ? product.description.substring(0, 70) + '...'
                          : product.description}
                      </p>
                      <p className="card-text">
                        <strong>Price:</strong> ₹{product.price}
                      </p>
                      <button
                        className="btn btn-primary"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the card click
                          handleAddToCart(product); // Add to cart
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
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
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    handleAddToCart(selectedProduct); // Add to cart
                    handleCloseModal(); // Close modal after adding
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Message Display */}
      {cartMessage && <div className="alert alert-info mt-3">{cartMessage}</div>}
    </div>
  );
};

export default Dashboard;
