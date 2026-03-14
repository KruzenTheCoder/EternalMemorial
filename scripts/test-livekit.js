
const { RoomServiceClient, AccessToken } = require('livekit-server-sdk');
require('dotenv').config({ path: '.env' });

const livekitUrl = process.env.LIVEKIT_URL;
const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

console.log('Testing LiveKit Connection...');
console.log('URL:', livekitUrl);
console.log('API Key:', apiKey);
console.log('API Secret:', apiSecret ? '***' : 'missing');

async function testConnection() {
  const svc = new RoomServiceClient(livekitUrl, apiKey, apiSecret);
  
  try {
    console.log('Listing rooms...');
    const rooms = await svc.listRooms();
    console.log('Success! Found rooms:', rooms.length);
    
    // Generate a test token
    const at = new AccessToken(apiKey, apiSecret, {
      identity: 'test-user',
      ttl: 3600
    });
    at.addGrant({ roomJoin: true, room: 'test-room' });
    const token = at.toJwt();
    console.log('Generated Token:', token);
    
  } catch (error) {
    console.error('Error connecting to LiveKit:', error.message);
    if (error.response) {
      console.error('Response:', error.response.status, error.response.statusText);
    }
  }
}

testConnection();
