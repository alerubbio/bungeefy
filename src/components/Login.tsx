import React from 'react';
import { getAuthUrl } from '../utils/spotify';
import {Button} from "@nextui-org/button";

const Login: React.FC = () => {
  const handleLogin = () => {
    window.location.href = getAuthUrl();
  };

  return (
    <div>
      <h1>Welcome to Spotify App</h1>
      <Button onClick={handleLogin}>Login with Spotify</Button>
    </div>
  );
};

export default Login;