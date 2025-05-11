#!/bin/bash

# Script to upload a file to S3 bucket
# Usage: ./upload-file.sh <file-path> <bucket-name>

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <file-path> <bucket-name>"
    echo "Example: $0 sample.txt my-bucket"
    exit 1
fi

FILE_PATH=$1
BUCKET_NAME=$2

# Check if file exists
if [ ! -f "$FILE_PATH" ]; then
    echo "Error: File '$FILE_PATH' does not exist"
    exit 1
fi

echo "Uploading file '$FILE_PATH' to bucket '$BUCKET_NAME'..."

# Upload the file
aws s3 cp "$FILE_PATH" "s3://$BUCKET_NAME/"

if [ $? -eq 0 ]; then
    echo "File uploaded successfully!"
    echo "File location: s3://$BUCKET_NAME/$(basename $FILE_PATH)"
else
    echo "Error: Failed to upload file"
    exit 1
fi

# List the bucket contents to verify
echo "Listing bucket contents..."
aws s3 ls "s3://$BUCKET_NAME/" 