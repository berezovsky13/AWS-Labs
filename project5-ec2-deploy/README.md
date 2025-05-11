# Node.js Application Deployment to EC2

This project demonstrates how to deploy a simple Node.js application to an EC2 instance using GitHub Actions CI/CD pipeline.

## Prerequisites

1. EC2 Instance Setup:
   - Launch an EC2 instance (Ubuntu recommended)
   - Install Node.js:
     ```bash
     curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
     sudo apt-get install -y nodejs
     ```
   - Install npm:
     ```bash
     sudo apt-get install -y npm
     ```

2. GitHub Repository Setup:
   - Create a new repository
   - Add the following secrets in your GitHub repository settings:
     - `AWS_ACCESS_KEY_ID`: Your AWS access key
     - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
     - `AWS_REGION`: Your AWS region (e.g., us-east-1)
     - `EC2_HOST`: Your EC2 instance public IP or DNS
     - `EC2_USERNAME`: Your EC2 instance username (e.g., ubuntu)
     - `EC2_SSH_KEY`: Your EC2 instance private SSH key

3. Security Group Configuration:
   - Allow inbound traffic on port 3000 (Node.js app)
   - Allow inbound traffic on port 22 (SSH)

## Project Structure
```
project5-ec2-deploy/
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions workflow
├── app/
│   ├── app.js           # Main application file
│   ├── package.json     # Node.js dependencies
│   ├── public/          # Static files
│   │   └── index.html   # Frontend page
│   └── node-app.service # Systemd service file
└── README.md           # This file
```

## Local Development

1. Install dependencies:
```bash
cd app
npm install
```

2. Run the application:
```bash
npm start
```

3. Access the application at `http://localhost:3000`

## Deployment

The application will be automatically deployed when you push to the main branch. The deployment process:

1. Copies files to EC2
2. Installs dependencies
3. Sets up systemd service
4. Starts the application

## Manual Deployment

If you need to deploy manually:

1. Copy files to EC2:
```bash
scp -r app/* user@your-ec2-host:/tmp/app/
```

2. SSH into EC2 and deploy:
```bash
ssh user@your-ec2-host
sudo mkdir -p /home/ubuntu/app
sudo cp -r /tmp/app/* /home/ubuntu/app/
sudo chown -R ubuntu:ubuntu /home/ubuntu/app
cd /home/ubuntu/app
npm install --production
sudo cp node-app.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable node-app
sudo systemctl restart node-app
```

## Troubleshooting

1. Check application logs:
```bash
sudo journalctl -u node-app -f
```

2. Check application status:
```bash
sudo systemctl status node-app
```

3. Check Node.js version:
```bash
node --version
npm --version
```

## Security Considerations

1. Use HTTPS in production
2. Configure proper firewall rules
3. Keep Node.js and npm updated
4. Use proper file permissions
5. Consider using PM2 for process management
6. Implement proper error handling and logging 