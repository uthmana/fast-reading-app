-- Grants the app user full rights on ONE production database.
-- Run as the MySQL root user (or a Plesk database admin) on the PRODUCTION server.
--
-- Before running, replace the placeholders:
--   <DB_NAME>      database the app uses (the one in DATABASE_URL)
--   <DB_USER>      MySQL user the app uses (the one in DATABASE_URL)
--   <DB_PASSWORD>  password for that user (must match DATABASE_URL on the server)
--
-- Run on the server:  mysql -u root -p < scripts/grant-prod-privileges.sql
-- Or paste into phpMyAdmin from Plesk (Databases -> phpMyAdmin).
--
-- Back up the database before running anything that changes its schema.

-- 1. Database (does nothing if it already exists)
CREATE DATABASE IF NOT EXISTS `<DB_NAME>` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. User (does nothing if it already exists)
CREATE USER IF NOT EXISTS '<DB_USER>'@'localhost' IDENTIFIED BY '<DB_PASSWORD>';

-- 3. Full rights on that database only. This includes CREATE, ALTER, DROP and INDEX,
--    which prisma db push / migrate deploy need. It does not include GRANT OPTION.
GRANT ALL PRIVILEGES ON `<DB_NAME>`.* TO '<DB_USER>'@'localhost';

-- 4. OPTIONAL: let the user create new databases whose names start with the app name.
--    Only needed if you want Prisma (migrate dev) to create its own databases.
--    The escaped underscore matters: an unescaped _ matches any single character.
--    Example: prefix fast_reading  ->  pattern fast\_reading\_%  matches fast_reading_shadow, etc.
--    Replace <DB_NAME_PREFIX> with the prefix, with each _ written as \_.
--    Uncomment to use. Avoid GRANT CREATE ON *.* on production, which allows any database.
-- GRANT ALL PRIVILEGES ON `<DB_NAME_PREFIX>\_%`.* TO '<DB_USER>'@'localhost';

FLUSH PRIVILEGES;

-- 5. Verify the result
SHOW GRANTS FOR '<DB_USER>'@'localhost';
