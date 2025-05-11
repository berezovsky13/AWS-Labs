# AWS CLI Copy Method

This method uses the AWS CLI `s3 cp` command to copy objects between S3 buckets.

## Features
- Simple and straightforward copying
- Supports recursive copying of directories
- Optional prefix filtering
- Verification of copy operation
- Object count comparison

## Prerequisites
- AWS CLI installed and configured
- Appropriate permissions on both source and destination buckets
- Source and destination buckets must exist

## Usage

1. Make the script executable:
```bash
chmod +x copy-objects.sh
```

2. Run the script:
```bash
# Copy all objects
./copy-objects.sh source-bucket destination-bucket

# Copy objects with specific prefix
./copy-objects.sh source-bucket destination-bucket folder/
```

## Example
```bash
# Copy all objects from source-bucket to dest-bucket
./copy-objects.sh source-bucket dest-bucket

# Copy only objects in the 'data/' folder
./copy-objects.sh source-bucket dest-bucket data/
```

## What the Script Does
1. Lists objects in the source bucket
2. Copies objects to the destination bucket
3. Verifies the copy operation
4. Compares object counts between buckets

## Limitations
- Not suitable for very large transfers (consider S3 Batch Operations)
- No built-in retry mechanism
- Single-threaded operation
- No progress indicator for large transfers

## Best Practices
- Use for small to medium transfers
- Verify object counts after transfer
- Consider using `--dryrun` option for testing
- Monitor AWS CloudWatch for transfer metrics 