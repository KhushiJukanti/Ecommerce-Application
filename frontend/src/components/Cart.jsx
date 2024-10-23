import React, { useEffect, useState } from 'react';
import { fetchAllCarts, removeCartItem } from '../api'; // Update the API import
import { Card, Button, Row, Col } from 'react-bootstrap'; // Import Bootstrap components
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AllCarts = () => {
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Get navigate function

    useEffect(() => {
        const getAllCarts = async () => {
            try {
                const cartData = await fetchAllCarts(); // Call to fetch all carts
                setCarts(cartData); // Update state with all carts
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch carts');
                setLoading(false);
            }
        };

        getAllCarts();
    }, []);

    const handleRemoveFromCart = async (cartId, itemId) => {
        try {
            const updatedCart = await removeCartItem(cartId, itemId); // Call to remove item from a specific cart
            // Update state with the updated cart
            setCarts(carts.map(cart =>
                cart._id === cartId ? updatedCart : cart
            ));
        } catch (error) {
            setError('Failed to remove item from cart');
        }
    };

    const handleCheckout = () => {
        navigate('/checkout'); // Use navigate to redirect to the checkout page
    };

    const totalAmount = carts.reduce((total, cart) => {
        return total + cart.items.reduce((cartTotal, item) => {
            const price = item.product?.price || 0; // Use optional chaining and default to 0
            return cartTotal + price * item.quantity;
        }, 0);
    }, 0);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mt-4">
            <h2>All Carts</h2>
            {carts.length === 0 ? (
                <p>No carts available</p>
            ) : (
                <Row>
                    {carts.map(cart => (
                        <Col lg={4} md={6} sm={12} className="mb-4" key={cart._id}>
                            <Card className="h-100">
                                <Card.Body>
                                    <Card.Title>Cart ID: {cart._id}</Card.Title>
                                    {cart.items.map((item) => {
                                        const { product, quantity } = item; // Extract product and quantity from item
                                        if (!product) return null; // Skip if product is undefined

                                        return (
                                            <div key={item._id}>
                                                <Card.Text>
                                                    <strong>Product:</strong> {product.name} <br />
                                                    <strong>Quantity:</strong> {quantity} <br />
                                                    <strong>Price:</strong> ₹{product.price} <br />
                                                </Card.Text>
                                                <Button variant="danger" onClick={() => handleRemoveFromCart(cart._id, item._id)}>
                                                    Remove
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
            <Col md={12} className="text-right mt-4">
                <h3>Total Amount from All Carts: ₹{totalAmount.toFixed(2)}</h3>
                <Button className='btn btn-success' onClick={handleCheckout}>
                    Checkout
                </Button>
            </Col>
        </div>
    );
};

export default AllCarts;
