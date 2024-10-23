import axios from 'axios';

const API_URL = 'https://ecommerce-application-ualq.onrender.com'; // Replace with your backend URL

// Fetch all products
export const fetchProducts = () => axios.get(`${API_URL}/products/`);

// Fetch a single product by ID
export const fetchProductById = (productId) => axios.get(`${API_URL}/products/${productId}`);

// Create a new product
export const createProduct = (productData) => axios.post(`${API_URL}/products/create`, productData);

// Update an existing product
export const updateProduct = (productId, productData) => axios.patch(`${API_URL}/products/${productId}`, productData);

// Delete a product
export const deleteProduct = (productId) => axios.delete(`${API_URL}/products/${productId}`);


// CART API service...........................


export const addItemToCart = async (data) => {
  try { // Get the token from localStorage
      const response = await axios.post(`${API_URL}/cart/`, data, {
          headers: {
              'Content-Type': 'application/json', // Send the token in the Authorization header
          }
      });
      return response.data;
  } catch (error) {
      console.error('Error adding to cart:', error.response ? error.response.data : error.message);
      throw error;
  }
};


// Fetch cart items for a specific user
// Fetch cart items for a specific user
export const fetchAllCarts = async () => {
    const token = localStorage.getItem('token');
    try {
         // Get the token from local storage
        const response = await axios.get(`${API_URL}/cart/`, {
            headers: {
                Authorization: `Bearer ${token}` // Include the token in the request headers
            }
        });
        return response.data; // Assuming the API returns an array of cart items
    } catch (error) {
        throw new Error('Failed to fetch cart items: ' + error.message); // Improved error message
    }
};


// Remove an item from the cart
export const removeCartItem = async (cartId, itemId) => {
  const response = await axios.delete(`${API_URL}/carts/${cartId}/items/${itemId}`);
  return response.data; // Assuming your API returns the updated cart
};




export const clearCart = async (userId) => {
  try {
      const response = await axios.delete(`${API_URL}/carts/${userId}/clear`);
      return response.data;
  } catch (error) {
      throw new Error('Error clearing cart');
  }
};




// Payments..................................................


export const createPayment = async (paymentData) => {
    const response = await axios.post(`${API_URL}/payments/`, paymentData);
    return response; // Return response for success or failure handling
  };


//   orders.....................................................................

export const createOrder = async (orderData) => {
    const response = await axios.post(`${API_URL}/orders/`, orderData);
    return response; // Return response for success or failure handling
  };


  export const fetchOrders = async (userId) => {
    const response = await axios.get(`${API_URL}/orders/`, { params: { userId } });
    return response.data; // Assuming the response returns an array of orders
};




// user APIS...........................................

// User registration
export const registerUser = (userData) => axios.post(`${API_URL}/users/register`, userData);

// User login
export const loginUser = (credentials) => axios.post(`${API_URL}/users/login`, credentials);

// Fetch user profile (requires authentication)
export const fetchUserProfile = () => axios.get(`${API_URL}/profile`, {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you store the token in localStorage
    }
});
