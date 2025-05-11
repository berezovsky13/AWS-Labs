#!/bin/bash

# Script to create CPU-based scaling policies for Auto Scaling Group
# Usage: ./create-scaling-policies.sh <auto-scaling-group-name>

if [ -z "$1" ]; then
    echo "Usage: $0 <auto-scaling-group-name>"
    exit 1
fi

ASG_NAME=$1

# Create CloudWatch Alarm for High CPU
echo "Creating CloudWatch Alarm for High CPU..."
aws cloudwatch put-metric-alarm \
    --alarm-name "${ASG_NAME}-HighCPU" \
    --alarm-description "Alarm when CPU exceeds 70%" \
    --metric-name CPUUtilization \
    --namespace AWS/EC2 \
    --statistic Average \
    --period 60 \
    --threshold 70 \
    --comparison-operator GreaterThanThreshold \
    --dimensions "Name=AutoScalingGroupName,Value=${ASG_NAME}" \
    --evaluation-periods 2 \
    --alarm-actions $(aws autoscaling put-scaling-policy \
        --auto-scaling-group-name ${ASG_NAME} \
        --policy-name "${ASG_NAME}-ScaleOut" \
        --policy-type SimpleScaling \
        --adjustment-type ChangeInCapacity \
        --scaling-adjustment 1 \
        --cooldown 300 \
        --query 'PolicyARN' \
        --output text)

# Create CloudWatch Alarm for Low CPU
echo "Creating CloudWatch Alarm for Low CPU..."
aws cloudwatch put-metric-alarm \
    --alarm-name "${ASG_NAME}-LowCPU" \
    --alarm-description "Alarm when CPU drops below 30%" \
    --metric-name CPUUtilization \
    --namespace AWS/EC2 \
    --statistic Average \
    --period 60 \
    --threshold 30 \
    --comparison-operator LessThanThreshold \
    --dimensions "Name=AutoScalingGroupName,Value=${ASG_NAME}" \
    --evaluation-periods 2 \
    --alarm-actions $(aws autoscaling put-scaling-policy \
        --auto-scaling-group-name ${ASG_NAME} \
        --policy-name "${ASG_NAME}-ScaleIn" \
        --policy-type SimpleScaling \
        --adjustment-type ChangeInCapacity \
        --scaling-adjustment -1 \
        --cooldown 300 \
        --query 'PolicyARN' \
        --output text)

echo "Scaling policies created successfully!"
echo "Scale Out: Add 1 instance when CPU > 70%"
echo "Scale In: Remove 1 instance when CPU < 30%"
echo "Cooldown period: 300 seconds" 