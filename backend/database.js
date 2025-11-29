const { Pool } = require('pg');
const redis = require('redis');

// PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

// Redis client for caching
const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    retry_strategy: (options) => Math.min(options.attempt * 100, 3000)
});

// Database schemas
const initDB = async () => {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                plan VARCHAR(50) DEFAULT 'free',
                daily_usage INTEGER DEFAULT 0,
                monthly_usage INTEGER DEFAULT 0,
                last_usage_date DATE DEFAULT CURRENT_DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS analysis_logs (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                content_hash VARCHAR(64) NOT NULL,
                verdict VARCHAR(50) NOT NULL,
                confidence DECIMAL(5,2) NOT NULL,
                processing_time INTEGER NOT NULL,
                sources JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS api_keys (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                key_hash VARCHAR(255) NOT NULL,
                name VARCHAR(100) NOT NULL,
                last_used TIMESTAMP,
                usage_count INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_analysis_logs_user_id ON analysis_logs(user_id);
            CREATE INDEX IF NOT EXISTS idx_analysis_logs_created_at ON analysis_logs(created_at);
        `);
    } finally {
        client.release();
    }
};

module.exports = { pool, redisClient, initDB };