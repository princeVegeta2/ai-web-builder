// src/utils/tokenUtils.js

export const isTokenExpired = (token) => {
    if (!token) return true;
  
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const exp = decodedPayload.exp;
  
    if (!exp) return true;
  
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    return exp < now;
  };
  