const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const multer = require('multer');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Create a product with image upload
router.post('/create', upload.single('image'), productController.createProduct);

// Get all products
router.get('/', productController.getProducts);

// Get product by ID
router.get('/:id', productController.getProductById);

// Update product
router.patch('/:id', upload.single('image'), productController.updateProduct);

router.delete('/:id', productController.deleteProduct);

module.exports = router;
