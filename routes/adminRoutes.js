const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { getAdminStats } = require('../controllers/adminController.js');

// 👑 Admin statistikasi
router.get('/stats', authMiddleware, adminMiddleware, getAdminStats);

router.post('/admins', authMiddleware, allowRoles('superadmin'), createAdmin);
router.put('/admins/:id', authMiddleware, allowRoles('superadmin'), updateAdmin);
router.delete('/admins/:id', authMiddleware, allowRoles('superadmin'), deleteAdmin);
router.get('/admins', authMiddleware, allowRoles('admin', 'superadmin'), getAllAdmins);
router.put('/admins/profile', authMiddleware, allowRoles('admin', 'superadmin'), updateOwnProfile);


module.exports = router;
