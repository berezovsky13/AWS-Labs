# AWS RDS Database Setup Project

This project demonstrates how to set up and manage Amazon RDS databases using AWS CLI and bash scripts.

## Prerequisites
- AWS CLI installed and configured
- AWS account with appropriate permissions
- Basic knowledge of database concepts
- VPC and subnet configuration

## Project Structure
```
project4-rds-setup/
├── README.md
├── scripts/
│   ├── create-db-instance.sh
│   ├── create-db-snapshot.sh
│   ├── restore-db-instance.sh
│   └── delete-db-instance.sh
├── sql/
│   ├── init.sql
│   └── sample-data.sql
└── config/
    ├── parameter-group.json
    └── option-group.json
```

## Scripts Description

1. `create-db-instance.sh`: Creates a new RDS database instance
2. `create-db-snapshot.sh`: Creates a snapshot of the database
3. `restore-db-instance.sh`: Restores a database from a snapshot
4. `delete-db-instance.sh`: Deletes a database instance

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
./scripts/create-db-instance.sh <db-instance-id> <db-name> <master-username> <master-password>
./scripts/create-db-snapshot.sh <db-instance-id> <snapshot-id>
./scripts/restore-db-instance.sh <snapshot-id> <new-db-instance-id>
./scripts/delete-db-instance.sh <db-instance-id>
```

## Security Best Practices
- Use strong passwords
- Enable encryption at rest
- Configure security groups properly
- Use private subnets
- Enable automated backups
- Use parameter groups for configuration
- Enable monitoring and logging
- Implement proper access controls 