// Test environment. Uses TEST_MONGODB_URI (a replica set is recommended so transactions work).
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = process.env.LOG_LEVEL ?? 'silent';
process.env.MONGODB_URI = process.env.TEST_MONGODB_URI ?? 'mongodb://localhost:27017/enatega_test?directConnection=true';
process.env.JWT_SECRET = 'test-jwt-secret-0123456789abcdef0123456789';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-0123456789abcdef01234';
process.env.ENCRYPTION_KEY = 'a'.repeat(64);
process.env.PUBLIC_API_URL = 'http://localhost:0';
process.env.JOBS_ENABLED = 'false';
process.env.AUTH_RATE_LIMIT_MAX = '1000';
process.env.RATE_LIMIT_MAX = '100000';
delete process.env.REDIS_URL;
