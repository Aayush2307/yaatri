const http = require('http');

async function testTemple() {
  console.log('--- TEMPLE QUERY TEST ---');
  return new Promise((resolve) => {
    http.get('http://localhost:3000/api/destinations', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Data: ${data.substring(0, 150)}...\n`);
        resolve();
      });
    });
  });
}

async function testMuhurat() {
  console.log('--- MUHURAT QUERY TEST ---');
  return new Promise((resolve) => {
    http.get('http://localhost:3000/api/muhurat?date=2026-05-03', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Data length: ${data.length} bytes, ok: ${JSON.parse(data).ok}\n`);
        resolve();
      });
    });
  });
}

async function testAuthAndBooking() {
  console.log('--- AUTH & BOOKING TEST ---');
  return new Promise((resolve) => {
    const postData = JSON.stringify({ phone: "+919999999999", otp: "123456" });
    const req = http.request(
      'http://localhost:3000/api/auth/verify-otp',
      { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': postData.length } },
      (res) => {
        let authData = '';
        res.on('data', chunk => authData += chunk);
        res.on('end', () => {
          console.log(`Auth Status: ${res.statusCode}`);
          try {
            const token = JSON.parse(authData).token;
            if (!token) throw new Error("No token returned");
            console.log(`Obtained Token: JWT ****...`);
            
            const chatData = JSON.stringify({ message: "Show my bookings" });
            const chatReq = http.request('http://localhost:3000/api/chatbot/message', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Content-Length': chatData.length
                }
            }, (getRes) => {
                let bData = '';
                getRes.on('data', chunk => bData += chunk);
                getRes.on('end', () => {
                    console.log(`Chatbot Response Status: ${getRes.statusCode}`);
                    console.log(`Chatbot Output (first 150 chars): ${bData.substring(0, 150)}`);
                    resolve();
                });
            });
            chatReq.write(chatData);
            chatReq.end();
          } catch(e) {
             console.log("Auth Failed", e.message);
             resolve();
          }
        });
    });
    req.write(postData);
    req.end();
  });
}

async function run() {
  await testTemple();
  await testMuhurat();
  await testAuthAndBooking();
}

run();