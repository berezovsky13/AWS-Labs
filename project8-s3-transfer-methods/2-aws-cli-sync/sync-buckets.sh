#!/bin/bash

# Usage: ./sync-buckets.sh <source-bucket> <destination-bucket> [prefix]

# Check if required parameters are provided
if [ $# -lt 2 ]; then
    echo "Error: Missing required parameters"
    echo "Usage: ./sync-buckets.sh <source-bucket> <destination-bucket> [prefix]"
    exit 1
fi

SOURCE_BUCKET=$1
DEST_BUCKET=$2
PREFIX=${3:-""}  # Optional prefix, defaults to empty string

echo "Starting bucket synchronization..."
echo "Source bucket: $SOURCE_BUCKET"
echo "Destination bucket: $DEST_BUCKET"
if [ ! -z "$PREFIX" ]; then
    echo "Prefix: $PREFIX"
fi

# List objects in source bucket before sync
echo "Listing objects in source bucket before sync..."
aws s3 ls "s3://$SOURCE_BUCKET/$PREFIX" --recursive

# Perform the sync operation
echo "Syncing objects from source to destination..."
aws s3 sync "s3://$SOURCE_BUCKET/$PREFIX" "s3://$DEST_BUCKET/$PREFIX"

# Check if sync was successful
if [ $? -eq 0 ]; then
    echo "Sync completed successfully"
else
    echo "Error: Sync operation failed"
    exit 1
fi

# List objects in destination bucket after sync
echo "Listing objects in destination bucket after sync..."
aws s3 ls "s3://$DEST_BUCKET/$PREFIX" --recursive

# Compare object counts
SOURCE_COUNT=$(aws s3 ls "s3://$SOURCE_BUCKET/$PREFIX" --recursive | wc -l)
DEST_COUNT=$(aws s3 ls "s3://$DEST_BUCKET/$PREFIX" --recursive | wc -l)

echo "Object count comparison:"
echo "Source bucket: $SOURCE_COUNT objects"
echo "Destination bucket: $DEST_COUNT objects"

if [ "$SOURCE_COUNT" -eq "$DEST_COUNT" ]; then
    echo "Verification successful: Object counts match"
else
    echo "Warning: Object counts do not match"
    exit 1
fi 