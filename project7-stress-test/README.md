# 🚀 Stress Testing Script

This is a simple stress testing script for Node.js applications using the `autocannon` library.

## 📋 Features

- Tests multiple endpoints simultaneously
- Configurable number of connections and duration
- Real-time progress tracking
- Detailed results saved to JSON file
- Tests different HTTP methods (GET, POST)
- Weighted scenarios to simulate real-world traffic

## 🛠️ Setup

1. Install dependencies:
```bash
npm install
```

2. Configure the test:
   - Open `stress-test.js`
   - Update the `url` in the config object to point to your application
   - Adjust other parameters as needed (connections, duration, etc.)

## 🏃‍♂️ Running the Test

```bash
npm test
```

## 📊 Test Scenarios

The script tests the following endpoints:
1. Root endpoint (`/`)
2. Health check (`/health`)
3. Get users (`/users`)
4. Create user (`/users` POST)

Each scenario has a different weight to simulate real-world traffic patterns.

## 📈 Results

After the test completes, you'll see:
- Total number of requests
- Number of errors
- Average latency
- Requests per second
- Response status code distribution

Results are also saved to a JSON file for further analysis.

## ⚙️ Configuration Options

- `connections`: Number of concurrent connections
- `duration`: Test duration in seconds
- `pipelining`: Number of pipelined requests
- `timeout`: Request timeout in seconds
- `scenarios`: Array of test scenarios with weights

## 🎯 Example Output

```
🚀 Starting stress test...
📊 Configuration:
- URL: http://localhost:3000
- Connections: 100
- Duration: 30s
- Scenarios: Root Endpoint, Health Check, Get Users, Create User

✅ Stress test completed!
📈 Results saved to: stress-test-results-2024-03-11T12-34-56-789Z.json

Summary:
- Total Requests: 15000
- Total Errors: 0
- Average Latency: 45ms
- 2xx Responses: 14950
- Non-2xx Responses: 50
- Requests/sec: 500
``` 