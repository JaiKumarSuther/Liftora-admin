// Simple test script to verify API endpoint
const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login API endpoint...');
    
    const response = await axios.post('http://localhost:8002/api/v2/admin/login', {
      email: 'admin@gmail.com',
      password: 'Test@123'
    });
    
    console.log('✅ Login successful!');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
  } catch (error) {
    console.error('❌ Login failed!');
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    console.error('Error message:', error.message);
  }
}

testLogin();
