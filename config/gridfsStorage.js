import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import path from 'path';
import crypto from 'crypto';
import mongoose from 'mongoose';

// GridFS storage for 3D models
const gridStorage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'models' // Collection name will be models.files and models.chunks
        };
        resolve(fileInfo);
      });
    });
  }
});

// Regular disk storage for images
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = 'uploads/images';
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'img-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'images' || file.fieldname === 'newImages') {
    // Image validation
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      return cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed!'));
    }
  } else if (file.fieldname === 'model' || file.fieldname === 'newModel') {
    // Model validation
    const allowedTypes = /glb|gltf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (extname) {
      return cb(null, true);
    } else {
      return cb(new Error('Only GLB or GLTF files are allowed!'));
    }
  } else {
    return cb(new Error('Unknown field name'));
  }
};

// Multer instances
export const uploadImagesLocal = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'images' || file.fieldname === 'newImages') {
      fileFilter(req, file, cb);
    } else {
      cb(new Error('This middleware only handles images'));
    }
  }
});

export const uploadModelGridFS = multer({
  storage: gridStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'model' || file.fieldname === 'newModel') {
      fileFilter(req, file, cb);
    } else {
      cb(new Error('This middleware only handles models'));
    }
  }
});

// Combined middleware that handles both
export const uploadPropertyFiles = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname === 'images' || file.fieldname === 'newImages') {
        cb(null, 'uploads/images');
      } else {
        // Models will be handled separately by GridFS
        cb(null, 'uploads/temp');
      }
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const prefix = (file.fieldname === 'images' || file.fieldname === 'newImages') ? 'img-' : 'model-';
      cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: fileFilter
});

// Helper to get GridFS bucket
export const getGridFSBucket = () => {
  if (!mongoose.connection.db) {
    throw new Error('MongoDB not connected');
  }
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'models'
  });
};
