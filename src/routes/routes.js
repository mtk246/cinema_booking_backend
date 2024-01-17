const router = require("express").Router();

const helloController = require('../../Controller/helloController');
const userController = require('../../Controller/userController');
const loginController = require('../../Controller/loginController');
const { verifyToken } = require('../../middlewares/authMiddleware');
const movieController = require('../../Controller/movieController');

router.get("/hello", helloController.hello);

router.post("/login", loginController.login);

// User Management
router.get("/getUsers", verifyToken, userController.get);
router.post("/createUser", userController.post);
router.put("/updateUser", verifyToken, userController.update);
router.get("/getMyInfo", verifyToken, userController.getMe);

// Movie Management
router.get('/movie', movieController.get);
router.post('/movie', verifyToken, movieController.post);
router.put('/movie', verifyToken, movieController.put);
router.get('/movie/schedules', movieController.getSchedules);
router.post('/movie/schedules', verifyToken, movieController.createSchedule);

exports.api_router = router;
