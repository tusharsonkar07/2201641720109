// Test script for the logging middleware
const { Logger } = require('./dist/logger');

async function testLogger() {
  console.log('🧪 Testing AFFORDMED Logging Middleware...\n');

  // Initialize logger with test credentials
  const logger = new Logger({
    apiUrl: 'http://20.244.56.144/evaluation-service/logs',
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyazIyLmNzY3lzLjMyNDI5QGdtYWlsLmNvbSIsImV4cCI6MTc1NzMyMTY1NywiaWF0IjoxNzU3MzIwNzU3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOGJjY2FjMjQtNjZiYS00NDRiLWJlNjEtNGEyZTIxNDcwZDcyIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidHVzaGFyIHNvbmthciIsInN1YiI6IjYwY2NjZGY1LTlhMWItNGI4Yy1iZDc3LTY3ZjFjYzlkODBmMSJ9LCJlbWFpbCI6IjJrMjIuY3NjeXMuMzI0MjlAZ21haWwuY29tIiwibmFtZSI6InR1c2hhciBzb25rYXIiLCJyb2xsTm8iOiIyMjAxNjQxNzIwMTA5IiwiYWNjZXNzQ29kZSI6InNBV1R1UiIsImNsaWVudElEIjoiNjBjY2NkZjUtOWExYi00YjhjLWJkNzctNjdmMWNjOWQ4MGYxIiwiY2xpZW50U2VjcmV0IjoiQVplU0ZucnZOdnpOdnJObiJ9.CAUQm4ewzzRgmkJfAJqZhKM3IWOAJ5byv3IENE3Z2ZI',
    enabled: true
  });

  try {
    // Test 1: Basic info log
    console.log('Test 1: Basic info log');
    const result1 = await logger.log('frontend', 'info', 'api', 'Testing logging middleware initialization');
    console.log('Result:', result1 ? 'Success' : 'Failed');
    console.log('');

    // Test 2: Error log
    console.log('Test 2: Error log');
    const result2 = await logger.log('frontend', 'error', 'component', 'Simulated component error for testing');
    console.log('Result:', result2 ? 'Success' : 'Failed');
    console.log('');

    // Test 3: Debug log using convenience method
    console.log('Test 3: Debug log using convenience method');
    const result3 = await logger.debug('utils', 'Debug message from convenience method');
    console.log('Result:', result3 ? 'Success' : 'Failed');
    console.log('');

    // Test 4: Warning log
    console.log('Test 4: Warning log');
    const result4 = await logger.warn('state', 'State update may cause re-render');
    console.log('Result:', result4 ? 'Success' : 'Failed');
    console.log('');

    // Test 5: Invalid package (should fail validation)
    console.log('Test 5: Invalid package validation');
    const result5 = await logger.log('frontend', 'info', 'invalid_package', 'This should fail validation');
    console.log('Result:', result5 ? 'Success' : 'Failed (Expected)');
    console.log('');

    console.log('✅ All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLogger();
