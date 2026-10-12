const express = require('express');
const { authenticate, requireRole } = require('./middleware/auth');
const auth = require('./controllers/authController');
const student = require('./controllers/studentController');
const admin = require('./controllers/adminController');

const router = express.Router();

// Public
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);

// Any logged-in user
router.get('/auth/me', authenticate, auth.me);

// Student only
router.get('/student/me', authenticate, requireRole('student'), student.getMe);
router.put('/student/me', authenticate, requireRole('student'), student.updateMe);

// Admin only
router.use('/admin', authenticate, requireRole('admin'));
router.get('/admin/students', admin.listStudents);
router.post('/admin/students', admin.create);
router.get('/admin/students/:id', admin.getOne);
router.put('/admin/students/:id', admin.update);
router.delete('/admin/students/:id', admin.remove);
router.patch('/admin/students/:id/admission', admin.setAdmission);

module.exports = router;