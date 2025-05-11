# AWS Auto Scaling Group Project

This project demonstrates how to set up and manage Auto Scaling Groups with CPU-based scaling policies and load testing.

## Prerequisites
- AWS CLI installed and configured
- AWS account with appropriate permissions
- Basic knowledge of EC2 and CloudWatch
- VPC and subnet configuration

## Project Structure
```
project7-auto-scaling/
├── README.md
├── scripts/
│   ├── create-launch-template.sh
│   ├── create-auto-scaling-group.sh
│   ├── create-scaling-policies.sh
│   ├── load-test.sh
│   └── monitor-scaling.sh
├── config/
│   ├── launch-template.json
│   ├── auto-scaling-config.json
│   └── scaling-policies.json
└── monitoring/
    └── cloudwatch-dashboard.json
```

## Scripts Description

1. `create-launch-template.sh`: Creates a launch template for EC2 instances
2. `create-auto-scaling-group.sh`: Creates an Auto Scaling Group
3. `create-scaling-policies.sh`: Sets up CPU-based scaling policies
4. `load-test.sh`: Simulates high CPU load for testing
5. `monitor-scaling.sh`: Monitors Auto Scaling activities

## Usage

1. Make sure you have AWS credentials configured:
```bash
aws configure
```

2. Make scripts executable:
```bash
chmod +x scripts/*.sh
```

3. Run the scripts in sequence:
```bash
# Create launch template
./scripts/create-launch-template.sh

# Create Auto Scaling Group
./scripts/create-auto-scaling-group.sh <min-size> <max-size> <desired-capacity>

# Create scaling policies
./scripts/create-scaling-policies.sh

# Run load test (optional)
./scripts/load-test.sh <duration-minutes>

# Monitor scaling activities
./scripts/monitor-scaling.sh
```

## Scaling Configuration
- Target CPU Utilization: 70%
- Scale Out: Add 1 instance when CPU > 70%
- Scale In: Remove 1 instance when CPU < 30%
- Cooldown Period: 300 seconds
- Health Check Grace Period: 300 seconds

## Monitoring
- CloudWatch Dashboard for metrics
- CPU Utilization
- Request Count
- Target Response Time
- Auto Scaling Group metrics

## Security Best Practices
- Use launch templates for consistency
- Implement proper health checks
- Use appropriate instance types
- Configure security groups
- Enable detailed monitoring
- Set up CloudWatch alarms
- Use proper IAM roles 