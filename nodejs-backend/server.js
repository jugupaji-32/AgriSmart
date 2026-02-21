const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const { validateEnv } = require('./config/validateEnv');
const port = process.env.PORT || 5001;

// Validate environment variables before starting
validateEnv();

connectDB();

const app = express();

// CORS configuration for production
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (process.env.NODE_ENV === 'production') {
            // Remove trailing slash from FRONTEND_URL if present
            const allowedOrigin = process.env.FRONTEND_URL?.replace(/\/$/, '') || '*';
            
            if (allowedOrigin === '*' || origin === allowedOrigin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        } else {
            // Allow all origins in development
            callback(null, true);
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/predict', require('./routes/predictRoutes'));
app.use('/api/external', require('./routes/weatherRoutes'));
app.use('/api/finance', require('./routes/financeRoutes'));

app.get('/', (req, res) => {
    res.json({
        message: 'Crop Recommendation API is running...',
        version: '1.0.0',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        memory: process.memoryUsage()
    });
});

app.use(require('./middleware/errorMiddleware').errorHandler);

// Export for Vercel serverless
if (process.env.VERCEL) {
    module.exports = app;
} else {
    const server = app.listen(port, () => {
        console.log(`🚀 Server started on port ${port}`);
        console.log(`📍 API URL: http://localhost:${port}`);
        console.log(`💚 Health Check: http://localhost:${port}/health`);
    });

    // Handle server errors
    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.error(`❌ Port ${port} is already in use. Please:`);
            console.error(`   1. Kill the process using: kill -9 $(lsof -ti:${port})`);
            console.error(`   2. Or use a different port by setting PORT in .env`);
            process.exit(1);
        } else {
            console.error('❌ Server error:', error.message);
            process.exit(1);
        }
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down server gracefully...');
        server.close(() => {
            console.log('✅ Server closed');
            process.exit(0);
        });
    });
}

module.exports = app;
