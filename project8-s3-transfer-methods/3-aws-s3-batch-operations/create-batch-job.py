#!/usr/bin/env python3

import boto3
import sys
import time
import logging
from botocore.exceptions import ClientError

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def create_manifest_file(s3_client, source_bucket, manifest_bucket, prefix=''):
    """Create a manifest file for the batch operation."""
    try:
        # List objects in source bucket
        paginator = s3_client.get_paginator('list_objects_v2')
        pages = paginator.paginate(Bucket=source_bucket, Prefix=prefix)
        
        # Create manifest content
        manifest_content = "{\"entries\":[\n"
        first_entry = True
        
        for page in pages:
            if 'Contents' in page:
                for obj in page['Contents']:
                    if not first_entry:
                        manifest_content += ",\n"
                    manifest_content += f'{{"bucket": "{source_bucket}", "key": "{obj["Key"]}"}}'
                    first_entry = False
        
        manifest_content += "\n]}"
        
        # Upload manifest file
        manifest_key = f"batch-transfer-manifest-{int(time.time())}.json"
        s3_client.put_object(
            Bucket=manifest_bucket,
            Key=manifest_key,
            Body=manifest_content
        )
        
        return manifest_key
    except ClientError as e:
        logger.error(f"Error creating manifest file: {e}")
        sys.exit(1)

def create_batch_job(s3control_client, account_id, source_bucket, dest_bucket, manifest_bucket, manifest_key):
    """Create an S3 Batch Operations job."""
    try:
        response = s3control_client.create_job(
            AccountId=account_id,
            Operation={
                'S3PutObjectCopy': {
                    'TargetResource': f'arn:aws:s3:::{dest_bucket}'
                }
            },
            Report={
                'Bucket': f'arn:aws:s3:::{manifest_bucket}',
                'Prefix': 'batch-transfer-reports/',
                'Format': 'Report_CSV_20180820',
                'Enabled': True
            },
            Manifest={
                'Spec': {
                    'Format': 'S3BatchOperations_CSV_20180820',
                    'Fields': ['Bucket', 'Key']
                },
                'Location': {
                    'ObjectArn': f'arn:aws:s3:::{manifest_bucket}/{manifest_key}',
                    'ETag': s3_client.head_object(Bucket=manifest_bucket, Key=manifest_key)['ETag']
                }
            },
            Priority=1,
            RoleArn=f'arn:aws:iam::{account_id}:role/S3BatchOperationsRole'
        )
        
        return response['JobId']
    except ClientError as e:
        logger.error(f"Error creating batch job: {e}")
        sys.exit(1)

def monitor_job(s3control_client, account_id, job_id):
    """Monitor the progress of a batch job."""
    try:
        while True:
            response = s3control_client.describe_job(
                AccountId=account_id,
                JobId=job_id
            )
            
            status = response['Job']['Status']
            logger.info(f"Job status: {status}")
            
            if status in ['Complete', 'Failed', 'Cancelled']:
                break
                
            time.sleep(30)  # Check every 30 seconds
        
        return status
    except ClientError as e:
        logger.error(f"Error monitoring job: {e}")
        sys.exit(1)

def main():
    if len(sys.argv) < 4:
        print("Usage: python create-batch-job.py <source-bucket> <destination-bucket> <manifest-bucket> [prefix]")
        sys.exit(1)
    
    source_bucket = sys.argv[1]
    dest_bucket = sys.argv[2]
    manifest_bucket = sys.argv[3]
    prefix = sys.argv[4] if len(sys.argv) > 4 else ''
    
    # Initialize AWS clients
    s3_client = boto3.client('s3')
    s3control_client = boto3.client('s3control')
    
    # Get AWS account ID
    sts_client = boto3.client('sts')
    account_id = sts_client.get_caller_identity()['Account']
    
    logger.info(f"Starting batch transfer from {source_bucket} to {dest_bucket}")
    if prefix:
        logger.info(f"Using prefix: {prefix}")
    
    # Create manifest file
    logger.info("Creating manifest file...")
    manifest_key = create_manifest_file(s3_client, source_bucket, manifest_bucket, prefix)
    
    # Create batch job
    logger.info("Creating batch job...")
    job_id = create_batch_job(s3control_client, account_id, source_bucket, dest_bucket, manifest_bucket, manifest_key)
    
    # Monitor job progress
    logger.info(f"Monitoring job {job_id}...")
    status = monitor_job(s3control_client, account_id, job_id)
    
    if status == 'Complete':
        logger.info("Batch transfer completed successfully")
    else:
        logger.error(f"Batch transfer failed with status: {status}")
        sys.exit(1)

if __name__ == "__main__":
    main() 