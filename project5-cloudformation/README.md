# AWS CloudFormation Learning Path

This project contains four CloudFormation templates that progress from simple to complex, helping you learn AWS CloudFormation step by step.

## Templates Overview

1. **templates/1-s3-bucket.yaml**
   - Creates a simple S3 bucket
   - Introduces basic CloudFormation concepts
   - Learn about: Resources, Properties, Outputs

2. **templates/2-ec2-instance.yaml**
   - Creates an EC2 instance with IAM role
   - Adds security group and user data
   - Learn about: Parameters, IAM roles, Security Groups

3. **templates/3-vpc-network.yaml**
   - Creates VPC and networking components
   - Sets up public subnet and internet gateway
   - Learn about: VPC, Subnets, Route Tables, Internet Gateway

4. **templates/4-complete-stack.yaml**
   - Combines all previous components
   - Creates a complete infrastructure
   - Learn about: Resource dependencies, Cross-referencing

## How to Use

Start with template 1 and progress through each template:

1. **Deploy S3 Bucket**
```bash
aws cloudformation create-stack \
  --stack-name my-s3-stack \
  --template-body file://templates/1-s3-bucket.yaml
```

2. **Deploy EC2 Instance**
```bash
aws cloudformation create-stack \
  --stack-name my-ec2-stack \
  --template-body file://templates/2-ec2-instance.yaml \
  --parameters ParameterKey=KeyName,ParameterValue=your-key-name \
  --capabilities CAPABILITY_IAM
```

3. **Deploy VPC Network**
```bash
aws cloudformation create-stack \
  --stack-name my-vpc-stack \
  --template-body file://templates/3-vpc-network.yaml
```

4. **Deploy Complete Stack**
```bash
aws cloudformation create-stack \
  --stack-name my-complete-stack \
  --template-body file://templates/4-complete-stack.yaml \
  --parameters ParameterKey=KeyName,ParameterValue=your-key-name \
  --capabilities CAPABILITY_IAM
```

## Prerequisites

1. AWS CLI installed and configured
2. An existing EC2 key pair in your AWS account
3. Basic understanding of AWS services

## Learning Objectives

- Understand CloudFormation template structure
- Learn about AWS resource types and properties
- Master CloudFormation functions and pseudo parameters
- Understand resource dependencies and references
- Learn about IAM roles and security groups
- Understand VPC networking concepts

## Cleanup

To delete each stack:
```bash
aws cloudformation delete-stack --stack-name my-s3-stack
aws cloudformation delete-stack --stack-name my-ec2-stack
aws cloudformation delete-stack --stack-name my-vpc-stack
aws cloudformation delete-stack --stack-name my-complete-stack
```

## Notes

- Each template builds upon the previous one
- Templates include comments explaining key concepts
- All resources are properly tagged for easy identification
- Security best practices are implemented throughout 