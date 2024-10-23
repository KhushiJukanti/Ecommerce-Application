const Payment = require('../models/payments');
const { v4: uuidv4 } = require('uuid');

// Create a new payment
exports.createPayment = async (req, res) => {
    const { username, amount, paymentMethod, status } = req.body;

    try {
        // Generate a unique transaction ID
        const transactionId = uuidv4();

        // Create a new payment record
        const newPayment = new Payment({
            username,
            amount,
            currency: 'INR', // Default currency
            status,
            paymentMethod,
            transactionId,
        });

        await newPayment.save();

        res.status(201).json({
            message: 'Payment created successfully',
            payment: newPayment,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all payments
exports.getPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('username'); // Populating user details if needed
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single payment by ID
exports.getPaymentById = async (req, res) => {
    const { id } = req.params;

    try {
        const payment = await Payment.findById(id).populate('username');

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a payment status
exports.updatePaymentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const payment = await Payment.findById(id);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        payment.status = status;
        await payment.save();

        res.status(200).json({
            message: 'Payment status updated successfully',
            payment,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
