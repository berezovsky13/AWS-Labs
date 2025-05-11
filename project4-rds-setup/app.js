const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'testdb'
};

// Create database connection
const connection = mysql.createConnection(dbConfig);

// Connect to database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database successfully');
});

// Middleware to parse JSON bodies
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the RDS Node.js API',
    endpoints: {
      root: 'GET /',
      health: 'GET /health',
      getUsers: 'GET /users',
      createUser: 'POST /users'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Get all users
app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Database error' });
      return;
    }
    res.json(results);
  });
});

// Create a new user
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }

  connection.query(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email],
    (err, results) => {
      if (err) {
        console.error('Error inserting into database:', err);
        res.status(500).json({ error: 'Database error' });
        return;
      }
      res.status(201).json({ id: results.insertId, name, email });
    }
  );
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
}); 