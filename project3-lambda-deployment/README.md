# AWS Lambda Function Deployment Project

This project demonstrates how to deploy and manage AWS Lambda functions using AWS CLI and bash scripts.

## Prerequisites
- AWS CLI installed and configured
- AWS account with appropriate permissions
- Node.js installed (for JavaScript/TypeScript functions)
- Python installed (for Python functions)

## Project Structure
```
project3-lambda-deployment/
├── README.md
├── scripts/
│   ├── create-function.sh
│   ├── update-function.sh
│   ├── invoke-function.sh
│   └── delete-function.sh
├── functions/
│   ├── python/
│   │   └── hello_world/
│   │       ├── lambda_function.py
│   │       └── requirements.txt
│   └── nodejs/
│       └── hello_world/
│           ├── index.js
│           └── package.json
└── config/
    └── lambda-role-policy.json
```

## Scripts Description

1. `create-function.sh`: Creates a new Lambda function
2. `update-function.sh`: Updates an existing Lambda function
3. `invoke-function.sh`: Invokes a Lambda function
4. `delete-function.sh`: Deletes a Lambda function

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
./scripts/create-function.sh <function-name> <runtime> <handler>
./scripts/update-function.sh <function-name>
./scripts/invoke-function.sh <function-name>
./scripts/delete-function.sh <function-name>
```

## Security Best Practices
- Use IAM roles with least privilege
- Enable function encryption
- Use environment variables for sensitive data
- Implement proper error handling
- Set up CloudWatch logging
- Use VPC if needed for private resources 