#!/bin/bash

# Simple script to create an S3 bucket
# Usage: ./create-bucket.sh <bucket-name> <region>

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <bucket-name> <region>"
    echo "Example: $0 my-unique-bucket-name us-east-1"
    exit 1
fi

BUCKET_NAME=$1
REGION=$2

echo "Creating S3 bucket: $BUCKET_NAME in region: $REGION"

# Create the bucket
aws s3api create-bucket \
    --bucket $BUCKET_NAME \
    --region $REGION \
    --create-bucket-configuration LocationConstraint=$REGION

if [ $? -ne 0 ]; then
    echo "Error: Failed to create bucket"
    exit 1
fi

echo "Bucket created successfully!"
echo "Bucket name: $BUCKET_NAME"
echo "Region: $REGION"

# List bucket contents to verify
echo "Listing bucket contents..."
aws s3 ls s3://$BUCKET_NAME 