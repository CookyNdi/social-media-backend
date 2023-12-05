import jwt, { type JwtPayload } from 'jsonwebtoken';

type verifyAccessTokenReturn = {
  valid: boolean;
  message: string | null;
  data: string | null;
};

const JWT_SECRET_ACCESS: string = process.env.JWT_SECRET_ACCESS;

export const createAccessToken = (username: string): string => {
  const payload = { username };
  return jwt.sign(payload, JWT_SECRET_ACCESS, { expiresIn: '1200s' });
};

export const verifyAccessToken = (token: string): verifyAccessTokenReturn => {
  try {
    const decode: string | JwtPayload = jwt.verify(token, JWT_SECRET_ACCESS);
    return { valid: true, message: null, data: decode as string };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { valid: false, message: 'Token has expired', data: null };
    } else {
      return { valid: false, message: 'Token is invalid', data: null };
    }
  }
};
