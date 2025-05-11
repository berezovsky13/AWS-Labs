#!/bin/bash

# Script to simulate high CPU load for testing Auto Scaling Group
# Usage: ./load-test.sh <duration-minutes> <instance-id>

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <duration-minutes> <instance-id>"
    exit 1
fi

DURATION=$1
INSTANCE_ID=$2

echo "Starting CPU load test for $DURATION minutes on instance $INSTANCE_ID"

# Create a temporary script to generate CPU load
cat > /tmp/cpu_load.sh << 'EOF'
#!/bin/bash
while true; do
    # Generate CPU load using dd and /dev/zero
    dd if=/dev/zero of=/dev/null &
    # Wait for 1 second
    sleep 1
    # Kill the dd process
    pkill dd
done
EOF

# Make the script executable
chmod +x /tmp/cpu_load.sh

# Copy the script to the instance
echo "Copying load test script to instance..."
aws ssm send-command \
    --instance-ids $INSTANCE_ID \
    --document-name "AWS-RunShellScript" \
    --parameters "commands=['chmod +x /tmp/cpu_load.sh']" \
    --output-s3-bucket-name "your-bucket-name" \
    --output-s3-key-prefix "load-test"

# Start the load test
echo "Starting load test..."
aws ssm send-command \
    --instance-ids $INSTANCE_ID \
    --document-name "AWS-RunShellScript" \
    --parameters "commands=['nohup /tmp/cpu_load.sh > /dev/null 2>&1 &']" \
    --output-s3-bucket-name "your-bucket-name" \
    --output-s3-key-prefix "load-test"

# Wait for the specified duration
echo "Waiting for $DURATION minutes..."
sleep $(($DURATION * 60))

# Stop the load test
echo "Stopping load test..."
aws ssm send-command \
    --instance-ids $INSTANCE_ID \
    --document-name "AWS-RunShellScript" \
    --parameters "commands=['pkill -f cpu_load.sh']" \
    --output-s3-bucket-name "your-bucket-name" \
    --output-s3-key-prefix "load-test"

echo "Load test completed!"
echo "Check CloudWatch metrics to see the Auto Scaling Group response" 