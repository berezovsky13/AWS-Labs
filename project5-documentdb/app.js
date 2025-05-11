const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// DocumentDB connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 27017,
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'documentdb-demo'
};

// Create MongoDB connection string
const connectionString = `mongodb://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false`;

console.log('Database configuration:', {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database
});

// Connect to DocumentDB with improved options
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  sslValidate: false, // Required for DocumentDB
  sslCA: process.env.CA_CERT_PATH, // Path to CA certificate if needed
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  socketTimeoutMS: 45000, // Increase socket timeout
  connectTimeoutMS: 30000, // Increase connection timeout
  maxPoolSize: 10, // Maximum number of connections in the pool
  minPoolSize: 5, // Minimum number of connections in the pool
  retryWrites: false, // Required for DocumentDB
  retryReads: true,
  w: 'majority', // Write concern
  wtimeoutMS: 25000 // Write concern timeout
})
.then(() => {
  console.log('Connected to DocumentDB successfully');
})
.catch((err) => {
  console.error('Error connecting to DocumentDB:', err);
  console.error('Connection string (without password):', connectionString.replace(dbConfig.password, '****'));
  console.error('SSL CA Path:', process.env.CA_CERT_PATH);
});

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DocumentDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from DocumentDB');
});

// Define User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

// Create User Model
const User = mongoose.model('User', userSchema);

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
        <title>DocumentDB Node.js Application</title>
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
                <h1 class="text-4xl font-bold text-white mb-4">DocumentDB Node.js Application</h1>
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
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'healthy',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }

    console.log('Fetching users...');
    const users = await User.find().sort({ createdAt: -1 });
    console.log('Users fetched successfully:', users);
    res.json(users);
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).json({ 
      error: 'Database error: ' + err.message,
      details: err.stack
    });
  }
});

// Create a new user
app.post('/users', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }

    const { name, email } = req.body;
    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required' });
      return;
    }

    console.log('Creating new user:', { name, email });
    const user = new User({ name, email });
    const savedUser = await user.save();
    console.log('User created successfully:', savedUser);
    res.status(201).json(savedUser);
  } catch (err) {
    console.error('Error inserting into database:', err);
    res.status(500).json({ 
      error: 'Database error: ' + err.message,
      details: err.stack
    });
  }
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
}); 