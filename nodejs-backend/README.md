# Node.js Backend - Crop Recommendation System

This is the backend API server for the crop recommendation system built with Node.js, Express, MongoDB, and Google Gemini AI.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Crop Prediction**: Integration with ML model for crop recommendations
- **AI Reports**: Generate detailed soil health reports using Google Gemini AI
- **File Uploads**: Profile image upload functionality
- **Data Persistence**: Store user data and crop recommendations in MongoDB

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Google Gemini AI API key
- ML Model API endpoint (Flask/Python service)

## Installation

1. Navigate to the backend directory:
```bash
cd nodejs-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
MONGO_URI=mongodb://localhost:27017/crop_recommendation
JWT_SECRET=your_secure_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
CROP_PREDICTION_API_URL=http://localhost:5001/predict
BASE_URL=http://localhost:5000
PORT=5000
NODE_ENV=development
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `GEMINI_API_KEY` | Google Gemini AI API key | Yes |
| `CROP_PREDICTION_API_URL` | ML model API endpoint | Yes |
| `BASE_URL` | Base URL for file uploads | No |
| `PORT` | Server port (default: 5000) | No |
| `NODE_ENV` | Environment (development/production) | No |

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Register new user
- `POST /login` - User login
- `PUT /profile` - Update user profile (protected)
- `DELETE /profile` - Delete user account (protected)

### Prediction Routes (`/api/predict`)

- `POST /` - Get crop prediction (protected)
- `POST /save` - Save recommendation (protected)
- `GET /history` - Get user's prediction history (protected)
- `POST /report` - Generate AI soil report (protected)
- `POST /health-summary` - Get soil health summary (protected)
- `POST /download-report` - Download PDF report (protected)

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

## Project Structure

```
nodejs-backend/
├── config/
│   ├── db.js              # MongoDB connection
│   └── validateEnv.js     # Environment validation
├── controllers/
│   ├── authController.js  # Authentication logic
│   └── predictController.js # Prediction logic
├── middleware/
│   ├── authMiddleware.js  # JWT authentication
│   ├── errorMiddleware.js # Error handling
│   └── uploadMiddleware.js # File upload handling
├── models/
│   ├── User.js           # User schema
│   └── Recommendation.js # Recommendation schema
├── routes/
│   ├── authRoutes.js     # Auth endpoints
│   └── predictRoutes.js  # Prediction endpoints
├── uploads/              # File upload directory
├── .env.example          # Environment template
├── .gitignore
├── package.json
└── server.js            # Main server file
```

## Security Features

- JWT token authentication
- Password hashing with bcryptjs
- Input validation and sanitization
- CORS configuration
- Environment variable validation
- File upload restrictions (images only)

## Dependencies

### Main Dependencies
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT implementation
- **bcryptjs**: Password hashing
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **multer**: File upload handling
- **@google/generative-ai**: Google Gemini AI integration
- **pdfkit**: PDF generation
- **axios**: HTTP client
- **nodemailer**: Email functionality

### Development Dependencies
- **nodemon**: Development server with auto-restart

## Error Handling

The API includes comprehensive error handling:
- Validation errors return 400 status
- Authentication errors return 401 status
- Authorization errors return 403 status
- Not found errors return 404 status
- Server errors return 500 status

## File Uploads

Profile images are stored in the `uploads/` directory with the following restrictions:
- Accepted formats: JPG, JPEG, PNG
- Files are renamed with timestamps to prevent conflicts
- Maximum file size limits (configured in multer)

## AI Integration

The system integrates with Google Gemini AI for:
- Detailed soil health reports
- Crop recommendation explanations
- Agricultural advice based on soil parameters

## Contributing

1. Follow the existing code structure and naming conventions
2. Add proper error handling for new endpoints
3. Include input validation for all user inputs
4. Update documentation for new features
5. Test all endpoints before submitting changes

## Common Issues

1. **MongoDB Connection**: Ensure MongoDB is running and the connection string is correct
2. **Environment Variables**: All required variables must be set in `.env`
3. **File Uploads**: Ensure the `uploads/` directory exists and has proper permissions
4. **AI API**: Verify your Gemini API key is valid and has sufficient quota

## License

This project is licensed under the ISC License.