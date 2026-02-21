const validateEnv = () => {
    const requiredEnvVars = [
        'MONGO_URI',
        'JWT_SECRET',
        'GEMINI_API_KEY',
        'CROP_PREDICTION_API_URL'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        console.error('❌ Missing required environment variables:');
        missingVars.forEach(varName => {
            console.error(`   - ${varName}`);
        });
        console.error('\n📝 Please check your .env file and add the missing variables.');
        console.error('💡 You can use .env.example as a template.\n');
        process.exit(1);
    }

    console.log('✅ All required environment variables are set');
};

module.exports = { validateEnv };