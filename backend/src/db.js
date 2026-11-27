const { Pool } = require('pg

cat > ~/marketplace/backend/src/db.js <<'EOF'
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    'postgresql://postgres@127.0.0.1:5432/marketplace',
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
