# S3 Transfer Methods Project

This project demonstrates different ways to transfer objects between S3 buckets.

## Methods Covered

1. **AWS CLI Copy**
   - Direct copy using `aws s3 cp` command
   - Simple and straightforward
   - Good for small to medium transfers

2. **AWS CLI Sync**
   - Synchronizes contents between buckets
   - Only copies changed files
   - Maintains directory structure
   - Good for ongoing synchronization

3. **AWS S3 Batch Operations**
   - Handles large-scale transfers
   - Supports parallel processing
   - Good for millions of objects
   - Requires S3 Batch Operations setup

4. **AWS SDK (Python)**
   - Programmatic transfer using boto3
   - Custom transfer logic
   - Good for complex transfer requirements
   - Supports multipart uploads

5. **AWS DataSync**
   - Managed transfer service
   - Handles large datasets
   - Built-in validation
   - Good for enterprise transfers

## Project Structure
```
project8-s3-transfer-methods/
├── README.md
├── 1-aws-cli-copy/
│   ├── copy-objects.sh
│   └── README.md
├── 2-aws-cli-sync/
│   ├── sync-buckets.sh
│   └── README.md
├── 3-s3-batch-operations/
│   ├── create-batch-job.sh
│   ├── monitor-batch-job.sh
│   └── README.md
├── 4-aws-sdk-python/
│   ├── transfer_objects.py
│   ├── requirements.txt
│   └── README.md
└── 5-aws-datasync/
    ├── setup-datasync.sh
    ├── create-transfer-task.sh
    └── README.md
```

## Prerequisites
- AWS CLI installed and configured
- Python 3.x (for SDK method)
- Appropriate AWS permissions
- Source and destination buckets created

## Usage
Each method has its own directory with specific instructions and scripts.
Follow the README in each directory for detailed usage instructions. 