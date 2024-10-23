import React, { useState, useEffect } from 'react';
import { createPayment, createOrder, clearCart, fetchAllCarts } from '../api'; 

const Payments = ({ userId }) => {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false); // State to track if checkout is ongoing

    useEffect(() => {
        const getCartItems = async () => {
            try {
                const cartData = await fetchAllCarts(userId);
                
                if (!cartData || !Array.isArray(cartData) || cartData.length === 0) {
                    throw new Error('No carts found');
                }

                const firstCart = cartData[0];
                if (!firstCart || !firstCart.items || firstCart.items.length === 0) {
                    throw new Error('No items found in cart');
                }

                setCartItems(firstCart.items);

                const total = firstCart.items.reduce(
                    (sum, item) => sum + item.product?.price * item.quantity, 0
                );
                setTotalAmount(total);

            } catch (error) {
                console.error('Error fetching cart items:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getCartItems();
    }, [userId]);

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        if (totalAmount <= 0) {
            alert('Total amount is invalid!');
            return;
        }

        const paymentMethod = 'Credit Card';
        const status = 'Pending';

        try {
            setIsProcessing(true); // Set processing state to true
            const paymentResponse = await createPayment({
                userId,
                amount: totalAmount,
                paymentMethod,
                status,
            });

            const orderResponse = await createOrder({
                userId,
                cartItems,
                totalAmount,
                payment: paymentResponse.data.payment._id,
            });

            await clearCart(userId);
            setCartItems([]);
            setTotalAmount(0);

            alert(`Payment successful! Transaction ID: ${paymentResponse.data.payment.transactionId}, Amount: ₹${totalAmount}`);
            alert(`Order placed successfully! Order ID: ${orderResponse.data.order._id}`);
        } catch (error) {
            console.error('Error during checkout:', error);
            alert('Payment or Order failed: ' + (error.response?.data?.error || 'Unknown error'));
        } finally {
            setIsProcessing(false); // Reset processing state
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container">
            <h2>Checkout</h2>
            <h4>Total Amount: ₹{totalAmount}</h4>
            <button onClick={handleCheckout} className="btn btn-success" disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Confirm Order'}
            </button>

            <div>
                <h3>Order Details</h3>
                <ul>
                    {cartItems
                        .filter((item) => item.product !== null)
                        .map((item) => (
                            <li key={item.product._id}>
                                {item.product.name} - ₹{item.product.price} x {item.quantity}
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
};

export default Payments;
