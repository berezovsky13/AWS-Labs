const autocannon = require('autocannon');
const fs = require('fs');

// Configuration
const config = {
    url: 'http://localhost:3000', // Change this to your application URL
    connections: 100,             // Number of concurrent connections
    duration: 30,                 // Duration of the test in seconds
    pipelining: 1,                // Number of pipelined requests
    timeout: 10,                  // Request timeout in seconds
    scenarios: [
        {
            name: 'Root Endpoint',
            weight: 1,
            requests: [
                {
                    method: 'GET',
                    path: '/'
                }
            ]
        },
        {
            name: 'Health Check',
            weight: 2,
            requests: [
                {
                    method: 'GET',
                    path: '/health'
                }
            ]
        },
        {
            name: 'Get Users',
            weight: 3,
            requests: [
                {
                    method: 'GET',
                    path: '/users'
                }
            ]
        },
        {
            name: 'Create User',
            weight: 1,
            requests: [
                {
                    method: 'POST',
                    path: '/users',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'Test User',
                        email: 'test@example.com'
                    })
                }
            ]
        }
    ]
};

// Run the stress test
console.log('🚀 Starting stress test...');
console.log(`📊 Configuration:
- URL: ${config.url}
- Connections: ${config.connections}
- Duration: ${config.duration}s
- Scenarios: ${config.scenarios.map(s => s.name).join(', ')}
`);

const instance = autocannon(config, (err, result) => {
    if (err) {
        console.error('❌ Error during stress test:', err);
        process.exit(1);
    }

    // Save results to a file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `stress-test-results-${timestamp}.json`;
    fs.writeFileSync(filename, JSON.stringify(result, null, 2));

    console.log(`
✅ Stress test completed!
📈 Results saved to: ${filename}

Summary:
- Total Requests: ${result.requests.total}
- Total Errors: ${result.errors}
- Average Latency: ${result.latency.average}ms
- 2xx Responses: ${result['2xx']}
- Non-2xx Responses: ${result.non2xx}
- Requests/sec: ${result.requests.average}
    `);
});

// Print real-time results
autocannon.track(instance, { renderProgressBar: true }); 