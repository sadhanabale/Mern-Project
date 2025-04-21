const productModel = require('../models/productModel');

const {
    createFactory,
    getAllFactory,
    getByIdFactory,
    updateByIdFactory,
    deleteByIdFactory
} = require('../utils/curdFactory');

const transfomedQueryHelper = (myQuery) => {
    const parseQuery = JSON.parse(myQuery);

    const queryOperators = {
        gt: '$gt',
        gte: '$gte',
        lt: '$lt',
        lte: '$lte',

        // add any other opertors that you want
    }

    for(let key in parseQuery) { // price: {lt: 60}
      
       let internalObj = parseQuery[key];

       if(typeof internalObj === "object") {
         for(let innerKey in internalObj) { // {lt: 60}

         if(queryOperators[innerKey]) {
            internalObj[`$${innerKey}`] = internalObj[innerKey]
                // {$lt:60 }
            delete internalObj[innerKey];
         }
         }
       }
    }

    return parseQuery;
}

const getProductHandler = async(req, res) => {
    try {
        const query = req.query;

        const sortParams = query.sort;
        const selectParams = query.select;
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 3;
        const skip = (page - 1) * limit;
        const filterParams = query.filter;
        const category = query.category;

        let filterObj = {};

        // Handle filter from query string
        if (filterParams) {
            filterObj = transfomedQueryHelper(filterParams);
        }

        // Add category-based filtering
        if (category) {
            filterObj.category = category;
        }

        // Count total matching products for pagination metadata
        const totalProducts = await productModel.countDocuments(filterObj);

        // Build query
        let queryResponsePromise = productModel.find(filterObj);

        // Sorting
        if (sortParams) {
            const [sortParam, order] = sortParams.split(" ");
            queryResponsePromise = queryResponsePromise.sort({
                [sortParam]: order === 'asc' ? 1 : -1
            });
        }

        // Selecting fields
        if (selectParams) {
            queryResponsePromise = queryResponsePromise.select(selectParams);
        }

        // Pagination
        queryResponsePromise = queryResponsePromise.skip(skip).limit(limit);

        const result = await queryResponsePromise;

        res.status(200).json({
            message: "Get products successfully",
            data: result,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


const getTop5Products = async(req, res, next) => {
    req.query.filter = {
        stock: {$lt: 5},
        averageRating: {$gt: 4.8}
    }

    next();
}

const getProductCategories = (req, res) => {
    res.status(200).json({
        data: ["electronics","jewelery","men's clothing","women's clothing"]
    });
}

const createProduct = createFactory(productModel);
const getProducts = getAllFactory(productModel);
const getProductById = getByIdFactory(productModel);
const updateProduct = updateByIdFactory(productModel);
const deleteProduct = deleteByIdFactory(productModel);

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    getProductHandler,
    getTop5Products,
    updateProduct,
    deleteProduct,
    getProductCategories
}