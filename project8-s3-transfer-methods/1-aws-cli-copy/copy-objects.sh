#!/bin/bash

# Script to copy objects between S3 buckets using AWS CLI
# Usage: ./copy-objects.sh <source-bucket> <destination-bucket> [prefix]

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <source-bucket> <destination-bucket> [prefix]"
    echo "Example: $0 source-bucket dest-bucket folder/"
    exit 1
fi

SOURCE_BUCKET=$1
DEST_BUCKET=$2
PREFIX=${3:-""}  # Optional prefix, defaults to empty string

echo "Copying objects from s3://$SOURCE_BUCKET/$PREFIX to s3://$DEST_BUCKET/$PREFIX"

# List objects in source bucket
echo "Listing objects in source bucket..."
aws s3 ls "s3://$SOURCE_BUCKET/$PREFIX" --recursive

# Copy objects
echo "Starting copy operation..."
aws s3 cp "s3://$SOURCE_BUCKET/$PREFIX" "s3://$DEST_BUCKET/$PREFIX" --recursive

if [ $? -eq 0 ]; then
    echo "Copy completed successfully!"
    
    # Verify copy by listing destination bucket
    echo "Verifying objects in destination bucket..."
    aws s3 ls "s3://$DEST_BUCKET/$PREFIX" --recursive
else
    echo "Error: Copy operation failed"
    exit 1
fi

# Optional: Compare object counts
SOURCE_COUNT=$(aws s3 ls "s3://$SOURCE_BUCKET/$PREFIX" --recursive | wc -l)
DEST_COUNT=$(aws s3 ls "s3://$DEST_BUCKET/$PREFIX" --recursive | wc -l)

echo "Source bucket object count: $SOURCE_COUNT"
echo "Destination bucket object count: $DEST_COUNT"

if [ "$SOURCE_COUNT" -eq "$DEST_COUNT" ]; then
    echo "Verification successful: Object counts match"
else
    echo "Warning: Object counts do not match"
fi 