# AWS EC2 Instance Management Project

This project demonstrates how to manage EC2 instances using AWS CLI and bash scripts.

## Prerequisites
- AWS CLI installed and configured
- AWS account with appropriate permissions
- Basic knowledge of Linux commands

## Project Structure
```
project1-ec2-management/
├── README.md
├── scripts/
│   ├── create-instance.sh
│   ├── list-instances.sh
│   ├── stop-instance.sh
│   └── terminate-instance.sh
└── config/
    └── user-data.sh
```

## Scripts Description

1. `create-instance.sh`: Creates a new EC2 instance with specified parameters
2. `list-instances.sh`: Lists all running EC2 instances
3. `stop-instance.sh`: Stops a specified EC2 instance
4. `terminate-instance.sh`: Terminates a specified EC2 instance

## Usage

1. Make sure you have AWS credentials configured:
```bash
aws configure
```

2. Make scripts executable:
```bash
chmod +x scripts/*.sh
```

3. Run the scripts as needed:
```bash
./scripts/create-instance.sh
./scripts/list-instances.sh
./scripts/stop-instance.sh <instance-id>
./scripts/terminate-instance.sh <instance-id>
```

## Security Best Practices
- Always use IAM roles with least privilege
- Keep your AWS credentials secure
- Use security groups to restrict access
- Regularly update your instances 