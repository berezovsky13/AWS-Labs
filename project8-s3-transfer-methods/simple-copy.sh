#!/bin/bash

# Simple script to copy objects between S3 buckets
# Usage: ./simple-copy.sh <source-bucket> <destination-bucket>

# Check if both parameters are provided
if [ $# -ne 2 ]; then
    echo "Error: Missing required parameters"
    echo "Usage: ./simple-copy.sh <source-bucket> <destination-bucket>"
    exit 1
fi

SOURCE_BUCKET=$1
DEST_BUCKET=$2

echo "Starting copy operation..."
echo "Source bucket: $SOURCE_BUCKET"
echo "Destination bucket: $DEST_BUCKET"

# Copy objects from source to destination bucket
aws s3 cp "s3://$SOURCE_BUCKET/" "s3://$DEST_BUCKET/" --recursive

# Check if copy was successful
if [ $? -eq 0 ]; then
    echo "Copy completed successfully!"
else
    echo "Error: Copy operation failed"
    exit 1
fi 