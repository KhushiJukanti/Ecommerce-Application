import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { loginUser } from '../api';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const { login } = useContext(AuthContext); // Use AuthContext to call login
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.password) newErrors.password = 'Password is required';
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };




    const handleSubmit = async (e) => {
        e.preventDefault();
        const formValidationErrors = validateForm();
        if (Object.keys(formValidationErrors).length > 0) {
            setErrors(formValidationErrors);
            return;
        }
    
        try {
            // Call the loginUser API
            const response = await loginUser({ email: formData.email, password: formData.password });
    
            // Assuming response contains user data, including token and role
            const userData = response.data.user;
    
            // Set the user data in AuthContext and localStorage
            login(userData);
    
            // Store userId in localStorage (make sure userData contains the userId)
            if (userData && userData._id) {
                localStorage.setItem('userId', userData._id); // Store userId
                console.log('User ID stored in localStorage:', userData._id)
            } else {
                console.error('User ID not found in userData');
            }
    
            // Reset the form and navigate to the dashboard
            setErrorMessage('');
            setFormData({ email: '', password: '' });
            navigate('/dashboard');
        } catch (err) {
            setErrorMessage('Invalid email or password. Please try again.');
        }
    };
    

    return (
        <div className="mt-5 d-flex justify-content-center align-items-center">
            <div className="w-100" style={{ maxWidth: '600px' }}>
                <h2 className="mb-4">Login</h2>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formEmail" className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formPassword" className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">Login</Button>
                </Form>

                <p className="mt-3">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
