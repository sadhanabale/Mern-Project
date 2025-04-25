const express = require('express');

const {
    createUser,
    getUsers,
    getUserById,
    getAllUsers,
    getUserProfile,
    updateUser,
    deleteUser
}  = require('../controllers/userController');
const {
    protectRouteMiddleware,
    isAuthorizedMiddleware
  } = require('../controllers/authController');

const router = express.Router();
router.get(
    '/',
    protectRouteMiddleware,
    isAuthorizedMiddleware(['admin']),
    getUsers
  );
router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

router.get('/getUser', protectRouteMiddleware, getUserProfile);

module.exports = router;