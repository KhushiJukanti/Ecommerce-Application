const Product = require('../models/products');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Directory where images will be saved
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Create a new product with image upload
exports.createProduct = async (req, res) => {
    const { name, description, price } = req.body;
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    try {
        const newProduct = new Product({
            name,
            description,
            price,
            image: imageUrl, // Store image URL in the database
        });

        await newProduct.save();

        res.status(201).json({
            message: 'Product created successfully',
            product: newProduct,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    let imageUrl = '';

    if (req.file) {
        imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, description, price, image: imageUrl || undefined },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Delete product by ID
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
      // Find the product by ID and delete it
      const deletedProduct = await Product.findByIdAndDelete(id);

      // If no product is found, return a 404 response
      if (!deletedProduct) {
          return res.status(404).json({ message: 'Product not found' });
      }

      // Return success response
      res.status(200).json({
          message: 'Product deleted successfully',
          product: deletedProduct,
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

