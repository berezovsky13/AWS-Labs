# AWS S3 Bucket Operations Project

This project demonstrates how to perform various operations on S3 buckets using AWS CLI and bash scripts.

## Prerequisites
- AWS CLI installed and configured
- AWS account with appropriate permissions
- Basic knowledge of Linux commands

## Project Structure
```
project2-s3-operations/
├── README.md
├── scripts/
│   ├── create-bucket.sh
│   ├── upload-file.sh
│   ├── download-file.sh
│   ├── list-objects.sh
│   └── delete-bucket.sh
└── config/
    └── bucket-policy.json
```

## Scripts Description

1. `create-bucket.sh`: Creates a new S3 bucket with specified configuration
2. `upload-file.sh`: Uploads files to an S3 bucket
3. `download-file.sh`: Downloads files from an S3 bucket
4. `list-objects.sh`: Lists all objects in a bucket
5. `delete-bucket.sh`: Deletes an S3 bucket and its contents

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
./scripts/create-bucket.sh <bucket-name>
./scripts/upload-file.sh <bucket-name> <file-path>
./scripts/download-file.sh <bucket-name> <object-key>
./scripts/list-objects.sh <bucket-name>
./scripts/delete-bucket.sh <bucket-name>
```

