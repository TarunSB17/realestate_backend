import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
const imagesDir = path.join(uploadsDir, 'images');
const modelsDir = path.join(uploadsDir, 'models');

[uploadsDir, imagesDir, modelsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage for property images
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'img-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage for 3D models
const modelStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, modelsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'model-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Custom storage that uses disk for images and memory for models
const customStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Only images go to disk, models will use memory storage
    if (file.fieldname === 'images' || file.fieldname === 'newImages') {
      cb(null, imagesDir);
    } else {
      // This won't be called for models since we'll use memory storage
      cb(null, imagesDir);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'img-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Combined file filter that validates based on field name
const combinedFileFilter = (req, file, cb) => {
  if (file.fieldname === 'images' || file.fieldname === 'newImages') {
    // Image validation
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      return cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed for images field!'));
    }
  } else if (file.fieldname === 'model' || file.fieldname === 'newModel') {
    // Model validation
    const allowedTypes = /glb|gltf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (extname) {
      return cb(null, true);
    } else {
      return cb(new Error('Only GLB or GLTF files are allowed for model field!'));
    }
  } else {
    return cb(new Error('Unknown field name'));
  }
};

// Multer instance that uses disk storage for images and memory storage for models
export const uploadImages = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'images' || file.fieldname === 'newImages') {
        cb(null, imagesDir);
      } else {
        // Models go to memory, but multer needs a destination
        cb(null, modelsDir);
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      if (file.fieldname === 'images' || file.fieldname === 'newImages') {
        cb(null, 'img-' + uniqueSuffix + path.extname(file.originalname));
      } else {
        cb(null, 'model-' + uniqueSuffix + path.extname(file.originalname));
      }
    }
  }),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: combinedFileFilter
});
