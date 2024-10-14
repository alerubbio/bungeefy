require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const querystring = require('querystring');

const app = express();
app.use(cors());
app.use(express.json());

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

const encodedCredentials = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

const LOCALSTORAGE_KEYS = {
  accessToken: 'spotify_access_token',
  refreshToken: 'spotify_refresh_token',
  expireTime: 'spotify_token_expire_time',
  timestamp: 'spotify_token_timestamp',
};

app.post('/login', (req, res) => {
  const code = req.body.code;
  console.log('Received authorization code:', code);
  
  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  axios({
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${encodedCredentials}`
    }
  })
    .then(response => {
      if (response.status === 200) {
        const { access_token, refresh_token, expires_in } = response.data;
        const currentTime = Math.floor(Date.now() / 1000);

        res.json({
          accessToken: access_token,
          refreshToken: refresh_token,
          expiresIn: expires_in,
          timestamp: currentTime
        });
      } else {
        res.status(response.status).json({ error: 'Error during authentication' });
      }
    })
    .catch(err => {
      console.error('Error in /login:', err);
      res.status(500).json({ error: 'An error occurred during authentication', details: err.message });
    });
});

app.get('/refresh_token', (req, res) => {
  const { refresh_token } = req.query;

  axios({
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${encodedCredentials}`
    }
  })
    .then(response => {
      res.json({
        access_token: response.data.access_token,
        expires_in: response.data.expires_in
      });
    })
    .catch(error => {
      console.error('Error refreshing token:', error);
      res.status(400).json({ error: 'Error refreshing token', details: error.message });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Redirect URI:', REDIRECT_URI);
  console.log('Client ID:', SPOTIFY_CLIENT_ID);
});