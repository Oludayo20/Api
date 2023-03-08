const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
// const verifyJWT = require('../middleware/verifyJWT');

// router.use(verifyJWT);
router.route('/').post(attendanceController.attendanceLink);
router.route('/sign').post(attendanceController.signAttendance);

module.exports = router;
