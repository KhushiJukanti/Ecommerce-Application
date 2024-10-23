import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import EcommerceNavbar from './components/Navbar';
import ProductComponent from './components/ProductManagement';
import Payments from './components/Checkout';
import Orders from './components/Orders';
import AllCarts from './components/Cart';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <EcommerceNavbar />
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin" element={<ProductComponent />} />
                    <Route path="/cart" element={<AllCarts/>} />
                    <Route path="/orders" element={<Orders/>} />
                    <Route path="/checkout" element={<Payments />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    {/* Add other routes as needed */}
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
