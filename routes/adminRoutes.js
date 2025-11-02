import express from 'express';
import {
  getAnalytics,
  getAllBuyers,
  toggleUserStatus,
  deleteUser,
  getAdminInquiries,
  updatePropertyStatus
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

router.get('/analytics', getAnalytics);
router.get('/buyers', getAllBuyers);
router.put('/buyers/:id/toggle-status', toggleUserStatus);
router.delete('/buyers/:id', deleteUser);
router.get('/inquiries', getAdminInquiries);
router.put('/properties/:id/status', updatePropertyStatus);

export default router;
