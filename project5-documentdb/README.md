# DocumentDB Node.js Application

This is a Node.js application that demonstrates how to use Amazon DocumentDB (MongoDB compatible) with a simple user management interface.

## Prerequisites

1. Node.js and npm installed
2. Amazon DocumentDB cluster created
3. EC2 instance with Node.js installed
4. Security groups configured to allow traffic between EC2 and DocumentDB

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Download the Amazon DocumentDB certificate:
   ```bash
   wget https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem -O rds-combined-ca-bundle.pem
   ```

3. Update the environment variables in `node-app.service` with your DocumentDB endpoint and credentials:
   ```
   Environment=DB_HOST=your-documentdb-endpoint
   Environment=DB_PASSWORD=your-password
   ```

4. Install and start the service:
   ```bash
   sudo cp node-app.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable node-app
   sudo systemctl start node-app
   ```

5. Check the service status:
   ```bash
   sudo systemctl status node-app
   ```

## Security Considerations

1. Make sure your EC2 security group allows outbound traffic to DocumentDB (port 27017)
2. Make sure your DocumentDB security group allows inbound traffic from your EC2 instance
3. Store sensitive information (passwords, endpoints) in environment variables or AWS Secrets Manager
4. Use SSL/TLS for all database connections

## Application Features

- User management interface
- Add new users
- View all users
- Health check endpoint
- Modern UI with Tailwind CSS
- Error handling and logging

## API Endpoints

- `GET /`: Main application interface
- `GET /health`: Health check endpoint
- `GET /users`: Get all users
- `POST /users`: Create a new user

## Troubleshooting

1. Check application logs:
   ```bash
   sudo journalctl -u node-app -f
   ```

2. Verify DocumentDB connection:
   ```bash
   mongo --ssl --host your-documentdb-endpoint:27017 --sslCAFile rds-combined-ca-bundle.pem --username admin --password your-password
   ```

3. Common issues:
   - SSL/TLS connection issues: Make sure the CA certificate is properly downloaded and referenced
   - Network connectivity: Verify security group rules
   - Authentication: Check username and password
   - Database access: Ensure the user has proper permissions 