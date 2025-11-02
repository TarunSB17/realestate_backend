import express from 'express';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  getSimilarProperties,
  seedMyProperties
} from '../controllers/propertyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin, canList } from '../middleware/roleMiddleware.js';
import { uploadImages } from '../config/localStorage.js';

const router = express.Router();

// Public routes
router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.get('/:id/similar', getSimilarProperties);

// Protected routes
router.post(
  '/',
  protect,
  canList,
  // Handle both images and model in one multer middleware
  uploadImages.fields([
    { name: 'images', maxCount: 10 },
    { name: 'model', maxCount: 1 }
  ]),
  createProperty
);

router.post('/my/seed', protect, canList, seedMyProperties);
router.get('/my/listings', protect, getMyProperties);
router.put(
  '/:id',
  protect,
  canList,
  uploadImages.fields([
    { name: 'newImages', maxCount: 10 },
    { name: 'newModel', maxCount: 1 }
  ]),
  updateProperty
);
router.delete('/:id', protect, deleteProperty);

export default router;
