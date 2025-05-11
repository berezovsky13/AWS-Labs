#!/usr/bin/env python3

import boto3
import sys
import os
from botocore.exceptions import ClientError
from concurrent.futures import ThreadPoolExecutor
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def list_objects(s3_client, bucket, prefix=''):
    """List objects in the specified bucket with optional prefix."""
    try:
        paginator = s3_client.get_paginator('list_objects_v2')
        pages = paginator.paginate(Bucket=bucket, Prefix=prefix)
        objects = []
        for page in pages:
            if 'Contents' in page:
                objects.extend([obj['Key'] for obj in page['Contents']])
        return objects
    except ClientError as e:
        logger.error(f"Error listing objects in bucket {bucket}: {e}")
        sys.exit(1)

def copy_object(s3_client, source_bucket, dest_bucket, key):
    """Copy a single object from source to destination bucket."""
    try:
        copy_source = {'Bucket': source_bucket, 'Key': key}
        s3_client.copy_object(
            CopySource=copy_source,
            Bucket=dest_bucket,
            Key=key
        )
        logger.info(f"Copied {key} successfully")
        return True
    except ClientError as e:
        logger.error(f"Error copying {key}: {e}")
        return False

def transfer_objects(source_bucket, dest_bucket, prefix='', max_workers=10):
    """Transfer objects between buckets using multiple threads."""
    s3_client = boto3.client('s3')
    
    # List objects in source bucket
    logger.info(f"Listing objects in source bucket {source_bucket}")
    objects = list_objects(s3_client, source_bucket, prefix)
    
    if not objects:
        logger.warning(f"No objects found in {source_bucket} with prefix {prefix}")
        return
    
    logger.info(f"Found {len(objects)} objects to transfer")
    
    # Copy objects using thread pool
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [
            executor.submit(copy_object, s3_client, source_bucket, dest_bucket, key)
            for key in objects
        ]
        
        # Wait for all copies to complete
        results = [future.result() for future in futures]
    
    # Verify transfer
    source_count = len(objects)
    dest_count = len(list_objects(s3_client, dest_bucket, prefix))
    
    logger.info(f"Transfer complete:")
    logger.info(f"Source bucket objects: {source_count}")
    logger.info(f"Destination bucket objects: {dest_count}")
    
    if source_count == dest_count:
        logger.info("Verification successful: Object counts match")
    else:
        logger.error("Verification failed: Object counts do not match")
        sys.exit(1)

def main():
    if len(sys.argv) < 3:
        print("Usage: python transfer_objects.py <source-bucket> <destination-bucket> [prefix]")
        sys.exit(1)
    
    source_bucket = sys.argv[1]
    dest_bucket = sys.argv[2]
    prefix = sys.argv[3] if len(sys.argv) > 3 else ''
    
    logger.info(f"Starting transfer from {source_bucket} to {dest_bucket}")
    if prefix:
        logger.info(f"Using prefix: {prefix}")
    
    transfer_objects(source_bucket, dest_bucket, prefix)

if __name__ == "__main__":
    main() 