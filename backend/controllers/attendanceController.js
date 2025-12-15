const Attendance = require('../models/Attendance')


exports.markAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.create(req.body)
    res.status(201).json({ message: 'Attendance marked', attendance })
  } catch (error) {
    next(error)
  }
}


exports.getAllAttendance = async (req, res, next) => {
  try {
    const records = await Attendance.find().populate('studentId')
    res.json(records)
  } catch (error) {
    next(error)
  }
}


exports.getAttendanceByStudent = async (req, res, next) => {
  try {
    const records = await Attendance.find({
      studentId: req.params.studentId
    }).populate('studentId')
    res.json(records)
  } catch (error) {
    next(error)
  }
}


exports.updateAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json({ message: 'Attendance updated', attendance })
  } catch (error) {
    next(error)
  }
}


exports.deleteAttendance = async (req, res, next) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id)
    res.json({ message: 'Attendance deleted' })
  } catch (error) {
    next(error)
  }
}
