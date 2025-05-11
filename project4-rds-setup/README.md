# RDS Node.js Application

This project demonstrates how to connect a Node.js application to an Amazon RDS MySQL database.

## Prerequisites

- Node.js installed on your EC2 instance
- MySQL RDS instance running
- Security group configured to allow MySQL traffic (port 3306)

## Setup Instructions

1. Create an RDS MySQL instance in AWS:
   - Choose MySQL as the engine
   - Select appropriate instance size
   - Configure security group to allow MySQL traffic
   - Note down the endpoint, username, and password

2. Set up the database:
   ```bash
   mysql -h your-rds-endpoint -u admin -p < setup.sql
   ```

3. Install Node.js dependencies:
   ```bash
   npm install
   ```

4. Configure environment variables:
   - Update the `node-app.service` file with your RDS endpoint and credentials
   - Or set environment variables directly:
     ```bash
     export DB_HOST=your-rds-endpoint
     export DB_USER=admin
     export DB_PASSWORD=your-password
     export DB_NAME=testdb
     ```

5. Start the application:
   ```bash
   # For testing
   npm start

   # For production (using systemd)
   sudo cp node-app.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable node-app
   sudo systemctl start node-app
   ```

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /users` - Get all users
- `POST /users` - Create a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```

## Security Considerations

1. Never commit sensitive information like database credentials
2. Use environment variables for configuration
3. Ensure RDS security group only allows traffic from your EC2 instance
4. Use strong passwords for database access
5. Consider using AWS Secrets Manager for credential management

## Troubleshooting

1. Check application logs:
   ```bash
   sudo journalctl -u node-app
   ```

2. Verify database connection:
   ```bash
   mysql -h your-rds-endpoint -u admin -p
   ```

3. Check security group settings in AWS Console

4. Verify environment variables:
   ```bash
   sudo systemctl status node-app
   ``` 