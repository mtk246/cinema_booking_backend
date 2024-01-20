const router = require("express").Router();

const helloController = require('../../Controller/helloController');
const userController = require('../../Controller/userController');
const loginController = require('../../Controller/loginController');
const { verifyToken } = require('../../middlewares/authMiddleware');
const movieController = require('../../Controller/movieController');
const seatController = require('../../Controller/seatController');
const theatreController = require('../../Controller/theatreController');
const bookingController = require('../../Controller/bookingController');

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


// Theatre Management
router.get('/theatre', theatreController.get);
router.post('/theatre', verifyToken, theatreController.createTheatre);
router.put('/theatre', verifyToken, theatreController.updateTheatre);

// Seat Management
router.post('/seats', seatController.createSeat);

// Booking Management
router.post('/booking', bookingController.createBooking);
router.post('/searchBooking', bookingController.searchBooking);

exports.api_router = router;
