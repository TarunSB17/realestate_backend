import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary from either CLOUDINARY_URL or individual vars
if (process.env.CLOUDINARY_URL) {
  cloudinary.config(process.env.CLOUDINARY_URL);
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Storage for property images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'homesphere/properties',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }]
  }
});

// Storage for 3D models (GLB/GLTF files)
const modelStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'homesphere/models',
    allowed_formats: ['glb', 'gltf'],
    resource_type: 'raw'
  }
});

export const uploadImages = multer({ storage: imageStorage });
export const uploadModel = multer({ storage: modelStorage });
export { cloudinary };
