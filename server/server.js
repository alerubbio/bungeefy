require('dotenv').config();
const express = require('express');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(cors());
app.use(express.json());

const spotifyApi = new SpotifyWebApi({
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

app.post('/login', (req, res) => {
  const code = req.body.code;
  console.log('Received code:', code);
  console.log('Redirect URI:', process.env.SPOTIFY_REDIRECT_URI);
  console.log('Client ID:', process.env.SPOTIFY_CLIENT_ID);
  
  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      console.log('Access token received from Spotify');
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch(err => {
      console.error('Error in /login:', err);
      if (err.body && err.body.error_description) {
        console.error('Spotify API error:', err.body.error_description);
      }
      res.status(400).json({ error: 'Invalid code', details: err.message });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Redirect URI:', process.env.SPOTIFY_REDIRECT_URI);
  console.log('Client ID:', process.env.SPOTIFY_CLIENT_ID);
});