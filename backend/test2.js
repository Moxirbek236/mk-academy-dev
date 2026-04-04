async function run() {
  try {
     console.log('Sending login...');
     const logRes = await fetch('http://localhost:3001/api/auth/login', {
       method: 'POST',
       headers: {'content-type':'application/json'},
       body: JSON.stringify({email: 'superadmin@mkacademy.uz', password: 'Password123!'})
     });
     console.log('Login status:', logRes.status);
     const responseBody = await logRes.json();
     const token = responseBody.data?.access_token || responseBody.access_token;
     
     if(token) {
        console.log('Token received');
        const statsRes = await fetch('http://localhost:3001/api/dashboard/stats', {
           headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Stats status:', statsRes.status);
        const statsText = await statsRes.text();
        console.log('Stats body:', statsText.substring(0,200));
     } else {
        console.log('No token in login data:', responseBody);
     }
  } catch(e) {
     console.error(e);
  } finally {
     process.exit();
  }
}
run();
