// const express = require('express');

// const {
//     createProduct,
//     getProducts,
//     getProductById,
//     updateProduct,
//     deleteProduct,
//     getProductHandler,
//     getTop5Products,
//     getProductCategories
// }  = require('../controllers/productController');

// const router = express.Router();

// router.get('/categories', getProductCategories);
// router.get('/', getProducts);
// router.get('/', getTop5Products, getProductHandler);
// router.get('/bigBillionDay', getProductHandler);
// router.get('/:id', getProductById);
// router.post('/', createProduct);
// router.put('/:id', updateProduct);
// router.delete('/:id', deleteProduct);



// module.exports = router;

// const express = require('express');

// const {
//     createProduct,
//     getProducts,
//     getProductById,
//     updateProduct,
//     deleteProduct,
//     getProductHandler,
//     getTop5Products,
//     getProductCategories
// }  = require('../controllers/productController');

// const router = express.Router();

// // Route for fetching product categories
// router.get('/categories', getProductCategories);

// // Route for fetching all products
// router.get('/', getProductHandler, getProducts);

// // Route for fetching top 5 products (if separate route)
// router.get('/top5', getTop5Products, getProductHandler);

// // Route for specific products by ID
// router.get('/:id', getProductById);

// // Route for creating a product
// router.post('/', createProduct);

// // Route for updating a product by ID
// router.put('/:id', updateProduct);

// // Route for deleting a product by ID
// router.delete('/:id', deleteProduct);

// // Route for fetching products on BigBillionDay sale
// router.get('/bigBillionDay',  getProductHandler, getProducts);

// module.exports = router;

const express = require('express');

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductHandler,
    getTop5Products,
    getProductCategories
} = require('../controllers/productController');

const router = express.Router();

// Route for fetching product categories
router.get('/categories', getProductCategories);

// Route for fetching all products
router.get('/', getProductHandler, getProducts);

// Route for fetching top 5 products (if separate route)
router.get('/top5', getTop5Products, getProductHandler);

// Route for fetching products on BigBillionDay sale
router.get('/bigBillionDay', getProductHandler, getProducts);

// Route for specific products by ID (this should come last)
router.get('/:id', getProductById);

// Route for creating a product
router.post('/', createProduct);

// Route for updating a product by ID
router.put('/:id', updateProduct);

// Route for deleting a product by ID
router.delete('/:id', deleteProduct);

module.exports = router;

