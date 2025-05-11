# AWS SDK Python Method

This method uses the AWS SDK for Python (boto3) to programmatically transfer objects between S3 buckets.

## Features
- Multi-threaded transfer for better performance
- Detailed logging of transfer operations
- Error handling and retry logic
- Optional prefix filtering
- Verification of transfer completion
- Object count comparison

## Prerequisites
- Python 3.6 or higher
- boto3 package installed
- AWS credentials configured
- Appropriate permissions on both source and destination buckets
- Source and destination buckets must exist

## Installation

1. Install required packages:
```bash
pip install boto3
```

2. Configure AWS credentials:
```bash
aws configure
```

## Usage

Run the script:
```bash
# Transfer all objects
python transfer_objects.py source-bucket destination-bucket

# Transfer objects with specific prefix
python transfer_objects.py source-bucket destination-bucket folder/
```

## Example
```bash
# Transfer all objects from source-bucket to dest-bucket
python transfer_objects.py source-bucket dest-bucket

# Transfer only objects in the 'data/' folder
python transfer_objects.py source-bucket dest-bucket data/
```

## What the Script Does
1. Lists objects in the source bucket
2. Transfers objects using multiple threads
3. Logs progress and any errors
4. Verifies the transfer operation
5. Compares object counts between buckets

## Advantages
- Better performance through multi-threading
- Detailed logging and error reporting
- Programmatic control over the transfer process
- Can be integrated into larger applications
- Customizable transfer logic

## Limitations
- Requires Python environment setup
- More complex than CLI methods
- Requires proper error handling
- May need additional configuration for large transfers

## Best Practices
- Monitor memory usage for large transfers
- Adjust thread count based on system resources
- Implement proper error handling
- Use appropriate IAM permissions
- Consider implementing retry logic for failed transfers
- Monitor AWS CloudWatch for transfer metrics 