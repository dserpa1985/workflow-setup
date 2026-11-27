const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    name: 'Marketplace API',
    status: 'running'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok'
  });
});

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 3000;

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
