import { useState, useEffect } from 'react';
import { getAccessToken, refreshAccessToken } from './spotify';

export default function useAuth(code: string | null) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<number | null>(null);

  useEffect(() => {
    if (!code) return;
    getAccessToken(code);
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
      refreshAccessToken(refreshToken)
        .then(res => {
          setAccessToken(res.accessToken);
          setExpiresIn(res.expiresIn);
        })
        .catch(() => {
          window.location.href = '/';
        });
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
}