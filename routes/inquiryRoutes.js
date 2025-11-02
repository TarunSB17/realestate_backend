import express from 'express';
import {
  createInquiry,
  getPropertyInquiries,
  getAllInquiries,
  updateInquiryStatus
} from '../controllers/inquiryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route
router.post('/', createInquiry);

// Protected routes
router.get('/', protect, getAllInquiries);
router.get('/property/:propertyId', protect, getPropertyInquiries);
router.put('/:id', protect, updateInquiryStatus);

export default router;
