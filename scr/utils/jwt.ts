import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export const generateAccessToken = (user: any): string => {
  return jwt.sign(
    { 
      id: user.id_usuario, 
      email: user.email,
      nombre_usuario: user.nombre_usuario
    },
    ENV.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

export const generateRefreshToken = (user: any): string => {
  return jwt.sign(
    { id: user.id_usuario },
    ENV.JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );
};