const Student = require('../models/Student')


exports.createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body)
    res.status(201).json({ message: 'Student created', student })
  } catch (error) {
    next(error)
  }
}


exports.getStudents = async (req, res, next) => {
  try {
    const students = await Student.find()
    res.json(students)
  } catch (error) {
    next(error)
  }
}


exports.getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
    if (!student) return res.status(404).json({ message: 'Student not found' })
    res.json(student)
  } catch (error) {
    next(error)
  }
}


exports.updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json({ message: 'Student updated', student })
  } catch (error) {
    next(error)
  }
}

exports.deleteStudent = async (req, res, next) => {
  try {
    await Student.findByIdAndDelete(req.params.id)
    res.json({ message: 'Student deleted' })
  } catch (error) {
    next(error)
  }
}
