import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
 

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
// CORS: allow Vercel frontend and localhost (credentials supported)
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://real-frontend-one.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow server-to-server / curl
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files statically with proper MIME types
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    // Set proper MIME type for GLB files
    if (filePath.endsWith('.glb')) {
      res.setHeader('Content-Type', 'model/gltf-binary');
      res.setHeader('Access-Control-Allow-Origin', '*');
    } else if (filePath.endsWith('.gltf')) {
      res.setHeader('Content-Type', 'model/gltf+json');
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
  }
}));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to DreamHomes API', status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    database: 'connected',
    cloudinary: !!process.env.CLOUDINARY_URL || !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY),
    timestamp: new Date().toISOString() 
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/inquiry', inquiryRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin', adminRoutes);
 

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
