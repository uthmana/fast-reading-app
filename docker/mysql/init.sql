-- Create shadow database for Prisma
CREATE DATABASE IF NOT EXISTS fast_reading_shadowdb;

-- Grant full access to main DB
GRANT ALL PRIVILEGES ON fast_reading_db.* 
TO 'fast_reading_db'@'%';

-- Grant full access to shadow DB
GRANT ALL PRIVILEGES ON fast_reading_shadowdb.* 
TO 'fast_reading_db'@'%';

FLUSH PRIVILEGES;
