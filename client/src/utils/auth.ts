/* eslint-disable @typescript-eslint/no-unused-vars */
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  exp: number; // Expiration timestamp (in seconds)
  iat: number; // Issued at (optional)
  // add other fields if needed
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded: JWTPayload = jwtDecode(token);
    const now = Date.now() / 1000; // in seconds
    return decoded.exp < now;
  } catch (err) {
    console.error("Invalid token");
    return true; // Treat malformed token as expired
  }
}
