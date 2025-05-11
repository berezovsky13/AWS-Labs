# AWS CLI Sync Method

This method uses the AWS CLI `s3 sync` command to synchronize contents between S3 buckets.

## Features
- Incremental synchronization
- Only copies changed or new files
- Maintains directory structure
- Optional prefix filtering
- Verification of sync operation
- Object count comparison

## Prerequisites
- AWS CLI installed and configured
- Appropriate permissions on both source and destination buckets
- Source and destination buckets must exist

## Usage

1. Make the script executable:
```bash
chmod +x sync-buckets.sh
```

2. Run the script:
```bash
# Sync all objects
./sync-buckets.sh source-bucket destination-bucket

# Sync objects with specific prefix
./sync-buckets.sh source-bucket destination-bucket folder/
```

## Example
```bash
# Sync all objects from source-bucket to dest-bucket
./sync-buckets.sh source-bucket dest-bucket

# Sync only objects in the 'data/' folder
./sync-buckets.sh source-bucket dest-bucket data/
```

## What the Script Does
1. Lists objects in the source bucket
2. Synchronizes objects to the destination bucket
3. Verifies the sync operation
4. Compares object counts between buckets

## Advantages Over Copy
- Only transfers changed files
- More efficient for incremental updates
- Maintains consistency between buckets
- Better for ongoing synchronization

## Limitations
- May take longer for initial sync
- Requires more IAM permissions
- No built-in retry mechanism
- Single-threaded operation

## Best Practices
- Use for ongoing synchronization
- Verify object counts after sync
- Consider using `--dryrun` option for testing
- Monitor AWS CloudWatch for sync metrics
- Use appropriate IAM permissions 