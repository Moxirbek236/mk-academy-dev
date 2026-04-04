const axios = require('axios');

async function test() {
  try {
    const loginRes = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'student@mkacademy.uz',
      password: 'Password123!'
    });
    console.log('Login success:', loginRes.data);

    const token = loginRes.data.access_token;
    const statsRes = await axios.get('http://localhost:3001/api/dashboard/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Stats:', statsRes.data);
  } catch (err) {
    if (err.response) {
      console.error('Error:', err.response.status, err.response.data);
    } else {
      console.error(err);
    }
  }
}

test();
