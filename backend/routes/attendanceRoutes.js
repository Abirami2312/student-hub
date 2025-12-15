const express = require('express')
const router = express.Router()
const {
  markAttendance,
  getAllAttendance,
  getAttendanceByStudent,
  updateAttendance,
  deleteAttendance
} = require('../controllers/attendance.controller')

router.post('/', markAttendance)
router.get('/', getAllAttendance)
router.get('/student/:studentId', getAttendanceByStudent)
router.put('/:id', updateAttendance)
router.delete('/:id', deleteAttendance)

module.exports = router
