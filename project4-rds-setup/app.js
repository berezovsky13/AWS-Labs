const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Initial connection config (without database)
const initialConfig = {
  host: 'database-1.ctoc2qsmye19.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '12345678'
};

// Final connection config (with database)
const dbConfig = {
  ...initialConfig,
  database: 'database-1'
};

console.log('Database configuration:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database
});

// Create initial connection without database
const initialConnection = mysql.createConnection(initialConfig);

// Connect and create database if it doesn't exist
initialConnection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL server:', err);
    return;
  }
  console.log('Connected to MySQL server successfully');

  // Create database if it doesn't exist
  initialConnection.query('CREATE DATABASE IF NOT EXISTS `database-1`', (err) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    console.log('Database created or already exists');

    // Create users table
    initialConnection.query('USE `database-1`', (err) => {
      if (err) {
        console.error('Error selecting database:', err);
        return;
      }

      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      initialConnection.query(createTableQuery, (err) => {
        if (err) {
          console.error('Error creating users table:', err);
          return;
        }
        console.log('Users table created or already exists');
        
        // Close initial connection
        initialConnection.end();

        // Create new connection with database
        const connection = mysql.createConnection(dbConfig);
        
        // Connect to database
        connection.connect((err) => {
          if (err) {
            console.error('Error connecting to database:', err);
            return;
          }
          console.log('Connected to database successfully');
          
          // Test the connection with a simple query
          connection.query('SHOW TABLES', (err, results) => {
            if (err) {
              console.error('Error checking tables:', err);
              return;
            }
            console.log('Available tables:', results);
          });
        });

        // Handle database connection errors
        connection.on('error', (err) => {
          console.error('Database error:', err);
          if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Attempting to reconnect to database...');
            connection.connect();
          } else {
            throw err;
          }
        });

        // Make connection available globally
        global.connection = connection;
      });
    });
  });
});

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Root endpoint - serve HTML
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>RDS Node.js Application</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <style>
            .gradient-bg {
                background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
            }
            .card {
                backdrop-filter: blur(10px);
                background-color: rgba(255, 255, 255, 0.8);
            }
        </style>
    </head>
    <body class="gradient-bg min-h-screen">
        <div class="container mx-auto px-4 py-8">
            <div class="text-center mb-12">
                <h1 class="text-4xl font-bold text-white mb-4">RDS Node.js Application</h1>
                <p class="text-xl text-white">A beautiful interface for managing users</p>
            </div>

            <!-- Add User Form -->
            <div class="card rounded-lg shadow-xl p-6 mb-8">
                <h2 class="text-2xl font-semibold mb-4">Add New User</h2>
                <form id="userForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" id="name" name="name" required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" name="email" required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    </div>
                    <button type="submit"
                        class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Add User
                    </button>
                </form>
            </div>

            <!-- Users List -->
            <div class="card rounded-lg shadow-xl p-6">
                <h2 class="text-2xl font-semibold mb-4">Users List</h2>
                <div id="usersList" class="space-y-4">
                    <!-- Users will be loaded here -->
                </div>
            </div>
        </div>

        <script>
            // Function to load users
            async function loadUsers() {
                try {
                    const response = await fetch('/users');
                    if (!response.ok) {
                        throw new Error('Failed to load users: ' + response.status);
                    }
                    const users = await response.json();
                    const usersList = document.getElementById('usersList');
                    usersList.innerHTML = users.map(user => 
                        '<div class="bg-white p-4 rounded-lg shadow">' +
                        '<h3 class="font-semibold">' + user.name + '</h3>' +
                        '<p class="text-gray-600">' + user.email + '</p>' +
                        '</div>'
                    ).join('');
                } catch (error) {
                    console.error('Error loading users:', error);
                    document.getElementById('usersList').innerHTML = 
                        '<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">' +
                        'Error loading users. Please try again later.' +
                        '</div>';
                }
            }

            // Function to add user
            async function addUser(event) {
                event.preventDefault();
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;

                try {
                    const response = await fetch('/users', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ name, email }),
                    });

                    if (response.ok) {
                        document.getElementById('userForm').reset();
                        loadUsers();
                    } else {
                        const error = await response.json();
                        alert(error.error || 'Error adding user');
                    }
                } catch (error) {
                    console.error('Error adding user:', error);
                    alert('Error adding user');
                }
            }

            // Event listeners
            document.getElementById('userForm').addEventListener('submit', addUser);

            // Load users on page load
            loadUsers();
        </script>
    </body>
    </html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Get all users
app.get('/users', (req, res) => {
  if (!global.connection) {
    res.status(500).json({ error: 'Database connection not established' });
    return;
  }

  console.log('Fetching users...');
  global.connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Database error: ' + err.message });
      return;
    }
    console.log('Users fetched successfully:', results);
    res.json(results);
  });
});

// Create a new user
app.post('/users', (req, res) => {
  if (!global.connection) {
    res.status(500).json({ error: 'Database connection not established' });
    return;
  }

  const { name, email } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }

  console.log('Creating new user:', { name, email });
  global.connection.query(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email],
    (err, results) => {
      if (err) {
        console.error('Error inserting into database:', err);
        res.status(500).json({ error: 'Database error: ' + err.message });
        return;
      }
      console.log('User created successfully:', results);
      res.status(201).json({ id: results.insertId, name, email });
    }
  );
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
}); 