var connectionString = process.env.DATABASE_URL || 'postgres://tass-user:1234@localhost:5432/tass-dev';

module.exports = connectionString;
