# HomeSphere View - Backend API

Backend API for HomeSphere View real estate platform with 3D model support.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Run the Server
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create new property (Protected)
- `PUT /api/properties/:id` - Update property (Protected)
- `DELETE /api/properties/:id` - Delete property (Protected)
- `GET /api/properties/my/listings` - Get user's properties (Protected)

### Inquiries
- `POST /api/inquiry` - Submit inquiry
- `GET /api/inquiry` - Get all inquiries (Protected)
- `GET /api/inquiry/property/:propertyId` - Get property inquiries (Protected)
- `PUT /api/inquiry/:id` - Update inquiry status (Protected)

## 🔧 Technologies Used
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary for file uploads
- Multer for multipart form data
- Bcrypt for password hashing

## 📦 Deployment
This backend is ready to deploy on Render, Heroku, or any Node.js hosting platform.
