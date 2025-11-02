import express from 'express';
import {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  checkFavorite
} from '../controllers/favoriteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getFavorites);
router.get('/check/:propertyId', protect, checkFavorite);
router.post('/:propertyId', protect, addToFavorites);
router.delete('/:propertyId', protect, removeFromFavorites);

export default router;
