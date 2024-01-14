const router = require("express").Router();

const helloController = require('../../Controller/helloController');
const userController = require('../../Controller/userController');
const loginController = require('../../Controller/loginController');
const { verifyToken } = require('../../middlewares/authMiddleware');
const purchaseController = require('../../Controller/purchaseController');
const stockController = require('../../Controller/stockController');
const packagingController = require('../../Controller/packagingController');
const recipeController = require('../../Controller/recipeController');
const productionController = require('../../Controller/productionController');

router.get("/hello", helloController.hello);

router.post("/login", loginController.login);

// User Management
router.get("/getUsers", verifyToken, userController.get);
router.post("/createUser", userController.post);
router.put("/updateUser", verifyToken, userController.update);
router.get("/getMyInfo", verifyToken, userController.getMe);

// Purchase Management
router.get('/purchase', verifyToken, purchaseController.get);
router.post('/purchase', verifyToken, purchaseController.post);
router.put('/purchase', verifyToken, purchaseController.update);
//router.get('/purchase', verifyToken, purchaseController.getPurchaseHistory);

//Purchase type Management
router.get('/purchaseType', verifyToken, purchaseController.getPurchaseType);
router.post('/purchaseType', verifyToken, purchaseController.postPurchaseType);
router.put('/purchaseType', verifyToken, purchaseController.putPurchaseType);

//Bill type Management
router.get('/billType', verifyToken, purchaseController.getBill);
router.post('/billType', verifyToken, purchaseController.postBill);
router.put('/billType', verifyToken, purchaseController.putBill);

// Stock Management
router.get('/stock', verifyToken, stockController.getStockList);

router.get('/packaging', verifyToken, packagingController.get);
router.post('/packaging', verifyToken, packagingController.post);
router.put('/packaging', verifyToken, packagingController.put);

// Recipe Management
router.get('/recipe', verifyToken, recipeController.get);
router.get('/recipeDetail', verifyToken, recipeController.recipeDetail);
router.post('/recipe', verifyToken, recipeController.post);
router.put('/recipeDetail', verifyToken, recipeController.put);
router.post('/recipePrice', verifyToken, recipeController.price);

// Production Management
router.get('/production', verifyToken, productionController.productionDetail);
router.post('/production', verifyToken, productionController.post);
router.put('/productionQty', verifyToken, productionController.productionQty);
router.put('/onTotalPacketUpdate', verifyToken, productionController.onTotalPacketUpdate);

exports.api_router = router;
